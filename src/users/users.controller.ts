import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";

@Controller()
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post("api/users")
    public createNewProduct(@Body() body: CreateUserDto) {
        return this.usersService.createUser(body)
    }

    @Get("api/users")
    public getAllUsers() {
        return this.usersService.getAll()
    }
    @Get("api/users/:id")
    public getUserById(@Param("id") id: number) {
        return this.usersService.getOneBy(id)
    }

    @Put("api/users/:id")
    public updateUser(@Param("id") id: number, @Body() body: UpdateUserDto) {
        return this.usersService.update(id, body)
    }
    @Delete("api/products/:id")
    public deleteUser(@Param("id") id: number) {
        return this.usersService.delete(id)
    }
}