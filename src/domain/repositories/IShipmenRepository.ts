import { Shipment } from "../entities/Shipment";

export interface IShipmentRepository {
  createShipment(shipment: Shipment): Promise<void>;
  updateShipment(shipmentId: string, status: string): Promise<boolean>;
}