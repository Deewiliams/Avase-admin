export type AdminRole = "SUPER_ADMIN" | "ADMIN";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: AdminUser;
  };
}

export interface MeResponse {
  success: boolean;
  data: {
    user: AdminUser;
  };
}
