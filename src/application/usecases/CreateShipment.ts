import { IShipmentRepository } from "../../domain/repositories/IShipmenRepository";
import { Shipment } from "../../domain/entities/Shipment";

export class CreateShipment {
  constructor(private shipmentRepository: IShipmentRepository) {}

  async execute(data: Shipment): Promise<void> {
    // Validar los datos de entrada
    if (!data.originZip || !data.destinationZip || !data.weight) {
      throw new Error("Datos de envío incompletos");
    }

    // Crear el envío
    await this.shipmentRepository.createShipment(data);
  }
}