import api from "../../lib/axios";

import type { VehicleListParams, VehicleListResponse } from "./vehicle-types";

export const vehicleService = {
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
};
