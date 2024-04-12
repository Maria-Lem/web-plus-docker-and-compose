import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { createHash } from 'src/utils/hash';
import { USER_ALREADY_EXIST, USER_NOT_FOUND } from 'src/utils/constants/users';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const email = await this.findByEmail(createUserDto.email);
    const username = await this.findByUsername(createUserDto.username);

    if (email) {
      throw new ForbiddenException(USER_ALREADY_EXIST);
    }

    if (username) {
      throw new ForbiddenException(USER_ALREADY_EXIST);
    }

    return await this.userRepository.save({
      ...createUserDto,
      password: await createHash(createUserDto.password),
    });
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find();

    return users;
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOneBy({ email });
  }

  async findByUsername(username: string): Promise<User> {
    return await this.userRepository.findOneBy({ username });
  }

  async findMany(query: string): Promise<User[]> {
    return await this.userRepository.find({
      where: [{ username: query }, { email: query }],
    });
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.password) {
      updateUserDto.password = await createHash(updateUserDto.password);
    }

    if (updateUserDto.email) {
      const email = await this.findByEmail(updateUserDto.email);

      if (email) {
        throw new ForbiddenException(USER_ALREADY_EXIST);
      }
    }

    if (updateUserDto.username) {
      const username = await this.findByUsername(updateUserDto.username);

      if (username) {
        throw new ForbiddenException(USER_ALREADY_EXIST);
      }
    }

    await this.userRepository.update({ id }, updateUserDto);

    return await this.findById(id);
  }
}
