import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { UserRole } from '../users/user.entity';

const mockUser = {
  id: 1,
  username: 'testuser',
  email: 'test@test.com',
  password: '$2a$10$hashedpassword',
  role: UserRole.USER,
  firstName: 'Test',
  lastName: 'User',
};

const mockUsersService = {
  findByUsername: jest.fn(),
  createUser: jest.fn(),
  toPublicDto: jest.fn((u) => ({ id: u.id, username: u.username, role: u.role })),
};

const mockJwtService = {
  sign: jest.fn(() => 'mock.jwt.token'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('должен зарегистрировать нового пользователя', async () => {
      mockUsersService.createUser.mockResolvedValue(mockUser);
      const result = await service.register({
        username: 'testuser',
        email: 'test@test.com',
        password: 'TestPass123!',
      });
      expect(result).toHaveProperty('username', 'testuser');
      expect(mockUsersService.createUser).toHaveBeenCalledTimes(1);
    });

    it('должен пробросить ConflictException при дублировании', async () => {
      mockUsersService.createUser.mockRejectedValue(
        new ConflictException('Пользователь уже существует.'),
      );
      await expect(
        service.register({
          username: 'testuser',
          email: 'test@test.com',
          password: 'TestPass123!',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('должен вернуть токен при верных данных', async () => {
      const bcrypt = require('bcryptjs');
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      mockUsersService.findByUsername.mockResolvedValue(mockUser);

      const result = await service.login({
        username: 'testuser',
        password: 'TestPass123!',
      });

      expect(result).toHaveProperty('access', 'mock.jwt.token');
      expect(result.user).toHaveProperty('username', 'testuser');
    });

    it('должен выбросить UnauthorizedException при неверном пароле', async () => {
      const bcrypt = require('bcryptjs');
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);
      mockUsersService.findByUsername.mockResolvedValue(mockUser);

      await expect(
        service.login({ username: 'testuser', password: 'wrongpassword' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('должен выбросить UnauthorizedException при несуществующем пользователе', async () => {
      mockUsersService.findByUsername.mockResolvedValue(null);
      await expect(
        service.login({ username: 'nobody', password: 'pass' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});