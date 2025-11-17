import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResImageCaptchaDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /* 获取图片验证码 */
  @Get('captchaImage')
  async captchaImage(): Promise<ResImageCaptchaDto> {
    return await this.authService.createImageCaptcha();
  }

  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
