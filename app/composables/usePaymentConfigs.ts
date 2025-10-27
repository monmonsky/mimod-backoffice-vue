export const usePaymentConfigs = () => {
    const config = useRuntimeConfig();
    const { token } = useAuthStore();

    const getPaymentConfigs = async (params?: any) => {
        return await $fetch('/payment-method-configs', {
            baseURL: config.public.apiBase,
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params,
        });
    };

    const getPaymentConfig = async (id: number | string) => {
        return await $fetch(`/payment-method-configs/${id}`, {
            baseURL: config.public.apiBase,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    };

    const createPaymentConfig = async (data: any) => {
        return await $fetch('/payment-method-configs', {
            method: 'POST',
            baseURL: config.public.apiBase,
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: data,
        });
    };

    const updatePaymentConfig = async (id: number | string, data: any) => {
        return await $fetch(`/payment-method-configs/${id}`, {
            method: 'PUT',
            baseURL: config.public.apiBase,
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: data,
        });
    };

    const deletePaymentConfig = async (id: number | string) => {
        return await $fetch(`/payment-method-configs/${id}`, {
            method: 'DELETE',
            baseURL: config.public.apiBase,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    };

    const deleteConfigItem = async (id: number | string, key: string) => {
        return await $fetch(`/payment-method-configs/${id}/items/${key}`, {
            method: 'DELETE',
            baseURL: config.public.apiBase,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    };

    return {
        getPaymentConfigs,
        getPaymentConfig,
        createPaymentConfig,
        updatePaymentConfig,
        deletePaymentConfig,
        deleteConfigItem,
    };
};
