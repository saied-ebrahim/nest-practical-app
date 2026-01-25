import { Injectable, NotFoundException } from "@nestjs/common"
import { CreateProductDto } from "./dtos/create-product.dto"
import { UpdateProductDto } from "./dtos/update-product.dto"
import { Between, Like, Repository } from "typeorm"
import { Product } from "./product.entity"
import { InjectRepository } from "@nestjs/typeorm"
import { UsersService } from "src/users/users.service"

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productsRepository: Repository<Product>
        , private readonly usersService: UsersService) { }

    /**
     *  create new product 
     * @param dto 
     * @returns 
     */
    public async createProduct(userId: number, dto: CreateProductDto): Promise<Product> {
        const user = await this.usersService.getCurrentUser(userId)
        const newProduct = this.productsRepository.create({
            ...dto,
            title: dto.title.toLowerCase(),
            user

        })
        return await this.productsRepository.save(newProduct)
    }

    /**
     * get all products from database
     * @returns collection of products
     */
    public getAll(title: string, minPrice: string, maxPrice: string): Promise<Product[]> {
        const filters = {
            ...(title ? { title: Like(`%${title.toLowerCase()}%`) } : {}),
            ...(minPrice && maxPrice ? { price: Between(parseInt(minPrice), parseInt(maxPrice)) } : {})
        }
        return this.productsRepository.find({ where: filters })
    }

    public async getOneBy(id: number): Promise<Product> {
        const product = await this.productsRepository.findOne({ where: { id } })
        if (!product) throw new NotFoundException("Product not found")
        return product
    }

    public async update(id: number, dto: UpdateProductDto): Promise<Product> {
        const product = await this.getOneBy(id)
        product.title = dto.title ?? product.title
        product.price = dto.price ?? product.price
        product.description = dto.description ?? product.description
        return this.productsRepository.save(product)
    }

    public async delete(id: number): Promise<{ message: string }> {
        const product = await this.getOneBy(id)
        if (!product) throw new NotFoundException("Product not found")
        await this.productsRepository.remove(product)
        return { message: 'product deleted successfully' }
    }
}