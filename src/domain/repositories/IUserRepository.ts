import { User } from '../entities/User';

export interface IUserRepository {
  register(user: User): Promise<string>;
  findByEmail(email: string): Promise<User | null>;
}
