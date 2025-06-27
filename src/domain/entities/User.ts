import { Address } from './Address';

export interface User {
  id?: number;
  name: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  addresses?: Address[];
  createdAt?: Date;
  updatedAt?: Date;
  isActive?: boolean;
  token?: string;
}
