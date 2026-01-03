import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { CreateProductDto } from "./dtos/create-product.dto";
import { UpdateProductDto } from "./dtos/update-product.dto";
import { ProductsService } from "./product.service";



@Controller()
export class ProductsController {
    constructor(private readonly productService: ProductsService) { }

    @Post("/api/products")
    public createNewProduct(@Body() body: CreateProductDto) {
        return this.productService.createProduct(body)
    }

    @Get("/api/products")
    public getAllProducts() {
        return this.productService.getAll()
    }

    @Get("api/products/:id")
    public getProductById(@Param("id") id: number) {
        return this.productService.getOneBy(id)
    }

    @Put("api/products/:id")
    public updateProduct(@Param("id") id: number, @Body() body: UpdateProductDto) {
        return this.productService.update(id, body)
    }

    @Delete("api/products/:id")
    public deleteProduct(@Param("id") id: number) {
        return this.productService.delete(id)
    }

}
