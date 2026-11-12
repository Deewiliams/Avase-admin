
export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN";
  isActive: boolean;
  lastLogin?: string | null;
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

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}
