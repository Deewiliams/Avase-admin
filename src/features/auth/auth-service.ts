import api from "../../lib/axios";
import type { LoginCredentials, LoginResponse, MeResponse } from "./auth-types";

export const authService = {
  async login(credentials: LoginCredentials) {
    const response = await api.post<LoginResponse>("/auth/login", credentials);

    return response.data;
  },

  async getMe() {
    const response = await api.get<MeResponse>("/auth/me");

    return response.data;
  },

  async changePassword(data: { currentPassword: string; newPassword: string }) {
    const response = await api.patch("/auth/change-password", data);

    return response.data;
  },
};
