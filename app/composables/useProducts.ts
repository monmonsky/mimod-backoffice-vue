import type { ProductFormData, ProductsListResponse, ProductDetailResponse, ProductCreateResponse, ProductUpdateResponse, ProductDeleteResponse } from "~/types/catalogs/products";
import type { PaginationParams } from "./usePagination";

export const useProducts = () => {
    const config = useRuntimeConfig();
    const authStore = useAuthStore();
    const { buildPaginationParams } = usePagination();

    const getProducts = (params?: Partial<PaginationParams>, options?: { watch?: any[] }) => {
        // Apply default pagination params (per_page: 20)
        const paginationParams = buildPaginationParams(params);

        return useAsyncData<ProductsListResponse>(
            "products",
            () =>
                $fetch("/catalog/products", {
                    baseURL: config.public.apiBase,
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                    },
                    params: paginationParams,
                }),
            {
                watch: options?.watch || [],
            },
        );
    };

    const getProduct = (id: number) => {
        return useAsyncData<ProductDetailResponse>(`product-${id}`, () =>
            $fetch(`/catalog/products/${id}`, {
                baseURL: config.public.apiBase,
                headers: {
                    Authorization: `Bearer ${authStore.token}`,
                },
            }),
        );
    };

    const createProduct = async (data: Partial<ProductFormData>) => {
        return await $fetch<ProductCreateResponse>("/catalog/products", {
            method: "POST",
            baseURL: config.public.apiBase,
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
            body: data,
        });
    };

    const updateProduct = async (id: number, data: Partial<ProductFormData>) => {
        return await $fetch<ProductUpdateResponse>(`/catalog/products/${id}`, {
            method: "PUT",
            baseURL: config.public.apiBase,
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
            body: data,
        });
    };

    const deleteProduct = async (id: number) => {
        return await $fetch<ProductDeleteResponse>(`/catalog/products/${id}`, {
            method: "DELETE",
            baseURL: config.public.apiBase,
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
        });
    };

    return {
        getProducts,
        getProduct,
        createProduct,
        updateProduct,
        deleteProduct,
    };
};
