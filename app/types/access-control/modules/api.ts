import type { ApiResponse, PaginatedData } from "~/types/common";

export interface Module {
    id: number;
    name: string;
    display_name: string;
    description: string | null;
    icon: string | null;
    parent_id: number | null;
    group_name: string | null;
    route: string;
    permission_name: string;
    component: string;
    sort_order: number;
    is_active: boolean;
    is_visible: boolean;
    created_at: string;
    updated_at: string;
    children?: Module[];
}

export type ModulesResponse = ApiResponse<PaginatedData<Module>>;
export type ModuleResponse = ApiResponse<Module>;

// Grouped Modules
export interface ModuleGroup {
    group_name: string;
    modules: Module[];
}

export type GroupedModulesResponse = ApiResponse<ModuleGroup[]>;

// Module Filters
export interface ModuleFilters {
    search?: string;
    is_active?: boolean | "";
    is_visible?: boolean | "";
    parent_id?: number;
    page?: number;
    per_page?: number;
}
