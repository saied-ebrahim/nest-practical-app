import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { UsersService } from "./users.service";
import { RegisterDto } from "./dtos/register.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { LoginDto } from "./dtos/login.dto";
import { AuthGuard } from "./guards/auth.guard";
import { CurrentUser } from "./decorators/current-user.decorator";
import type { JWTPayloadType } from "src/utils/types";
import { Roles } from "./decorators/user-role.decorator";
import { UserType } from "src/utils/enums";
import { AuthRolesGuard } from "./guards/auth-roles.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import type { Response } from "express";
import { ResetPasswordDto } from "./dtos/reset-password.dto";
import { ForgetPasswordDto } from "./dtos/forget-password.dto";

@Controller("api/users")
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post("auth/register")
    public register(@Body() body: RegisterDto) {
        return this.usersService.register(body)
    }

    @Post("auth/login")
    @HttpCode(HttpStatus.OK)
    public login(@Body() body: LoginDto) {
        return this.usersService.login(body)
    }

    @Get('verify-email/:id/:token')
    public verifyEmail(
        @Param('id', ParseIntPipe) id: number,
        @Param('token') token: string) {
        return this.usersService.verifyEmail(id, token)
    }


    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    public sendResetEmail(
        @Body() body: ForgetPasswordDto,
    ) {
        return this.usersService.sendResetPassword(body.email)
    }

    @Get('reset-password/:id/:resetPasswordToken')
    public getResetPassword(
        @Param('id', ParseIntPipe) id: number,
        @Param('resetPasswordToken') resetPasswordToken: string,
    ) {
        return this.usersService.getResetPassword(id, resetPasswordToken)
    }

    @Post('reset-password')
    public resetPassword(@Body() body: ResetPasswordDto) {
        return this.usersService.resetPassword(body)
    }

    @Get("current-user")
    @UseGuards(AuthGuard)
    public getCurrentUser(@CurrentUser() payload: JWTPayloadType) {
        return this.usersService.getCurrentUser(payload.id)
    }
    @Get()
    @Roles(UserType.ADMIN)
    @UseGuards(AuthRolesGuard)
    public getAllUsers() {
        return this.usersService.getAll()
    }


    @Put()
    @Roles(UserType.ADMIN, UserType.USER)
    @UseGuards(AuthRolesGuard)
    public updateUser(@CurrentUser() payload: JWTPayloadType, @Body() body: UpdateUserDto) {
        return this.usersService.update(payload.id, body)
    }
    @Delete(":id")
    @Roles(UserType.ADMIN, UserType.USER)
    @UseGuards(AuthRolesGuard)
    public deleteUser(@Param("id", ParseIntPipe) id: number, @CurrentUser() payload: JWTPayloadType) {
        return this.usersService.delete(id, payload)
    }


    @Post('profile-image')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('user-image'))
    public uploadProfileImage(@UploadedFile() file: Express.Multer.File,
        @CurrentUser() payload: JWTPayloadType) {
        if (!file) throw new BadRequestException('no image provided')
        return this.usersService.setProfileImage(payload.id, file.filename)
    }


    @Delete('profile-image/remove')
    @UseGuards(AuthGuard)
    public removeProfileImage(@CurrentUser() payload: JWTPayloadType) {
        console.log('test');
        return this.usersService.removeProfileImage(payload.id)
    }

    @Get('profile-image/:image')
    @UseGuards(AuthGuard)
    public getProfileImage(@Param('image') image: string, @Res() res: Response) {
        return res.sendFile(image, { root: 'uploads/users' })
    }
}