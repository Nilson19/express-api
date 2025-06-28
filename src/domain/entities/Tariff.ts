export interface Tariff {
  origin_zip: string;
  destination_zip: string;
  min_weight: number;
  max_weight: number;
  cost: number;
}
