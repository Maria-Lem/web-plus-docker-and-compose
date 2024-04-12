import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Wish } from './entities/wish.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import {
  NOT_YOUR_WISH,
  RAISED_NOT_NULL,
  WISH_ALREADY_COPIED,
  WISH_NOT_FOUND,
} from 'src/utils/constants/wishes';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
  ) {}

  async createWish(owner: User, createWishDto: CreateWishDto): Promise<Wish> {
    return await this.wishesRepository.save({
      ...createWishDto,
      owner: owner,
    });
  }

  async getTopWishes(): Promise<Wish[]> {
    return await this.wishesRepository.find({
      order: {
        copied: 'DESC',
      },
      take: 10,
    });
  }

  async getLastWishes(): Promise<Wish[]> {
    return await this.wishesRepository.find({
      order: {
        createdAt: 'DESC',
      },
      take: 20,
    });
  }

  async getUserWishes(id: number): Promise<Wish[]> {
    return await this.wishesRepository.find({
      where: {
        owner: { id },
      },
      relations: {
        owner: true,
      },
    });
  }

  async findWishById(wishId: number): Promise<Wish> {
    return await this.wishesRepository.findOne({
      where: {
        id: wishId,
      },
      relations: {
        owner: true,
        offers: true,
      },
    });
  }

  async findMany(items: number[]): Promise<Wish[]> {
    return await this.wishesRepository.find({
      where: {
        id: In(items),
      },
    });
  }

  async findAll(): Promise<Wish[]> {
    const wishes = await this.wishesRepository.find({
      relations: ['owner', 'offers'],
    });

    return wishes;
  }

  async updateWish(
    wishId: number,
    userId: number,
    updateWishDto: UpdateWishDto,
  ): Promise<Wish> {
    const wish = await this.findWishById(wishId);

    if (!wish) {
      throw new NotFoundException(WISH_NOT_FOUND);
    }

    if (userId !== wish.owner.id) {
      throw new ForbiddenException(NOT_YOUR_WISH);
    }

    if (wish.raised > 0) {
      throw new ForbiddenException(RAISED_NOT_NULL);
    }

    return await this.wishesRepository.save({ ...wish, ...updateWishDto });
  }

  async updateWishRaised(wishId: number, newRaised: number): Promise<Wish> {
    const wish = await this.findWishById(wishId);

    if (!wish) {
      throw new NotFoundException(WISH_NOT_FOUND);
    }

    return await this.wishesRepository.save({ ...wish, raised: newRaised });
  }

  async deleteWish(wishId: number, userId: number): Promise<Wish> {
    const wish = await this.findWishById(wishId);

    if (!wish) {
      throw new NotFoundException(WISH_NOT_FOUND);
    }

    if (userId !== wish.owner.id) {
      throw new ForbiddenException(NOT_YOUR_WISH);
    }

    return await this.wishesRepository.remove(wish);
  }

  async copyWish(wishId: number, user: User): Promise<Wish> {
    const wish = await this.findWishById(wishId);

    if (!wish) {
      throw new NotFoundException(WISH_NOT_FOUND);
    }

    if (user.id === wish.owner.id) {
      throw new ForbiddenException(WISH_ALREADY_COPIED);
    }

    await this.wishesRepository.update(wishId, {
      copied: ++wish.copied,
    });

    const wishCopy = {
      ...wish,
      owner: user.id,
      raised: 0,
      copied: 0,
      offers: [],
    };

    return await this.createWish(user, wishCopy);
  }
}
