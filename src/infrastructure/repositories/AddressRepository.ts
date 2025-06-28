import { IAddressRepository } from "../../domain/repositories/IAddressRepository";
import { Address } from "../../domain/entities/Address";
import { mysqlPool } from "../../config/dbConnection";
import { AppError } from "../../utils/errors/AppError";

export class AddressRepository implements IAddressRepository {
  async addAddress(userId: string, address: Address): Promise<void> {
    try {
      await mysqlPool.execute(
        `INSERT INTO addresses (userId, street, city, state, zipCode, country, isDefault)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          address.street,
          address.city,
          address.state,
          address.zipCode,
          address.country,
          address.isDefault ?? false,
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
