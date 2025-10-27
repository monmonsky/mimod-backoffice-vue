export const useShippingConfigs = () => {
    const config = useRuntimeConfig();
    const { token } = useAuthStore();

    const getShippingConfigs = async (params?: any) => {
        return await $fetch('/shipping-method-configs', {
            baseURL: config.public.apiBase,
            headers: { Authorization: `Bearer ${token}` },
            params,
        });
    };

    const getShippingConfig = async (id: number | string) => {
        return await $fetch(`/shipping-method-configs/${id}`, {
            baseURL: config.public.apiBase,
            headers: { Authorization: `Bearer ${token}` },
        });
    };

    const createShippingConfig = async (data: any) => {
        return await $fetch('/shipping-method-configs', {
            method: 'POST',
            baseURL: config.public.apiBase,
            headers: { Authorization: `Bearer ${token}` },
            body: data,
        });
    };

    const updateShippingConfig = async (id: number | string, data: any) => {
        return await $fetch(`/shipping-method-configs/${id}`, {
            method: 'PUT',
            baseURL: config.public.apiBase,
            headers: { Authorization: `Bearer ${token}` },
            body: data,
        });
    };

    return {
        getShippingConfigs,
        getShippingConfig,
        createShippingConfig,
        updateShippingConfig,
    };
};
