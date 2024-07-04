import { Role } from "src/auth/enums/role.enum";

export class CreateUserDto{
    readonly username: string;
    readonly email: string;
    readonly password: string;
    readonly roles:Role[];
}
