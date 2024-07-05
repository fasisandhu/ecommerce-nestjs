import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import mongoose from 'mongoose';
import { CartService } from 'src/cart/cart.service';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name)
    private orderModel: mongoose.Model<Order>,
    private cartService: CartService,
    private productService: ProductService,
  ) {}

  async findOrder(userId: string,id:string): Promise<Order> {
    return await this.orderModel.findOne({ _id:id,userId: userId });
  }
  async createOrder(userId: string): Promise<Order> {
    const cart = await this.cartService.getCart(userId);

    if (!cart) {
      throw new HttpException('Cart empty', 404);
    }
    if (cart.items.length === 0) {
      throw new HttpException('Cart empty', 404);
    }

    const order = await this.orderModel.create({
      userId: (await cart).userId,
      items: (await cart).items,
      totalPrice: (await cart).totalPrice,
    });

    cart.items.forEach(async (item) => {
      const product = await this.productService.getProduct(
        item.productId.toString(),
      );
      product.stock -= item.quantity;
      await this.productService.updateProduct(item.productId.toString(), {
        name: product.name,
        author: product.author,
        rating: product.rating,
        category: product.category,
        stock: product.stock,
      });
    });

    await this.cartService.deleteCart(userId); //as order created so no need of cart
    return order.save();
  }

  async cancelOrder(userId: string,id:string) {
    const existingOrder = await this.findOrder(userId,id);

    if (!existingOrder) {
      throw new HttpException('No Order Exists', 404);
    }

    if(existingOrder.status === 'Cancelled')
      {
      throw new HttpException('Order Already Cancelled', 404);
        
      }  
    const cancelledOrder = await this.orderModel.findOneAndUpdate(
      { userId: userId,_id:id },
      {
        userId: existingOrder.userId,
        items: existingOrder.items,
        totalPrice: existingOrder.totalPrice,
        status: 'Cancelled',
      },
    );
    // const cancelledOrder = await this.orderModel.updateOne({
    //   userId: existingOrder.userId,
    //   items: existingOrder.items,
    //   totalPrice: existingOrder.totalPrice,
    //   status: 'Cancelled',
    // });

    existingOrder.items.forEach(async (item) => {
      const product = await this.productService.getProduct(
        item.productId.toString(),
      );
      product.stock += item.quantity;
      await this.productService.updateProduct(item.productId.toString(), {
        name: product.name,
        author: product.author,
        rating: product.rating,
        category: product.category,
        stock: product.stock,
      });
    });

    return cancelledOrder;
  }
}
