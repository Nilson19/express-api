export interface Shipment {
  user_id: string;
  origin_zip: string;
  destination_zip: string;
  weight: number;           
  length: number;           
  width: number;
  height: number;          
  total_cost: number;
  created_at?: Date;        
  updated_at?: Date;        
  status?: string;       
}
