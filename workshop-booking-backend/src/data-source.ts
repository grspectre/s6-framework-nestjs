import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// Загружаем переменные окружения из .env
config();

export const AppDataSource = new DataSource({
  type: 'postgres', // или ваш тип БД
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'my_database',
  
  // Искать все файлы .entity в папке src и подпапках
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  
  // Искать миграции в папке src/migrations
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  
  // ВАЖНО: для работы миграций должно быть false
  synchronize: false,
  
  logging: true,
})

// Инициализация (полезно для отладки, но для CLI достаточно экспорта)
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!")
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err)
  })