export const useDashboard = () => {
    const config = useRuntimeConfig();
    const authStore = useAuthStore();

    const getStatistics = () => {
        return useAsyncData("dashboard-statistics", () =>
            $fetch("/dashboard/statistics", {
                baseURL: config.public.apiBase,
                headers: {
                    Authorization: `Bearer ${authStore.token}`,
                },
            }),
        );
    };

    const getSalesChart = (period: "week" | "month" | "year" = "week") => {
        return useAsyncData(
            `dashboard-sales-${period}`,
            () =>
                $fetch("/dashboard/sales-chart", {
                    baseURL: config.public.apiBase,
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                    },
                    params: { period },
                }),
            {
                watch: [() => period],
            },
        );
    };

    const getRecentOrders = (limit: number = 10) => {
        return useAsyncData("dashboard-recent-orders", () =>
            $fetch("/dashboard/recent-orders", {
                baseURL: config.public.apiBase,
                headers: {
                    Authorization: `Bearer ${authStore.token}`,
                },
                params: { limit },
            }),
        );
    };

    const getTopProducts = (period: "week" | "month" | "year" | "all" = "month", limit: number = 10) => {
        return useAsyncData(`dashboard-top-products-${period}`, () =>
            $fetch("/dashboard/top-products", {
                baseURL: config.public.apiBase,
                headers: {
                    Authorization: `Bearer ${authStore.token}`,
                },
                params: { period, limit },
            }),
        );
    };

    return {
        getStatistics,
        getSalesChart,
        getRecentOrders,
        getTopProducts,
    };
};
