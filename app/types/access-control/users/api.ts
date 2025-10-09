import type { ApiResponse, PaginatedData } from "./common";

// User Types
export interface User {
    id: number;
    role_id: number;
    name: string;
    email: string;
    phone: string;
    photo?: string | null;
    password?: string;
    email_verified_at: string | null;
    phone_verified_at: string | null;
    last_login_at: string | null;
    last_login_ip: string | null;
    status: "active" | "inactive";
    two_factor_enabled: boolean;
    two_factor_secret: string | null;
    created_at: string;
    updated_at: string;
    role_name: string;
    role_display_name: string;
    role_priority: number;
}

export type UserStatus = "active" | "inactive";

// User API Responses
export type UsersResponse = ApiResponse<PaginatedData<User>>;
export type UserResponse = ApiResponse<User>;

// User Form Data
export interface UserFormData {
    name: string;
    email: string;
    phone?: string;
    role_id: number;
    status: UserStatus;
    password?: string;
    password_confirmation?: string;
}

// Filters
export interface UserFilters {
    search?: string;
    status?: UserStatus | "";
    role_id?: number;
    page?: number;
    per_page?: number;
}
