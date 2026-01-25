import { BadRequestException, Module } from "@nestjs/common";
import { UploadsController } from "./uploads.controller";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";


@Module({
    imports: [MulterModule.register({
        storage: diskStorage({
            destination: './uploads',
            filename(req, file, callback) {
                const prefix = `${Date.now()}-${Math.random() * 1000000}`
                const fileName = `${prefix}- ${file.originalname}`
                callback(null, fileName)
            },
        }),
        fileFilter(req, file, callback) {
            if (file.mimetype.startsWith('image')) {
                callback(null, true)
            } else {
                callback(new BadRequestException('unsupported file format '), false)
            }
        }, limits: { fileSize: 1024 * 1024 * 2 }
    })],
    exports: [],
    providers: [],
    controllers: [UploadsController],
})
export class UploadsModule { }