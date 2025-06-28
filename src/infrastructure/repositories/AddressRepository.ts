import { IAddressRepository } from "../../domain/repositories/IAddressRepository";
import { Address } from "../../domain/entities/Address";
import { mysqlPool } from "../../config/dbConnection";
import { AppError } from "../../utils/errors/AppError";

export class AddressRepository implements IAddressRepository {
  async addAddress(userId: string, address: Address): Promise<void> {
    try {
      await mysqlPool.execute(
        `INSERT INTO addresses (user_id, street, city, state, zip_code, country, is_default)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          address.street,
          address.city,
          address.state,
          address.zip_code,
          address.country,
          address.is_default ?? false,
        ]
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new AppError("Error al registrar la dirección: " + error.message);
      }
      throw new Error("Error desconocido al registrar la dirección");
    }
  }
}
