import 'dotenv/config';
import cluster from 'node:cluster';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import {
  HttpStatus,
  Logger,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { LoggerService } from './shared/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 获取配置服务
  const configService = app.get(ConfigService);
  console.log(configService.get('nestConf.globalPrefix'), 'globalPrefix');
  const globalPrefix = configService.get('nestConf.globalPrefix') as string;
  // 设置全局路由前缀
  app.setGlobalPrefix(globalPrefix);
  // web 安全，防常见漏洞
  // 注意： 开发环境如果开启 nest static module 需要将 crossOriginResourcePolicy 设置为 false 否则 静态资源 跨域不可访问
  app.use(
    helmet({
      crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
      crossOriginResourcePolicy: false,
      contentSecurityPolicy: false, // 放开 CSP 限制
    }),
  );
  // 开启全局跨域
  app.enableCors({
    origin: '*',
    credentials: true,
    methods: configService.get('nestConf.enableCorsmethods'), // 明确允许方法
    allowedHeaders: configService.get('nestConf.enableCorsAllowedHeaders'), // 按需配置允许的请求头
  });

  // 开启全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO中没有验证装饰器的字段，一律删除
      // forbidNonWhitelisted: true, // 抛出异常如果存在未定义的属性
      transform: true, // 自动转换请求体为 DTO 实例
      transformOptions: { enableImplicitConversion: true }, // 开启隐式转换
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY, // 422 未处理实体
      stopAtFirstError: true,
      // 自定义异常工厂，返回 422 状态码和第一个错误消息
      exceptionFactory: (errors) =>
        new UnprocessableEntityException(
          errors.map((e) => {
            const rule = Object.keys(e.constraints!)[0];
            const msg = e.constraints![rule];
            return msg;
          })[0],
        ),
    }),
  );

  const port = configService.get('nestConf.port') as number;
  console.log(port, 'port');
  await app.listen(port, '0.0.0.0', async () => {
    app.useLogger(app.get(LoggerService));
    const url = await app.getUrl();
    console.log(url, 'url');
    const { pid } = process;
    const env = cluster.isPrimary;
    const prefix = env ? 'P' : 'W';

    // if (!isMainProcess) return;

    // printSwaggerLog?.();

    const logger = new Logger('NestApplication');
    logger.log(`[${prefix + pid}] Server running on ${url}`);
  });
}
void bootstrap();
