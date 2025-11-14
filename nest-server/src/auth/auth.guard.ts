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
      await this.jumpActivate(ctx);
      console.log('白名单路由跳过验证');
      return true;
    }

    // 接口路由判断是否有token
    const req = ctx.switchToHttp().getRequest();
    const accessToken = req.get('Authorization');

    if (!accessToken) {
      throw new ForbiddenException('请重新登录');
    }
    const atUserId = await this.authService.parseToken(accessToken);
    if (!atUserId) {
      throw new UnauthorizedException('当前登录已过期，请重新登录');
    }

    return this.activate(ctx);
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
