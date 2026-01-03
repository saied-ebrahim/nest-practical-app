import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products/product.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './users/user.entity';
import { Review } from './reviews/review.entity';

@Module({
  imports: [UsersModule, ReviewsModule, ProductsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: "postgres",
          host: "localhost",
          port: config.get<number>("DB_PORT"),
          username: config.get<string>("DB_USERNAME"),
          password: config.get<string>("DB_PASSWORD"),
          database: config.get<string>("DB_DATABASE"),
          entities: [Product,User,Review],
          synchronize: process.env.NODE_ENV !== 'production'

        }
      }

    }),

  ],
  controllers: [],
})
export class AppModule { }
