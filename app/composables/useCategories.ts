import type { CategoryFormData, CategoriesListResponse, CategoryDetailResponse, CategoryCreateResponse, CategoryUpdateResponse, CategoryDeleteResponse } from "~/types/catalogs/categories";
import type { PaginationParams } from "./usePagination";

export const useCategories = () => {
    const config = useRuntimeConfig();
    const authStore = useAuthStore();
    const { buildPaginationParams } = usePagination();

    const getCategories = (params?: Partial<PaginationParams>) => {
        // Apply default pagination params (per_page: 20)
        const paginationParams = buildPaginationParams(params);

        const query = new URLSearchParams();
        if (paginationParams.page) query.append("page", paginationParams.page.toString());
        if (paginationParams.per_page) query.append("per_page", paginationParams.per_page.toString());
        if (paginationParams.search) query.append("search", paginationParams.search);
        if (paginationParams.sort) query.append("sort", paginationParams.sort);
        if (paginationParams.order) query.append("order", paginationParams.order);

        // Custom filters
        if (params?.is_active !== undefined) query.append("is_active", params.is_active.toString());

        const queryString = query.toString();
        const url = `/catalog/categories${queryString ? `?${queryString}` : ""}`;

        return useApi<CategoriesListResponse>(url, {
            key: `categories-${queryString}`,
        });
    };

    const getCategory = (categoryId: number) => {
        return useApi<CategoryDetailResponse>(`/catalog/categories/${categoryId}`, {
            key: `category-${categoryId}`,
        });
    };

    const createCategory = async (data: CategoryFormData) => {
        return $fetch<CategoryCreateResponse>(`/catalog/categories`, {
            baseURL: config.public.apiBase,
            method: "POST",
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
            body: data,
        });
    };

    const updateCategory = async (categoryId: number, data: CategoryFormData) => {
        return $fetch<CategoryUpdateResponse>(`/catalog/categories/${categoryId}`, {
            baseURL: config.public.apiBase,
            method: "PUT",
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
            body: data,
        });
    };

    const deleteCategory = async (categoryId: number) => {
        return $fetch<CategoryDeleteResponse>(`/catalog/categories/${categoryId}`, {
            baseURL: config.public.apiBase,
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
        });
    };

    return {
        getCategories,
        getCategory,
        createCategory,
        updateCategory,
        deleteCategory,
    };
};
