import { IsNotEmpty, IsString } from 'class-validator';
import { PROFILE } from 'src/entities/profile.entity';

export class CreateProfileDto {
  @IsNotEmpty()
  @IsString()
  profileName: PROFILE;
}
