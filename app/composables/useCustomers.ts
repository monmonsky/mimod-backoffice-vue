import type { CustomerFormData, CustomersListResponse, CustomerDetailResponse, CustomerCreateResponse, CustomerUpdateResponse, CustomerDeleteResponse } from "~/types/customers";

export const useCustomers = () => {
    const config = useRuntimeConfig();
    const authStore = useAuthStore();

    const getCustomers = (params?: Record<string, any>) => {
        const query = new URLSearchParams();
        if (params?.page) query.append("page", params.page.toString());
        if (params?.per_page) query.append("per_page", params.per_page.toString());
        if (params?.search) query.append("search", params.search);
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
        console.log("=== useCustomers.createCustomer ===");
        console.log("URL:", `${config.public.apiBase}/customers`);
        console.log("Body:", data);
        console.log("==================================");

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
        console.log("=== useCustomers.updateCustomer ===");
        console.log("URL:", `${config.public.apiBase}/customers/${customerId}`);
        console.log("Customer ID:", customerId);
        console.log("Body:", data);
        console.log("==================================");

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
