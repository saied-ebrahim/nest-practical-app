import { Module } from "@nestjs/common";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./product.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./product.entity";
import { UsersModule } from "src/users/users.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [TypeOrmModule.forFeature([Product]), UsersModule, JwtModule],
    controllers: [ProductsController],
    providers: [ProductsService,],
    exports: [ProductsService]
})
export class ProductsModule { }