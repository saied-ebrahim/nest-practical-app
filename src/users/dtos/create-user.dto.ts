import { IsString, IsNotEmpty, Length, IsEmail, IsStrongPassword } from "class-validator"

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @Length(3, 50)
    firstName: string;

    @IsNotEmpty()
    @IsString()
    @Length(3, 50)
    lastName: string;


    @IsNotEmpty()
    @IsEmail()
    email: string



    @IsNotEmpty()
    @IsStrongPassword({
        minNumbers: 2,
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minSymbols: 1,
    }, {
        message: 'Password is too weak. It must be at least 10 characters long and contain at least 2 numbers.',
    })
    password: string;
}