import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Глобальная валидация DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,       // срезаем лишние поля
      forbidNonWhitelisted: true,
      transform: true,       // автоматически приводим типы
    }),
  );

  // CORS для Vue-фронтенда
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  app.setGlobalPrefix('api');

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Backend запущен: http://localhost:${port}/api`);
}
bootstrap();