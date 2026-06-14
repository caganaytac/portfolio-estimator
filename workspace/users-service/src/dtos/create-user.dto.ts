import { IsEmail, IsIn, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {

    @IsEmail()
    email!: string;

    @IsNotEmpty()
    passwordHash!: string;

    @IsString()
    @IsIn(["user", "admin", "manager"])
    role!: string;
}
