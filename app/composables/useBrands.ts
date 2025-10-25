import type { BrandFormData, BrandsListResponse, BrandDetailResponse, BrandCreateResponse, BrandUpdateResponse, BrandDeleteResponse } from "~/types/catalogs/brands";
import type { PaginationParams } from "./usePagination";

export const useBrands = () => {
    const config = useRuntimeConfig();
    const authStore = useAuthStore();
    const { buildPaginationParams } = usePagination();

    const getBrands = (params?: Partial<PaginationParams>) => {
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
        if (params?.status) query.append("status", params.status);

        const queryString = query.toString();
        const url = `/catalog/brands${queryString ? `?${queryString}` : ""}`;

        return useApi<BrandsListResponse>(url, {
            key: `brands-${queryString}`,
        });
    };

    const getBrand = (brandId: number) => {
        return useApi<BrandDetailResponse>(`/catalog/brands/${brandId}`, {
            key: `brand-${brandId}`,
        });
    };

    const createBrand = async (data: BrandFormData) => {
        return $fetch<BrandCreateResponse>(`/catalog/brands`, {
            baseURL: config.public.apiBase,
            method: "POST",
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
            body: data,
        });
    };

    const updateBrand = async (brandId: number, data: BrandFormData) => {
        return $fetch<BrandUpdateResponse>(`/catalog/brands/${brandId}`, {
            baseURL: config.public.apiBase,
            method: "PUT",
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
            body: data,
        });
    };

    const deleteBrand = async (brandId: number) => {
        return $fetch<BrandDeleteResponse>(`/catalog/brands/${brandId}`, {
            baseURL: config.public.apiBase,
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
        });
    };

    return {
        getBrands,
        getBrand,
        createBrand,
        updateBrand,
        deleteBrand,
    };
};
