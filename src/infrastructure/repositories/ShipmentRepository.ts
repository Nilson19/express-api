import { IShipmentRepository } from "../../domain/repositories/IShipmenRepository";
import { Shipment } from "../../domain/entities/Shipment";
import { mysqlPool } from "../../config/dbConnection";
import { AppError } from "../../utils/errors/AppError";

export class ShipmentRepository implements IShipmentRepository {
  async createShipment(shipment: Shipment): Promise<void> {
    try {
      await mysqlPool.execute(
        `INSERT INTO shipments (origin_zip, destination_zip, weight, length, width, height, total_cost, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          shipment.origin_zip,
          shipment.destination_zip,
          shipment.weight,
          shipment.length,
          shipment.width,
          shipment.height,
          shipment.total_cost,
          shipment.status || "pending", // Default status if not provided
        ]
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new AppError("Error creating shipment: " + error.message);
      }
      throw new AppError("Unknown error creating shipment");
    }
  }
}
