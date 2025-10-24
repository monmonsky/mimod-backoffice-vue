<script setup lang="ts">
definePageMeta({
    layout: "admin",
    middleware: "auth",
});

// Set page title from admin menu
const { setPageTitleFromMenu } = useAdminMenu();
setPageTitleFromMenu();

const { getStatistics } = useDashboard();

const { data: statsResponse, pending: loadingStats } = await getStatistics();
const stats = computed(() => (statsResponse.value as any)?.data || {});

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(value);
};

const formatNumber = (value: number) => {
    return new Intl.NumberFormat("id-ID").format(value);
};
</script>

<template>
    <div class="space-y-6 p-6">
        <div>
            <h1 class="text-2xl font-bold">Dashboard</h1>
            <p class="text-base-content/60 mt-1 text-sm">Welcome back! Here's your business overview</p>
        </div>

        <!-- Statistics Cards -->
        <div v-if="loadingStats" class="flex items-center justify-center py-12">
            <span class="loading loading-spinner loading-lg"></span>
        </div>

        <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            <!-- Total Revenue -->
            <div class="card bg-gradient-to-br from-primary to-primary/80 text-primary-content shadow-lg">
                <div class="card-body">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-primary-content/80 text-sm">Total Revenue</p>
                            <p class="mt-2 text-3xl font-bold">{{ formatCurrency(stats.total_revenue || 0) }}</p>
                            <p class="text-primary-content/70 mt-2 text-xs">
                                <span v-if="stats.revenue_growth >= 0" class="text-success-content">
                                    ↑ {{ stats.revenue_growth?.toFixed(1) }}%
                                </span>
                                <span v-else class="text-error-content">↓ {{ Math.abs(stats.revenue_growth || 0).toFixed(1) }}%</span>
                                from last month
                            </p>
                        </div>
                        <span class="iconify lucide--trending-up size-12 opacity-50" />
                    </div>
                </div>
            </div>

            <!-- Total Orders -->
            <div class="card bg-gradient-to-br from-secondary to-secondary/80 text-secondary-content shadow-lg">
                <div class="card-body">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-secondary-content/80 text-sm">Total Orders</p>
                            <p class="mt-2 text-3xl font-bold">{{ formatNumber(stats.total_orders || 0) }}</p>
                            <p class="text-secondary-content/70 mt-2 text-xs">
                                <span v-if="stats.orders_growth >= 0" class="text-success-content">
                                    ↑ {{ stats.orders_growth?.toFixed(1) }}%
                                </span>
                                <span v-else class="text-error-content">↓ {{ Math.abs(stats.orders_growth || 0).toFixed(1) }}%</span>
                                from last month
                            </p>
                        </div>
                        <span class="iconify lucide--shopping-cart size-12 opacity-50" />
                    </div>
                </div>
            </div>

            <!-- Total Products -->
            <div class="card bg-gradient-to-br from-accent to-accent/80 text-accent-content shadow-lg">
                <div class="card-body">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-accent-content/80 text-sm">Total Products</p>
                            <p class="mt-2 text-3xl font-bold">{{ formatNumber(stats.total_products || 0) }}</p>
                            <p class="text-accent-content/70 mt-2 text-xs">
                                {{ formatNumber(stats.active_products || 0) }} active products
                            </p>
                        </div>
                        <span class="iconify lucide--package size-12 opacity-50" />
                    </div>
                </div>
            </div>

            <!-- Total Customers -->
            <div class="card bg-gradient-to-br from-info to-info/80 text-info-content shadow-lg">
                <div class="card-body">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-info-content/80 text-sm">Total Customers</p>
                            <p class="mt-2 text-3xl font-bold">{{ formatNumber(stats.total_customers || 0) }}</p>
                            <p class="text-info-content/70 mt-2 text-xs">
                                <span v-if="stats.customers_growth >= 0" class="text-success-content">
                                    ↑ {{ stats.customers_growth?.toFixed(1) }}%
                                </span>
                                <span v-else class="text-error-content">
                                    ↓ {{ Math.abs(stats.customers_growth || 0).toFixed(1) }}%
                                </span>
                                from last month
                            </p>
                        </div>
                        <span class="iconify lucide--users size-12 opacity-50" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Additional Stats Row -->
        <div v-if="!loadingStats" class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            <!-- Pending Orders -->
            <div class="card bg-base-100 shadow">
                <div class="card-body">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-base-content/60 text-sm">Pending Orders</p>
                            <p class="mt-2 text-2xl font-bold">{{ formatNumber(stats.pending_orders || 0) }}</p>
                        </div>
                        <span class="iconify lucide--clock size-8 text-warning" />
                    </div>
                </div>
            </div>

            <!-- Processing Orders -->
            <div class="card bg-base-100 shadow">
                <div class="card-body">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-base-content/60 text-sm">Processing</p>
                            <p class="mt-2 text-2xl font-bold">{{ formatNumber(stats.processing_orders || 0) }}</p>
                        </div>
                        <span class="iconify lucide--package-check size-8 text-info" />
                    </div>
                </div>
            </div>

            <!-- Completed Orders -->
            <div class="card bg-base-100 shadow">
                <div class="card-body">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-base-content/60 text-sm">Completed</p>
                            <p class="mt-2 text-2xl font-bold">{{ formatNumber(stats.completed_orders || 0) }}</p>
                        </div>
                        <span class="iconify lucide--check-circle size-8 text-success" />
                    </div>
                </div>
            </div>

            <!-- Low Stock Products -->
            <div class="card bg-base-100 shadow">
                <div class="card-body">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-base-content/60 text-sm">Low Stock Items</p>
                            <p class="mt-2 text-2xl font-bold">{{ formatNumber(stats.low_stock_products || 0) }}</p>
                        </div>
                        <span class="iconify lucide--alert-triangle size-8 text-error" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Charts and Tables Section -->
        <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <!-- Sales Chart -->
            <div class="card bg-base-100 shadow">
                <div class="card-body">
                    <h3 class="card-title">Sales Overview</h3>
                    <DashboardSalesChart />
                </div>
            </div>

            <!-- Top Products -->
            <div class="card bg-base-100 shadow">
                <div class="card-body">
                    <h3 class="card-title">Top Selling Products</h3>
                    <DashboardTopProducts />
                </div>
            </div>
        </div>

        <!-- Recent Orders -->
        <div class="card bg-base-100 shadow">
            <div class="card-body">
                <div class="flex items-center justify-between">
                    <h3 class="card-title">Recent Orders</h3>
                    <NuxtLink to="/orders" class="btn btn-ghost btn-sm gap-2">
                        View All
                        <span class="iconify lucide--arrow-right size-4" />
                    </NuxtLink>
                </div>
                <DashboardRecentOrders />
            </div>
        </div>
    </div>
</template>
