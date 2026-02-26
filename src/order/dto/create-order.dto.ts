import { Type } from "class-transformer";
import { IsArray, IsInt, IsMongoId, IsNotEmpty, IsString, Min, ValidateNested } from "class-validator";


export class ItemDto {
    @IsMongoId()
    itemId: string;

    @IsInt()
    @Min(1)
    quantity: number;
}

export class CreateOrderDto {
    @IsMongoId()
    restaurantId: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ItemDto)
    items: ItemDto[];

    @IsNotEmpty()
    @IsString()
    deliveryAddress: string
}
