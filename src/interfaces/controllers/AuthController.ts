import { Request, Response, NextFunction } from "express";
import { RegisterUser } from "../../application/usecases/RegisterUser";
import { LoginUser } from "../../application/usecases/LoginUser";

export class AuthController {
  constructor(
    private readonly registerUser: RegisterUser,
    private readonly loginUser: LoginUser
  ) {}

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      await this.registerUser.execute(req.body);
      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.loginUser.execute(req.body);
      res.status(200).json({ message: "Login successful", data: result });
    } catch (err) {
      next(err);
    }
  }
}
