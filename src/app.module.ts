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
import { SocketModule } from './providers/socket/socket.module';
import { RedisModule } from '@liaoliaots/nestjs-redis/dist/redis/redis.module';
import { NotificationsModule } from './app/notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule.register({ session: true }),
    RedisModule.forRootAsync({
      useFactory: () => ({
        config: {
          host: 'redis-12941.c114.us-east-1-4.ec2.cloud.redislabs.com',
          port: 12941,
          password: '9y5rmF9FiWEn5kHvT0qQMt1pxafV22kn',
        },
      }),
    }),
    SocketModule,
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
    AwsS3Module,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
