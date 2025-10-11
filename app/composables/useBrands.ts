import type { BrandFormData, BrandsListResponse, BrandDetailResponse, BrandCreateResponse, BrandUpdateResponse, BrandDeleteResponse } from "~/types/catalogs/brands";

export const useBrands = () => {
    const config = useRuntimeConfig();
    const authStore = useAuthStore();

    const getBrands = (params?: Record<string, any>) => {
        const query = new URLSearchParams();
        if (params?.page) query.append("page", params.page.toString());
        if (params?.per_page) query.append("per_page", params.per_page.toString());
        if (params?.search) query.append("search", params.search);
        if (params?.is_active !== undefined) query.append("is_active", params.is_active.toString());

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
