import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateBannerDto {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsOptional()
    image: File
}
