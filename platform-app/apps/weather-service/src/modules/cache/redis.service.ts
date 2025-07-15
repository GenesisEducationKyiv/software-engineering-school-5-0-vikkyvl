import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { redisExpiry } from './config/config';
import { CacheServiceInterface } from '../weather/proxy/weather.proxy';
import { Redis } from 'ioredis';
import { cacheTokens } from '../../common';

@Injectable()
export class RedisService implements OnModuleDestroy, CacheServiceInterface {
  constructor(
    @Inject(cacheTokens.REDIS_CLIENT) private readonly client: Redis,
  ) {}

  async onModuleDestroy() {
    await this.client.quit();
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, expiry = redisExpiry): Promise<void> {
    await this.client.set(key, value, 'EX', expiry);
  }
}
