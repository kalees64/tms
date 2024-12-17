import { UserService } from './../user/user.service';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async findUser(email: string, password: string): Promise<any> {
    const user = await this.userRepo.findOne({
      where: { email, password },
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

    return transformedUser;
  }

  async createUser(userData: CreateUserDto): Promise<{ data: any }> {
    return this.userService.createUser(userData);
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.findUser(email, password);

    if (user) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException();
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }
}
