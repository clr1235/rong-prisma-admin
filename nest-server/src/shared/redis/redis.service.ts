import { Injectable } from '@nestjs/common';
import {
  RedisService as NestRedisService,
  DEFAULT_REDIS,
} from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  private readonly redis: Redis;

  constructor(private readonly nestRedisService: NestRedisService) {
    this.redis = this.nestRedisService.getOrThrow(DEFAULT_REDIS);
  }

  async set(
    key: string,
    value: string,
    expireSeconds?: number,
  ): Promise<'OK' | null> {
    if (expireSeconds) {
      return this.redis.set(key, value, 'EX', expireSeconds);
    }
    return this.redis.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async del(key: string): Promise<number> {
    return this.redis.del(key);
  }

  async exists(key: string): Promise<number> {
    return this.redis.exists(key);
  }

  // …你还可以封装更多你业务用到的方法
}
