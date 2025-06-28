export interface Tariff {
  originZip: string;
  destinationZip: string;
  minWeight: number;
  maxWeight: number;
  cost: number;
}
