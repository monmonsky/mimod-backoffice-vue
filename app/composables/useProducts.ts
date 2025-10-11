import type { ProductFormData, ProductsListResponse, ProductDetailResponse, ProductCreateResponse, ProductUpdateResponse, ProductDeleteResponse } from "~/types/catalogs/products";

export const useProducts = () => {
    const config = useRuntimeConfig();
    const authStore = useAuthStore();

    const getProducts = (params?: Record<string, any>) => {
        return useAsyncData<ProductsListResponse>("products", () =>
            $fetch("/catalog/products", {
                baseURL: config.public.apiBase,
                headers: {
                    Authorization: `Bearer ${authStore.token}`,
                },
                params,
            }),
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
