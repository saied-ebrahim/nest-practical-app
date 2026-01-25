import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Review } from "./review.entity";
import { Repository } from "typeorm";
import { ProductsService } from "src/products/product.service";
import { UsersService } from "src/users/users.service";
import { CreateReviewDto } from "./dtos/create-review.dto";
import { UpdateReviewDto } from "./dtos/update-review.dto";
import { JWTPayloadType, ReviewType } from "src/utils/types";
import { UserType } from "src/utils/enums";



@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(Review) private readonly reviewsRepository: Repository<Review>,
        private readonly productsService: ProductsService,
        private readonly usersService: UsersService
    ) { }

    public async create(productId: number, userId: number, dto: CreateReviewDto): Promise<ReviewType> {
        const product = await this.productsService.getOneBy(productId)
        const user = await this.usersService.getCurrentUser(userId)
        const review = this.reviewsRepository.create({ ...dto, product, user })
        const result = await this.reviewsRepository.save(review)
        return {

            id: result.id,
            rating: result.rating,
            comment: result.comment,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
            userId: user.id,
            productId: product.id
        }

    }

    public async getOneBy(id: number): Promise<Review> {
        const review = await this.reviewsRepository.findOne({ where: { id } })
        if (!review) throw new NotFoundException("review not found")
        console.log(review.product)
        return review
    }

    public async getAll(pageNumber: number, countPerPage: number) {
        const result = await this.reviewsRepository.find({
            skip: countPerPage * (pageNumber - 1),
            take: countPerPage,
            order: { createdAt: "DESC" }
        })
        return {
            ...result, pag: {
                pageNumber,
                countPerPage
            }
        }
    }

    public async update(id: number, userId: number, dto: UpdateReviewDto): Promise<Review> {
        const review = await this.getOneBy(id)

        if (review.user.id !== userId)
            throw new ForbiddenException("access denied, you are not allowed to do this  ")

        review.comment = dto.comment?.toLowerCase() ?? review.comment
        review.rating = dto.rating ?? review.rating
        return this.reviewsRepository.save(review)
    }

    public async delete(id: number, payload: JWTPayloadType) {
        const review = await this.getOneBy(id)
        if (review.user.id === payload.id || payload.userType === UserType.ADMIN) {
            await this.reviewsRepository.remove(review)
            return { message: 'review deleted successfully' }
        }
        throw new ForbiddenException("access denied, you are not allowed to do this  ")

    }
}