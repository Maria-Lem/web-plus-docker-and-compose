import {
  IsDate,
  IsDecimal,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from 'src/users/entities/user.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { Wishlist } from 'src/wishlists/entities/wishlists.entity';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;

  @Column()
  @IsString()
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
  })
  @IsDecimal()
  price: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
  })
  @IsDecimal()
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  @IsNotEmpty()
  owner: User;

  @Column()
  @Length(1, 1024)
  @IsString()
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @Column({
    default: 0,
  })
  @IsInt()
  copied: number;

  @ManyToMany(() => Wishlist, (wishlist) => wishlist.items)
  wishlists: Wishlist[];
}
