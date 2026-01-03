import { IsString, IsNotEmpty, Length, IsEmail, IsStrongPassword, IsOptional } from "class-validator"

export class UpdateUserDto {
    @IsNotEmpty()
    @IsOptional()
    @IsString()
    @Length(3, 50)
    userName?: string;

    

    @IsNotEmpty()
    @IsOptional()
    @IsEmail()
    email?: string



    @IsNotEmpty()
    @IsOptional()
    @IsStrongPassword({
        minLength: 10,
        minNumbers: 2,
    }, {
        message: 'Password is too weak. It must be at least 10 characters long and contain at least 2 numbers.',
    })
    password?: string;
}