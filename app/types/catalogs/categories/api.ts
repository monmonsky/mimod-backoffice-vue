import type { PaginatedData } from "~/types/common";
import type { Category } from "./types";

export interface CategoryStatistics {
    total: number;
    active: number;
    inactive: number;
    parents: number;
    total_products: number;
}

// List response has nested structure with categories and statistics
export interface CategoriesListResponse {
    status: boolean;
    statusCode: string;
    message: string;
    data: {
        categories: PaginatedData<Category>;
        statistics: CategoryStatistics;
    };
}

export interface CategoryDetailResponse {
    status: boolean;
    statusCode: string;
    message: string;
    data: Category;
}

export interface CategoryCreateResponse {
    status: boolean;
    statusCode: string;
    message: string;
    data: Category;
}

export interface CategoryUpdateResponse {
    status: boolean;
    statusCode: string;
    message: string;
    data: Category;
}

export interface CategoryDeleteResponse {
    status: boolean;
    statusCode: string;
    message: string;
    data: { message: string };
}
