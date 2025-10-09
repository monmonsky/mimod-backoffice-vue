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

// Grouped Permissions Types
export interface GroupedPermission {
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

export interface PermissionGroup {
    module: string;
    permissions: GroupedPermission[];
}

export type GroupedPermissionsResponse = ApiResponse<PermissionGroup[]>;

export interface RolePermissionsData {
    role: Role;
    permissions: PermissionGroup[];
}

export type RolePermissionsResponse = ApiResponse<RolePermissionsData>;

// Role Form Data
export interface RoleFormData {
    name: string;
    display_name: string;
    description?: string;
    priority: number;
    is_active: boolean;
    is_system?: boolean;
}
