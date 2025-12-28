import { IsNumber, IsString, IsNotEmpty, Length, Min, IsOptional } from "class-validator"

export class UpdateProductDto {
    @IsNotEmpty()
    @IsString()
    @Length(3, 150)
    @IsOptional()
    title?: string;
    
    @IsNotEmpty()
    @IsString()
    @Length(3, 150)
    @IsOptional()
    description?: string

    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    @IsOptional()
    price?: number;
}