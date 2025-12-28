import { Injectable, NotFoundException } from "@nestjs/common"
import { CreateProductDto } from "./dtos/create-product.dto"
import { UpdateProductDto } from "./dtos/update-product.dto"
import { Repository } from "typeorm"
import { Product } from "./product.entity"
import { InjectRepository } from "@nestjs/typeorm"

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product) private readonly productsRepository: Repository<Product>) { }

    public async createProduct(dto: CreateProductDto) {
        const newProduct = this.productsRepository.create(dto)
        return await this.productsRepository.save(newProduct)
    }

    public getAll() {
        return this.productsRepository.find()
    }

    public async getOneBy(id: number) {
        const product = await this.productsRepository.findOne({ where: { id } })
        if (!product) throw new NotFoundException("Product not found")
        return product
    }

    public async update(id: number, dto: UpdateProductDto) {
        const product = await this.getOneBy(id)
        if (!product) throw new NotFoundException("Product not found")
        product.title = dto.title ?? product.title
        product.price = dto.price ?? product.price
        product.description = dto.description ?? product.description
        return this.productsRepository.save(product)
    }

    public async delete(id: number) {
        const product = await this.getOneBy(id)
        if (!product) throw new NotFoundException("Product not found")
        await this.productsRepository.remove(product)
        return { message: 'product deleted successfully' }
    }
}