import type {
    OrdersListResponse,
    OrderDetailResponse,
    OrderCreateResponse,
    OrderUpdateResponse,
    OrderDeleteResponse,
    CreateOrderData,
} from "~/types/orders";

export const useOrders = () => {
    const config = useRuntimeConfig();
    const authStore = useAuthStore();

    const getOrders = (params?: Record<string, any>, options?: { watch?: any[] }) => {
        return useAsyncData<OrdersListResponse>(
            "orders",
            () =>
                $fetch("/orders", {
                    baseURL: config.public.apiBase,
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                    },
                    params,
                }),
            {
                watch: options?.watch || [],
            },
        );
    };

    const getOrder = (id: number) => {
        return useAsyncData<OrderDetailResponse>(`order-${id}`, () =>
            $fetch(`/orders/${id}`, {
                baseURL: config.public.apiBase,
                headers: {
                    Authorization: `Bearer ${authStore.token}`,
                },
            }),
        );
    };

    const createOrder = async (data: CreateOrderData) => {
        return await $fetch<OrderCreateResponse>("/orders", {
            method: "POST",
            baseURL: config.public.apiBase,
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
            body: data,
        });
    };

    const updateOrder = async (id: number, data: Partial<CreateOrderData>) => {
        return await $fetch<OrderUpdateResponse>(`/orders/${id}`, {
            method: "PUT",
            baseURL: config.public.apiBase,
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
            body: data,
        });
    };

    const updateOrderStatus = async (id: number, status: string) => {
        return await $fetch<OrderUpdateResponse>(`/orders/${id}/status`, {
            method: "PATCH",
            baseURL: config.public.apiBase,
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
            body: { status },
        });
    };

    const updatePaymentStatus = async (id: number, payment_status: string) => {
        return await $fetch<OrderUpdateResponse>(`/orders/${id}/payment`, {
            method: "PATCH",
            baseURL: config.public.apiBase,
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
            body: { payment_status },
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

    const deleteOrder = async (id: number) => {
        return await $fetch<OrderDeleteResponse>(`/orders/${id}`, {
            method: "DELETE",
            baseURL: config.public.apiBase,
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
        });
    };

    return {
        getOrders,
        getOrder,
        createOrder,
        updateOrder,
        updateOrderStatus,
        updatePaymentStatus,
        sendInvoiceEmail,
        deleteOrder,
    };
};
