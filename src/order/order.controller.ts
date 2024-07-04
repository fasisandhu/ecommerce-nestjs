import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('store/order')
export class OrderController {
    constructor(private orderService: OrderService)
    {}


    @Post()
    @UseGuards(JwtAuthGuard)
    createOrder(@Request() req)
    {

        return this.orderService.createOrder(req.user.userId)
    }


    @Post('cancel')
    @UseGuards(JwtAuthGuard)
    cancelOrder(@Request() req)
    {
        return this.orderService.cancelOrder(req.user.userId)
    }
}
