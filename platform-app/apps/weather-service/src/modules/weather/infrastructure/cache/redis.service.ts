import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { redisExpiry } from './config/config';
import { RedisServiceInterface } from '../../proxy/weather.proxy';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy, RedisServiceInterface {
  constructor(@Inject('RedisClient') private readonly client: Redis) {}

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
