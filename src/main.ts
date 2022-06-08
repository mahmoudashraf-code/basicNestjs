import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { SessionAdapter } from './users/adminSocket/redis.adapter';
import * as cookieParser from 'cookie-parser';
var FileStore = require('session-file-store')(session);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: ["http://127.0.0.1:4200"], credentials: true });
  app.setGlobalPrefix("api");
  app.use(cookieParser());
  const sessionMiddleware = session({
    store: new FileStore({ logFn: () => { }, reapInterval: 60 * 60 * 24 * 30 }),
    secret: 'my-secret',
    resave: false,
    saveUninitialized: false,
  });
  app.use(sessionMiddleware);
  app.useWebSocketAdapter(new SessionAdapter(sessionMiddleware, app));
  process
    .on('unhandledRejection', (reason, p) => { })
    .on('uncaughtException', err => { });

  await app.listen(3000)
}
bootstrap();
