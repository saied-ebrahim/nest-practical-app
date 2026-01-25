import { Module } from "@nestjs/common";
import { ReviewsController } from "./reviews.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Review } from "./review.entity";
import { UsersModule } from "src/users/users.module";
import { ProductsModule } from "src/products/products.module";
import { JwtModule } from "@nestjs/jwt";
import { ReviewsService } from "./reviews.service";

@Module({
    imports: [TypeOrmModule.forFeature([Review]), UsersModule, ProductsModule, JwtModule],
    controllers: [ReviewsController],
    providers: [ReviewsService]
})
export class ReviewsModule { }
