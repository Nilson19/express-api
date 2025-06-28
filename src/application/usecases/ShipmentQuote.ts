import { ITariffRepository } from "../../domain/repositories/ITariffRepository";

export class ShipmentQuote {
  constructor(private tariffRepository: ITariffRepository) {}

  async getShipmentQuote(
    originZip: string,
    destinationZip: string,
    weight: number
  ): Promise<string | null> {
    if (!originZip || !destinationZip || weight <= 0) {
      throw new Error("Invalid input parameters for shipment quote.");
    }

    const cost = await this.tariffRepository.getTariff(
      originZip,
      destinationZip,
      weight
    );

    if (!cost) {
      throw new Error("No tariff found for the given parameters.");
    }

    return cost;
  }
}