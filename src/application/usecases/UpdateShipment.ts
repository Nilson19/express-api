import { IShipmentRepository } from "../../domain/repositories/IShipmenRepository";

export class UpdateShipment {
  constructor(private shipmentRepository: IShipmentRepository) {}

  async execute(shipmentId: string, status: string): Promise<boolean> {
    // Validar los datos de entrada
    if (!shipmentId || !status ) {
      throw new Error("Datos de actualizacion incompletos");
    }

    // Crear el envío
    return await this.shipmentRepository.updateShipment(shipmentId, status);
  }
}