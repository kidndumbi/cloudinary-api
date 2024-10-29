import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';
import { createReadStream } from 'streamifier';

@Injectable()
export class AppService {
  uploadFile(
    file: Express.Multer.File,
    bucket?: string,
    tags?: string[],
    context?: Record<string, any>,
  ): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: bucket || null,
          tags: tags || [],
          context: context || {},
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  getFiles(publicIds: string[]): Promise<any[]> {
    const filePromises = publicIds.map((id) =>
      new Promise((resolve, reject) => {
        cloudinary.api.resource(id, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        });
      }),
    );

    return Promise.all(filePromises);
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
