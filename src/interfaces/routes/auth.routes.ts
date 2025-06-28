import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { AddressRepository } from "../../infrastructure/repositories/AddressRepository";
import { RegisterUser } from "../../application/usecases/RegisterUser";
import { LoginUser } from "../../application/usecases/LoginUser";

const router = Router();

// Inyección manual de dependencias
const userRepository = new UserRepository();
const addressRepository = new AddressRepository();
const registerUser = new RegisterUser(userRepository, addressRepository);
const loginUser = new LoginUser(userRepository);

const authController = new AuthController(registerUser, loginUser);

// Rutas
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints de autenticación
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post("/register", (req, res, next) => authController.register(req, res, next));
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Inicia sesión con un usuario existente
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso
 *       401:
 *         description: Credenciales inválidas
 */
router.post("/login", (req, res, next) => authController.login(req, res, next));

export default router;
