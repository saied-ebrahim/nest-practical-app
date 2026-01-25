import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from "@nestjs/common";
import { CreateProductDto } from "./dtos/create-product.dto";
import { UpdateProductDto } from "./dtos/update-product.dto";
import { ProductsService } from "./product.service";
import { CurrentUser } from "src/users/decorators/current-user.decorator";
import type { JWTPayloadType } from "src/utils/types";
import { Roles } from "src/users/decorators/user-role.decorator";
import { UserType } from "src/utils/enums";
import { AuthRolesGuard } from "src/users/guards/auth-roles.guard";



@Controller("api/products")
export class ProductsController {
    constructor(private readonly productService: ProductsService) { }

    @Post()
    @Roles(UserType.ADMIN)
    @UseGuards(AuthRolesGuard)
    public createNewProduct(@Body() body: CreateProductDto, @CurrentUser() payload: JWTPayloadType) {
        return this.productService.createProduct(payload.id, body)
    }

    @Get()
    public getAllProducts(
        @Query('title') title: string,
        @Query('minPrice') minPrice: string,
        @Query('maxPrice') maxPrice: string,) {
        return this.productService.getAll(title, minPrice, maxPrice)
    }

    @Get(":id")
    public getProductById(@Param("id", ParseIntPipe) id: number) {
        return this.productService.getOneBy(id)
    }

    @Put(":id")
    @Roles(UserType.ADMIN)
    @UseGuards(AuthRolesGuard)
    public updateProduct(@Param("id", ParseIntPipe) id: number, @Body() body: UpdateProductDto) {
        return this.productService.update(id, body)
    }

    @Delete(":id")
    @Roles(UserType.ADMIN)
    @UseGuards(AuthRolesGuard)
    public deleteProduct(@Param("id", ParseIntPipe) id: number) {
        return this.productService.delete(id)
    }

}
