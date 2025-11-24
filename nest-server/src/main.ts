import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';

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

  const port = configService.get('nestConf.port') as number;
  console.log(port, 'port');
  await app.listen(port);
}
void bootstrap();
