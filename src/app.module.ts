import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [
    {
      provide: 'CLOUDINARY',
      useFactory: (config: ConfigService) => {
        return cloudinary.config({
          cloud_name: config.get('CLOUDINARY_NAME'),
          api_key: config.get('CLOUDINARY_API_KEY'),
          api_secret: config.get('CLOUDINARY_API_SECRET'),
        });
      },
      inject: [ConfigService],
    },
    AppService,
  ],
})
export class AppModule {}
