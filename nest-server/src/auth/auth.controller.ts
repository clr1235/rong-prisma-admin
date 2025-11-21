import {
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResImageCaptchaDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /* 获取图片验证码 */
  @Get('captchaImage')
  async captchaImage(
    @Query('type') type: 'svg' | 'base64' = 'svg',
  ): Promise<ResImageCaptchaDto> {
    return await this.authService.createImageCaptcha(type);
  }

  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
