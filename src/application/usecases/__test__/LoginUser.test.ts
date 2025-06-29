import { LoginUser } from '../LoginUser';
import { UnauthorizedError } from '../../../utils/errors/AppError';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mocked.jwt.token'),
}));

jest.mock('../../../utils/validation', () => ({
  __esModule: true,
  default: {
    validatePassword: jest.fn(),
    hashPassword: jest.fn(),
  },
}));

jest.mock('../../../utils/mappers', () => ({
  toUserDTO: jest.fn((user) => ({
    id: user.id,
    email: user.email,
    token: user.token,
  })),
}));

jest.mock('../../../config/env', () => ({
  env: { jwtSecret: 'test-secret' },
}));


import ValidationUtils from '../../../utils/validation';

const mockValidatePassword = ValidationUtils.validatePassword as jest.Mock;


const mockUser = {
  id: 1,
  email: 'test@example.com',
  password: 'hashed-password',
  name: 'Test',
  last_name: 'User',
  phone: '1234567890',
};

describe('LoginUser', () => {
  let userRepository: jest.Mocked<IUserRepository>;
  let loginUser: LoginUser;

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
      register: jest.fn(),
    } as jest.Mocked<IUserRepository>;

    loginUser = new LoginUser(userRepository);
    jest.clearAllMocks();
  });

  it('debería iniciar sesión correctamente y retornar UserDTO con token', async () => {
    userRepository.findByEmail.mockResolvedValue({ ...mockUser });
    mockValidatePassword.mockResolvedValue(true);

    const result = await loginUser.execute({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(userRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
    expect(mockValidatePassword).toHaveBeenCalledWith('password123', mockUser.password);
    expect(result).toEqual({
      id: mockUser.id,
      email: mockUser.email,
      token: 'mocked.jwt.token',
    });
  });

  it('debería lanzar ValidationError si el usuario no existe', async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    const promise = loginUser.execute({
      email: 'notfound@example.com',
      password: 'password123',
    });

    await expect(promise).rejects.toThrow(UnauthorizedError);
    await expect(promise).rejects.toThrow('Email inválido');
  });

  it('debería lanzar ValidationError si la contraseña no es válida', async () => {
    userRepository.findByEmail.mockResolvedValue({ ...mockUser });
    mockValidatePassword.mockResolvedValue(false);

    const promise = loginUser.execute({
      email: 'test@example.com',
      password: 'wrongpassword',
    });

    await expect(promise).rejects.toThrow(UnauthorizedError);
    await expect(promise).rejects.toThrow('Usuario o contraseña inválidos');
  });
});
