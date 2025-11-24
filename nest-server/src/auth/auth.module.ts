import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { SharedModule } from 'src/shared/shared.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './controllers/auth.controller';
import { UsersModule } from 'src/users/users.module';
import { CaptchaController } from './controllers/captcha.controller';
import { AccountController } from './controllers/account.controller';

@Module({
  imports: [
    UsersModule,
    SharedModule,
    PassportModule,
    // 异步注册JwtModule
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('jwt.secretkey'),
          signOptions: { expiresIn: configService.get('jwt.expiresIn') },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController, CaptchaController, AccountController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
