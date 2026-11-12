
export type VehicleStatus =
  | "DRAFT"
  | "AVAILABLE"
  | "RESERVED"
  | "SOLD"
  | "ARCHIVED";

export type VehicleCurrency = "ZMW" | "USD";

export type VehicleTransmission =
  | "AUTOMATIC"
  | "MANUAL"
  | "CVT"
  | "OTHER";

export type VehicleFuelType =
  | "PETROL"
  | "DIESEL"
  | "HYBRID"
  | "ELECTRIC"
  | "OTHER";

export type VehicleCondition =
  | "BRAND_NEW"
  | "FOREIGN_USED"
  | "LOCALLY_USED";

export type VehicleDriveType =
  | "FWD"
  | "RWD"
  | "AWD"
  | "4WD"
  | "OTHER";

export type VehicleBodyType =
  | "SUV"
  | "SEDAN"
  | "HATCHBACK"
  | "COUPE"
  | "PICKUP"
  | "TRUCK"
  | "VAN"
  | "WAGON"
  | "OTHER";

export interface VehicleImage {
  publicId: string;
  url: string;
}

export interface Vehicle {
  _id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  currency: VehicleCurrency;
  mileage: number;
  transmission: VehicleTransmission;
  fuelType: VehicleFuelType;
  engineCapacity?: string;
  bodyType: VehicleBodyType;
  condition: VehicleCondition;
  exteriorColor?: string;
  interiorColor?: string;
  driveType?: VehicleDriveType;
  location?: string;
  description: string;
  features: string[];
  images: VehicleImage[];
  status: VehicleStatus;
  isPublished: boolean;
  isFeatured: boolean;
  vin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VehiclePagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface VehicleListResponse {
  success: boolean;
  data: {
    vehicles: Vehicle[];
    pagination: VehiclePagination;
  };
}

export interface VehicleDetailResponse {
  success: boolean;
  data: {
    vehicle: Vehicle;
  };
}

export interface VehicleListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: VehicleStatus | "";
}
