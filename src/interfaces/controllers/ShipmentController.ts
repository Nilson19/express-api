import { Request, Response, NextFunction } from "express";
import { redisClient } from "../../config/redis";
import { CreateShipment } from "../../application/usecases/CreateShipment";
import { UpdateShipment } from "../../application/usecases/UpdateShipment";
import { GetShipment } from "../../application/usecases/GetShipments";
import { ShipmentQuote } from "../../application/usecases/ShipmentQuote";

export class ShipmentController {
  constructor(
    private readonly createShipment: CreateShipment,
    private readonly updateShipment: UpdateShipment,
    private readonly getShipment: GetShipment,
    private readonly shipmentQuote: ShipmentQuote
  ) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const shipment = await this.createShipment.execute(req.body);
      res
        .status(201)
        .json({
          message: "Shipment created successfully",
          data: { shipment_id: shipment },
        });
    } catch (err) {
      next(err);
    }
  }

  async getQuote(req: Request, res: Response, next: NextFunction) {
    try {
      const { originZip, destinationZip, weight, length, width, height } = req.body;
      const cacheKey = `quote:${originZip}:${destinationZip}:${weight}:${length}:${width}:${height}`;

      // 1. Buscar en Redis
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        res.status(200).json({
          message: "Shipment quote retrieved from cache",
          data: JSON.parse(cached),
        });
        return;
      }

      const quote = await this.shipmentQuote.getShipmentQuote(
        originZip,
        destinationZip,
        weight,
        length,
        width,
        height
      );

      await redisClient.set(cacheKey, JSON.stringify(quote), { EX: 3600 });

      res
        .status(200)
        .json({
          message: "Shipment quote retrieved successfully",
          data: quote,
        });
    } catch (err) {
      next(err);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const { status } = req.body;

      const result = await this.updateShipment.execute(id, status);

      if (!result) {
        res
          .status(404)
          .json({ message: "Shipment not found or update failed" });
        return;
      }

      // Emitir evento WebSocket
      req.app.get("io").emit("shipmentStatusUpdate", { id, status });

      res.status(200).json({ message: "Estado actualizado correctamente" });
    } catch (err) {
      next(err);
    }
  }

  async getShipments(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.body.userId;
      const shipments = await this.getShipment.execute(userId);
      res.status(200).json({ message: "Shipments retrieved successfully", data: shipments });
    } catch (err) {
      next(err);
    }
  }
}