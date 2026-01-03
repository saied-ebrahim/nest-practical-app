import { Module } from "@nestjs/common";
import { ReviewsController } from "./reviews.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Review } from "./review.entity";

@Module({imports:[TypeOrmModule.forFeature([Review])],
    controllers:[ReviewsController]
})
export class ReviewsModule {}
