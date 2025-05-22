
import { mockVehicleData, supabase, useSupabase } from './vehicleClient';

// Get unique vehicle makes
export const getVehicleMakes = async (): Promise<string[]> => {
  try {
    if (useSupabase && supabase) {
      const { data, error } = await supabase
        .from('vehicles')
        .select('make');

      if (error) {
        console.error("Error fetching vehicle makes:", error);
        return [];
      }

      // Extract unique makes manually
      const uniqueMakes = Array.from(new Set(data.map(item => item.make)));
      return uniqueMakes.sort();
    } else {
      // Use mock data
      const uniqueMakes = Array.from(new Set(mockVehicleData.map(item => item.make)));
      return uniqueMakes.sort();
    }
  } catch (error) {
    console.error("Failed to fetch vehicle makes:", error);
    return [];
  }
};

// Get vehicle models by make
export const getVehicleModels = async (make?: string): Promise<string[]> => {
  try {
    if (useSupabase && supabase) {
      let query = supabase
        .from('vehicles')
        .select('model');

      if (make) {
        query = query.eq('make', make);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching vehicle models:", error);
        return [];
      }

      // Extract unique models manually
      const uniqueModels = Array.from(new Set(data.map(item => item.model)));
      return uniqueModels.sort();
    } else {
      // Use mock data
      let filteredData = mockVehicleData;
      if (make) {
        filteredData = filteredData.filter(vehicle => vehicle.make === make);
      }
      const uniqueModels = Array.from(new Set(filteredData.map(item => item.model)));
      return uniqueModels.sort();
    }
  } catch (error) {
    console.error("Failed to fetch vehicle models:", error);
    return [];
  }
};

// Get unique body types
export const getBodyTypes = async (): Promise<string[]> => {
  try {
    if (useSupabase && supabase) {
      const { data, error } = await supabase
        .from('vehicles')
        .select('body_type');

      if (error) {
        console.error("Error fetching body types:", error);
        return [];
      }

      // Extract unique body types manually
      const uniqueBodyTypes = Array.from(new Set(data.map(item => item.body_type)));
      return uniqueBodyTypes.sort();
    } else {
      // Use mock data
      const uniqueBodyTypes = Array.from(new Set(mockVehicleData.map(item => item.bodyType)));
      return uniqueBodyTypes.sort();
    }
  } catch (error) {
    console.error("Failed to fetch body types:", error);
    return [];
  }
};

// Get unique colors
export const getAllColors = async (): Promise<string[]> => {
  try {
    if (useSupabase && supabase) {
      const { data, error } = await supabase
        .from('vehicles')
        .select('exterior_color');

      if (error) {
        console.error("Error fetching colors:", error);
        return [];
      }

      // Extract unique colors manually
      const uniqueColors = Array.from(new Set(data.map(item => item.exterior_color)));
      return uniqueColors.sort();
    } else {
      // Use mock data
      const uniqueColors = Array.from(new Set(mockVehicleData.map(item => item.exteriorColor)));
      return uniqueColors.sort();
    }
  } catch (error) {
    console.error("Failed to fetch colors:", error);
    return [];
  }
};
