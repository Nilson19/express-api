import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { mysqlPool } from '../../config/dbConnection';

export class UserRepository implements IUserRepository {
  async register(user: User): Promise<string> {
    const connection = await mysqlPool.getConnection();
    try {
      // Insertar usuario
      const [result] = await connection.execute(
        `INSERT INTO users (name, lastName, email, password, phone, isActive)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [user.name, user.lastName, user.email, user.password, user.phone, true]
      );

      const userId = (result as any).insertId;
      return userId.toString();

    } catch (error: any) {
      throw new Error('Error al registrar usuario: ' + error.message);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const [rows] = await mysqlPool.execute(
        `SELECT * FROM users WHERE email = ? LIMIT 1`,
        [email]
      );

      const userRow = (rows as any[])[0];
      console.log('User found:', userRow);
      if (!userRow) return null;

      // Buscar direcciones relacionadas
      const [addressRows] = await mysqlPool.execute(
        `SELECT * FROM addresses WHERE userId = ?`,
        [userRow.id]
      );

        console.log('Addresses found:', addressRows);

      return {
        id: userRow.id,
        name: userRow.name,
        lastName: userRow.lastName,
        email: userRow.email,
        password: userRow.password,
        phone: userRow.phone,
        isActive: userRow.isActive,
        createdAt: userRow.createdAt,
        updatedAt: userRow.updatedAt,
        addresses: addressRows as any[],
      };
    } catch (error: any) {
      throw new Error('Error al buscar el usuario por email: ' + error.message);
    }
  }
}
