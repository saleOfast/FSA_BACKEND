import { Profile } from '../../../../core/DB/Entities/profile.entity';
import { BaseRepository } from '../../../../core/base/BaseRepository';
import { IUser } from '../../../../core/types/AuthService/AuthService';
import { IUserReference, ICreateProfileDto, IUpdateProfileDto } from '../../../../core/types/Profile/Profile.types';

export class ProfileController {
  private profileRepo: BaseRepository<Profile>;

  constructor() {
    // Directly use BaseRepository with Profile entity
    this.profileRepo = new BaseRepository(Profile);
  }

  // Create Profile
  async createProfile(profileData: Omit<ICreateProfileDto, 'createdBy'>, user: IUser) {
    try {
      if (!user?.emp_id) {
        return { status: 401, message: 'Unauthorized', data: null };
      }

      // Check if profile with same name already exists
      const existingProfile = await this.profileRepo.findAll({ profileName: profileData.profileName });
      if (existingProfile.total > 0) {
        return { status: 400, message: 'Profile with this name already exists', data: null };
      }

      // Create user reference object
      const userReference: IUserReference = {
        id: user.emp_id,
        name: `${user.firstname} ${user.lastname || ''}`.trim()
      };

      const newProfile = await this.profileRepo.create({
        ...profileData,
        createdBy: userReference
      });

      return {
        status: 201,
        message: 'Profile created successfully',
        data: newProfile
      };
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  }

  // Get Profile by ID
  async getProfile(profileId: number) {
    try {
      const profile = await this.profileRepo.findById(profileId);
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

      const profile = await this.profileRepo.findById(profileId);
      if (!profile) {
        return { status: 404, message: 'Profile not found', data: null };
      }

      const updateData: Omit<IUpdateProfileDto, 'modifiedBy'> = { ...profileData };

      // Only include fields that are defined in the DTO
      if (updateData.profileName === undefined) delete updateData.profileName;
      if (updateData.userLicence === undefined) delete updateData.userLicence;
      if (updateData.remarks === undefined) delete updateData.remarks;

      const updatedProfile = await this.profileRepo.update(profileId, {
        ...updateData,
        modifiedBy: {
          id: user.emp_id,
          name: `${user.firstname} ${user.lastname || ''}`.trim()
        }
      });

      return {
        status: 200,
        message: 'Profile updated successfully',
        data: updatedProfile
      };
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  // Delete Profile
  async deleteProfile(profileId: number) {
    try {
      const profile = await this.profileRepo.findById(profileId);
      if (!profile) {
        return { status: 404, message: 'Profile not found', data: null };
      }

      await this.profileRepo.delete(profileId);

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

  // Get All Profiles with pagination
  async getAllProfiles(page: number = 1, limit: number = 10) {
    try {
      const result = await this.profileRepo.findAll({}, page, limit);

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
