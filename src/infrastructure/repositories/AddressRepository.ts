import { IAddressRepository } from '../../domain/repositories/IAddressRepository';
import { Address } from '../../domain/entities/Address';
import { mysqlPool } from '../../config/dbConnection';

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
    } catch (error: any) {
      throw new Error('Error al registrar la dirección: ' + error.message);
    }
  }
}
