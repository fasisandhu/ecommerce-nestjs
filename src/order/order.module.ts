import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from './schemas/order.schema';
import { CartModule } from 'src/cart/cart.module';

@Module({
  imports:[MongooseModule.forFeature([{name:'Order',schema:OrderSchema}]),CartModule],
  providers: [OrderService],
  controllers: [OrderController]
})
export class OrderModule {}
