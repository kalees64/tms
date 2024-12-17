import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/entities/profile.entity';
import { UserProfile } from 'src/entities/user-profile.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
    @InjectRepository(UserProfile)
    private readonly userProfileRepo: Repository<UserProfile>,
  ) {}

  async getUsers(): Promise<{ data: any[] }> {
    const users = await this.userRepo.find({
      relations: ['profiles.profile'],
    });

    const transformedUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      modifiedAt: user.modifiedAt,
      profiles: user.profiles.map((userProfile) => userProfile.profile),
    }));

    return { data: transformedUsers };
  }

  async getUser(id: string): Promise<{ data: any }> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['profiles.profile'],
    });

    if (!user) {
      throw new NotFoundException();
    }

    const transformedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      modifiedAt: user.modifiedAt,
      profiles: user.profiles.map((userProfile) => userProfile.profile),
    };

    return { data: transformedUser };
  }

  async createUser(userData: CreateUserDto): Promise<{ data: any }> {
    const createUser = await this.userRepo.create(userData);

    const profile = await this.profileRepo.findOne({
      where: { id: userData.profileId },
    });

    if (!profile) {
      throw new NotFoundException();
    }

    const newUser = await this.userRepo.save(createUser);

    const createUserProfile = await this.userProfileRepo.create({
      userId: newUser.id,
      user: newUser,
      profileId: userData.profileId,
      profile: profile,
    });

    const newUserProfile = await this.userProfileRepo.save(createUserProfile);

    if (!newUserProfile) {
      throw new InternalServerErrorException();
    }

    return {
      data: {
        ...newUser,
        profile: profile,
      },
    };
  }

  async updateUser(
    id: string,
    userData: UpdateUserDto,
  ): Promise<{ data: User }> {
    if (Object.keys(userData).length === 0) {
      throw new BadRequestException('No data provided');
    }

    if (userData.profileId) {
      const newProfileId = userData.profileId;

      delete userData.profileId;

      const userProfile = await this.userProfileRepo.findOne({
        where: { userId: id },
      });

      console.log(userProfile);

      if (!userProfile) {
        throw new NotFoundException();
      }

      const newProfile = await this.profileRepo.findOne({
        where: { id: newProfileId },
      });

      console.log(newProfile);

      if (!newProfile) {
        throw new NotFoundException();
      }

      const updateUser = await this.userRepo.update(id, userData);

      const updateUserProfile = await this.userProfileRepo.update(
        userProfile.id,
        {
          profile: newProfile,
          profileId: newProfile.id,
        },
      );
    }

    const updateUser = await this.userRepo.update(id, userData);

    const user = await this.getUser(id);

    return user;
  }

  async deleteUser(id: string): Promise<{ data: User }> {
    const user = await this.getUser(id);

    await this.userRepo.delete(id);

    return user;
  }
}
