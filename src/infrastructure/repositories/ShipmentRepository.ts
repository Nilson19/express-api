import { ResultSetHeader, RowDataPacket } from "mysql2";
import { IShipmentRepository } from "../../domain/repositories/IShipmenRepository";
import { Shipment } from "../../domain/entities/Shipment";
import { mysqlPool } from "../../config/dbConnection";
import { AppError } from "../../utils/errors/AppError";

export class ShipmentRepository implements IShipmentRepository {
  async createShipment(shipment: Shipment): Promise<string> {
    try {
      const [result] = await mysqlPool.execute<ResultSetHeader>(
        `INSERT INTO shipments (user_id, origin_zip, destination_zip, weight, length, width, height, total_cost, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          shipment.user_id,
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

  async getShipments(userId: string): Promise<Shipment[]> {
    try {
      const [rows] = await mysqlPool.execute<RowDataPacket[]>(
        `SELECT * FROM shipments WHERE user_id = ?`,
        [userId]
      );

      const shipments: Shipment[] = rows.map(row => ({
        user_id: row.user_id,
        origin_zip: row.origin_zip,
        destination_zip: row.destination_zip,
        weight: row.weight,
        length: row.length,
        width: row.width,
        height: row.height,
        total_cost: row.total_cost,
        created_at: row.created_at ? new Date(row.created_at) : undefined,
        updated_at: row.updated_at ? new Date(row.updated_at) : undefined,
        status: row.status,
      }));

      return shipments;

    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new AppError("Error fetching shipments: " + error.message);
      }
      throw new AppError("Unknown error fetching shipments");
    }
  }
}
