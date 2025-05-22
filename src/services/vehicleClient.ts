
import { createClient } from '@supabase/supabase-js';
import { Vehicle } from '@/types/vehicle';
import { Database } from '@/types/supabase';

// Try to get Supabase URL and key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a flag to determine if we should use Supabase or mock data
export const useSupabase = supabaseUrl && supabaseKey;

// Only create Supabase client if URL and key are available
export const supabase = useSupabase ? createClient<Database>(supabaseUrl, supabaseKey) : null;

// In-memory storage for mock data
export let mockVehicleData: Vehicle[] = [];

// Initialize the database with mock vehicles
export const initializeDatabase = async (vehicles: Vehicle[]): Promise<void> => {
  console.log("Initialize database called with", vehicles.length, "vehicles");
  
  // Always populate the mock data for fallback
  mockVehicleData = [...vehicles];
  console.log("Mock data has been initialized with", mockVehicleData.length, "vehicles");
  
  if (useSupabase) {
    try {
      console.log("Using Supabase for initialization");
      // Check if the vehicles table is empty
      const { data, error, count } = await supabase!
        .from('vehicles')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error("Error checking vehicles table:", error);
        throw error;
      }

      if (count === 0) {
        // If the table is empty, insert the mock vehicles
        const { error: insertError } = await supabase!
          .from('vehicles')
          .insert(vehicles);

        if (insertError) {
          console.error("Error inserting mock vehicles:", insertError);
          throw insertError;
        }

        console.log("Database initialized with mock vehicles.");
      } else {
        console.log("Database already contains vehicles. Skipping initialization.");
      }
    } catch (error) {
      console.error("Failed to initialize Supabase database, falling back to mock data:", error);
    }
  } else {
    // Store the vehicles in memory for mock data
    console.log("Using mock data instead of Supabase");
  }
  
  console.log("Mock data array now has", mockVehicleData.length, "vehicles");
};
