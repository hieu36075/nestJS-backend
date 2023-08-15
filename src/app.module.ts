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
import { AmentityModule } from './app/amentity/amenity.module';
import { RoomModule } from './app/room/room.module';
import { CityModule } from './app/city/city.module';
import { CategoryRoomModule } from './app/categoryRoom/categoryRoom.module';
import { ImageHotelModule } from './app/imageHotel/imageHotel.module';
import { ImageCommentModule } from './app/imageComment/imageCommmet.module';
import { ImageRoomModule } from './app/imageRoom/imageRoom.module';
import { StripeModule } from './providers/stripe/stripe.module';
import { OrderModule } from './app/order/order.module';
import { OrderDetailsModule } from './app/orderDetails/orderDetails.module';
import { PaymentModule } from './app/payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule.register({ session: true }),
    RedisModule.forRootAsync({
      useFactory: () => ({
        config: {
          host: process.env.REDIS_HOST,
          port: 12941,
          password: process.env.REDIS_PASSWORD,
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
    AmentityModule,
    RoomModule,
    CityModule,
    CategoryRoomModule,
    ImageHotelModule,
    ImageCommentModule,
    ImageRoomModule,
    PaymentModule,
    StripeModule,
    OrderModule,
    OrderDetailsModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
