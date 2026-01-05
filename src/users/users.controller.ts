import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, UseGuards } from "@nestjs/common";
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
}