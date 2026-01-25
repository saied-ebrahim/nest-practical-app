import { BadRequestException, Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { AuthProvider } from "./auth.provider";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { MailModule } from "src/mail/mail.module";

@Module({
    controllers: [UsersController],
    providers: [UsersService, AuthProvider],
    imports: [MailModule, TypeOrmModule.forFeature([User]),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                return {
                    global: true,
                    secret: config.get<string>("JWT_SECRET"),
                    signOptions: { expiresIn: config.get<string>("JWT_EXPIRES_IN") as any }
                }
            }
        }), MulterModule.register({
            storage: diskStorage({
                destination: 'uploads/users',
                filename(req, file, callback) {
                    const prefix = `${Date.now()}-${Math.random() * 1000000}`
                    const fileName = `${prefix}-${file.originalname}`
                    callback(null, fileName)
                },
            }), fileFilter(req, file, callback) {
                if (file.mimetype.startsWith('image')) {
                    callback(null, true)
                } else {
                    callback(new BadRequestException('unsupported file format'), false)
                }
            }, limits: { fileSize: 1024 * 1024 * 2 }
        })],
    exports: [UsersService]

})
export class UsersModule { }