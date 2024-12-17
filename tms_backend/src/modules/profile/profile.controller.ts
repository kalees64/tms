import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Profile } from 'src/entities/profile.entity';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('profiles')
@UseGuards(AuthGuard('jwt'))
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async getProfiles(): Promise<{ data: Profile[] }> {
    return await this.profileService.getProfiles();
  }

  @Get('/:id')
  async getProfile(@Param('id') id: string): Promise<{ data: Profile }> {
    return await this.profileService.getProfile(id);
  }

  @Post()
  async createProfile(
    @Body() profileData: CreateProfileDto,
  ): Promise<{ data: Profile }> {
    return await this.profileService.createProfile(profileData);
  }

  @Patch('/:id')
  async updateProfile(
    @Param('id') id: string,
    @Body() profileData: CreateProfileDto,
  ): Promise<{ data: Profile }> {
    return await this.profileService.updateProfile(id, profileData);
  }

  @Delete('/:id')
  async deleteProfile(@Param('id') id: string): Promise<{ data: Profile }> {
    return await this.profileService.deleteProfile(id);
  }
}
