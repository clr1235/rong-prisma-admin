/**
 * LocalStrategy 只在 登录行为（/auth/login） 使用。
 * 它做的事：
    从请求里拿账号 + 密码;
    调用 authService.validateUser() 验证是否正确;
    通过后把 user 对象挂到 req 上，让 AuthController 生成 JWT;
    👉 它是负责 “发 token 前的验证”;

  passport-local 策略默认要求请求体包含名为 username 和 password 的属性
 */

import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
