import { NestFactory } from '@nestjs/core';
import path from 'path';

import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import fastifyStatic from '@fastify/static';

import { NotFoundExceptionFilter } from './not.foundexception';
import { AppModule } from './app.module';

async function start() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: APP_USE_LOGGER }),
  );

  app.register(fastifyStatic, {
    root: path.resolve(process.cwd(), APP_STATIC_PATH),
    preCompressed: true,
  });
  app.register(fastifyStatic, {
    root: path.resolve(process.cwd(), APP_PUBLIC_PATH),
    decorateReply: false,
    prefix: '/public/',
  });

  app.useGlobalFilters(new NotFoundExceptionFilter());

  if (APP_NODE_ENV == 'development') {
    app.enableCors();

    console.log(
      'Static preCompressed files path: ' +
        path.resolve(process.cwd(), APP_STATIC_PATH),
    );
    console.log(
      'Static assets files path: ' +
        path.resolve(process.cwd(), APP_PUBLIC_PATH),
    );
  }

  await app.listen(APP_PORT, APP_URL);
}

start();
