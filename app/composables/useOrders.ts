export const useOrders = () => {
    const config = useRuntimeConfig();
    const authStore = useAuthStore();

    const getOrders = (params?: any, options?: { watch?: any[] }) => {
        return useAsyncData(
            "orders",
            () => {
                const queryParams = typeof params === 'function' ? params() : unref(params);
                return $fetch("/orders", {
                    baseURL: config.public.apiBase,
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                    },
                    params: queryParams,
                });
            },
            {
                watch: options?.watch || [],
            },
        );
    };

    const getOrderDetail = (id: number) => {
        return useAsyncData(`order-${id}`, () =>
            $fetch(`/orders/${id}`, {
                baseURL: config.public.apiBase,
                headers: {
                    Authorization: `Bearer ${authStore.token}`,
                },
            }),
        );
    };

    const getCustomerOrders = (customerId: number) => {
        return useAsyncData(`customer-orders-${customerId}`, () =>
            $fetch(`/orders/customer/${customerId}`, {
                baseURL: config.public.apiBase,
                headers: {
                    Authorization: `Bearer ${authStore.token}`,
                },
            }),
        );
    };

    const updateOrderStatus = async (id: number, data: { status: string; notes?: string }) => {
        return await $fetch(`/orders/${id}/status`, {
            method: "PUT",
            baseURL: config.public.apiBase,
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
            body: data,
        });
    };

    const updatePaymentStatus = async (id: number, data: { payment_status: string; notes?: string }) => {
        return await $fetch(`/orders/${id}/payment-status`, {
            method: "PUT",
            baseURL: config.public.apiBase,
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
            body: data,
        });
    };

    const sendInvoiceEmail = async (id: number) => {
        return await $fetch(`/orders/${id}/send-invoice`, {
            method: "POST",
            baseURL: config.public.apiBase,
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
        });
    };

    return {
        getOrders,
        getOrderDetail,
        getCustomerOrders,
        updateOrderStatus,
        updatePaymentStatus,
        sendInvoiceEmail,
    };
};
