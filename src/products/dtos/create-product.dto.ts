import { IsNumber, IsString, IsNotEmpty, Length, Min } from "class-validator"

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    @Length(3, 150)
    title: string;


    @IsNotEmpty()
    @IsString()
    description: string

    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    price: number;
}