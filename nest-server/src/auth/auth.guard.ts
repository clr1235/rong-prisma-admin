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
import { AuthService } from './auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private globalWhiteList = [];
  constructor(
    // private readonly reflector: Reflector,
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {
    super();
    this.globalWhiteList = [].concat(
      this.config.get('perm.router.whitelist') || [],
    );
  }

  async canActivate(ctx: ExecutionContext) {
    const isInWhiteList = this.checkWhiteList(ctx);
    if (isInWhiteList) {
      console.log('白名单路由跳过验证');
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
    return this.activate(ctx);
  }

  handleRequest(err, user, info) {
    console.log(err, 'err====', info, 'user====', user);
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException('token无效或已过期');
    }
    return user;
  }

  async activate(ctx: ExecutionContext) {
    return super.canActivate(ctx) as boolean;
  }

  /**
   * 跳过验证
   * @param ctx
   * @returns
   */
  async jumpActivate(ctx: ExecutionContext) {
    try {
      await this.activate(ctx);
    } catch (e) {
      console.log(e, '跳过验证--失败');
      // 未登录不做任何处理，直接返回 true
    }

    return true;
  }

  /**
   * 检查接口是否在白名单内
   * @param ctx
   * @returns
   */
  checkWhiteList(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();

    const i = this.globalWhiteList.findIndex((route: any) => {
      // 请求方法类型相同
      if (
        !route.method ||
        req.method.toUpperCase() === route.method.toUpperCase()
      ) {
        // 对比 url
        return !!pathToRegexp(route.path).regexp.exec(req.route.path);
      }
      return false;
    });
    // 在白名单内 则 进行下一步， i === -1 ，则不在白名单，需要 比对是否有当前接口权限
    return i > -1;
  }
}
