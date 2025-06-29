import { Shipment } from "../entities/Shipment";

export interface IShipmentRepository {
  createShipment(shipment: Shipment): Promise<string>;
  updateShipment(shipmentId: string, status: string): Promise<boolean>;
  getShipments(userId: string): Promise<Shipment[]>;
}