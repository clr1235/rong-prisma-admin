import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { pathToRegexp } from 'path-to-regexp';
import { AuthService } from '../auth.service';
import { IS_PUBLIC_KEY } from '../auth.contants';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private globalWhiteList = [];
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {
    super();
    this.globalWhiteList = [].concat(
      this.config.get('perm.router.whitelist') || [],
    );
  }

  // 扩展自定义的认证逻辑
  async canActivate(ctx: ExecutionContext) {
    // JwtAuthGuard 在发现 "isPublic" 元数据时返回 true, 跳过接口登录验证
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    // 接口路由判断是否有token
    const req = ctx.switchToHttp().getRequest();
    const rawToken = req.get('Authorization') || '';
    const token = rawToken.replace(/^Bearer\s+/i, '');

    if (!token) {
      throw new ForbiddenException('请重新登录');
    }
    // 手动解析token
    const userId = await this.authService.parseToken(token);
    if (!userId) {
      throw new UnauthorizedException('当前登录已过期，请重新登录');
    }
    // 调用jwt的验证流程
    return super.canActivate(ctx) as boolean;
  }

  // 扩展默认的错误处理
  handleRequest(err, user, info) {
    console.log(err, 'err====', info, 'user====', user);
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException('token无效或已过期');
    }
    return user;
  }
}
