import { Profile } from '../../../../core/DB/Entities/profile.entity';
import { ObjectEntity } from '../../../../core/DB/Entities/object.entity';
import { ObjectFieldDefinition } from '../../../../core/DB/Entities/ObjectFieldDefinition.entity';
import { FieldPermission } from '../../../../core/DB/Entities/FieldPermission.entity';
import { ObjectRecordTypeDefinition } from '../../../../core/DB/Entities/ObjectRecordTypeDefinition.entity';
import { Tab } from '../../../../core/DB/Entities/Tab.entity';
import { TabPermission } from '../../../../core/DB/Entities/TabPermission.entity';
import { ObjectPermission } from '../../../../core/DB/Entities/ObjectPermission.entity';
import { RecordTypeAccess } from '../../../../core/DB/Entities/RecordTypeAccess.entity';
import { BaseRepository } from '../../../../core/base/BaseRepository';
import { IUser } from '../../../../core/types/AuthService/AuthService';
import {
  IUserReference,
  ICreateProfileDto,
  IUpdateProfileDto,
  ITabPermissionInput,
  IObjectPermissionInput,
  IFieldPermissionInput,
  IRecordTypeAccessInput
} from '../../../../core/types/Profile/Profile.types';
import { DbConnections } from '../../../../core/DB/postgresdb';
import { FindOptionsWhere } from 'typeorm';
import {
  applyProfilePermissions,
  ProfilePermissionApplySummary
} from '../../../../core/services/profilePermission.service';
import { ProfileMetadataSyncService } from '../../../../core/services/profileMetadataSync.service';

/** Accept body as array or under common wrapper keys (UI may use tablePermissions, etc.). */
function normalizePermissionRows<T>(input: unknown, keys: string[]): T[] {
  if (Array.isArray(input)) {
    return input as T[];
  }
  if (input && typeof input === 'object') {
    const record = input as Record<string, unknown>;
    for (const key of keys) {
      const val = record[key];
      if (Array.isArray(val)) {
        return val as T[];
      }
    }
  }
  return [];
}

/** Relations to load full profile permissions (reuse for getProfile + createUser). */
export const PROFILE_PERMISSION_RELATIONS = [
  'tabPermissions',
  'tabPermissions.tab',
  'objectPermissions',
  'objectPermissions.object',
  'fieldPermissions',
  'fieldPermissions.object',
  'recordTypeAccesses',
  'recordTypeAccesses.object',
  'systemPermissions',
] as const;


export class ProfileController {
  private profileRepo: BaseRepository<Profile>;
  private metadataSyncService: ProfileMetadataSyncService;

  constructor() {
    // Directly use BaseRepository with Profile entity
    this.profileRepo = new BaseRepository(Profile);
    this.metadataSyncService = new ProfileMetadataSyncService();
  }

  private async getActiveProfileById(profileId: number, relations?: string[]) {
    const ds = DbConnections.AppDbConnection.getConnection();
    return ds.getRepository(Profile).findOne({
      where: { profileId, isDeleted: false },
      relations,
    });
  }


    /** Load profile with tab/object/field/record-type/system permissions. */
    async getProfileWithPermissions(profileId: number) {
      return this.getActiveProfileById(profileId, [...PROFILE_PERMISSION_RELATIONS]);
    }



