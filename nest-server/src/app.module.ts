import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { SharedModule } from './shared/shared.module';
import configuration from './config/index';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { TransformInterceptor } from './common/interceptor/transform.interceptor';
import { TimeoutInterceptor } from './common/interceptor/timeout.interceptor';

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
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // 替换抽象类或者接口实现时，必须使用useClass的方式提供
    {
      // 在任意模块中，使用构造方法的写法，将JwtAuthGuard注册为全局守卫，配置完成后，Nest 将自动为所有接口绑定 JwtAuthGuard
      // 对于不需要检测用户登录的接口只需要添加 @Public() 装饰器即可
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useFactory: () => new TimeoutInterceptor(15 * 1000),
    },
  ],
})
export class AppModule {}
