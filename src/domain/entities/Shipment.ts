export interface Shipment {
  originZip: string;
  destinationZip: string;
  weight: number;           
  length: number;           
  width: number;
  height: number;          
  totalCost: number;
  createdAt?: Date;        
  updatedAt?: Date;        
  status?: string;       
}
