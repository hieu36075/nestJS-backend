import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { PostModule } from './post/post.module';
import * as redisStore from 'cache-manager-redis-store';
import { CacheModule, CacheInterceptor  } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RedisConfigService } from './config/redis/redis.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // CacheModule.register(   
    // {     
    //   isGlobal: true,
    //   // @ts-ignore   
    //   store: redisStore,
    //   host: 'localhost', //default host
    //   port: 6379 //default port
    // }),
    CacheModule.registerAsync({
      isGlobal:true,
      useClass: RedisConfigService,
    }),
    AuthModule,
    UserModule,
    PrismaModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [{
    provide:APP_INTERCEPTOR,
    useClass: CacheInterceptor
  },AppService],
})
export class AppModule { }
