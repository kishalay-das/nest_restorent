import { IsOptional, IsString, MaxLength } from "class-validator";
import { PaginationQuaryDto } from "common/dto/pagination-quary";

export class OrderQuaryDto extends PaginationQuaryDto {
    @IsOptional()
    @IsString()
    @MaxLength(100)
    search?: string
}