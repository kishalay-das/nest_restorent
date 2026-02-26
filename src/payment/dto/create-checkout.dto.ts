import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested, ArrayMinSize } from 'class-validator';
import { CheckoutItemDto } from './checkout-item.dto';

export class CreateCheckoutDto {
    @IsArray()
    @IsString({ each: true })
    orderIds: string[];
    
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CheckoutItemDto)
    items: CheckoutItemDto[];
}