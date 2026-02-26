import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateMenuDto {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsOptional()
    image?: File

    @IsNotEmpty()
    @IsString()
    price: number;

    @IsNotEmpty()
    @IsString()
    discountPrice: number;

    @IsNotEmpty()
    @IsString()
    itemType: string;
}
