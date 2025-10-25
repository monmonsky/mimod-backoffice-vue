import type { CustomerFormData, CustomersListResponse, CustomerDetailResponse, CustomerCreateResponse, CustomerUpdateResponse, CustomerDeleteResponse } from "~/types/customers";
import type { PaginationParams } from "./usePagination";

export const useCustomers = () => {
    const config = useRuntimeConfig();
    const authStore = useAuthStore();
    const { buildPaginationParams } = usePagination();

    const getCustomers = (params?: Partial<PaginationParams>) => {
        // Apply default pagination params (per_page: 20)
        const paginationParams = buildPaginationParams(params);

        const query = new URLSearchParams();
        if (paginationParams.page) query.append("page", paginationParams.page.toString());
        if (paginationParams.per_page) query.append("per_page", paginationParams.per_page.toString());
        if (paginationParams.search) query.append("search", paginationParams.search);
        if (paginationParams.sort) query.append("sort", paginationParams.sort);
        if (paginationParams.order) query.append("order", paginationParams.order);

        // Custom filters
        if (params?.status) query.append("status", params.status);
        if (params?.segment) query.append("segment", params.segment);
        if (params?.is_vip !== undefined) query.append("is_vip", params.is_vip.toString());

        const queryString = query.toString();
        const url = `/customers${queryString ? `?${queryString}` : ""}`;

        return useApi<CustomersListResponse>(url, {
            key: `customers-${queryString}`,
        });
    };

    const getCustomer = (customerId: number) => {
        return useApi<CustomerDetailResponse>(`/customers/${customerId}`, {
            key: `customer-${customerId}`,
        });
    };

    const createCustomer = async (data: CustomerFormData) => {
        return $fetch<CustomerCreateResponse>(`/customers`, {
            baseURL: config.public.apiBase,
            method: "POST",
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
            body: data,
        });
    };

    const updateCustomer = async (customerId: number, data: CustomerFormData) => {
        return $fetch<CustomerUpdateResponse>(`/customers/${customerId}`, {
            baseURL: config.public.apiBase,
            method: "PUT",
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
            body: data,
        });
    };

    const deleteCustomer = async (customerId: number) => {
        return $fetch<CustomerDeleteResponse>(`/customers/${customerId}`, {
            baseURL: config.public.apiBase,
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
        });
    };

    return {
        getCustomers,
        getCustomer,
        createCustomer,
        updateCustomer,
        deleteCustomer,
    };
};
