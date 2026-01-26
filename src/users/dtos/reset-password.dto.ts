import { IsNotEmpty, IsEmail, MaxLength, IsString, IsNumber, IsStrongPassword, MinLength, Min } from "class-validator"

export class ResetPasswordDto {

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
    newPassword: string


    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    userId: number;


    @IsNotEmpty()
    @IsString()
    @MinLength(12)
    resetPasswordToken: string

}