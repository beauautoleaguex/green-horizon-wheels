
export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  bodyType: string;
  condition: string;
  imageUrl?: string;
  exteriorColor: string;
  interiorColor: string;
  engineSize: string;
  features: string[];
}
