import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import mongoose from 'mongoose';
import { CartService } from 'src/cart/cart.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name)
    private orderModel: mongoose.Model<Order>,
    private cartService: CartService,
  ) {}

  async findOrder(userId: string):Promise<Order> {
    return await this.orderModel.findOne({ userId: userId });
  }
  async createOrder(userId: string): Promise<Order> {
    const cart = await this.cartService.getCart(userId);

    if (!cart) {
      throw new HttpException('Cart empty', 404);
    }

    const order = await this.orderModel.create({
      userId: (await cart).userId,
      items: (await cart).items,
      totalPrice: (await cart).totalPrice,
    });

    await this.cartService.deleteCart(userId); //as order created so no need of cart
    return order.save();
  }

  async cancelOrder(userId: string) {
    const existingOrder = await this.findOrder(userId);

    if (!existingOrder) {
      throw new HttpException('No Order Exists', 404);
    }

    const cancelledOrder = await this.orderModel.updateOne({
      userId: existingOrder.userId,
      items: existingOrder.items,
      totalPrice: existingOrder.totalPrice,
      status:'Cancelled'
    });

    return cancelledOrder;
  }
}
