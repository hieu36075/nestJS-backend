import { CacheModuleOptions, CacheOptionsFactory, Injectable } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';

@Injectable()
export class RedisConfigService implements CacheOptionsFactory {
  createCacheOptions(): CacheModuleOptions {
    return {
        // @ts-ignore 
      store:  redisStore,
      host: 'localhost', // Địa chỉ Redis server
      port: 6379, // Cổng Redis server
    };
  }
}
