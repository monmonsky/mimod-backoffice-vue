import type { ApiResponse, PaginatedData } from "~/types/common";

// Role Types
export interface Role {
    id: number;
    name: string;
    display_name: string;
    description: string;
    is_active: boolean;
    is_system: boolean;
    priority: number;
    created_at: string;
    updated_at: string;
}

// Role API Responses
export type RolesResponse = ApiResponse<PaginatedData<Role>>;
export type RoleResponse = ApiResponse<Role>;
