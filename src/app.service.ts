import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';
import { createReadStream } from 'streamifier';

@Injectable()
export class AppService {
  uploadFile(
    file: Express.Multer.File,
    bucket?: string,
  ): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      console.log('file', file);
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: bucket || null },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  deleteFile(publicId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, {}, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }
}
