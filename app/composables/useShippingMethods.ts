export const useShippingMethods = () => {
    const config = useRuntimeConfig();
    const { token } = useAuthStore();

    const getShippingMethods = async (params?: any) => {
        return await $fetch('/shipping-methods', {
            baseURL: config.public.apiBase,
            headers: { Authorization: `Bearer ${token}` },
            params,
        });
    };

    const getShippingMethod = async (id: number | string) => {
        return await $fetch(`/shipping-methods/${id}`, {
            baseURL: config.public.apiBase,
            headers: { Authorization: `Bearer ${token}` },
        });
    };

    const createShippingMethod = async (data: any) => {
        return await $fetch('/shipping-methods', {
            method: 'POST',
            baseURL: config.public.apiBase,
            headers: { Authorization: `Bearer ${token}` },
            body: data,
        });
    };

    const updateShippingMethod = async (id: number | string, data: any) => {
        return await $fetch(`/shipping-methods/${id}`, {
            method: 'PUT',
            baseURL: config.public.apiBase,
            headers: { Authorization: `Bearer ${token}` },
            body: data,
        });
    };

    const deleteShippingMethod = async (id: number | string) => {
        return await $fetch(`/shipping-methods/${id}`, {
            method: 'DELETE',
            baseURL: config.public.apiBase,
            headers: { Authorization: `Bearer ${token}` },
        });
    };

    return {
        getShippingMethods,
        getShippingMethod,
        createShippingMethod,
        updateShippingMethod,
        deleteShippingMethod,
    };
};
