import { Profile } from '../../../../core/DB/Entities/profile.entity';
import { ProfileRepository } from '../../../../core/repositories/ProfileRepository';
import { IUser } from '../../../../core/types/AuthService/AuthService';
import { IUserReference } from '../../../../core/types/Profile/Profile.types';
import { ICreateProfileDto, IUpdateProfileDto } from '../../../../core/types/Profile/Profile.types';

export class ProfileController {
  private profileRepository: ProfileRepository;

  constructor(profileRepository?: ProfileRepository) {
    this.profileRepository = profileRepository || new ProfileRepository();
  }

  // Create Profile
  async createProfile(profileData: Omit<ICreateProfileDto, 'createdBy'>, user: IUser) {
    try {
      if (!user?.emp_id) {
        return { status: 401, message: 'Unauthorized', data: null };
      }

      // Check if profile with same name already exists
      const existingProfile = await this.profileRepository.findByName(profileData.profileName);
      if (existingProfile) {
        return { status: 400, message: 'Profile with this name already exists', data: null };
      }

      // Create user reference object
      const userReference: IUserReference = {
        id: user.emp_id,
        name: `${user.firstname} ${user.lastname || ''}`.trim()
      };

      const newProfile = await this.profileRepository.createProfile({
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
      throw error; // Let the error handler middleware handle it
    }
  }

  // Get Profile by ID
  async getProfile(profileId: number) {
    try {
      const profile = await this.profileRepository.findById(profileId);
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

      const profile = await this.profileRepository.findById(profileId);
      if (!profile) {
        return { status: 404, message: 'Profile not found', data: null };
      }

      const updateData: Omit<IUpdateProfileDto, 'modifiedBy'> = { ...profileData };
      
      // Only include fields that are defined in the DTO
      if (updateData.profileName === undefined) delete updateData.profileName;
      if (updateData.userLicence === undefined) delete updateData.userLicence;
      if (updateData.remarks === undefined) delete updateData.remarks;

      const updatedProfile = await this.profileRepository.updateProfile(profileId, {
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
      const profile = await this.profileRepository.findById(profileId);
      if (!profile) {
        return { status: 404, message: 'Profile not found', data: null };
      }

      await this.profileRepository.delete(profileId);
      
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
      const result = await this.profileRepository.findAll({}, page, limit);

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
