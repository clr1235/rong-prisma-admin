import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule as NestRedisModule } from '@liaoliaots/nestjs-redis';
import { RedisService } from './redis.service';

@Global()
@Module({
  imports: [
    NestRedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        readyLog: true,
        config: {
          host: configService.get('redis.host', '127.0.0.1'),
          port: configService.get('redis.port', 6379),
          password: configService.get('redis.password'),
          db: configService.get('redis.db', 0),
          keyPrefix: configService.get('redis.keyPrefix', ''),
        },
      }),
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
