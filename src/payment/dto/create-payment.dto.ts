import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreatePaymentDto {
    @IsNumber()
    @Min(1)
    amount: number;

    @IsOptional()
    @IsString()
    currency?: string; // default: inr
}