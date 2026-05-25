import { STATUSCODES } from "../../../../core/types/Constent/common";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import {
  CreateRoleDto,
  UpdateRoleDto,
  IRoleListItem,
  IRoleHierarchyNode,
} from "../../../../core/types/RoleService/RoleService";
import { Role, RoleRepository } from "../../../../core/DB/Entities/role.entity";
import { Profile } from "../../../../core/DB/Entities/profile.entity";
import { User } from "../../../../core/DB/Entities/User.entity";
import { IUserReference } from "../../../../core/types/Profile/Profile.types";
import { DbConnections } from "../../../../core/DB/postgresdb";
import { In, Like } from "typeorm";

class RoleController {
  private roleRepo = RoleRepository();

  private userRef(user: IUser): IUserReference {
    return {
      id: user.emp_id,
      name: `${user.firstname} ${user.lastname || ""}`.trim(),
    };
  }

  private normalizeParentRoleId(value: unknown): number | null {
    if (value === null || value === undefined || value === "") return null;
    const n = Number(value);
    return Number.isNaN(n) ? null : n;
  }

  /** Force-write role columns to DB (reports to, profile link, description). */
  private async persistRoleFields(
    roleId: number,
    fields: {
      name: string;
      profileId: number;
      parentRoleId: number | null;
      description?: string;
      modifiedBy?: IUserReference;
    }
  ): Promise<void> {
    const patch: Parameters<typeof this.roleRepo.update>[1] = {
      name: fields.name,
      profileId: fields.profileId,
      parentRoleId: fields.parentRoleId,
    };
    if (fields.description !== undefined) {
      patch.description = fields.description;
    }
    if (fields.modifiedBy) {
      patch.modifiedBy = fields.modifiedBy;
    }
    await this.roleRepo.update(roleId, patch);
  }

  /**
   * Persist assigned users on `users.role_id` + `users.profile_id`.
   * When `assignedEmpIds` is sent, replaces the full assignment list for this role.
   */
 private async syncAssignedUsers(
  roleId: number,
  profileId: number,
  addEmpIds?: number[],
  removeEmpIds?: number[]
): Promise<void> {

  const ds = DbConnections.AppDbConnection.getConnection();
  const userRepo = ds.getRepository(User);

  // ADD USERS
  if (addEmpIds?.length) {

    const addIds = [
      ...new Set(
        addEmpIds
          .map((id) => Number(id))
          .filter((id) => !Number.isNaN(id))
      ),
    ];

    await userRepo.update(
      {
        emp_id: In(addIds),
        isDeleted: false
      },
      {
        roleId,
        profileId
      }
    );
  }

  // REMOVE USERS
  if (removeEmpIds?.length) {

    const removeIds = [
      ...new Set(
        removeEmpIds
          .map((id) => Number(id))
          .filter((id) => !Number.isNaN(id))
      ),
    ];

    await userRepo.update(
      {
        emp_id: In(removeIds),
        roleId,
        isDeleted: false
      },
      {
        roleId: null as unknown as number,
        profileId: null as unknown as number
      }
    );
  }
}

  private async getProfileOrFail(profileId: number): Promise<Profile | null> {
    const ds = DbConnections.AppDbConnection.getConnection();
    return ds.getRepository(Profile).findOne({
      where: { profileId, isDeleted: false },
    });
  }

  private async wouldCreateCycle(
    roleId: number,
    newParentId: number | null | undefined
  ): Promise<boolean> {
    if (newParentId == null || newParentId === roleId) return newParentId === roleId;
    let current: number | null | undefined = newParentId;
    const seen = new Set<number>();
    while (current != null) {
      if (current === roleId || seen.has(current)) return true;
      seen.add(current);
      const ancestor: Pick<Role, "roleId" | "parentRoleId"> | null =
        await this.roleRepo.findOne({
          where: { roleId: current, isDeleted: false },
          select: ["roleId", "parentRoleId"],
        });
      current = ancestor?.parentRoleId ?? null;
    }
    return false;
  }


  private async assignedUsersForRole(roleId: number) {
    const ds = DbConnections.AppDbConnection.getConnection();
    const users = await ds.getRepository(User).find({
      where: { roleId, isDeleted: false },
      select: ["emp_id", "firstname", "lastname", "name"],
    });
    return users.map((u) => ({
      emp_id: u.emp_id,
      name:
        u.name?.trim() ||
        `${u.firstname || ""} ${u.lastname || ""}`.trim() ||
        `User ${u.emp_id}`,
    }));
  }

