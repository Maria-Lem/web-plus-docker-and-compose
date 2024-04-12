import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class UpdateWishlistDto {
  @IsString()
  @Length(1, 250)
  name: string;

  @IsString()
  @IsOptional()
  @Length(0, 1500)
  description: string;

  @IsUrl()
  image: string;

  @IsArray()
  @IsNumber()
  itemsId: number[];
}
