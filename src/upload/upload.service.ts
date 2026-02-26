import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { cloudinary } from 'config/cloudinary.config';

@Injectable()
export class UploadService {
    async upload(
        file: Express.Multer.File,
        folder = 'uploads',
    ): Promise<{
        url: string;
        secure_url: string;
        public_id: string;
        format: string;
        bytes: number;
    }> {
        try {
            const result = await new Promise<any>((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                        folder,
                        resource_type: 'auto',
                    },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    },
                ).end(file.buffer);
            });

            return {
                url: result.url,
                secure_url: result.secure_url,
                public_id: result.public_id,
                format: result.format,
                bytes: result.bytes,
            };
        } catch (error) {
            console.error('Cloudinary upload error:', error);
            throw new InternalServerErrorException('File upload failed');
        }
    }
    
    async delete(publicId: string): Promise<{ success: boolean }> {
        try {
            const result = await cloudinary.uploader.destroy(publicId, {
                resource_type: 'auto',
            });

            if (result.result !== 'ok' && result.result !== 'not found') {
                throw new Error('Delete failed');
            }

            return { success: true };
        } catch (error) {
            console.error('Cloudinary delete error:', error);
            throw new InternalServerErrorException('File delete failed');
        }
    }
}
