import { FactoryProvider } from '@nestjs/common';
import { Redis } from 'ioredis';
import { redisConfig } from './config/config';
import { cacheTokens } from '../../common';

export const redisClientFactory: FactoryProvider<Redis> = {
  provide: cacheTokens.REDIS_CLIENT,
  useFactory: () => {
    return new Redis(redisConfig);
  },
  inject: [],
};
