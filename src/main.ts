import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import {
  NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify';
import compression from '@fastify/compress';
import helmet from '@fastify/helmet';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.useLogger(app.get(Logger));

  await app.register(compression);

  await app.register(helmet);

  app.setGlobalPrefix('api/v1');

  const configService = app.get(ConfigService);

  const host = configService.get('app.host');
  const port = configService.get('app.port');

  await app.listen(port, host);

  console.log(`[Api] Listening on port ${port} on ${await app.getUrl()}`);
}
bootstrap();
