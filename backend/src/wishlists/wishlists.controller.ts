import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Wishlist } from './entities/wishlists.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  async getWishlists(): Promise<Wishlist[]> {
    return await this.wishlistsService.findWishlists();
  }

  @Post()
  async createWishlist(
    @Req() req: User,
    @Body() createWishlistDto: CreateWishlistDto,
  ): Promise<Wishlist> {
    return await this.wishlistsService.createWishlist(createWishlistDto, req);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getWishlistById(@Param('id') id: number): Promise<Wishlist> {
    return await this.wishlistsService.findWishlistById(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateWishlist(
    @Req() req: User,
    @Param('id') id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    return await this.wishlistsService.updateWishlist(
      id,
      req.id,
      updateWishlistDto,
    );
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteWishlist(
    @Req() req: User,
    @Param('id') id: number,
  ): Promise<Wishlist> {
    return await this.wishlistsService.deleteWishlist(id, req.id);
  }
}
