import { defineStore } from "pinia";
import type { OrdersListResponse } from "~/types/orders";

export interface OrderCounts {
    unpaid: number;
    readyToShip: number;
    shipped: number;
    actionRequired: number;
}

export const useOrderCountsStore = defineStore("orderCounts", () => {
    const config = useRuntimeConfig();
    const authStore = useAuthStore();

    const counts = ref<OrderCounts>({
        unpaid: 0,
        readyToShip: 0,
        shipped: 0,
        actionRequired: 0,
    });

    const loading = ref(false);

    const fetchOrderCounts = async () => {
        if (!authStore.token) return;

        loading.value = true;
        try {
            // Fetch order statistics - only need one API call
            const response = await $fetch<OrdersListResponse>("/orders", {
                baseURL: config.public.apiBase,
                headers: {
                    Authorization: `Bearer ${authStore.token}`,
                },
                params: {
                    per_page: 1, // We only need the statistics
                },
            });

            const stats = response.data?.statistics;

            if (stats) {
                // pending_count includes both unpaid and processing orders that need action
                counts.value.unpaid = stats.pending_count || 0;
                // processing_count is "Ready to Ship" (paid and ready to process)
                counts.value.readyToShip = stats.processing_count || 0;
                counts.value.shipped = stats.shipped_count || 0;
                counts.value.actionRequired = counts.value.unpaid + counts.value.readyToShip;
            }
        } catch (error) {
            console.error("Error fetching order counts:", error);
        } finally {
            loading.value = false;
        }
    };

    return {
        counts,
        loading,
        fetchOrderCounts,
    };
});
