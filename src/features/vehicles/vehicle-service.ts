import api from "../../lib/axios";

import type {
  VehicleListParams,
  VehicleListResponse,
  VehicleDetailResponse,
} from "./vehicle-types";

export const vehicleService = {
  // Get paginated vehicles
  async getVehicles(params: VehicleListParams) {
    const { data } = await api.get<VehicleListResponse>("/vehicles/admin/all", {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        ...(params.search?.trim() ? { search: params.search.trim() } : {}),
        ...(params.status ? { status: params.status } : {}),
      },
    });

    return data;
  },

  // Get a single vehicle
  async getVehicleById(id: string) {
    const { data } = await api.get<VehicleDetailResponse>(
      `/vehicles/admin/${id}`,
    );

    return data;
  },

  // Create vehicle
  async createVehicle(formData: FormData) {
    const { data } = await api.post("/vehicles", formData);

    return data;
  },

  // Update vehicle
  async updateVehicle(id: string, formData: FormData) {
    const { data } = await api.put(`/vehicles/${id}`, formData);

    return data;
  },
};