  private async toListItem(role: Role): Promise<IRoleListItem> {
    const assignedUsers = await this.assignedUsersForRole(role.roleId);
    let reportsToLabel = "(Top Level)";
    if (role.parentRoleId) {
      const parentRole = await this.roleRepo.findOne({
        where: { roleId: role.parentRoleId, isDeleted: false },
      });
      reportsToLabel = parentRole?.name ?? `Role ${role.parentRoleId}`;
    }
    return {
      roleId: role.roleId,
      name: role.name,
      profileId: role.profileId,
      linkedProfileName: role.profile?.profileName ?? "",
      parentRoleId: role.parentRoleId ?? null,
      reportsToLabel,
      description: role.description,
      assignedUserCount: assignedUsers.length,
      assignedUsers,
      modifiedOn: role.updatedAt,
    };
  }

  private buildHierarchyTree(
    roles: Role[],
    assignedCounts: Map<number, number>
  ): IRoleHierarchyNode[] {
    const byId = new Map<number, IRoleHierarchyNode>();
    for (const r of roles) {
      byId.set(r.roleId, {
        roleId: r.roleId,
        name: r.name,
        profileId: r.profileId,
        linkedProfileName: r.profile?.profileName ?? "",
        assignedUserCount: assignedCounts.get(r.roleId) ?? 0,
        children: [],
      });
    }
    const roots: IRoleHierarchyNode[] = [];
    for (const r of roles) {
      const node = byId.get(r.roleId)!;
      if (r.parentRoleId && byId.has(r.parentRoleId)) {
        byId.get(r.parentRoleId)!.children.push(node);
      } else {
        roots.push(node);
      }
    }
    return roots;
  }

  async create(input: CreateRoleDto, user: IUser): Promise<IApiResponse> {
    const profile = await this.getProfileOrFail(input.profileId);
    if (!profile) {
      return { status: 400, message: "Linked profile not found", data: null };
    }

    const profileId = Number(input.profileId);
    const parentRoleId = this.normalizeParentRoleId(input.parentRoleId);

    if (parentRoleId != null) {
      const parent = await this.roleRepo.findOne({
        where: { roleId: parentRoleId, isDeleted: false },
      });
      if (!parent) {
        return { status: 400, message: "Parent role not found", data: null };
      }
    }

    const row = this.roleRepo.create({
      name: input.name.trim(),
      profileId,
      parentRoleId,
      description: input.description,
      isDeleted: false,
      isActive: true,
      createdBy: this.userRef(user),
    });
    const saved = await this.roleRepo.save(row);

    await this.persistRoleFields(saved.roleId, {
      name: input.name.trim(),
      profileId,
      parentRoleId,
      description: input.description,
    });

    await this.syncAssignedUsers(saved.roleId, profileId, input.assignedEmpIds);

    const withProfile = await this.roleRepo.findOne({
      where: { roleId: saved.roleId },
      relations: ["profile"],
    });
    return {
      status: 201,
      message: "Role created successfully",
      data: await this.toListItem(withProfile!),
    };
  }

  async list(search?: string): Promise<IApiResponse> {
    const where: any = { isDeleted: false };
    if (search?.trim()) {
      where.name = Like(`%${search.trim()}%`);
    }
    const roles = await this.roleRepo.find({
      where,
      relations: ["profile"],
      order: { name: "ASC" },
    });
    const data = await Promise.all(roles.map((r) => this.toListItem(r)));
    return {
      status: STATUSCODES.SUCCESS,
      message: "Roles retrieved successfully",
      data,
    };
  }

  async hierarchy(): Promise<IApiResponse> {
    const roles = await this.roleRepo.find({
      where: { isDeleted: false },
      relations: ["profile"],
      order: { name: "ASC" },
    });
    const counts = new Map<number, number>();
    for (const r of roles) {
      const users = await this.assignedUsersForRole(r.roleId);
      counts.set(r.roleId, users.length);
    }
    return {
      status: STATUSCODES.SUCCESS,
      message: "Role hierarchy retrieved successfully",
      data: this.buildHierarchyTree(roles, counts),
    };
  }

