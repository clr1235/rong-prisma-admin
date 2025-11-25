import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { RegisterDto } from '../dto';

// 使用passport-local 策略提供的内置 AuthGuard 来装饰路由意味着：只有在用户通过验证后才会调用路由处理程序
@UseGuards(LocalAuthGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Request() req) {
    // Passport 会根据 validate() 方法的返回值自动创建 user 对象，并将其赋值给 Request 对象的 req.user 属性。
    // 所以此处可以在req中取到user对象
    return this.authService.login(req.user);
  }

  @Post('logout')
  async logout(@Request() req) {
    return req.logout();
  }

  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<void> {
    await this.authService.register(dto);
  }
}
