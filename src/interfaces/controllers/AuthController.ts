import { Request, Response } from "express";
import { RegisterUser } from "../../application/usecases/RegisterUser";
import { LoginUser } from "../../application/usecases/LoginUser";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { AddressRepository } from "../../infrastructure/repositories/AddressRepository";

const userRepository = new UserRepository();
const addressRepository = new AddressRepository();
const registerUseCase = new RegisterUser(userRepository, addressRepository);
const loginUseCase = new LoginUser(userRepository);

export class AuthController {
  static async register(req: Request, res: Response, next: Function) {
    try {
      const user = await registerUseCase.execute(req.body);
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: Function) {
    try {
      const result = await loginUseCase.execute(req.body);
      res.status(200).json({ message: result });
    } catch (err) {
      next(err);
    }
  }
}
