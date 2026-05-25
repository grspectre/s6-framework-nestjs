# 🎨 WorkshopBooking

Fullstack-приложение для записи на мастер-классы.
Бэкенд — **NestJS + TypeORM + PostgreSQL**, фронтенд — **Vue 3 + Pinia + Tailwind CSS**.

---

## 📋 Содержание

- [Технологии](#технологии)
- [Архитектура](#архитектура)
- [Быстрый старт](#быстрый-старт)
- [Переменные окружения](#переменные-окружения)
- [API Reference](#api-reference)
- [Роли и права доступа](#роли-и-права-доступа)
- [Запуск тестов](#запуск-тестов)
- [Структура проекта](#структура-проекта)
- [Создание администратора](#создание-администратора)

---

## 🛠 Технологии

### Бэкенд
| Пакет | Версия | Назначение |
|---|---|---|
| NestJS | ^10 | Основной фреймворк |
| TypeORM | ^0.3 | ORM для работы с БД |
| PostgreSQL | 15+ | База данных |
| passport-jwt | ^4 | JWT-аутентификация |
| bcryptjs | ^2 | Хэширование паролей |
| class-validator | ^0.14 | Валидация DTO |

### Фронтенд
| Пакет | Версия | Назначение |
|---|---|---|
| Vue 3 | ^3.4 | UI-фреймворк |
| Pinia | ^2 | Управление состоянием |
| Vue Router | ^4 | Маршрутизация |
| Axios | ^1 | HTTP-клиент |
| Tailwind CSS | ^3 | Стилизация |

---

## 🏗 Архитектура

```
┌─────────────────────┐        HTTP/REST        ┌──────────────────────┐
│   Vue 3 (Vite)      │ ──────────────────────► │   NestJS API         │
│   localhost:5173    │ ◄────────────────────── │   localhost:3000/api │
│                     │      JSON + JWT          │                     │
│  Pinia stores       │                          │  Guards + DTOs      │
│  Vue Router         │                          │  TypeORM entities   │
└─────────────────────┘                          └──────────┬──────────┘
                                                            │
                                                            ▼
                                                 ┌──────────────────────┐
                                                 │   PostgreSQL         │
                                                 │   workshop_js_db        │
                                                 └──────────────────────┘
```

---

## 🚀 Быстрый старт

### Предварительные требования

- Node.js >= 18
- PostgreSQL >= 15
- npm >= 9

### 1. Клонирование репозитория

```bash
git clone https://github.com/your-username/workshop-booking.git
cd workshop-booking
```

### 2. Настройка базы данных

```sql
CREATE DATABASE workshop_js_db;
CREATE USER workshop_js_user WITH PASSWORD 'workshop_js_password';
GRANT ALL PRIVILEGES ON DATABASE workshop_js_db TO workshop_js_user;
```

### 3. Запуск бэкенда

```bash
cd workshop-booking-backend
npm install
cp .env.example .env   # заполните своими значениями
npm run start:dev
```

Бэкенд запустится на `http://localhost:3000/api`

### 4. Запуск фронтенда

```bash
cd workshop-booking-frontend
npm install
npm run dev
```

Фронтенд запустится на `http://localhost:5173`

### 5. Создание первого администратора

```bash
cd workshop-booking-backend
CREATE_ADMIN=true npm run start:dev
```

Данные по умолчанию: `admin` / `AdminPass123!`

---

## ⚙️ Переменные окружения

Создайте файл `.env` в директории `workshop-booking-backend/`:

```env
# База данных
DB_HOST=localhost
DB_PORT=5432
DB_NAME=workshop_js_db
DB_USER=workshop_js_user
DB_PASSWORD=workshop_js_password

# JWT
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRES_IN=24h

# Сервер
PORT=3000
```

> ⚠️ **Никогда не коммитьте `.env` в репозиторий.** Используйте `.env.example` с заглушками.

---

## 📡 API Reference

### Аутентификация

| Метод | Endpoint | Доступ | Описание |
|---|---|---|---|
| `POST` | `/api/auth/register` | Публичный | Регистрация нового пользователя |
| `POST` | `/api/auth/login` | Публичный | Вход, возвращает JWT-токен |
| `GET` | `/api/auth/me` | 🔒 Авторизован | Данные текущего пользователя |

#### POST /api/auth/register
```json
// Запрос
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}

// Ответ 201
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "role": "user"
}
```

#### POST /api/auth/login
```json
// Запрос
{
  "username": "john_doe",
  "password": "SecurePass123!"
}

// Ответ 200
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "role": "user"
  }
}
```

---

### Мастер-классы

| Метод | Endpoint | Доступ | Описание |
|---|---|---|---|
| `GET` | `/api/workshops` | Публичный | Список всех мастер-классов |
| `GET` | `/api/workshops/:id` | Публичный | Детали мастер-класса |
| `POST` | `/api/workshops` | 🔑 Только admin | Создать мастер-класс |
| `PUT` | `/api/workshops/:id` | 🔑 Только admin | Обновить мастер-класс |
| `DELETE` | `/api/workshops/:id` | 🔑 Только admin | Удалить мастер-класс |

#### Пример ответа GET /api/workshops
```json
[
  {
    "id": 1,
    "title": "Акварельная живопись для начинающих",
    "description": "Научимся работать с акварелью...",
    "instructor": "Анна Смирнова",
    "date": "2026-03-15T14:00:00.000Z",
    "location": "Арт-студия на Невском, 10",
    "maxParticipants": 15,
    "availableSpots": 8,
    "isPast": false,
    "createdAt": "2026-02-01T10:00:00.000Z",
    "updatedAt": "2026-02-01T10:00:00.000Z"
  }
]
```

---

### Бронирования

| Метод | Endpoint | Доступ | Описание |
|---|---|---|---|
| `GET` | `/api/bookings` | 🔒 Авторизован | Мои брони (admin видит все) |
| `GET` | `/api/bookings/:id` | 🔒 Владелец / admin | Детали бронирования |
| `POST` | `/api/bookings` | 🔒 Авторизован | Записаться на мастер-класс |
| `DELETE` | `/api/bookings/:id` | 🔒 Владелец / admin | Отменить бронирование |

#### POST /api/bookings
```json
// Запрос
{ "workshopId": 1 }

// Ответ 201
{
  "id": 5,
  "createdAt": "2026-02-18T12:00:00.000Z",
  "workshop": {
    "id": 1,
    "title": "Акварельная живопись для начинающих",
    "availableSpots": 7,
    ...
  }
}
```

#### Коды ошибок

| Код | Причина |
|---|---|
| `400` | Дата в прошлом / нет свободных мест |
| `401` | Токен отсутствует или истёк |
| `403` | Недостаточно прав |
| `404` | Ресурс не найден |
| `409` | Пользователь уже записан на этот мастер-класс |

---

## 🔐 Роли и права доступа

| Действие | `user` | `admin` |
|---|---|---|
| Просмотр мастер-классов | ✅ | ✅ |
| Запись на мастер-класс | ✅ | ✅ |
| Просмотр своих броней | ✅ | ✅ |
| Отмена своей брони | ✅ | ✅ |
| Просмотр всех броней | ❌ | ✅ |
| Создание мастер-класса | ❌ | ✅ |
| Редактирование мастер-класса | ❌ | ✅ |
| Удаление мастер-класса | ❌ | ✅ |
| Отмена чужой брони | ❌ | ✅ |

JWT-токен передаётся в заголовке:
```
Authorization: Bearer <your_token>
```

---

## 🧪 Запуск тестов

```bash
cd workshop-booking-backend

# Все тесты
npm run test

# С покрытием
npm run test:cov

# В watch-режиме
npm run test:watch

# E2E тесты
npm run test:e2e
```

### Что покрыто тестами

- `AuthService` — регистрация, вход, обработка неверных данных
- `WorkshopsService` — CRUD, валидация дат, вычисляемые поля
- `BookingsService` — создание брони, защита от дублей, переполнения, прошедших дат

---

## 📁 Структура проекта

```
workshop-booking/
├── workshop-booking-backend/
│   ├── src/
│   │   ├── auth/               # JWT-аутентификация
│   │   ├── users/              # Сущность пользователя
│   │   ├── workshops/          # Мастер-классы (CRUD)
│   │   ├── bookings/           # Бронирования
│   │   ├── common/
│   │   │   ├── guards/         # RolesGuard, OwnerOrAdminGuard
│   │   │   └── decorators/     # @CurrentUser, @Roles
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env.example
│   └── package.json
│
└── workshop-booking-frontend/
    ├── src/
    │   ├── api/                # Axios-инстанс с interceptors
    │   ├── stores/             # Pinia: auth, workshops
    │   ├── views/              # Страницы приложения
    │   ├── components/         # Переиспользуемые компоненты
    │   ├── router/             # Vue Router + route guards
    │   └── App.vue
    └── package.json
```

---

## 🗄 Схема базы данных

```
users
├── id            PK
├── username      UNIQUE
├── email         UNIQUE
├── password      (bcrypt hash)
├── firstName
├── lastName
├── role          ENUM('user', 'admin')
└── createdAt

workshops
├── id            PK
├── title
├── description
├── instructor
├── date
├── location
├── maxParticipants
├── createdAt
└── updatedAt

bookings
├── id            PK
├── userId        FK → users.id
├── workshopId    FK → workshops.id
├── createdAt
└── UNIQUE(userId, workshopId)
```

---

## 🔄 Бизнес-правила

- Нельзя создать мастер-класс с датой **в прошлом**
- Нельзя записаться на мастер-класс, который **уже прошёл**
- Нельзя записаться, если **нет свободных мест**
- Один пользователь **не может дважды** записаться на один мастер-класс
- При удалении пользователя или мастер-класса — брони удаляются **каскадно**

---

## 🚢 Продакшен-чеклист

- [ ] Заменить `synchronize: true` на **TypeORM Migrations**
- [ ] Настроить **HTTPS** (reverse proxy через Nginx)
- [ ] Сменить `JWT_SECRET` на криптостойкий ключ (мин. 64 символа)
- [ ] Добавить **rate limiting** (`@nestjs/throttler`)
- [ ] Настроить **helmet** для защиты HTTP-заголовков
- [ ] Поднять PostgreSQL в **Docker**
- [ ] Настроить **CI/CD** (GitHub Actions)
- [ ] Добавить **логирование** (Winston / Pino)

---

## 📄 Лицензия

MIT © 2026

