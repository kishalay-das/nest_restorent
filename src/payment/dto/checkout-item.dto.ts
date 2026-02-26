import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CheckoutItemDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    image?: string;

    @IsNumber()
    @Min(1)
    price: number;

    @IsNumber()
    @Min(1)
    qty: number;
}