  // Create Profile
  async createProfile(profileData: Omit<ICreateProfileDto, 'createdBy'>, user: IUser) {
    try {
      if (!user?.emp_id) {
        return { status: 401, message: 'Unauthorized', data: null };
      }

      // Check if profile with same name already exists
      const existingProfileFilter: FindOptionsWhere<Profile> = {
        profileName: profileData.profileName,
        isDeleted: false
      };
      const existingProfile = await this.profileRepo.findAll(existingProfileFilter);
      if (existingProfile.total > 0) {
        return { status: 400, message: 'Profile with this name already exists', data: null };
      }

      // Create user reference object
      const userReference: IUserReference = {
        id: user.emp_id,
        name: `${user.firstname} ${user.lastname || ''}`.trim()
      };

      const {
        tabPermissions,
        objectPermissions,
        fieldPermissions,
        recordTypeAccesses,
        description,
        ...coreProfile
      } = profileData;

      const remarks = coreProfile.remarks ?? description;

      const ds = DbConnections.AppDbConnection.getConnection();
      const hasPermissionPayload =
        (tabPermissions && tabPermissions.length > 0) ||
        (objectPermissions && objectPermissions.length > 0) ||
        (fieldPermissions && fieldPermissions.length > 0) ||
        (recordTypeAccesses && recordTypeAccesses.length > 0);

      const { saved: newProfile, permSummary } = await ds.transaction(async (manager) => {
        const profileRepo = manager.getRepository(Profile);
        const row = profileRepo.create({
          profileName: coreProfile.profileName,
          userLicence: coreProfile.userLicence ?? '',
          remarks,
          department: coreProfile.department,
          createdBy: userReference
        });
        const saved = await profileRepo.save(row);
        const summary = hasPermissionPayload
          ? await applyProfilePermissions(manager, saved.profileId, {
              tabPermissions,
              objectPermissions,
              fieldPermissions,
              recordTypeAccesses
            })
          : { missingTabs: [], missingObjects: [] };
        return { saved, permSummary: summary };
      });

      const fullProfile = await this.getProfileWithPermissions(newProfile.profileId);

      const skipped =
        permSummary.missingTabs.length > 0 || permSummary.missingObjects.length > 0;

      return {
        status: 201,
        message: hasPermissionPayload
          ? skipped
            ? 'Profile created. Some permission rows were skipped — see permissionApplySummary. Assign remaining permissions via Tab / Table / Field / Record Type APIs.'
            : 'Profile created successfully with permissions.'
          : 'Profile created successfully. Assign Tab, Table, Field, and Record Type permissions using the permission save APIs.',
        data: {
          ...fullProfile,
          permissionApplySummary: permSummary
        }
      };
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  }

  // Get Profile by ID
  async getProfile(profileId: number) {
    try {
            const profile = await this.getProfileWithPermissions(profileId);
      if (!profile) {
        return { status: 404, message: 'Profile not found', data: null };
      }

      return {
        status: 200,
        message: 'Profile retrieved successfully',
        data: profile
      };
    } catch (error) {
      console.error('Error getting profile:', error);
      throw error;
    }
  }

  // Update Profile
  async updateProfile(profileId: number, profileData: Omit<IUpdateProfileDto, 'modifiedBy'>, user: IUser) {
    try {
      if (!user?.emp_id) {
        return { status: 401, message: 'Unauthorized', data: null };
      }

      const profile = await this.getActiveProfileById(profileId);
      if (!profile) {
        return { status: 404, message: 'Profile not found', data: null };
      }

      const {
        tabPermissions,
        objectPermissions,
        fieldPermissions,
        recordTypeAccesses,
        profileName,
        userLicence,
        remarks,
        description,
        department
      } = profileData;

      const modifiedBy = {
        id: user.emp_id,
        name: `${user.firstname} ${user.lastname || ''}`.trim()
      };

      const resolvedRemarks = remarks ?? description;

      const scalarPatch: Partial<Pick<Profile, 'profileName' | 'userLicence' | 'remarks' | 'department'>> = {};
      if (profileName !== undefined) scalarPatch.profileName = profileName;
      if (userLicence !== undefined) scalarPatch.userLicence = userLicence;
      if (resolvedRemarks !== undefined) scalarPatch.remarks = resolvedRemarks;
      if (department !== undefined) scalarPatch.department = department;

      const hasScalarUpdate = Object.keys(scalarPatch).length > 0;

      const hasPermissionPayload =
        (tabPermissions && tabPermissions.length > 0) ||
        (objectPermissions && objectPermissions.length > 0) ||
        (fieldPermissions && fieldPermissions.length > 0) ||
        (recordTypeAccesses && recordTypeAccesses.length > 0);

      let updatedProfile: Profile | null = profile;

      if (hasScalarUpdate) {
        updatedProfile = await this.profileRepo.update(profileId, {
          ...scalarPatch,
          modifiedBy
        });
      }

      let permSummary: ProfilePermissionApplySummary | undefined;
      if (hasPermissionPayload) {
        const ds = DbConnections.AppDbConnection.getConnection();
        permSummary = await ds.transaction(async (manager) => {
          return applyProfilePermissions(manager, profileId, {
            tabPermissions,
            objectPermissions,
            fieldPermissions,
            recordTypeAccesses
          });
        });
      }

      if (hasPermissionPayload || hasScalarUpdate) {
        updatedProfile = await this.getProfileWithPermissions(profileId);
      }

      const skipped =
        permSummary &&
        (permSummary.missingTabs.length > 0 || permSummary.missingObjects.length > 0);

      return {
        status: 200,
        message: skipped
          ? 'Profile updated. Some permission rows were skipped — see permissionApplySummary.'
          : 'Profile updated successfully',
        data:
          permSummary !== undefined
            ? { ...updatedProfile, permissionApplySummary: permSummary }
            : updatedProfile
      };
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  /** Save Tab Permissions tab only (UI: "Save Tab Permissions"). */
  async saveTabPermissions(
    profileId: number,
    tabPermissions: unknown,
    user: IUser
  ) {
    const rows = normalizePermissionRows<ITabPermissionInput>(tabPermissions, [
      'tabPermissions',
      'tabs'
    ]);
    return this.savePermissionSlice(
      profileId,
      user,
      { tabPermissions: rows },
      'Tab permissions saved successfully.',
      'Send a non-empty array or { "tabPermissions": [ { "tabName": "Customer", "readOnly": false, "defaultOn": true } ] }'
    );
  }

  /** Save Table Permissions tab only (UI: "Save Permissions" on Table tab). */
  async saveObjectPermissions(
    profileId: number,
    objectPermissions: unknown,
    user: IUser
  ) {
    const rows = normalizePermissionRows<IObjectPermissionInput>(objectPermissions, [
      'objectPermissions',
      'tablePermissions',
      'tables'
    ]);
    return this.savePermissionSlice(
      profileId,
      user,
      { objectPermissions: rows },
      'Table permissions saved successfully.',
      'Send a non-empty array or { "objectPermissions": [ { "objectName": "Customer", "canRead": true, "canCreate": true, "canEdit": true, "canDelete": false } ] }'
    );
  }

  /** Save Field Permissions tab only. */
  async saveFieldPermissions(
    profileId: number,
    fieldPermissions: unknown,
    user: IUser
  ) {
    const rows = normalizePermissionRows<IFieldPermissionInput>(fieldPermissions, [
      'fieldPermissions',
      'fields'
    ]);
    return this.savePermissionSlice(
      profileId,
      user,
      { fieldPermissions: rows },
      'Field permissions saved successfully.',
      'Send a non-empty array or { "fieldPermissions": [ { "objectName": "Customer", "fieldName": "Phone", "mandatory": false, "readOnly": false, "editable": true } ] }'
    );
  }

  /** Save Record Type Access tab only. */
  async saveRecordTypeAccesses(
    profileId: number,
    recordTypeAccesses: unknown,
    user: IUser
  ) {
    const rows = normalizePermissionRows<IRecordTypeAccessInput>(recordTypeAccesses, [
      'recordTypeAccesses',
      'recordTypeAccess',
      'recordTypes'
    ]);
    return this.savePermissionSlice(
      profileId,
      user,
      { recordTypeAccesses: rows },
      'Record type access saved successfully.',
      'Send a non-empty array or { "recordTypeAccesses": [ { "objectName": "Customer", "recordTypeName": "GT", "canRead": true, "canCreate": true, "canEdit": true, "canDelete": false } ] }'
    );
  }

  private async savePermissionSlice(
    profileId: number,
    user: IUser,
    payload: {
      tabPermissions?: ITabPermissionInput[];
      objectPermissions?: IObjectPermissionInput[];
      fieldPermissions?: IFieldPermissionInput[];
      recordTypeAccesses?: IRecordTypeAccessInput[];
    },
    successMessage: string,
    bodyHint?: string
  ) {
    if (!user?.emp_id) {
      return { status: 401, message: 'Unauthorized', data: null };
    }

    const profile = await this.getActiveProfileById(profileId);
    if (!profile) {
      return { status: 404, message: 'Profile not found', data: null };
    }

    const hasPayload =
      (payload.tabPermissions && payload.tabPermissions.length > 0) ||
      (payload.objectPermissions && payload.objectPermissions.length > 0) ||
      (payload.fieldPermissions && payload.fieldPermissions.length > 0) ||
      (payload.recordTypeAccesses && payload.recordTypeAccesses.length > 0);

    if (!hasPayload) {
      return {
        status: 400,
        message: 'At least one permission row is required',
        data: bodyHint ? { hint: bodyHint } : null
      };
    }

    const modifiedBy = {
      id: user.emp_id,
      name: `${user.firstname} ${user.lastname || ''}`.trim()
    };
    await this.profileRepo.update(profileId, { modifiedBy } as Partial<Profile>);

    const ds = DbConnections.AppDbConnection.getConnection();
    const permSummary = await ds.transaction((manager) =>
      applyProfilePermissions(manager, profileId, payload)
    );

    const fullProfile = await this.getProfileWithPermissions(profileId);
    const skipped =
      permSummary.missingTabs.length > 0 || permSummary.missingObjects.length > 0;

    return {
      status: 200,
      message: skipped
        ? `${successMessage} Some rows were skipped — see permissionApplySummary.`
        : successMessage,
      data: {
        ...fullProfile,
        permissionApplySummary: permSummary
      }
    };
  }

  // Delete Profile
  async deleteProfile(profileId: number) {
    try {
      const profile = await this.getActiveProfileById(profileId);
      if (!profile) {
        return { status: 404, message: 'Profile not found', data: null };
      }

      await this.profileRepo.update(profileId, {
        isDeleted: true
      } as Partial<Profile>);

      return {
        status: 200,
        message: 'Profile deleted successfully',
        data: null
      };
    } catch (error) {
      console.error('Error deleting profile:', error);
      throw error;
    }
  }

  /** All nav tabs + optional saved TabPermission for a profile (Tab Permissions screen). */
  async getTabsCatalog(profileId?: number) {
    try {
      const ds = DbConnections.AppDbConnection.getConnection();
      const tabs = await ds.getRepository(Tab).find({
        where: { isDeleted: false, isActive: true },
        order: { orderNumber: "ASC", name: "ASC" },
      });

      const permByTabId = new Map<string, { readOnly: boolean; defaultOn: boolean }>();
      if (profileId != null && !Number.isNaN(profileId)) {
        const perms = await ds.getRepository(TabPermission).find({
          where: { profile: { profileId } },
          relations: ["tab"],
        });
        for (const tp of perms) {
          if (tp.tab?.id) {
            permByTabId.set(tp.tab.id, { readOnly: tp.readOnly, defaultOn: tp.defaultOn });
          }
        }
      }

      const data = tabs.map((t) => ({
        tabId: t.id,
        name: t.name,
        orderNumber: t.orderNumber ?? null,
        permission: permByTabId.get(t.id) ?? null,
      }));

      return {
        status: 200,
        message: "Tabs retrieved successfully",
        data: { tabs: data },
      };
    } catch (error) {
      console.error("Error getting tabs catalog:", error);
      throw error;
    }
  }

  /** All objects + optional ObjectPermission for a profile (Table Permissions screen). */
  async getObjectPermissionsCatalog(profileId?: number) {
    try {
      const ds = DbConnections.AppDbConnection.getConnection();
      const objects = await ds.getRepository(ObjectEntity).find({
        where: { isDeleted: false, isActive: true },
        order: { name: "ASC" },
      });

      const permByObjectId = new Map<string, ObjectPermission>();
      if (profileId != null && !Number.isNaN(profileId)) {
        const perms = await ds.getRepository(ObjectPermission).find({
          where: { profile: { profileId } },
          relations: ["object"],
        });
        for (const p of perms) {
          if (p.object?.id) permByObjectId.set(p.object.id, p);
        }
      }

      const rows = objects.map((o) => {
        const p = permByObjectId.get(o.id);
        return {
          objectId: o.id,
          objectName: o.name,
          helpText: o.helpText ?? null,
          permission: p
            ? {
                canRead: p.canRead,
                canCreate: p.canCreate,
                canEdit: p.canEdit,
                canDelete: p.canDelete,
                canViewAll: p.canViewAll,
                canModifyAll: p.canModifyAll,
              }
            : null,
        };
      });

      return {
        status: 200,
        message: "Object permissions catalog retrieved successfully",
        data: { objects: rows },
      };
    } catch (error) {
      console.error("Error getting object permissions catalog:", error);
      throw error;
    }
  }

  /** Record types for an object + optional RecordTypeAccess for a profile (Record Type Access screen). */
  async getRecordTypeCatalog(objectName: string, profileId?: number) {
    try {
      const name = objectName.trim();
      if (!name) {
        return { status: 400, message: "objectName is required", data: null };
      }

      const ds = DbConnections.AppDbConnection.getConnection();
      const obj = await ds.getRepository(ObjectEntity).findOne({
        where: { name, isDeleted: false },
      });
      if (!obj) {
        return { status: 404, message: `Object "${name}" not found`, data: null };
      }

      const defs = await ds.getRepository(ObjectRecordTypeDefinition).find({
        where: { object: { id: obj.id }, isActive: true },
        order: { sortOrder: "ASC", recordTypeName: "ASC" },
      });

      const permByRt = new Map<string, RecordTypeAccess>();
      if (profileId != null && !Number.isNaN(profileId)) {
        const perms = await ds.getRepository(RecordTypeAccess).find({
          where: { profile: { profileId }, object: { id: obj.id } },
        });
        for (const p of perms) {
          permByRt.set(p.recordTypeName, p);
        }
      }

      const recordTypes = defs.map((d) => {
        const p = permByRt.get(d.recordTypeName);
        return {
          recordTypeName: d.recordTypeName,
          sortOrder: d.sortOrder,
          permission: p
            ? {
                canRead: p.canRead,
                canCreate: p.canCreate,
                canEdit: p.canEdit,
                canDelete: p.canDelete,
              }
            : null,
        };
      });

      return {
        status: 200,
        message: "Record type catalog retrieved successfully",
        data: {
          objectName: obj.name,
          objectId: obj.id,
          recordTypes,
        },
      };
    } catch (error) {
      console.error("Error getting record type catalog:", error);
      throw error;
    }
  }

  /** Tables/modules for Field Permissions (and similar) dropdowns */
  async getObjectsCatalog() {
    try {
      const ds = DbConnections.AppDbConnection.getConnection();
      const rows = await ds.getRepository(ObjectEntity).find({
        where: { isDeleted: false, isActive: true },
        order: { name: "ASC" },
        select: ["id", "name", "helpText"],
      });
      return {
        status: 200,
        message: "Objects retrieved successfully",
        data: rows,
      };
    } catch (error) {
      console.error("Error getting objects catalog:", error);
      throw error;
    }
  }

  /**
   * Field master list for the selected table — UI loads this when user picks a table.
   * Optional `profileId` merges saved FieldPermission rows (prefers global row: empty recordTypeName).
   */
  async getFieldCatalog(objectName: string, profileId?: number) {
    try {
      const name = objectName.trim();
      if (!name) {
        return { status: 400, message: "objectName is required", data: null };
      }

      const ds = DbConnections.AppDbConnection.getConnection();
      const obj = await ds.getRepository(ObjectEntity).findOne({
        where: { name, isDeleted: false },
      });
      if (!obj) {
        return { status: 404, message: `Object "${name}" not found`, data: null };
      }

      // Auto-sync field definitions from real entity/table metadata when missing/stale.
      await this.metadataSyncService.ensureFieldDefinitionsForObject(obj.name, obj.helpText || undefined);

      const definitions = await ds.getRepository(ObjectFieldDefinition).find({
        where: { object: { id: obj.id }, isActive: true },
        order: { sortOrder: "ASC", fieldName: "ASC" },
      });

      const pickPermission = (perms: FieldPermission[], field: string): FieldPermission | null => {
        const matches = perms.filter((p) => p.fieldName === field);
        if (matches.length === 0) return null;
        const global = matches.find((p) => !p.recordTypeName || p.recordTypeName === "");
        return global ?? matches[0];
      };

      let perms: FieldPermission[] = [];
      if (profileId != null && !Number.isNaN(profileId)) {
        perms = await ds.getRepository(FieldPermission).find({
          where: { profile: { profileId }, object: { id: obj.id } },
        });
      }

      const fields = definitions.map((d) => {
        const p = pickPermission(perms, d.fieldName);
        return {
          fieldName: d.fieldName,
          dataType: d.dataType,
          notes: d.notes ?? null,
          sortOrder: d.sortOrder,
          permission: p
            ? {
                mandatory: p.mandatory,
                readOnly: p.readOnly,
                editable: p.editable,
                recordTypeName: p.recordTypeName || "",
              }
            : null,
        };
      });

      return {
        status: 200,
        message: "Field catalog retrieved successfully",
        data: {
          objectName: obj.name,
          objectId: obj.id,
          fields,
        },
      };
    } catch (error) {
      console.error("Error getting field catalog:", error);
      throw error;
    }
  }

  /** One-shot schema sync: DB entities/tables -> objects, tabs, object_field_definitions */
  async syncMetadataCatalog() {
    try {
      const data = await this.metadataSyncService.syncObjectAndTabCatalogFromSchema();
      return {
        status: 200,
        message: "Profile metadata sync completed",
        data,
      };
    } catch (error) {
      console.error("Error syncing profile metadata:", error);
      throw error;
    }
  }

  // Get All Profiles with pagination
  async getAllProfiles(page: number = 1, limit: number = 10) {
    try {
      const profileFilter: FindOptionsWhere<Profile> = { isDeleted: false };
      const result = await this.profileRepo.findAll(profileFilter, page, limit);

      return {
        status: 200,
        message: 'Profiles retrieved successfully',
        data: result.data,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: Math.ceil(result.total / result.limit)
        }
      };
    } catch (error) {
      console.error('Error getting all profiles:', error);
      throw error;
    }
  }
}

export default new ProfileController();
