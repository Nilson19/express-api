import { Request, Response, NextFunction } from "express";
import { CreateShipment } from "../../application/usecases/CreateShipment";
import { UpdateShipment } from "../../application/usecases/UpdateShipment";
import { ShipmentQuote } from "../../application/usecases/ShipmentQuote";

export class ShipmentController {
  constructor(
    private readonly createShipment: CreateShipment,
    private readonly updateShipment: UpdateShipment,
    private readonly shipmentQuote: ShipmentQuote
  ) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const shipment = await this.createShipment.execute(req.body);
      res.status(201).json({ message: "Shipment created successfully", data: shipment });
    } catch (err) {
      next(err);
    }
  }

  async getQuote(req: Request, res: Response, next: NextFunction) {
    try {
      const { originZip, destinationZip, weight } = req.body;
      const quote = await this.shipmentQuote.getShipmentQuote(originZip, destinationZip, weight);
      res.status(200).json({ message: "Shipment quote retrieved successfully", data: quote });
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
        res.status(404).json({ message: "Shipment not found or update failed" });
      }

      // Emitir evento WebSocket
      req.app.get("io").emit("shipmentStatusUpdate", { id, status });

      res.status(200).json({ message: "Estado actualizado correctamente" });
    } catch (err) {
      next(err);
    }
  }
}