import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { ItemDto } from './dtos/item.dto';
import mongoose from 'mongoose';
import { ProductService } from 'src/product/product.service';
import { Item } from './schemas/item.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private CartModel: mongoose.Model<CartDocument>,
    private productService: ProductService,
  ) {}

  async createCart(
    userId: string,
    item: ItemDto,
    subTotalPrice: number,
    totalPrice: number,
  ) {
    const { productId, quantity } = item;

    const product = await this.productService.getProduct(productId);
    if (product.stock < quantity) {
      throw new HttpException(
        'Required quantity not avialable',
        HttpStatus.BAD_REQUEST,
      );
    }

    const productIdObjectId = new mongoose.Types.ObjectId(item.productId);
    const tempItem: Item = {
      productId: productIdObjectId,
      quantity: item.quantity,
      subtotal: subTotalPrice,
    };
    const cart = await this.CartModel.create({
      userId,
      items: [{ ...tempItem, subTotalPrice }],
      totalPrice,
    });
    //console.log('inside create cart');
    //console.log(userId);
    return cart.save();
  }

  async getCart(userId: string): Promise<CartDocument> {
    console.log(userId);
    const cart = await this.CartModel.findOne({ userId: userId })
      .populate('userId');
    return cart;
  }

  async deleteCart(userId: string): Promise<Cart> {
    const cart = await this.CartModel.findOneAndDelete({ userId: userId });
    // cart.items.forEach(async (item) => {
    //   const product = await this.productService.getProduct(
    //     item.productId.toString(),
    //   );
    //   product.stock += item.quantity;
    //   await this.productService.updateProduct(item.productId.toString(), {
    //     name: product.name,
    //     author: product.author,
    //     rating: product.rating,
    //     category: product.category,
    //     stock: product.stock,
    //   });
    // });
    return cart;
  }

  async recalCart(cart: CartDocument) {
    cart.totalPrice = 0;
    cart.items.forEach(async (item) => {
      const product = await this.productService.getProduct(
        item.productId.toString(),
      );
      cart.totalPrice += item.quantity * product.rating;
    });
  }

  async addItemToCart(userid: string, item: ItemDto): Promise<Cart> {
    //rating is price
    const { productId, quantity } = item;

    const product = await this.productService.getProduct(productId);
    if (product.stock < quantity) {
      throw new HttpException(
        'Required quantity not avialable',
        HttpStatus.BAD_REQUEST,
      );
    }

    const subtotal = product.rating * quantity;

    const cart = await this.getCart(userid);

    if (cart) {
      const itemIdx = cart.items.findIndex(
        (item) => item.productId.toString() == productId,
      );

      if (itemIdx > -1) {
        //item exists
        let myitem = cart.items[itemIdx];
        myitem.quantity = Number(myitem.quantity) + Number(quantity);
        myitem.subtotal = myitem.quantity * product.rating;

        cart.items[itemIdx] = myitem;
        this.recalCart(cart);
        // product.stock -= quantity;
        // await this.productService.updateProduct(productId, {
        //   name: product.name,
        //   author: product.author,
        //   rating: product.rating,
        //   category: product.category,
        //   stock: product.stock,
        // });
        return cart.save();
      } else {
        const productIdObjectId = new mongoose.Types.ObjectId(item.productId);
        const tempItem: Item = {
          productId: productIdObjectId,
          quantity: item.quantity,
          subtotal: subtotal,
        };
        cart.items.push({ ...tempItem, subtotal });
        this.recalCart(cart);
        // product.stock -= quantity;
        // await this.productService.updateProduct(item.productId, {
        //   name: product.name,
        //   author: product.author,
        //   rating: product.rating,
        //   category: product.category,
        //   stock: product.stock,
        // });
        return cart.save();
      }
    } else {
      console.log('inside add item');
      const newCart = await this.createCart(userid, item, subtotal, subtotal); //at start total price is equal to subtotal
      product.stock -= quantity;
      return newCart;
    }
  }

  async removeItemFromCart(userid: string, pid: string): Promise<any> {
    const cartt = await this.getCart(userid);

    const itemIdx = cartt.items.findIndex(
      (item) => item.productId.toString() == pid,
    );

    if (itemIdx > -1) {
      // const product = await this.productService.getProduct(pid);
      // product.stock += cartt.items[itemIdx].quantity;
      // await this.productService.updateProduct(pid, {
      //   name: product.name,
      //   author: product.author,
      //   rating: product.rating,
      //   category: product.category,
      //   stock: product.stock,
      // });
      cartt.items.splice(itemIdx, 1);
      this.recalCart(cartt);
      return cartt.save();
    }
  }
}
