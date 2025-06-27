import { Address } from '../entities/Address';

export interface IAddressRepository {
  addAddress(userId: string, address: Address): Promise<void>;
}