  async getById(roleId: number): Promise<IApiResponse> {
    const role = await this.roleRepo.findOne({
      where: { roleId, isDeleted: false },
      relations: ["profile", "parent"],
    });
    if (!role) {
      return { status: 404, message: "Role not found", data: null };
    }
    return {
      status: STATUSCODES.SUCCESS,
      message: "Success",
      data: await this.toListItem(role),
    };
  }

  async parentOptions(excludeRoleId?: number): Promise<IApiResponse> {
    const roles = await this.roleRepo.find({
      where: { isDeleted: false },
      order: { name: "ASC" },
    });
    const filtered = excludeRoleId
      ? roles.filter((r) => r.roleId !== excludeRoleId)
      : roles;
    return {
      status: STATUSCODES.SUCCESS,
      message: "Success",
      data: filtered.map((r) => ({
        roleId: r.roleId,
        name: r.name,
        parentRoleId: r.parentRoleId ?? null,
      })),
    };
  }

async update(
  roleId: number,
  input: UpdateRoleDto,
  user: IUser
): Promise<IApiResponse> {

  // Find existing role
  const role = await this.roleRepo.findOne({
    where: {
      roleId,
      isDeleted: false,
    },
    relations: ["profile"],
  });

  if (!role) {
    return {
      status: 404,
      message: "Role not found",
      data: null,
    };
  }

  // Validate profile
  if (input.profileId !== undefined) {

    const profile = await this.getProfileOrFail(
      Number(input.profileId)
    );

    if (!profile) {
      return {
        status: 400,
        message: "Linked profile not found",
        data: null,
      };
    }

    role.profileId = Number(input.profileId);
  }

  // Update name
  if (input.name !== undefined) {
    role.name = input.name.trim();
  }

  // Update description
  if (input.description !== undefined) {
    role.description = input.description;
  }

  // Update parent role
  if (input.parentRoleId !== undefined) {

    const nextParentRoleId =
      input.parentRoleId === null ||
      input.parentRoleId === undefined
        ? null
        : Number(input.parentRoleId);

    // Validate parent role
    if (nextParentRoleId !== null) {

      const parentRole = await this.roleRepo.findOne({
        where: {
          roleId: nextParentRoleId,
          isDeleted: false,
        },
      });

      if (!parentRole) {
        return {
          status: 400,
          message: "Parent role not found",
          data: null,
        };
      }

      // Prevent circular hierarchy
      const cycle = await this.wouldCreateCycle(
        roleId,
        nextParentRoleId
      );

      if (cycle) {
        return {
          status: 400,
          message:
            "Invalid parent: would create a circular hierarchy",
          data: null,
        };
      }
    }

    role.parentRoleId = nextParentRoleId;
  }

  // Modified by
  role.modifiedBy = this.userRef(user);

  // Save updated role
  await this.roleRepo.save(role);

  // Sync assigned users
  await this.syncAssignedUsers(
    role.roleId,
    role.profileId,
    input.assignedEmpIds,
    input.removeEmpIds
  );

  // Fetch latest updated role
  const updated = await this.roleRepo.findOne({
    where: { roleId },
    relations: ["profile"],
  });

  return {
    status: STATUSCODES.SUCCESS,
    message: "Role updated successfully",
    data: await this.toListItem(updated!),
  };
}

  async delete(roleId: number): Promise<IApiResponse> {
    const role = await this.roleRepo.findOne({
      where: { roleId, isDeleted: false },
    });
    if (!role) {
      return { status: 404, message: "Role not found", data: null };
    }

    const ds = DbConnections.AppDbConnection.getConnection();
    const userCount = await ds.getRepository(User).count({
      where: { roleId, isDeleted: false },
    });
    if (userCount > 0) {
      return {
        status: 400,
        message: `Cannot delete role: ${userCount} user(s) still assigned`,
        data: null,
      };
    }

    const childCount = await this.roleRepo.count({
      where: { parentRoleId: roleId, isDeleted: false },
    });
    if (childCount > 0) {
      return {
        status: 400,
        message: "Cannot delete role: child roles exist under this role",
        data: null,
      };
    }

    await this.roleRepo.update(roleId, { isDeleted: true });
    return {
      status: STATUSCODES.SUCCESS,
      message: "Role deleted successfully",
      data: null,
    };
  }
}

export { RoleController as RoleService };