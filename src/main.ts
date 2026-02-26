import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Capture raw body for Stripe
  app.use(
    '/payment/webhook',
    bodyParser.raw({
      type: 'application/json',
    }),
    (req, _res, next) => {
      // Save the raw buffer to req.rawBody
      (req as any).rawBody = req.body;
      next();
    },
  );
  // Normal JSON parsing for other routes
  app.use(bodyParser.json());


  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }))
  await app.listen(process.env.PORT ?? 3050);
}
bootstrap();
