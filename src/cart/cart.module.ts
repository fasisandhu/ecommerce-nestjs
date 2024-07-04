import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CartSchema } from './schemas/cart.schema';
import { ProductModule } from 'src/product/product.module';
import { ItemSchema } from './schemas/item.schema';

@Module({
  imports:[MongooseModule.forFeature([{name:'Cart',schema:CartSchema},{name:'Item',schema:ItemSchema}]),ProductModule],
  controllers: [CartController],
  providers: [CartService],
  exports:[CartService]
})
export class CartModule {}
