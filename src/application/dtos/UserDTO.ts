import { AddressDTO } from './AddressDTO';

export interface UserDTO {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  addresses?: AddressDTO[];
  token?: string;
}
