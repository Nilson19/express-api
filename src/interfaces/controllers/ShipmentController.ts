import { Request, Response, NextFunction } from "express";
import { CreateShipment } from "../../application/usecases/CreateShipment";
import { ShipmentQuote } from "../../application/usecases/ShipmentQuote";

export class ShipmentController {
  constructor(
    private readonly createShipment: CreateShipment,
    private readonly shipmentQuote: ShipmentQuote
  ) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const shipment = await this.createShipment.execute(req.body);
      res.status(201).json(shipment);
    } catch (err) {
      next(err);
    }
  }

  async getQuote(req: Request, res: Response, next: NextFunction) {
    try {
      const { originZip, destinationZip, weight } = req.body;
      const quote = await this.shipmentQuote.getShipmentQuote(originZip, destinationZip, weight);
      res.status(200).json({ quote });
    } catch (err) {
      next(err);
    }
  }
}