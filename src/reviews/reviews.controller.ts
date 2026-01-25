import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from "@nestjs/common";
import { CreateReviewDto } from "./dtos/create-review.dto";
import { CurrentUser } from "src/users/decorators/current-user.decorator";
import { UserType } from "src/utils/enums";
import { Roles } from "src/users/decorators/user-role.decorator";
import type { JWTPayloadType } from "src/utils/types";
import { ReviewsService } from "./reviews.service";
import { AuthRolesGuard } from "src/users/guards/auth-roles.guard";
import { UpdateReviewDto } from "./dtos/update-review.dto";

@Controller('api/reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) { }

    @Post(":id")
    @Roles(UserType.ADMIN, UserType.USER)
    @UseGuards(AuthRolesGuard)
    public createNewReview(@Param("id", ParseIntPipe) productId: number, @Body() body: CreateReviewDto, @CurrentUser() payload: JWTPayloadType,) {
        return this.reviewsService.create(productId, payload.id, body)
    }
    @Get(":id")
    public getOneById(@Param("id", ParseIntPipe) id: number) {
        return this.reviewsService.getOneBy(id)
    }
    @Get()
    @Roles(UserType.ADMIN)
    @UseGuards(AuthRolesGuard)
    public getAllReviews(
        @Query('pageNumber', ParseIntPipe) pageNumber: number,
        @Query('countPerPage', ParseIntPipe) countPerPage: number) {
        return this.reviewsService.getAll(pageNumber, countPerPage)
    }


    @Put(":id")
    @Roles(UserType.ADMIN, UserType.USER)
    @UseGuards(AuthRolesGuard)
    public updateReview(@CurrentUser() payload: JWTPayloadType, @Param("id", ParseIntPipe) id: number, @Body() body: UpdateReviewDto) {
        return this.reviewsService.update(id, payload.id, body)
    }

    @Delete(":id")
    @Roles(UserType.ADMIN, UserType.USER)
    @UseGuards(AuthRolesGuard)
    public deleteReview(@CurrentUser() payload: JWTPayloadType, @Param("id", ParseIntPipe) id: number) {
        return this.reviewsService.delete(id, payload)
    }
}