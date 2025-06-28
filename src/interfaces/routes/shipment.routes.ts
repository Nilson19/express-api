import { Router } from "express";
import passport from "passport";
import { ShipmentController } from "../controllers/ShipmentController";
import { ShipmentRepository } from "../../infrastructure/repositories/ShipmentRepository";
import { TariffRepository } from "../../infrastructure/repositories/TariffRepository";
import { CreateShipment } from "../../application/usecases/CreateShipment";
import { ShipmentQuote } from "../../application/usecases/ShipmentQuote";

const router = Router();

// Inyección manual de dependencias
const shipmentRepository = new ShipmentRepository();
const tariffRepository = new TariffRepository();
const createShipment = new CreateShipment(shipmentRepository);
const shipmentQuote = new ShipmentQuote(tariffRepository);
const shipmentController = new ShipmentController(createShipment, shipmentQuote);

// Rutas
router.post("/create", passport.authenticate('jwt', { session: false }), (req, res, next) => shipmentController.create(req, res, next));
router.post("/quote", passport.authenticate('jwt', { session: false }), (req, res, next) => shipmentController.getQuote(req, res, next));

export default router;