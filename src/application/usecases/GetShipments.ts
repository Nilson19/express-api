import { IShipmentRepository } from "../../domain/repositories/IShipmenRepository";
import { Shipment } from "../../domain/entities/Shipment";

export class GetShipment {
  constructor(private shipmentRepository: IShipmentRepository) {}

  async execute(userId: string): Promise<Shipment[]> {
    // Validar los datos de entrada
    if (!userId) {
      throw new Error("ID de usuario no proporcionado");
    }

    // Obtener los envíos del usuario
    const shipments = await this.shipmentRepository.getShipments(userId);

    return shipments; // Retorna los envíos del usuario
  }
}