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
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getUsers(): Promise<{ data: any[] }> {
    return await this.userService.getUsers();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:id')
  async getUser(@Param('id') id: string): Promise<{ data: any }> {
    return await this.userService.getUser(id);
  }

  @Post()
  async createUser(@Body() userData: CreateUserDto): Promise<{ data: any }> {
    return await this.userService.createUser(userData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() userData: UpdateUserDto,
  ): Promise<{ data: User }> {
    return await this.userService.updateUser(id, userData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  async deleteUser(@Param('id') id: string): Promise<{ data: User }> {
    return await this.userService.deleteUser(id);
  }
}
