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
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  async getWishlists(): Promise<Wishlist[]> {
    return await this.wishlistsService.findWishlists();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getWishlistById(@Param('id') id: number): Promise<Wishlist> {
    return await this.wishlistsService.findWishlistById(id);
  }

  @Post()
  async createWishlist(
    @Req() req,
    @Body() createWishlistDto: CreateWishlistDto,
  ): Promise<Wishlist> {
    console.log(req);
    return await this.wishlistsService.createWishlist(
      createWishlistDto,
      req.user,
    );
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateWishlist(
    @Req() req,
    @Param('id') id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    return await this.wishlistsService.updateWishlist(
      id,
      req.user.id,
      updateWishlistDto,
    );
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteWishlist(@Req() req, @Param('id') id: number): Promise<Wishlist> {
    return await this.wishlistsService.deleteWishlist(id, req.user.id);
  }
}
