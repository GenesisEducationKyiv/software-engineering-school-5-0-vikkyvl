import { FactoryProvider } from '@nestjs/common';
import { Redis } from 'ioredis';
import { redisConfig } from './config/config';

export const redisClientFactory: FactoryProvider<Redis> = {
  provide: 'RedisClient',
  useFactory: () => {
    return new Redis(redisConfig);
  },
  inject: [],
};
