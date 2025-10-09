import type { UserFilters, UsersResponse, UserResponse, UserFormData } from "~/types/access-control/users";

export const useUsers = () => {
    const getUsers = (filters: UserFilters = {}) => {
        const query = new URLSearchParams();

        if (filters.search) query.append("search", filters.search);
        if (filters.status) query.append("status", filters.status);
        if (filters.role_name) query.append("role_name", filters.role_name);
        if (filters.page) query.append("page", filters.page.toString());
        if (filters.per_page) query.append("per_page", filters.per_page.toString());

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
