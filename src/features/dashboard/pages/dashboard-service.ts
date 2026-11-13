import api from "../../../lib/axios";
import type { DashboardOverviewResponse } from "./dashboard-types";

export const dashboardService = {
  // Get dashboard overview statistics
  async getDashboardOverview(): Promise<DashboardOverviewResponse> {
    const response = await api.get<DashboardOverviewResponse>(
      "/dashboard/overview"
    );

    return response.data;
  },
};