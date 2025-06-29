import { ResultSetHeader } from "mysql2";
import { IShipmentRepository } from "../../domain/repositories/IShipmenRepository";
import { Shipment } from "../../domain/entities/Shipment";
import { mysqlPool } from "../../config/dbConnection";
import { AppError } from "../../utils/errors/AppError";

export class ShipmentRepository implements IShipmentRepository {
  async createShipment(shipment: Shipment): Promise<string> {
    try {
      const [result] = await mysqlPool.execute<ResultSetHeader>(
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

      return result.insertId.toString(); // Devuelve el ID del nuevo envío como string
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new AppError("Error creating shipment: " + error.message);
      }
      throw new AppError("Unknown error creating shipment");
    }
  }

  async updateShipment(shipmentId: string, status: string): Promise<boolean> {
    try {
      const [result] = await mysqlPool.execute<ResultSetHeader>(
        `UPDATE shipments SET status = ? WHERE id = ?`,
        [status, shipmentId]
      );

      if (result.affectedRows === 0) {
        return false; // No se actualizó nada
      }

      return true;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new AppError("Error updating shipment: " + error.message);
      }
      throw new AppError("Unknown error updating shipment");
    }
  }
}
