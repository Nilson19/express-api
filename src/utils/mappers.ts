import { User } from '../domain/entities/User';
import { UserDTO } from '../application/dtos/UserDTO';
import { Address } from '../domain/entities/Address';
import { AddressDTO } from '../application/dtos/AddressDTO';

/**
 * Convierte una entidad Address en un AddressDTO
 */
export function toAddressDTO(address: Address): AddressDTO {
  return {
    street: address.street,
    city: address.city,
    state: address.state,
    zip_code: address.zip_code,
    country: address.country,
    is_default: address.is_default ?? false,
  };
}

/**
 * Convierte un arreglo de direcciones
 */
export function toAddressDTOArray(addresses: Address[] = []): AddressDTO[] {
  return addresses.map(toAddressDTO);
}

/**
 * Convierte una entidad User en un UserDTO
 */
export function toUserDTO(user: User): UserDTO {
  return {
    name: user.name,
    last_name: user.last_name,
    email: user.email,
    phone: user.phone,
    addresses: user.addresses ? toAddressDTOArray(user.addresses) : [],
    token: user.token,
  };
}
