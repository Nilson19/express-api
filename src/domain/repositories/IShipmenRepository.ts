import { Shipment } from "../entities/Shipment";

export interface IShipmentRepository {
  createShipment(shipment: Shipment): Promise<void>;
}