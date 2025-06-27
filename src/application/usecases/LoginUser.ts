import jwt from 'jsonwebtoken';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { UserDTO } from '../dtos/UserDTO';
import { ValidationError } from '../../utils/errors/AppError';
import ValidationUtils from '../../utils/validation';
import { toUserDTO } from '../../utils/mappers';
import { env } from '../../config/env';


export class LoginUser {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(data: { email: string; password: string }): Promise<UserDTO> {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new ValidationError('Email inválido');
    }

    const isMatch = await ValidationUtils.validatePassword(data.password, user.password);
    if (!isMatch) {
      throw new ValidationError('Usuario o contraseña inválidos');
    }

    const token = jwt.sign(
      { sub: user.id, email: user.email },
      env.jwtSecret,
      { expiresIn: '5h' }
    );

    user.token = token;

    // Mapear el usuario a DTO
    const userDTO = toUserDTO(user);

    return userDTO;
  }
}
