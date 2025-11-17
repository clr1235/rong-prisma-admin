import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { SharedModule } from './shared/shared.module';
import { RedisModule } from 'nestjs-redis-cluster';
import configuration from './config/index';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      cache: true,
      load: [configuration],
      isGlobal: true,
    }),
    UsersModule,
    SharedModule,
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          host: configService.get('redis.host'),
          port: configService.get('redis.port'),
          password: configService.get('redis.password'),
          db: configService.get('redis.db'),
          keyPrefix: configService.get('redis.keyPrefix'),
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
