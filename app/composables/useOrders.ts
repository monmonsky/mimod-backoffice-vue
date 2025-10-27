import type {
    OrdersListResponse,
    OrderDetailResponse,
    OrderCreateResponse,
    OrderUpdateResponse,
    OrderDeleteResponse,
    CreateOrderData,
} from "~/types/orders";
import type { PaginationParams } from "./usePagination";

export const useOrders = () => {
    const config = useRuntimeConfig();
    const authStore = useAuthStore();
    const { buildPaginationParams } = usePagination();

    const getOrders = (params?: ComputedRef<Record<string, any>> | Record<string, any>, options?: { watch?: any[] }) => {
        return useAsyncData<OrdersListResponse>(
            "orders",
            () => {
                // Get params value (handle both ComputedRef and plain object)
                const paramsValue = isRef(params) ? params.value : params;

                return $fetch("/orders", {
                    baseURL: config.public.apiBase,
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                    },
                    params: paramsValue,
                });
            },
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

    const updateOrderStatus = async (id: number, statusOrData: string | { status: string; notes?: string }) => {
        // Handle both string and object parameters
        const body = typeof statusOrData === 'string'
            ? { status: statusOrData }
            : statusOrData;

        return await $fetch<OrderUpdateResponse>(`/orders/${id}/status`, {
            method: "PATCH",
            baseURL: config.public.apiBase,
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
            body,
        });
    };

    const updatePaymentStatus = async (id: number, paymentStatusOrData: string | { payment_status: string; notes?: string }) => {
        // Handle both string and object parameters
        const body = typeof paymentStatusOrData === 'string'
            ? { payment_status: paymentStatusOrData }
            : paymentStatusOrData;

        return await $fetch<OrderUpdateResponse>(`/orders/${id}/payment`, {
            method: "PATCH",
            baseURL: config.public.apiBase,
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
            body,
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
