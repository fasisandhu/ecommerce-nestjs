import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import mongoose from 'mongoose';
import { CreateUserDto } from './dtos/create-user-dtos';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
    constructor(@InjectModel(User.name)
    private UserModel:mongoose.Model<UserDocument>
    ){}

    async addUser(user:CreateUserDto):Promise<User>
    {
        const newuser=await this.UserModel.create(user);
        newuser.password=await bcrypt.hash(newuser.password,8);
        return newuser.save();
    }

    async findUser(username:string):Promise<User>
    {
        const user=await this.UserModel.findOne({username:username});
        return user;
    }


}
