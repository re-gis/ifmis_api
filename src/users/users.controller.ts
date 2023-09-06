/* eslint-disable */
import {
  Controller,
  Param,
  Delete,
  Get,
  Body,
  Post,
  Patch,
} from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { UpdateUserDto } from 'src/dtos/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/all')
  @Roles('ADMIN')
  getUsers() {
    return this.usersService.getUsers();
  }

  @Get('/:id')
  async getUserById(@Param('id') id: number) {
    const user = await this.usersService.getUserById(id, 'User');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Post('/create')
  @Roles('ADMIN', 'TEACHER')
  createAdminAccount(@Body() body: CreateUserDto) {
    return this.usersService.createUser(body);
  }

  @Patch('update/:id')
  updateUser(@Param('id') id: number, @Body() body: UpdateUserDto) {
    return this.usersService.updateUser(id, body);
  }

  @Delete('delete/;id')
  deleteUser(@Param('id') id: number) {
    return this.usersService.deleteUser(id);
  }
}
function ApiTags(
  arg0: string,
): (target: typeof UsersController) => void | typeof UsersController {
  throw new Error('Function not implemented.');
}
