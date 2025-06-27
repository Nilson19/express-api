import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { ValidationError } from '../../utils/errors/AppError';

export class LoginUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: { email: string; password: string }): Promise<string> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user || user.password !== data.password) {
      throw new ValidationError('Invalid credentials');
    }

    return 'Login successful'; // luego retornará un token
  }
}
