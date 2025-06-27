import { User } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IAddressRepository } from "../../domain/repositories/IAddressRepository";
import { ConflictError, ValidationError } from '../../utils/errors/AppError';
import ValidationUtils from '../../utils/validation';

export class RegisterUser {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly addressRepository: IAddressRepository
  ) {}

  async execute(data: User): Promise<void> {
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) {
      throw new ConflictError("El correo electrónico ya está registrado.");
    }

    if (!data.addresses || data.addresses.length === 0) {
      throw new ValidationError("Debe proporcionar al menos una dirección.");
    }

    data.password = await ValidationUtils.hashPassword(data.password);

    // Crear el usuario
    const userId = await this.userRepository.register(data);

    // Insertar direcciones
    for (const address of data.addresses) {
      await this.addressRepository.addAddress(userId, address);
    }
  }
}
