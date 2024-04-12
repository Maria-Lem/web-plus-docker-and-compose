import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Offer } from './entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateOfferDto } from './dto/create-offer.dto';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @UseGuards(JwtGuard)
  @Post()
  async createOffer(
    @Req() req: User,
    @Body() createOfferDto: CreateOfferDto,
  ): Promise<Offer> {
    return await this.offersService.createOffer(createOfferDto, req);
  }

  @UseGuards(JwtGuard)
  @Get()
  async findAllOffer(): Promise<Offer[]> {
    return await this.offersService.findAllOffers();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOfferById(@Param('id') id: number): Promise<Offer> {
    return await this.findOfferById(id);
  }
}
