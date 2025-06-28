import { Router } from "express";
import passport from "passport";
import { ShipmentController } from "../controllers/ShipmentController";
import { ShipmentRepository } from "../../infrastructure/repositories/ShipmentRepository";
import { TariffRepository } from "../../infrastructure/repositories/TariffRepository";
import { CreateShipment } from "../../application/usecases/CreateShipment";
import { UpdateShipment } from "../../application/usecases/UpdateShipment";
import { ShipmentQuote } from "../../application/usecases/ShipmentQuote";

const router = Router();

// Inyección manual de dependencias
const shipmentRepository = new ShipmentRepository();
const tariffRepository = new TariffRepository();
const createShipment = new CreateShipment(shipmentRepository);
const updateShipment = new UpdateShipment(shipmentRepository);
const shipmentQuote = new ShipmentQuote(tariffRepository);
const shipmentController = new ShipmentController(createShipment, updateShipment, shipmentQuote);

// Rutas
/**
 * @swagger
 * tags:
 *   name: Shipments
 *   description: Endpoints relacionados con envíos
 */

/**
 * @swagger
 * /shipments/create:
 *   post:
 *     summary: Crea un nuevo envío
 *     security:
 *       - bearerAuth: []
 *     tags: [Shipments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - originZip
 *               - destinationZip
 *               - weight
 *               - length
 *               - width
 *               - height
 *             properties:
 *               originZip:
 *                 type: string
 *               destinationZip:
 *                 type: string
 *               weight:
 *                 type: number
 *               length:
 *                 type: number
 *               width:
 *                 type: number
 *               height:
 *                 type: number
 *     responses:
 *       201:
 *         description: Envío creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
router.post("/create", passport.authenticate('jwt', { session: false }), (req, res, next) => shipmentController.create(req, res, next));
/**
 * @swagger
 * /shipments/quote:
 *   post:
 *     summary: Obtiene una cotización de envío
 *     security:
 *       - bearerAuth: []
 *     tags: [Shipments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - originZip
 *               - destinationZip
 *               - weight
 *             properties:
 *               originZip:
 *                 type: string
 *               destinationZip:
 *                 type: string
 *               weight:
 *                 type: number
 *     responses:
 *       200:
 *         description: Cotización obtenida exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
router.post("/quote", passport.authenticate('jwt', { session: false }), (req, res, next) => shipmentController.getQuote(req, res, next));

/**
 * @swagger
 * /shipments/update/{id}:
 *   patch:
 *     summary: Actualiza el estado de un envío
 *     security:
 *       - bearerAuth: []
 *     tags: [Shipments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del envío a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Estado actualizado correctamente
 *       404:
 *         description: Envío no encontrado o actualización fallida
 */
router.patch("/update/:id", passport.authenticate('jwt', { session: false }), (req, res, next) => shipmentController.updateStatus(req, res, next));

export default router;