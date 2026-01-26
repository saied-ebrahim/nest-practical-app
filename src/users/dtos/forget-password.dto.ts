import { IsNotEmpty, IsEmail, MaxLength } from "class-validator"

export class ForgetPasswordDto {

    @IsNotEmpty()
    @IsEmail()
    @MaxLength(200)
    email: string

}