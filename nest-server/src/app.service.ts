import { Injectable } from '@nestjs/common';
import { PrismaService } from './shared/prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prismaService: PrismaService) {}

  async getHello() {
    // await this.prismaService.sysUser.create({
    //   data: {
    //     userName: 'admin',
    //     password: '123456',
    //     nickName: 'admin',
    //   },
    // });
    return 'Hello World!';
  }
}
