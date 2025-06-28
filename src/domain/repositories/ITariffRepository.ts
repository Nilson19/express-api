export interface ITariffRepository {
  getTariff(
    originZip: string,
    destinationZip: string,
    weight: number,
  ): Promise<string | null>;
}