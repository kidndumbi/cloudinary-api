import { AppService } from './app.service';
import {
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  landing() {
    return 'Media Controlller!';
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Query() queryParams: { bucket: string },
  ) {
    return this.appService.uploadFile(file, queryParams.bucket);
  }
  //test
  @Delete('delete')
  delete(@Query() queryParams: { publicId: string }) {
    return this.appService.deleteFile(queryParams.publicId);
  }
}
