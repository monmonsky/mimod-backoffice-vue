import type { UserFilters, UsersResponse, UserResponse, UserFormData } from "~/types/access-control/users";
import type { PaginationParams } from "./usePagination";

export const useUsers = () => {
    const { buildPaginationParams } = usePagination();

    const getUsers = (filters: Partial<PaginationParams> & Omit<UserFilters, 'page' | 'per_page'> = {}) => {
        // Apply default pagination params (per_page: 20)
        const paginationParams = buildPaginationParams(filters);

        const query = new URLSearchParams();

        if (paginationParams.page) query.append("page", paginationParams.page.toString());
        if (paginationParams.per_page) query.append("per_page", paginationParams.per_page.toString());
        if (paginationParams.search) query.append("search", paginationParams.search);
        if (paginationParams.sort) query.append("sort", paginationParams.sort);
        if (paginationParams.order) query.append("order", paginationParams.order);

        // Custom filters
        if (filters.status) query.append("status", filters.status);
        if (filters.role_name) query.append("role_name", filters.role_name);

        const queryString = query.toString();
        const url = `/access-control/users${queryString ? `?${queryString}` : ""}`;

        return useApi<UsersResponse>(url, {
            key: `users-${queryString}`,
        });
    };

    const getUser = (id: number) => {
        return useApi<UserResponse>(`/access-control/users/${id}`, {
            key: `user-${id}`,
        });
    };

    const createUser = async (data: UserFormData) => {
        return await $fetch<UserResponse>("/access-control/users", {
            method: "POST",
            body: data,
            baseURL: useRuntimeConfig().public.apiBase || "http://127.0.0.1:8000/api",
            headers: {
                Authorization: `Bearer ${useAuthStore().token}`,
            },
        });
    };

    const updateUser = async (id: number, data: UserFormData) => {
        return await $fetch<UserResponse>(`/access-control/users/${id}`, {
            method: "PUT",
            body: data,
            baseURL: useRuntimeConfig().public.apiBase || "http://127.0.0.1:8000/api",
            headers: {
                Authorization: `Bearer ${useAuthStore().token}`,
            },
        });
    };

    const deleteUser = async (id: number) => {
        return await $fetch<UserResponse>(`/access-control/users/${id}`, {
            method: "DELETE",
            baseURL: useRuntimeConfig().public.apiBase || "http://127.0.0.1:8000/api",
            headers: {
                Authorization: `Bearer ${useAuthStore().token}`,
            },
        });
    };

    return {
        getUsers,
        getUser,
        createUser,
        updateUser,
        deleteUser,
    };
};
