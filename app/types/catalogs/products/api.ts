import type { ApiResponse, PaginatedData } from "~/types/common";
import type { Product, ProductStatistics } from "./types";

export type ProductsListResponse = ApiResponse<{
    products: PaginatedData<Product>;
    statistics: ProductStatistics;
}>;

export type ProductDetailResponse = ApiResponse<Product>;

export type ProductCreateResponse = ApiResponse<Product>;

export type ProductUpdateResponse = ApiResponse<Product>;

export type ProductDeleteResponse = ApiResponse<{ message: string }>;
