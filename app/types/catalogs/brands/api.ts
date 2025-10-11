import type { PaginatedData } from "~/types/common";
import type { Brand } from "./types";

// List response has array with pagination object
export interface BrandsListResponse {
    status: boolean;
    statusCode: string;
    message: string;
    data: [PaginatedData<Brand>];
}

export interface BrandDetailResponse {
    status: boolean;
    statusCode: string;
    message: string;
    data: Brand;
}

export interface BrandCreateResponse {
    status: boolean;
    statusCode: string;
    message: string;
    data: Brand;
}

export interface BrandUpdateResponse {
    status: boolean;
    statusCode: string;
    message: string;
    data: Brand;
}

export interface BrandDeleteResponse {
    status: boolean;
    statusCode: string;
    message: string;
    data: { message: string };
}
