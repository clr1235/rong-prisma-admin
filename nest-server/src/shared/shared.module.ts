import { Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [SharedService],
  exports: [SharedService, RedisModule],
})
export class SharedModule {}
