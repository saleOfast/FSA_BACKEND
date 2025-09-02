import { BaseRepository } from '../base/BaseRepository';
import { Profile } from '../DB/Entities/profile.entity';
import { Repository, FindOptionsWhere, FindManyOptions, FindOneOptions } from 'typeorm';
import { ICreateProfileDto, IUpdateProfileDto } from '../types/Profile/Profile.types';
import { DbConnections } from '../DB/postgresdb';
import { User } from '../DB/Entities/User.entity';

export class ProfileRepository extends BaseRepository<Profile> {
  constructor(repository?: Repository<Profile>) {
    super(Profile, repository);
  }

  async findAll(
    filter?: FindOptionsWhere<Profile>,
    page: number = 1,
    limit: number = 10,
    relations: string[] = []
  ): Promise<{ data: Profile[]; total: number; page: number; limit: number }> {
    await this.ensureRepositoryInitialized();
    const skip = (page - 1) * limit;
    
    const [data, total] = await this.repo.findAndCount({
      where: filter,
      relations,
      skip,
      take: limit,
      order: { createdDate: 'DESC' }
    });
    
    return { 
      data, 
      total, 
      page,
      limit,
    };
  }

  async findById(profileId: number): Promise<Profile | null> {
    await this.ensureRepositoryInitialized();
    return this.repo.findOne({ where: { id: profileId } } as any);
  }

  async findByName(profileName: string): Promise<Profile | null> {
    await this.ensureRepositoryInitialized();
    return this.repo.findOne({ 
      where: { profileName } 
    } as any);
  }

  async createProfile(createDto: ICreateProfileDto): Promise<Profile> {
    await this.ensureRepositoryInitialized();
    
    try {
      // Create the profile with the provided user reference
      const profile = new Profile();
      profile.profileName = createDto.profileName;
      profile.userLicence = createDto.userLicence;
      profile.remarks = createDto.remarks;
      
      // Set the user reference
      profile.createdBy = createDto.createdBy;
      profile.modifiedBy = createDto.createdBy; // Same as createdBy for new records
      
      // Set timestamps
      profile.createdDate = new Date();
      profile.modifiedDate = new Date();
      
      return this.repo.save(profile);
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  }

  async updateProfile(profileId: number, updateDto: IUpdateProfileDto): Promise<Profile | null> {
    await this.ensureRepositoryInitialized();
    const profile = await this.findById(profileId);
    if (!profile) return null;

    // Update fields if provided
    if (updateDto.profileName) profile.profileName = updateDto.profileName;
    if (updateDto.userLicence) profile.userLicence = updateDto.userLicence;
    if (updateDto.remarks !== undefined) profile.remarks = updateDto.remarks;
    
    // Update modifiedBy and modifiedDate
    if (updateDto.modifiedBy) {
      profile.modifiedBy = updateDto.modifiedBy;
      profile.modifiedDate = new Date();
    }

    return this.repo.save(profile);
  }

  async deleteProfile(profileId: number): Promise<boolean> {
    await this.ensureRepositoryInitialized();
    const result = await this.repo.delete(profileId);
    return result.affected ? result.affected > 0 : false;
  }
}
