export const usePaymentMethods = () => {
    const config = useRuntimeConfig();
    const { token } = useAuthStore();

    const getPaymentMethods = async (params?: any) => {
        return await $fetch('/payment-methods', {
            baseURL: config.public.apiBase,
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params,
        });
    };

    const getPaymentMethod = async (id: number | string) => {
        return await $fetch(`/payment-methods/${id}`, {
            baseURL: config.public.apiBase,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    };

    const createPaymentMethod = async (data: any) => {
        return await $fetch('/payment-methods', {
            method: 'POST',
            baseURL: config.public.apiBase,
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: data,
        });
    };

    const updatePaymentMethod = async (id: number | string, data: any) => {
        return await $fetch(`/payment-methods/${id}`, {
            method: 'PUT',
            baseURL: config.public.apiBase,
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: data,
        });
    };

    const deletePaymentMethod = async (id: number | string) => {
        return await $fetch(`/payment-methods/${id}`, {
            method: 'DELETE',
            baseURL: config.public.apiBase,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    };

    return {
        getPaymentMethods,
        getPaymentMethod,
        createPaymentMethod,
        updatePaymentMethod,
        deletePaymentMethod,
    };
};
