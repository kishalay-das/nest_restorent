import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MaxLength, MinLength } from "class-validator";

export class loginDto {
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsString()
    @IsStrongPassword({ minLength: 8, minUppercase: 1, minSymbols: 1, minNumbers: 1, minLowercase: 1 })
    password: string

}