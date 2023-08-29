import { Module } from '@nestjs/common';
import { CacheModule, CacheInterceptor } from '@nestjs/cache-manager';
import { CacheConfigService } from 'src/config/redis/cache.config';


@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useClass: CacheConfigService,
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
