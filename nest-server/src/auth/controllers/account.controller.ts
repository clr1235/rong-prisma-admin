import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from '../auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';

/**
 * 当访问 /account 下的路由时，守卫将自动调用我们自定义配置的 passport-jwt 策略，
 * 验证 JWT，并将 user 属性赋值给 Request 对象
 */
@UseGuards(JwtAuthGuard)
@Controller('account')
export class AccountController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}
}
