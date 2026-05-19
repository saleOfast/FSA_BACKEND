import { User } from '../../DB/Entities/User.entity';

export interface IProfile {
  profileId: number;
  profileName: string;
  userLicence: string;
  remarks?: string;
  department?: string;
  createdDate: Date;
  createdBy: IUserReference;
  modifiedDate?: Date;
  modifiedBy?: IUserReference;
}

/** Tab / navigation row — persisted on `tab_permissions` (readOnly → isVisible, defaultOn → isAvailable). */
export interface ITabPermissionInput {
  tabName: string;
  readOnly: boolean;
  defaultOn: boolean;
}

/** Table (object) CRUD flags */
export interface IObjectPermissionInput {
  objectName: string;
  canRead: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canViewAll?: boolean;
  canModifyAll?: boolean;
}

export interface IFieldPermissionInput {
  objectName: string;
  fieldName: string;
  /** When omitted or empty, permission applies to all record types for that field row */
  recordTypeName?: string;
  mandatory: boolean;
  readOnly: boolean;
  editable: boolean;
  notes?: string;
}

export interface IRecordTypeAccessInput {
  objectName: string;
  recordTypeName: string;
  canRead: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export interface IUserReference {
  id: number;
  name: string;
}

export interface ICreateProfileDto {
  profileName: string;
  userLicence?: string;
  remarks?: string;
  department?: string;
  tabPermissions?: ITabPermissionInput[];
  objectPermissions?: IObjectPermissionInput[];
  fieldPermissions?: IFieldPermissionInput[];
  recordTypeAccesses?: IRecordTypeAccessInput[];
  createdBy: IUserReference;
}

export interface IUpdateProfileDto {
  profileName?: string;
  userLicence?: string;
  remarks?: string;
  department?: string;
  tabPermissions?: ITabPermissionInput[];
  objectPermissions?: IObjectPermissionInput[];
  fieldPermissions?: IFieldPermissionInput[];
  recordTypeAccesses?: IRecordTypeAccessInput[];
  modifiedBy: IUserReference;
}
