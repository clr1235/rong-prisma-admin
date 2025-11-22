import { Get, Controller, Query } from '@nestjs/common';
import { ResImageCaptchaDto } from '../dto';
import * as svgCaptcha from 'svg-captcha';
import sharp from 'sharp';
import { ConfigService } from '@nestjs/config';
import { RedisService } from 'nestjs-redis-cluster';

import { SharedService } from 'src/shared/shared.service';

@Controller('auth/captcha')
export class CaptchaController {
  constructor(
    private readonly sharedService: SharedService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  /* 获取图片验证码 */
  @Get('img')
  async captchaImage(
    @Query('type') type: 'svg' | 'base64' = 'svg',
  ): Promise<ResImageCaptchaDto> {
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
}
