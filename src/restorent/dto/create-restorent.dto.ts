import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class CreateRestorentDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    image?: File;

    @IsNotEmpty()
    @IsString()
    addressLine: string;

    @IsNotEmpty()
    @IsString()
    city: string;

    @IsNotEmpty()
    @IsString()
    state: string;

    @IsNotEmpty()
    @IsString()
    country: string;

    @IsNotEmpty()
    @IsString()
    @Length(6, 6)
    pincode: string;
}
