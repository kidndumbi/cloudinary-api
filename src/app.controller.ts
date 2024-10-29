import { AppService } from './app.service';
import {
  Controller,
  Delete,
  Get,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  landing() {
    return 'Media Controller!';
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body()
    body: {
      bucket?: string;
      tags?: string;
      context?: string;
    },
  ) {
    const { bucket, tags, context } = body;

    return this.appService.uploadFile(
      file,
      bucket,
      tags ? tags.split(',') : [],
      context ? JSON.parse(context) : {},
    );
  }

  @Post('get-files')
  getFilesPost(@Body('publicIds') publicIds: string[]) {
    return this.appService.getFiles(publicIds);
  }

  @Delete('delete')
  delete(@Query() queryParams: { publicId: string }) {
    return this.appService.deleteFile(queryParams.publicId);
  }
}
