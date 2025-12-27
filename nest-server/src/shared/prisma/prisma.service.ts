import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../../../generated/prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit {
  constructor() {
    const pool = new PrismaMariaDb({
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT || 3307),
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      connectionLimit: 10,
    });

    super({
      adapter: pool,
      log: [
        { emit: 'event', level: 'query' }, // SQL
        { emit: 'stdout', level: 'error' },
        { emit: 'stdout', level: 'warn' },
      ],
    });

    // 👉 监听 SQL 执行
    (this as any).$on('query', (e: any) => {
      console.log('\n📦 Prisma SQL');
      console.log('--------------------------------');
      console.log('Query:', e.query);
      console.log('Params:', e.params);
      console.log('Duration:', `${e.duration}ms`);
      console.log('--------------------------------\n');
    });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
