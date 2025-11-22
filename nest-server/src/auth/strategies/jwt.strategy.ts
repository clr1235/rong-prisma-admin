/**
 * JwtStrategy 策略要求：api路由请求中必须包含有效的jwt来保护路由.
 * 
 * JwtStrategy 负责：
    拦截 header 中的 Authorization: Bearer xxx
    校验 token 是否有效
    校验完把 user 信息挂到 req.user（给后续 controller 用）
    👉 它是负责 “登陆后的所有请求都要靠它守卫”
 */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * 这里的构造函数向父类传递了授权时必要的参数，在实例化时，父类会得知授权时，客户端的请求必须使用 Authorization 作为请求头，
   * 而这个请求头的内容前缀也必须为 Bearer，在解码授权令牌时，使用秘钥 secretOrKey: 'secretKey' 来将授权令牌解码为创建令牌时的 payload。
   */
  constructor(private readonly config: ConfigService) {
    const secretkey = config.get('jwt.secretkey');
    // 初始化 JWT 策略
    super({
      // 从请求头中使用 Authorization 字段提取 JWT，并且期望格式为 Bearer 。
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 不忽略 JWT 的过期时间，即如果令牌过期，将被视为无效。
      ignoreExpiration: false,
      // 验证 JWT 的密钥
      secretOrKey: secretkey,
    });
  }

  /**
   * validate 方法实现了父类的抽象方法，在解密授权令牌成功后，即本次请求的授权令牌是没有过期的，
   * 此时会将解密后的 payload 作为参数传递给 validate 方法，这个方法需要做具体的授权逻辑，比如这里我使用了通过用户名查找用户是否存在。
   * 当用户不存在时，说明令牌有误，可能是被伪造了，此时需抛出 UnauthorizedException 未授权异常。
   * 当用户存在时，会将 user 对象添加到 req 中，在之后的 req 对象中，可以使用 req.user 获取当前登录用户。
   */
  // Passport 会根据 validate() 方法的返回值构建 user 对象，并将其附加到 Request 对象上。
  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
