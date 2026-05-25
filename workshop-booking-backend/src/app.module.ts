import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { WorkshopsModule } from './workshops/workshops.module';
import { BookingsModule } from './bookings/bookings.module';
import { User } from './users/user.entity';
import { Workshop } from './workshops/workshop.entity';
import { Booking } from './bookings/booking.entity';

@Module({
  imports: [
    // Загружаем .env глобально
    ConfigModule.forRoot({ isGlobal: true }),

    // Подключение к PostgreSQL через TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get('DB_USER'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        entities: [User, Workshop, Booking],
        synchronize: true, // В продакшене заменить на миграции!
      }),
    }),

    AuthModule,
    UsersModule,
    WorkshopsModule,
    BookingsModule,
  ],
})
export class AppModule {}
