import { User } from '../../DB/Entities/User.entity';

export interface IProfile {
  profileId: number;
  profileName: string;
  userLicence: string;
  remarks?: string;
  createdDate: Date;
  createdBy: IUserReference;
  modifiedDate?: Date;
  modifiedBy?: IUserReference;
}

export interface IUserReference {
  id: number;
  name: string;
}

export interface ICreateProfileDto {
  profileName: string;
  userLicence: string;
  remarks?: string;
  createdBy: IUserReference;
}

export interface IUpdateProfileDto {
  profileName?: string;
  userLicence?: string;
  remarks?: string;
  modifiedBy: IUserReference;
}
