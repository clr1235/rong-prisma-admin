import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import sharp from 'sharp';
import { UsersService } from 'src/users/users.service';
import * as svgCaptcha from 'svg-captcha';
import { RedisService } from 'nestjs-redis-cluster';
import { ConfigService } from '@nestjs/config';
import { SharedService } from 'src/shared/shared.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private readonly redisService: RedisService,
    private configService: ConfigService,
    private sharedService: SharedService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // 创建图片验证码
  async createImageCaptcha(type) {
    const { data, text } = svgCaptcha.createMathExpr({
      size: 4, //验证码长度
      ignoreChars: '0o1i', // 验证码字符中排除 0o1i
      noise: 3, // 干扰线条的数量
      color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
      background: '#ffffff', // 验证码图片背景颜色
      width: 115.5,
      height: 38,
    });

    let img = data.toString();
    if (type === 'base64') {
      const pngBuffer = await sharp(Buffer.from(data)).png().toBuffer();
      img = pngBuffer.toString('base64');
    }

    const result = {
      img,
      type,
      uuid: this.sharedService.generateUUID(),
    };
    await this.redisService
      .getClient()
      .set(
        `${this.configService.get('redis.captchaImgKey')}:${result.uuid}`,
        text,
        'EX',
        60 * 5,
      );
    return result;
  }

  // 登录成功之后，返回token
  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * 从令牌token中解析数据
   *
   * @param token 令牌
   * @return 数据声明
   */
  parseToken(token: string) {
    try {
      if (!token) return null;
      const payload = this.jwtService.verify(token.replace('Bearer ', ''));
      return payload;
    } catch (error) {
      console.log(error, '解析token失败');
      return null;
    }
  }
}
