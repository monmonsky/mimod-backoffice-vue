<script setup lang="ts">
// Dashboard Recent Orders Component
const { getRecentOrders } = useDashboard();
const { data: response, pending } = await getRecentOrders(10);

const orders = computed(() => (response.value as any)?.data || []);

const formatCurrency = (value: number | string) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(Number(value));
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};
</script>

<template>
    <div>
        <div v-if="pending" class="flex items-center justify-center py-8">
            <span class="loading loading-spinner loading-md"></span>
        </div>

        <div v-else-if="orders.length === 0" class="flex flex-col items-center justify-center py-12">
            <span class="iconify lucide--inbox size-16 mb-3 text-base-content/40" />
            <p class="text-sm font-medium">No recent orders</p>
            <p class="text-xs text-base-content/60 mt-1">Orders will appear here once customers place them</p>
        </div>

        <div v-else class="overflow-x-auto">
            <table class="table table-zebra">
                <thead>
                    <tr>
                        <th>Order</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Payment</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="order in orders" :key="order.id">
                        <td>
                            <div class="flex items-center gap-2">
                                <span class="iconify lucide--shopping-bag text-primary" />
                                <span class="font-medium">#{{ order.order_number }}</span>
                            </div>
                        </td>
                        <td>
                            <div>
                                <div class="font-medium">{{ order.customer?.name || 'Guest' }}</div>
                                <div class="text-xs text-base-content/60">{{ order.customer?.email || '-' }}</div>
                            </div>
                        </td>
                        <td>
                            <div class="badge badge-sm badge-ghost">
                                {{ order.items_count || 0 }} item{{ order.items_count > 1 ? 's' : '' }}
                            </div>
                        </td>
                        <td>
                            <span class="font-semibold">{{ formatCurrency(order.total_amount) }}</span>
                        </td>
                        <td>
                            <div :class="['badge badge-sm', getPaymentStatusBadgeClass(order.payment_status)]">
                                {{ order.payment_status }}
                            </div>
                        </td>
                        <td>
                            <div :class="['badge badge-sm', getOrderStatusBadgeClass(order.status)]">
                                {{ order.status }}
                            </div>
                        </td>
                        <td>
                            <span class="text-xs text-base-content/60">{{ formatDate(order.created_at) }}</span>
                        </td>
                        <td>
                            <NuxtLink :to="`/orders/${order.id}/show`" class="btn btn-ghost btn-xs">
                                <span class="iconify lucide--eye size-4" />
                            </NuxtLink>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
