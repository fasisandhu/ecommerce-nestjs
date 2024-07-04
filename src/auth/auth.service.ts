import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/schema/user.schema';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {} 
  
    async validateUser(username: string, password: string): Promise<User> {
      const user = await this.userService.findUser(username);
      const isPasswordMatch = await bcrypt.compare(
        password,
        user.password
      );
      if (user && isPasswordMatch) {
        return user;
      }
      return null;
    }

    async login(user: any) {
      const payload = { username: user.username, sub: user._id, roles: user.roles };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
  
    // async login(user: AuthCredentialsDto):Promise<{access_token:string}> {
    //   const { username, password } = user;
    //   const valuser= await this.validateUser(username,password)
    //   const payload = { username: valuser.username, sub: valuser.email };
    //   //console.log(payload.sub,payload.username);

    //   return {
    //     access_token: await this.jwtService.sign(payload),
    //   };
    // }
  }