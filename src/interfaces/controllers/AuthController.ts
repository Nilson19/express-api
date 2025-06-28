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
      const user = await this.registerUser.execute(req.body);
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.loginUser.execute(req.body);
      res.status(200).json({ message: result });
    } catch (err) {
      next(err);
    }
  }
}
