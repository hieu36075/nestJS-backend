import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { createReadStream } from 'fs';
import multer from 'multer';

@Injectable()
export class S3Service {
private s3Client: S3Client;
  private readonly bucketName: string;
  private readonly cloundFront : string;
  constructor(private readonly configService: ConfigService) {
     
    this.bucketName = this.configService.get('AWS_PUBLIC_BUCKET_KEY');
    this.cloundFront = this.configService.get('CLOUDFRONT_URL');
    this.s3Client = new S3Client({
        region: this.configService.get('AWS_S3_REGION'),
        credentials: {
            accessKeyId: this.configService.get('AWS_ACCESS_KEY'),
            secretAccessKey: this.configService.get('AWS_SERCER_ACCESS_KEY')
          },
    });
  }
  async uploadFile(file: Express.Multer.File, path: string,): Promise<string> {
    const fileData = file.buffer;
    
    const params = {
      Bucket: this.bucketName,
      Key: path + file.originalname,
      Body: fileData,
      ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(params);
    const response = await this.s3Client.send(command);
    if (response.$metadata.httpStatusCode === 200) {
        const fileUrl = `https://${this.cloundFront}/${file.originalname}`;
        return fileUrl;
      } else {
        throw new Error('Lỗi khi tải lên tệp lên Amazon S3.');
      }
  }



  async  uploadMultipleFiles(files: Express.Multer.File[], path: string): Promise<string[]> {
    const fileUrls: string[] = [];

    for (const file of files) {
      const fileData = file.buffer;
      
      const params = {
        Bucket: this.bucketName,
        Key: path + file.originalname,
        Body: fileData,
        ContentType: file.mimetype,
      };
      
      const command = new PutObjectCommand(params);
      const uploadPromise = this.s3Client.send(command).then(() => {
        const fileUrl = `https://${this.cloundFront}/${file.originalname}`;
        return fileUrl;
      });     
      fileUrls.push(await uploadPromise);
    }
    return fileUrls;
  }
  
}