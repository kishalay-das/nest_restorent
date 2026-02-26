import { Body, Controller, Delete, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'config/multer.config';

@Controller('upload')
export class UploadController {
    constructor(private readonly uploadervice: UploadService) { }

    @Post()
    @UseInterceptors(FileInterceptor('file', multerConfig))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        return await this.uploadervice.upload(file, 'restaurants')
    }

    @Delete()
    async deleteFile(@Body('publicId') publicId: string) {
        return await this.uploadervice.delete(publicId)
    }
}
