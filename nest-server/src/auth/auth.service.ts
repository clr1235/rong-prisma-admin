import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { UsersService } from 'src/users/users.service';
import { SharedService } from 'src/shared/shared.service';
import { RegisterDto } from './dto';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService,
    private sharedService: SharedService,
    private prismaService: PrismaService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // 登录成功之后，返回生成的JWT Token
  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // 注册
  async register(dto: RegisterDto): Promise<void> {
    console.log('zhuce===>>', dto);
    try {
      const result = await this.prismaService.sysUser.create({
      data: {
        userName: dto.username || '',
        password: dto.password || '',
        nickName: dto.nickName ?? '',
        // Not including 'captcha' as likely not required in table, omit if not needed
        },
      });
      console.log('result===>>', result);
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new BadRequestException('用户名已存在')
      }
      throw e
    }
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
