import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './app/auth/auth.module';
import { UserModule } from './app/user/user.module';
import { PrismaModule } from './database/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { PostModule } from './app/post/post.module';
import { CacheInterceptorModule } from './providers/redis/cache.interceptor';
import { MailModule } from './providers/mail/mail.module';
import { PassportModule } from '@nestjs/passport';
import { CategoriesModule } from './app/categories/categories.module';
import { HotelModule } from './app/hotel/hotel.module';
import { CountryModule } from './app/country/country.module';
import { ProfileModule } from './app/profile/profile.module';
import { AwsS3Module } from './providers/aws s3/aws.s3.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule.register({session:true}),
    CacheInterceptorModule,
    MailModule,
    AuthModule,
    UserModule,
    PrismaModule,
    PostModule,
    CategoriesModule,
    HotelModule,
    CountryModule,
    ProfileModule,
    AwsS3Module
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
