import { Center, Loader } from "@mantine/core";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../features/auth/pages/LoginPage";
import ProtectedRoute from "../features/auth/ProtectedRoute";
import { useAuth } from "../features/auth/AuthContext";
import AdminLayout from "../components/layout/AdminLayout";
import ComingSoonPage from "../components/layout/ComingSoonPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import VehiclesPage from "../features/vehicles/pages/VehiclesPage";
import CreateVehiclePage from "../features/vehicles/pages/CreateVehiclePage";
import VehicleDetailsPage from "../features/vehicles/pages/VehicleDetailsPage";
import EditVehiclePage from "../features/vehicles/pages/CreateVehiclePage";
import EnquiriesPage from "../features/enquiries/EnquiriesPage";

function PublicRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Center mih="100vh">
        <Loader color="dark" />
      </Center>
    );
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/vehicles" element={<VehiclesPage />} />
          <Route path="/vehicles/new" element={<CreateVehiclePage />} />
          <Route path="vehicles/:id" element={<VehicleDetailsPage />} />
          <Route path="vehicles/:id/edit" element={<EditVehiclePage />} />
          <Route path="inquiries" element={<EnquiriesPage />} />
          <Route
            path="/vehicles/*"
            element={
              <ComingSoonPage
                title="Vehicle Management"
                description="Manage vehicle listings, vehicle information, images and availability."
              />
            }
          />

          <Route
            path="/inquiries"
            element={
              <ComingSoonPage
                title="Client Inquiries"
                description="Review and manage vehicle sourcing requests from clients."
              />
            }
          />

          <Route
            path="/administrators"
            element={
              <ComingSoonPage
                title="Administrator Management"
                description="Manage administrator accounts and access permissions."
              />
            }
          />

          <Route
            path="/settings"
            element={
              <ComingSoonPage
                title="System Settings"
                description="Manage your AVASE administration preferences."
              />
            }
          />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
