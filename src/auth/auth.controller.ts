import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dtos/create-user-dtos';
import { LocalAuthGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorators';
import { Role } from './enums/role.enum';



@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('/register')
  async register(@Body() createUserDTO: CreateUserDto) {
    const user = await this.userService.addUser(createUserDTO);
    return user;
  }

  // @Post('test')
  // @UseGuards(AuthGuard())
  // test(@Req() req) {
  //   console.log(req.user._id);
  // }

  //   @UseGuards()
  //   @Post('/login')
  //   async login(@Request() req) {
  //     return this.authService.login(req.user);
  //   }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req): Promise<{ access_token: string }> {
    return this.authService.login(req.user);
  }
  //   @Post('/login')
  //   async login(
  //     @Body() { username, password }: { username: string; password: string },
  //   ) {
  //     const user = await this.authService.validateUser(username, password);
  //     if (!user) {
  //       return { statusCode: 401, message: 'Invalid credentials' };
  //     }
  //     return this.authService.login(user);
  //   }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @Get('/user')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('/admin')
  getDashboard(@Request() req) {
    return req.user;
  }
}
