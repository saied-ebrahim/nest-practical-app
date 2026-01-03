import { IsString, IsNotEmpty, IsEmail, IsStrongPassword, MaxLength } from "class-validator"

export class LoginDto {

    @IsNotEmpty()
    @IsEmail()
    @MaxLength(200)
    email: string



    @IsString()
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