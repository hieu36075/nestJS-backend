import { Module } from '@nestjs/common';
import { CacheModule, CacheInterceptor  } from '@nestjs/cache-manager';
import { RedisConfigService } from 'src/config/redis/redis.config';

@Module({
    imports: [
        CacheModule.registerAsync({
            isGlobal:true,
            useClass: RedisConfigService,
          }),
    ],
    providers: [
      {
        provide: 'CacheInterceptor',
        useClass: CacheInterceptor,
      },
    ],
    exports: ['CacheInterceptor'],
  })
  export class CacheInterceptorModule {}