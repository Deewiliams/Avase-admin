export type EnquiryStatus =
  | "NEW"
  | "CONTACTED"
  | "IN_DISCUSSION"
  | "CONVERTED"
  | "CLOSED"
  | "SPAM";

export type EnquiryType =
  | "GENERAL_INFORMATION"
  | "PRICE_REQUEST"
  | "ADDITIONAL_PHOTOS"
  | "VIEWING_REQUEST"
  | "OTHER";

export type PreferredContactMethod = "PHONE" | "EMAIL" | "WHATSAPP";

export interface EnquiryVehicleSnapshot {
  make: string;
  model: string;
  year: number;
}

export interface EnquiryVehicleImage {
  publicId: string;
  url: string;
}

export interface EnquiryVehicle {
  _id: string;
  make: string;
  model: string;
  year: number;
  price?: number;
  currency?: string;
  images?: EnquiryVehicleImage[];
}

export interface EnquiryAdmin {
  _id: string;
  name: string;
  email: string;
}

export interface EnquiryInternalNote {
  _id?: string;
  note: string;
  createdBy: EnquiryAdmin;
  createdAt: string;
}

export interface Enquiry {
  _id: string;
  vehicle: EnquiryVehicle;
  vehicleSnapshot: EnquiryVehicleSnapshot;
  customerName: string;
  email: string | null;
  phone: string;
  preferredContactMethod: PreferredContactMethod;
  enquiryType: EnquiryType;
  message: string;
  status: EnquiryStatus;
  assignedTo: EnquiryAdmin | null;
  internalNotes: EnquiryInternalNote[];
  createdAt: string;
  updatedAt: string;
}

export interface EnquiryListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: EnquiryStatus | "";
  vehicleId?: string;
}

export interface EnquiryPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface EnquiryListResponse {
  success: boolean;
  message: string;
  data: Enquiry[];
  pagination: EnquiryPagination;
}

export interface EnquiryDetailResponse {
  success: boolean;
  message: string;
  data: Enquiry;
}

export interface UpdateEnquiryStatusPayload {
  status: EnquiryStatus;
}

export interface AddEnquiryNotePayload {
  note: string;
}

export interface EnquiryMutationResponse {
  success: boolean;
  message: string;
  data: Enquiry;
}
