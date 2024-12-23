import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUser.dto';
import mongoose from 'mongoose';
import { UpdateUserDto } from './dto/upsateUser.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  createUser(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    // if (!mongoose.isValidObjectId(id)) it is also right
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const findUser = await this.usersService.getUserById(id);

    console.log(findUser);
    if (!findUser)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return findUser;
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const updatedUser = await this.usersService.updateUser(id, updateUserDto);

    if (!updatedUser)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return updatedUser;
  }
}
