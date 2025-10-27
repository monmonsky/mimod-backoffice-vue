<script setup lang="ts">
import { formatPrice, formatDate } from "~/utils/formatters";
import { getOrderStatusBadgeClass, getPaymentStatusBadgeClass } from "~/utils/statusHelpers";

definePageMeta({
    layout: "admin",
    middleware: "auth",
});

const route = useRoute();
const orderId = Number(route.params.id);

// Set page title
const { setPageTitleFromMenu } = useAdminMenu();
setPageTitleFromMenu();

// Fetch order detail
const { data: orderResponse, pending: loading, refresh } = await useAsyncData(
    `order-${orderId}`,
    () =>
        $fetch(`/orders/${orderId}`, {
            baseURL: useRuntimeConfig().public.apiBase,
            headers: {
                Authorization: `Bearer ${useAuthStore().token}`,
            },
        })
);

const order = computed(() => (orderResponse.value as any)?.data || {});
</script>

<template>
    <div class="space-y-6 p-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
                <NuxtLink to="/orders" class="btn btn-ghost btn-sm">
                    <span class="iconify lucide--arrow-left size-4" />
                    Back to Orders
                </NuxtLink>
                <div>
                    <h1 class="text-2xl font-bold">Order Details</h1>
                    <p class="text-base-content/60 mt-1 text-sm">View and manage order information</p>
                </div>
            </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex items-center justify-center py-12">
            <span class="loading loading-spinner loading-lg"></span>
        </div>

        <!-- Content -->
        <div v-else class="space-y-6">
            <!-- Order Header Card -->
            <div class="card bg-base-100 shadow">
                <div class="card-body">
                    <div class="flex items-start justify-between">
                        <div>
                            <p class="text-3xl font-bold">{{ order.order_number }}</p>
                            <p class="text-base-content/60 mt-2 text-sm">
                                <span class="iconify lucide--calendar size-3.5" />
                                {{ formatDate(order.created_at, 'datetime') }}
                            </p>
                        </div>
                        <div class="flex gap-2">
                            <span :class="['badge badge-lg', getOrderStatusBadgeClass(order.status)]">
                                {{ order.status }}
                            </span>
                            <span :class="['badge badge-lg', getPaymentStatusBadgeClass(order.payment_status)]">
                                {{ order.payment_status }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <!-- Left Column (2/3) -->
                <div class="space-y-6 lg:col-span-2">
                    <!-- Order Items -->
                    <div class="card bg-base-100 shadow">
                        <div class="card-body">
                            <h4 class="card-title text-base flex items-center gap-2">
                                <span class="iconify lucide--package size-5" />
                                Order Items
                            </h4>
                            <div class="overflow-x-auto mt-4">
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Variant</th>
                                            <th class="text-right">Price</th>
                                            <th class="text-center">Qty</th>
                                            <th class="text-right">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="item in order.items" :key="item.id">
                                            <td>
                                                <div class="font-medium">{{ item.product_name }}</div>
                                            </td>
                                            <td class="text-sm text-base-content/60">
                                                {{ item.variant_name || '-' }}
                                            </td>
                                            <td class="text-right">{{ formatPrice(item.price) }}</td>
                                            <td class="text-center">{{ item.quantity }}</td>
                                            <td class="text-right font-medium">{{ formatPrice(item.subtotal) }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <!-- Customer & Shipping Info -->
                    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div class="card bg-base-100 shadow">
                            <div class="card-body">
                                <h4 class="card-title text-base flex items-center gap-2">
                                    <span class="iconify lucide--user size-5" />
                                    Customer Information
                                </h4>
                                <div class="space-y-2 mt-4">
                                    <p class="font-medium text-lg">{{ order.customer?.name || 'N/A' }}</p>
                                    <p class="text-base-content/60 flex items-center gap-2">
                                        <span class="iconify lucide--mail size-4" />
                                        {{ order.customer?.email || '-' }}
                                    </p>
                                    <p class="text-base-content/60 flex items-center gap-2">
                                        <span class="iconify lucide--phone size-4" />
                                        {{ order.customer?.phone || '-' }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="card bg-base-100 shadow">
                            <div class="card-body">
                                <h4 class="card-title text-base flex items-center gap-2">
                                    <span class="iconify lucide--map-pin size-5" />
                                    Shipping Address
                                </h4>
                                <div class="mt-4 text-sm">
                                    <p class="font-medium">{{ order.shipping_phone || '-' }}</p>
                                    <p class="text-base-content/60 mt-2">
                                        {{ order.shipping_address || '-' }}<br />
                                        {{ order.shipping_city || '' }}{{ order.shipping_city && order.shipping_province ? ', ' : '' }}{{ order.shipping_province || '' }}<br />
                                        {{ order.shipping_postal_code || '' }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Column (1/3) -->
                <div class="space-y-6">
                    <!-- Order Summary -->
                    <div class="card bg-base-100 shadow">
                        <div class="card-body">
                            <h4 class="card-title text-base">Order Summary</h4>
                            <div class="space-y-3 mt-4">
                                <div class="flex justify-between text-sm">
                                    <span class="text-base-content/60">Subtotal</span>
                                    <span class="font-medium">{{ formatPrice(order.subtotal || 0) }}</span>
                                </div>
                                <div class="flex justify-between text-sm">
                                    <span class="text-base-content/60">Shipping</span>
                                    <span class="font-medium">{{ formatPrice(order.shipping_cost || 0) }}</span>
                                </div>
                                <div class="flex justify-between text-sm" v-if="order.tax_amount > 0">
                                    <span class="text-base-content/60">Tax</span>
                                    <span class="font-medium">{{ formatPrice(order.tax_amount || 0) }}</span>
                                </div>
                                <div class="flex justify-between text-sm" v-if="order.discount_amount > 0">
                                    <span class="text-base-content/60">Discount</span>
                                    <span class="font-medium text-error">-{{ formatPrice(order.discount_amount || 0) }}</span>
                                </div>
                                <div class="divider my-2"></div>
                                <div class="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span class="text-primary">{{ formatPrice(order.total_amount || 0) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Payment Information -->
                    <div class="card bg-base-100 shadow">
                        <div class="card-body">
                            <h4 class="card-title text-base flex items-center gap-2">
                                <span class="iconify lucide--credit-card size-5" />
                                Payment
                            </h4>
                            <div class="space-y-2 mt-4">
                                <div class="flex justify-between text-sm">
                                    <span class="text-base-content/60">Method</span>
                                    <span class="font-medium">{{ order.payment_method || 'N/A' }}</span>
                                </div>
                                <div class="flex justify-between text-sm">
                                    <span class="text-base-content/60">Status</span>
                                    <span :class="['badge badge-sm', getPaymentStatusBadgeClass(order.payment_status)]">
                                        {{ order.payment_status }}
                                    </span>
                                </div>
                                <div class="flex justify-between text-sm" v-if="order.paid_at">
                                    <span class="text-base-content/60">Paid at</span>
                                    <span>{{ formatDate(order.paid_at, 'datetime') }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Shipping Information -->
                    <div class="card bg-base-100 shadow">
                        <div class="card-body">
                            <h4 class="card-title text-base flex items-center gap-2">
                                <span class="iconify lucide--truck size-5" />
                                Shipping
                            </h4>
                            <div class="space-y-2 mt-4">
                                <div class="flex justify-between text-sm">
                                    <span class="text-base-content/60">Courier</span>
                                    <span class="font-medium">{{ order.courier || 'N/A' }}</span>
                                </div>
                                <div class="flex justify-between text-sm">
                                    <span class="text-base-content/60">Cost</span>
                                    <span class="font-medium">{{ formatPrice(order.shipping_cost || 0) }}</span>
                                </div>
                                <div class="flex justify-between text-sm" v-if="order.tracking_number">
                                    <span class="text-base-content/60">Tracking</span>
                                    <span class="font-medium">{{ order.tracking_number }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
