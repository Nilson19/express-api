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
    zipCode: address.zipCode,
    country: address.country,
    isDefault: address.isDefault ?? false,
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
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    addresses: user.addresses ? toAddressDTOArray(user.addresses) : [],
    token: user.token,
  };
}
