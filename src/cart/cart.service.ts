import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { ItemDto } from './dtos/item.dto';
import mongoose from 'mongoose';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private CartModel: mongoose.Model<CartDocument>,
  ) {}

  async createCart(
    userid: string,
    item: ItemDto,
    subTotalPrice: number,
    totalPrice: number,
  ) {
    const cart = await this.CartModel.create({
      userid,
      items: [{ ...item, subTotalPrice }],
      totalPrice,
    });
    console.log("inside create cart")
    return cart.save();
  }

  async getCart(userId: string): Promise<CartDocument> {
    const cart = await this.CartModel.findOne({ userid: userId });
    return cart;
  }

  async deleteCart(userId: string): Promise<Cart> {
    const cart = await this.CartModel.findOneAndDelete({ userid: userId });
    return cart;
  }

  async recalCart(cart: CartDocument) {
    cart.totalPrice = 0;
    cart.items.forEach((item) => {
      cart.totalPrice += item.quantity * item.price;
    });
  }

  async addItemToCart(userid:string, item:ItemDto):Promise<Cart>
  {
      const {productId,quantity,price}=item
      const subtotal=price*quantity

      const cart=await this.getCart(userid);

      if(cart)
          {
              const itemIdx=cart.items.findIndex(item=>item.productId==productId);

              if(itemIdx>-1)//item exists
              {
                  let myitem=cart.items[itemIdx];
                  myitem.quantity=Number(myitem.quantity)+Number(quantity)
                  myitem.subtotal=myitem.quantity*item.price

                  cart.items[itemIdx] = myitem;
                  this.recalCart(cart)
                  return cart.save();
              }
              else
              {
                  cart.items.push({...item,subtotal})
                  this.recalCart(cart)
                  return cart.save();
              }
          }
      else
          {
            console.log("inside add item")
              const newCart=await this.createCart(userid,item,subtotal,price)
              return newCart;
          }
  }

  async removeItemFromCart(userid: string, pid: string): Promise<any> {
    const cartt = await this.getCart(userid);

    const itemIdx = cartt.items.findIndex((item) => item.productId == pid);

    if (itemIdx > -1) {
      cartt.items.splice(itemIdx, 1);
      this.recalCart(cartt)
      return cartt.save();
    }
  }
}
