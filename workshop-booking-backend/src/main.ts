import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Глобальная валидация DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // срезаем лишние поля
      forbidNonWhitelisted: true,
      transform: true, // автоматически приводим типы
    }),
  );

  // CORS для Vue-фронтенда
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  app.setGlobalPrefix('api');

  // main.ts — добавить перед listen()
  if (process.env.CREATE_ADMIN === 'true') {
    const usersService = app.get(UsersService);
    await usersService
      .createUser({
        username: 'admin',
        email: 'admin@admin.com',
        password: 'AdminPass123!',
      })
      .then(async (user) => {
        // Меняем роль напрямую через репозиторий
        const repo = app.get('UserRepository');
        await repo.update(user.id, { role: 'admin' });
        console.log('Admin created!');
      })
      .catch(() => console.log('Admin already exists'));
  }

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Backend запущен: http://localhost:${port}/api`);
}
bootstrap();
