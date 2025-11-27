import { Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { RedisModule } from './redis/redis.module';
import { PrismaModule } from './prisma/prisma.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [RedisModule, PrismaModule, LoggerModule.forRoot()],
  providers: [SharedService],
  exports: [SharedService, RedisModule, PrismaModule],
})
export class SharedModule {}
