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
router.post("/register", (req, res, next) => authController.register(req, res, next));
router.post("/login", (req, res, next) => authController.login(req, res, next));

export default router;
