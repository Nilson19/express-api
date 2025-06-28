import { AddressDTO } from './AddressDTO';

export interface UserDTO {
  name: string;
  last_name: string;
  email: string;
  phone: string;
  addresses?: AddressDTO[];
  token?: string;
}
