import { ITariffRepository } from "../../domain/repositories/ITariffRepository";

export class ShipmentQuote {
  constructor(private tariffRepository: ITariffRepository) {}

  async getShipmentQuote(
    originZip: string,
    destinationZip: string,
    weight: number,
    length?: number,
    width?: number,
    height?: number
  ): Promise<string | null> {
    if (!originZip || !destinationZip || weight <= 0 || !length || !width || !height) {
      throw new Error("Invalid input parameters for shipment quote.");
    }


    let maxWeight = height * width * length / 2500;
    maxWeight = Math.max(maxWeight, weight);



    const cost = await this.tariffRepository.getTariff(
      originZip,
      destinationZip,
      Math.ceil(maxWeight),
    );

    if (!cost) {
      throw new Error("No tariff found for the given parameters.");
    }

    return cost;
  }
}