import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import type { Response } from "express";
import { diskStorage } from "multer";

@Controller("api/upload")
export class UploadsController {
    constructor() { }



    @Post()
    @UseInterceptors(FileInterceptor('file'))
    public uploadFile(@UploadedFile() file: Express.Multer.File) {
        if (!file) throw new BadRequestException("no file provided")
        console.log("file uploaded", file)
        return { message: "file uploaded successfully" }
    }


    @Get(':image')
    public getUploadedFile(@Param('image') image: string, @Res() res: Response) {
        return res.sendFile(image, { root: 'uploads' })

    }
    @Post()
    @UseInterceptors(FilesInterceptor('file'))
    public uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
        if (!files) throw new BadRequestException("no file provided")
        console.log("file uploaded", files)
        return { message: "file uploaded successfully" }
    }


}