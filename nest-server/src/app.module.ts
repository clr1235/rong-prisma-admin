import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { SharedModule } from './shared/shared.module';
import { RedisModule } from 'nestjs-redis-cluster';
import configuration from './config/index';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

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
  providers: [
    AppService,
    {
      // 在任意模块中，使用构造方法的写法，将JwtAuthGuard注册为全局守卫，配置完成后，Nest 将自动为所有接口绑定 JwtAuthGuard
      // 对于不需要检测用户登录的接口只需要添加 @Public() 装饰器即可
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
