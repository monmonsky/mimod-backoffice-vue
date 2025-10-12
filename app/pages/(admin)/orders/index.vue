<script setup lang="ts">
import OrdersTable from "~/components/orders/OrdersTable.vue";

definePageMeta({
    layout: "admin",
    middleware: "auth",
});

useHead({
    title: "Orders",
});

// Statistics will be passed from OrdersTable via emit
const statistics = ref({
    total_orders: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    completed: 0,
    cancelled: 0,
});

const loading = ref(true);

const handleStatisticsUpdate = (stats: any) => {
    statistics.value = stats;
    loading.value = false;
};
</script>

<template>
    <div class="space-y-6 p-6">
        <div>
            <h1 class="text-2xl font-bold">Orders Management</h1>
            <p class="text-base-content/60 mt-1 text-sm">Manage and track all customer orders</p>
        </div>

        <!-- Statistics Cards -->
        <div v-if="!loading" class="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
            <div class="card bg-base-100 shadow">
                <div class="card-body p-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-base-content/60 text-xs">Total Orders</div>
                            <div class="text-2xl font-bold">{{ statistics.total_orders || 0 }}</div>
                        </div>
                        <span class="iconify lucide--shopping-cart size-8 text-base-content/20" />
                    </div>
                </div>
            </div>
            <div class="card bg-warning/10 shadow">
                <div class="card-body p-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-warning text-xs">Pending</div>
                            <div class="text-2xl font-bold text-warning">{{ statistics.pending || 0 }}</div>
                        </div>
                        <span class="iconify lucide--clock size-8 text-warning/20" />
                    </div>
                </div>
            </div>
            <div class="card bg-info/10 shadow">
                <div class="card-body p-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-info text-xs">Processing</div>
                            <div class="text-2xl font-bold text-info">{{ statistics.processing || 0 }}</div>
                        </div>
                        <span class="iconify lucide--package-check size-8 text-info/20" />
                    </div>
                </div>
            </div>
            <div class="card bg-primary/10 shadow">
                <div class="card-body p-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-primary text-xs">Shipped</div>
                            <div class="text-2xl font-bold text-primary">{{ statistics.shipped || 0 }}</div>
                        </div>
                        <span class="iconify lucide--truck size-8 text-primary/20" />
                    </div>
                </div>
            </div>
            <div class="card bg-success/10 shadow">
                <div class="card-body p-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-success text-xs">Completed</div>
                            <div class="text-2xl font-bold text-success">{{ statistics.completed || 0 }}</div>
                        </div>
                        <span class="iconify lucide--check-circle size-8 text-success/20" />
                    </div>
                </div>
            </div>
            <div class="card bg-error/10 shadow">
                <div class="card-body p-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-error text-xs">Cancelled</div>
                            <div class="text-2xl font-bold text-error">{{ statistics.cancelled || 0 }}</div>
                        </div>
                        <span class="iconify lucide--x-circle size-8 text-error/20" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Orders Table Component -->
        <ClientOnly>
            <OrdersTable @update:statistics="handleStatisticsUpdate" />
        </ClientOnly>
    </div>
</template>
