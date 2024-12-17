import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/entities/profile.entity';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
  ) {}

  async getProfiles(): Promise<{ data: Profile[] }> {
    const profiles = await this.profileRepo.find();

    return { data: profiles };
  }

  async getProfile(id: string): Promise<{ data: Profile }> {
    const profile = await this.profileRepo.findOne({ where: { id } });

    if (!profile) {
      throw new NotFoundException();
    }

    return { data: profile };
  }

  async createProfile(
    profileData: CreateProfileDto,
  ): Promise<{ data: Profile }> {
    const createProfile = await this.profileRepo.create(profileData);

    const saveProfile = await this.profileRepo.save(createProfile);

    return { data: saveProfile };
  }

  async updateProfile(
    id: string,
    profileData: CreateProfileDto,
  ): Promise<{ data: Profile }> {
    const updateProfile = await this.profileRepo.update(id, profileData);

    const profile = await this.getProfile(id);

    return profile;
  }

  async deleteProfile(id: string): Promise<{ data: Profile }> {
    const profile = await this.getProfile(id);

    await this.profileRepo.delete(id);

    return profile;
  }
}
