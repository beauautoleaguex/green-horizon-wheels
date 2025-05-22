
import { Vehicle } from '@/types/vehicle';

// Create a function that generates 100 mock vehicles
const generateMockVehicles = (): Vehicle[] => {
  const vehicles: Vehicle[] = [];
  const makes = ['Toyota', 'Honda', 'Ford', 'Tesla', 'BMW', 'Audi', 'Mercedes', 'Chevrolet', 'Nissan', 'Hyundai'];
  const models = ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Truck', 'Wagon', 'Convertible', 'Van'];
  const fuelTypes = ['Gasoline', 'Diesel', 'Electric', 'Hybrid'];
  const transmissions = ['Automatic', 'Manual', 'CVT'];
  const bodyTypes = ['Sedan', 'SUV', 'Truck', 'Hatchback', 'Coupe', 'Wagon', 'Convertible', 'Van'];
  const conditions = ['New', 'Used', 'Demo'];
  const colors = ['Red', 'Blue', 'Black', 'White', 'Silver', 'Gray', 'Green', 'Yellow', 'Orange', 'Brown'];
  const features = ['Bluetooth', 'Navigation', 'Backup Camera', 'Sunroof', 'Leather Seats', 'Heated Seats', 
                   'Apple CarPlay', 'Android Auto', 'Premium Sound', 'Alloy Wheels', 'Keyless Entry', 
                   'Push Button Start', 'Blind Spot Monitor', 'Lane Departure Warning'];
  
  for (let i = 1; i <= 100; i++) {
    const makeIndex = i % makes.length;
    const modelIndex = i % models.length;
    const year = 2015 + (i % 9); // Years from 2015 to 2023
    const price = 15000 + (i * 1000);
    const mileage = i % 3 === 0 ? 0 : 5000 + (i * 500); // Some cars are new (0 miles)
    const fuelIndex = i % fuelTypes.length;
    const transIndex = i % transmissions.length;
    const bodyIndex = i % bodyTypes.length;
    const conditionIndex = i % conditions.length;
    const exteriorColorIndex = i % colors.length;
    const interiorColorIndex = (i + 3) % colors.length; // Offset for variety
    
    // Select 3-5 random features for each vehicle
    const numFeatures = 3 + (i % 3);
    const vehicleFeatures: string[] = [];
    const featureIndices = new Set<number>();
    
    while (featureIndices.size < numFeatures) {
      featureIndices.add(Math.floor(Math.random() * features.length));
    }
    
    featureIndices.forEach(index => {
      vehicleFeatures.push(features[index]);
    });
    
    vehicles.push({
      id: i.toString(),
      make: makes[makeIndex],
      model: `${models[modelIndex]} ${String.fromCharCode(65 + (i % 26))}`, // Add a letter suffix for variety
      year: year,
      price: price,
      mileage: mileage,
      fuelType: fuelTypes[fuelIndex],
      transmission: transmissions[transIndex],
      bodyType: bodyTypes[bodyIndex],
      condition: conditions[conditionIndex],
      imageUrl: `https://placehold.co/600x400/e2e8f0/64748b?text=${makes[makeIndex]}+${models[modelIndex]}`,
      exteriorColor: colors[exteriorColorIndex],
      interiorColor: colors[interiorColorIndex],
      engineSize: `${(1.5 + (i % 5) * 0.5).toFixed(1)}L`,
      features: vehicleFeatures,
      trim: i % 4 === 0 ? 'Premium' : i % 4 === 1 ? 'Sport' : i % 4 === 2 ? 'Limited' : 'Base',
      seats: String(4 + (i % 4)) // Vehicles with 4-7 seats
    });
  }
  
  return vehicles;
};

// Generate 100 vehicles
export const mockVehicles: Vehicle[] = generateMockVehicles();
