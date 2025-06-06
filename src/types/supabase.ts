
import { Vehicle } from './vehicle';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      vehicles: {
        Row: Vehicle;
        Insert: Vehicle;
        Update: Partial<Vehicle>;
      };
    };
  };
}
