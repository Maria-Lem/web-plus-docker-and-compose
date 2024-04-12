import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UsersService } from './users.service';
import { WishesService } from 'src/wishes/wishes.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { USER_NOT_FOUND } from 'src/utils/constants/users';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  @UseGuards(JwtGuard)
  @Get('me')
  async getAuthUser(@Req() req: User): Promise<User> {
    return await this.usersService.findById(req.id);
  }

  @UseGuards(JwtGuard)
  @Get('me/wishes')
  async getAuthUserWishes(@Req() req: User): Promise<Wish[]> {
    return await this.wishesService.getUserWishes(req.id);
  }

  @Get(':username')
  async findUserByUsername(@Param('username') username: string): Promise<User> {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    return user;
  }

  @UseGuards(JwtGuard)
  @Get(':username/wishes')
  async getUserWishes(@Param('username') username: string): Promise<Wish[]> {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    return await this.wishesService.getUserWishes(user.id);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  async updateAuthUser(
    @Req() req: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.updateUser(req.id, updateUserDto);
  }

  @Post('find')
  async findMany(@Body('query') query: string): Promise<User[]> {
    return this.usersService.findMany(query);
  }
}
