import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Role } from "src/auth/enums/role.enum";

export class CreateUserDto{
    @IsNotEmpty()
    @IsString()
    readonly username: string;
    @IsNotEmpty()
    @IsString()
    readonly email: string;
    @IsNotEmpty()
    @IsString()
    readonly password: string;
    @IsEnum(Role)
    readonly roles:Role[];
}
