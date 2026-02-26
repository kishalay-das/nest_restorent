import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MaxLength, MinLength } from "class-validator";

export class registerDto {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @MaxLength(10)
    @MinLength(10)
    phone: string

    @IsNotEmpty()
    @IsString()
    @IsStrongPassword({ minLength: 8, minUppercase: 1, minSymbols: 1, minNumbers: 1, minLowercase: 1 })
    password: string

}