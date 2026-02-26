import { BadRequestException } from '@nestjs/common';
import multer from 'multer';
import type { Options as MulterOptions } from 'multer';

export const multerConfig: MulterOptions = {
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
            return cb(new BadRequestException('Invalid file type'));
        }
        cb(null, true);
    },
};
