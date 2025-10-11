import type { ApiResponse, PaginatedData } from "~/types/common";
import type { Customer, CustomerStatistics } from "./types";

export type CustomersListResponse = ApiResponse<{
    customers: PaginatedData<Customer>;
    statistics: CustomerStatistics;
}>;

export type CustomerDetailResponse = ApiResponse<Customer>;

export type CustomerCreateResponse = ApiResponse<Customer>;

export type CustomerUpdateResponse = ApiResponse<Customer>;

export type CustomerDeleteResponse = ApiResponse<{ message: string }>;
