import 'dotenv/config';
import { NestFactory } from '@nestjs/core';

import * as express from 'express';
import helmet from 'helmet';
import { ExpressAdapter } from '@nestjs/platform-express';

import { AppModule } from './app.module';

import * as serverless from 'serverless-http';

const port = process.env.PORT || 4000;

async function bootstrap() {
  const expressApp = express();

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  app.enableCors();
  app.use(helmet());

  await app.init();
  await serverless(expressApp);

  await app.listen(port);
}
bootstrap().then(() => {
  console.log('App is running on %s port', port);
});

let server: any;

export const handler = async (event: any, context: any) => {
  if (!server) {
    server = await bootstrap();
  }
  return server(event, context);
};
