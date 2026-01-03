import { Body, Controller, Delete, Get,  HttpCode, HttpStatus, Param, Post, Put, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { RegisterDto } from "./dtos/register.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { LoginDto } from "./dtos/login.dto";
import { AuthGuard } from "./guards/auth.guard";
import { CurrentUser } from "./decorators/current-user.decorator";
import type { JWTPayloadType } from "src/utils/types";

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
    @Get("auth/users")
    public getAllUsers() {
        return this.usersService.getAll()
    }
    @Get("auth/users/:id")
    public getUserById(@Param("id") id: number) {
        return this.usersService.getOneBy(id)
    }

    @Put("auth/users/:id")
    public updateUser(@Param("id") id: number, @Body() body: UpdateUserDto) {
        return this.usersService.update(id, body)
    }
    @Delete("auth/products/:id")
    public deleteUser(@Param("id") id: number) {
        return this.usersService.delete(id)
    }
}