// src/config/passport.ts
import { PassportStatic } from "passport";
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
} from "passport-jwt";
import { JwtPayload } from "jsonwebtoken";
import { env } from "./env";
import { IUserRepository } from "../domain/repositories/IUserRepository";
import { User } from "../domain/entities/User";

export const configurePassport = (
  passport: PassportStatic,
  userRepository: IUserRepository
) => {
  const opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: env.jwtSecret,
  };

  passport.use(
    new JwtStrategy(
      opts,
      async (
        jwt_payload: JwtPayload,
        done: (error: Error | null, user?: User | false) => void
      ) => {
        try {
          if (!jwt_payload || !jwt_payload.email) {
            return done(null, false);
          }

          const user = await userRepository.findByEmail(jwt_payload.email);
          return user ? done(null, user) : done(null, false);
        } catch (error) {
          return done(error as Error, false);
        }
      }
    )
  );
};
