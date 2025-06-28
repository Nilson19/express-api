import { ITariffRepository } from "../../domain/repositories/ITariffRepository";
import { Tariff } from "../../domain/entities/Tariff";
import { mysqlPool } from "../../config/dbConnection";
import { AppError } from "../../utils/errors/AppError";

export class TariffRepository implements ITariffRepository {
  async getTariff(
    originZip: string,
    destinationZip: string,
    weight: number
  ): Promise<string | null> {
    try {
      const [rows] = await mysqlPool.execute(
        `SELECT * FROM tariffs WHERE originZip = ? AND destinationZip = ? AND minWeight <= ? AND maxWeight >= ?`,
        [originZip, destinationZip, weight, weight]
      );

      if (Array.isArray(rows) && rows.length > 0) {
        const tariff = rows[0] as Tariff;
        return tariff.cost.toString();
      }
      return null;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new AppError("Error fetching tariff: " + error.message);
      }
      throw new AppError("Unknown error fetching tariff");
    }
  }
}
