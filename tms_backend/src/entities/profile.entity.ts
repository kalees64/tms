import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum PROFILE {
  STAKEHOLDER = 'stakeholder',
  MANAGER = 'manager',
  IT_TEAM = 'it_team',
}

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: PROFILE, name: 'profile_name' })
  profileName: string;
}
