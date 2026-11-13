export interface DashboardOverview {
  totalVehicles: number;
  availableVehicles: number;
  clientInquiries: number;
  registeredAdmins: number;
}

export interface DashboardOverviewResponse {
  success: boolean;
  message: string;
  data: DashboardOverview;
}