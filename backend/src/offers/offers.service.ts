import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateOfferDto } from './dto/create-offer.dto';
import { WishesService } from 'src/wishes/wishes.service';
import { Offer } from './entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { WISH_NOT_FOUND } from 'src/utils/constants/wishes';
import {
  MONEY_ALREADY_COLLECTED,
  OFFER_NOT_FOUND,
  SUM_GREATER_THAN_PRICE,
  SUM_GREATER_THAN_REMAINING_AMOUNT,
  WISH_OWNER_CANNOT_PAY,
} from 'src/utils/constants/offer';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) {}

  async createOffer(
    createOfferDto: CreateOfferDto,
    user: User,
  ): Promise<Offer> {
    const wish = await this.wishesService.findWishById(createOfferDto.itemId);
    const remainingSum = wish.price - wish.raised;

    if (!wish) {
      throw new NotFoundException(WISH_NOT_FOUND);
    }

    if (wish.owner.id === user.id) {
      throw new ForbiddenException(WISH_OWNER_CANNOT_PAY);
    }

    if (wish.raised === wish.price) {
      throw new ForbiddenException(MONEY_ALREADY_COLLECTED);
    }

    if (createOfferDto.amount > wish.price) {
      throw new ForbiddenException(SUM_GREATER_THAN_PRICE);
    }

    if (createOfferDto.amount > remainingSum) {
      throw new ForbiddenException(SUM_GREATER_THAN_REMAINING_AMOUNT);
    }

    await this.wishesService.updateWishRaised(
      wish.id,
      wish.raised + createOfferDto.amount,
    );

    const newOffer = this.offerRepository.create({
      ...createOfferDto,
      user,
      item: wish,
    });

    return await this.offerRepository.save(newOffer);
  }

  async findOfferById(offerId: number): Promise<Offer> {
    const offer = await this.offerRepository.findOne({
      where: {
        id: offerId,
      },
      relations: {
        user: true,
        item: true,
      },
    });

    if (!offer) {
      throw new NotFoundException(OFFER_NOT_FOUND);
    }

    return offer;
  }

  async findAllOffers(): Promise<Offer[]> {
    return await this.offerRepository.find({
      relations: {
        user: true,
        item: true,
      },
    });
  }
}
