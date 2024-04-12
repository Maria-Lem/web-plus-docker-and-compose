import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { validateHash } from 'src/utils/hash';
import {
  INCORRECT_USERNAME_OR_PASSWORD,
  USER_NOT_FOUND,
} from 'src/utils/constants/users';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  auth(user: User) {
    const payload = { sub: user.id };

    return { access_token: this.jwtService.sign(payload) };
  }

  async validatePassword(username: string, password: string): Promise<User> {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    if (!validateHash(password, user.password)) {
      throw new UnauthorizedException(INCORRECT_USERNAME_OR_PASSWORD);
    }

    return user;
  }
}
