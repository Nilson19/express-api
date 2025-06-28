import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import { Address } from "../../domain/entities/Address";
import { mysqlPool } from "../../config/dbConnection";
import { ResultSetHeader } from "mysql2";
import { AppError } from "../../utils/errors/AppError";

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

      const userId = (result as ResultSetHeader).insertId;
      return userId.toString();
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new AppError("Error al registrar usuario: " + error.message);
      }
      throw new AppError("Error desconocido al registrar usuario");
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const [rows] = await mysqlPool.execute(
        `SELECT * FROM users WHERE email = ? LIMIT 1`,
        [email]
      );

      const userRow = (rows as User[])[0];
      if (!userRow) return null;

      // Buscar direcciones relacionadas
      const [addressRows] = await mysqlPool.execute(
        `SELECT * FROM addresses WHERE userId = ?`,
        [userRow.id]
      );

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
        addresses: addressRows as Address[],
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new AppError(
          "Error al buscar el usuario por email: " + error.message
        );
      }
      throw new AppError("Error desconocido al buscar el usuario por email");
    }
  }
}
