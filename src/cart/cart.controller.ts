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

  @Post(':id')
  async getUserCart(
    @Param('id')
    id: string,
  ) {
    return await this.CartService.getCart(id);
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

  @Post()
  @UseGuards(AuthGuard())
  createCart(@Req() req, @Body() item: ItemDto): string {
    console.log(req.user._id);
    //console.log("logginigns")
    return 'holaaa';
    //await this.CartService.createCart(req.user.userId, item,item.price*item.quantity,item.price);
  }

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
  @Delete('/:id')
  async deleteCart(
    @Param('id')
    id: string,
  ) {
    const cart = await this.CartService.deleteCart(id);
    if (!cart) throw new NotFoundException('Cart does not exist');
    return cart;
    //return await this.CartService.deleteCart(id);
  }
}
