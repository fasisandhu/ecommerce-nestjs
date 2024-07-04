import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { ItemDto } from './dtos/item.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/schema/user.schema';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { Role } from 'src/auth/enums/role.enum';

@Controller('store/cart')
export class CartController {
  constructor(private CartService: CartService) {}

  @Post('getCart')
  @UseGuards(JwtAuthGuard)
  async getUserCart(
    @Req()
    req
  ) {
    console.log(req.user.userId);
    return await this.CartService.getCart(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  //  @Roles(Role.User)
  @Post()
  async addItemToCart(
    @Request()
    req,
    @Body()
    item: ItemDto,
  ) {
    console.log('controller ');
    return await this.CartService.addItemToCart(req.user.userId, item);
  }

  // @Post('create')
  // @UseGuards(JwtAuthGuard)
  // createCart(@Req() req, @Body() item: ItemDto) {
  //   //console.log(req.user._id);
  //   //console.log("logginigns")
  //   //return 'holaaa';
  //   console.log(req.user)
  //   console.log(req.user.userId);
  //   return this.CartService.createCart(req.user.userId, item,item.price*item.quantity,item.price);
  // }

  // @Post('/addItem')
  // async addItemToCart(@Request() req, @Body() item: ItemDto)
  // {
  //   return await this.CartService.addItemToCart(req.user.userId, item);
  // }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @Delete('/removeItem')
  async removeItemFromCart(
    @Request()
    req,
    @Body()
    { productId },
  ) {
    const userId = req.user.userId;
    const cart = await this.CartService.removeItemFromCart(userId, productId);
    if (!cart) throw new NotFoundException('Item does not exist');
    return cart;
    // return await this.CartService.removeItemFromCart(
    //   req.user.userId,
    //   productId,
    // );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @Delete('')
  async deleteCart(
    @Req()
    req
  ) {
    const cart = await this.CartService.deleteCart(req.user.userId);
    if (!cart) throw new NotFoundException('Cart does not exist');
    return cart;
    //return await this.CartService.deleteCart(id);
  }
}
