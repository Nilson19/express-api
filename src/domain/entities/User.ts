import { Address } from './Address';

export interface User {
  id?: number;
  name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  addresses?: Address[];
  created_at?: Date;
  updated_at?: Date;
  is_active?: boolean;
  token?: string;
}
