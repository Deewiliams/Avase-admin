import api from "../../lib/axios";
import type { LoginCredentials, LoginResponse, MeResponse } from "./auth-types";

export const authService = {
  async login(credentials: LoginCredentials) {
    const { data } = await api.post<LoginResponse>("/auth/login", credentials);

    return data;
  },

  async getMe() {
    const { data } = await api.get<MeResponse>("/auth/me");

    return data;
  },

  async changePassword(payload: {
    currentPassword: string;
    newPassword: string;
  }) {
    const { data } = await api.post("/auth/change-password", payload);

    return data;
  },
};
