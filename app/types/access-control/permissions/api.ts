import type { ApiResponse, PaginatedData } from "~/types/common";

// Permission Types
export interface Permission {
    id: number;
    name: string;
    display_name: string;
    description: string;
    module: string;
    action: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// Permission API Responses
export type PermissionsResponse = ApiResponse<PaginatedData<Permission>>;
export type PermissionResponse = ApiResponse<Permission>;

// Permission Filters
export interface PermissionFilters {
    search?: string;
    module?: string;
    action?: string;
    is_active?: boolean | "";
    page?: number;
    per_page?: number;
}
