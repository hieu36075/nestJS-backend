import { Global, Module } from '@nestjs/common';
import { S3Service } from './aws.s3.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { imageFileFilter } from 'src/common/helpers/imageFileFitelter.helper';

@Global()
@Module({
   imports:[MulterModule.register({
    storage: diskStorage({
        destination:'./uploads',
    }),
    limits:{fieldSize: 2000000},
    fileFilter: imageFileFilter,
   })] ,
  providers: [S3Service],
  exports: [S3Service],
})
export class AwsS3Module {}