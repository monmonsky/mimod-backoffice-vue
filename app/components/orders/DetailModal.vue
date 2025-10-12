<script setup lang="ts">
const props = defineProps<{
    orderId: number;
}>();

const emit = defineEmits<{
    close: [];
}>();

const { getOrderDetail } = useOrders();

const { data: orderResponse, pending: loading } = await getOrderDetail(props.orderId);
const order = computed(() => (orderResponse.value as any)?.data || {});

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(value);
};

const formatDate = (date: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
        pending: "badge-warning",
        processing: "badge-info",
        shipped: "badge-primary",
        completed: "badge-success",
        cancelled: "badge-error",
    };
    return colors[status] || "badge-ghost";
};
</script>

<template>
    <dialog class="modal modal-open">
        <div class="modal-box max-w-4xl">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="emit('close')">✕</button>

            <h3 class="flex items-center gap-2 text-lg font-bold">
                <span class="iconify lucide--shopping-cart size-5 text-primary" />
                Order Details
            </h3>

            <div v-if="loading" class="flex items-center justify-center py-12">
                <span class="loading loading-spinner loading-lg"></span>
            </div>

            <div v-else class="mt-4 space-y-6">
                <!-- Order Header -->
                <div class="flex items-start justify-between">
                    <div>
                        <p class="text-2xl font-bold">{{ order.order_number }}</p>
                        <p class="text-base-content/60 mt-1 text-sm">{{ formatDate(order.created_at) }}</p>
                    </div>
                    <div class="flex gap-2">
                        <span :class="['badge badge-lg', getStatusColor(order.status)]">{{ order.status }}</span>
                        <span
                            :class="[
                                'badge badge-lg',
                                order.payment_status === 'paid' ? 'badge-success' : 'badge-warning',
                            ]">
                            {{ order.payment_status }}
                        </span>
                    </div>
                </div>

                <!-- Customer & Shipping Info -->
                <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div class="card border border-base-300 bg-base-100">
                        <div class="card-body">
                            <h4 class="font-semibold flex items-center gap-2">
                                <span class="iconify lucide--user size-4" />
                                Customer Information
                            </h4>
                            <div class="space-y-1 text-sm">
                                <p class="font-medium">{{ order.customer?.name || 'N/A' }}</p>
                                <p class="text-base-content/60">{{ order.customer?.email || '' }}</p>
                                <p class="text-base-content/60">{{ order.customer?.phone || '' }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="card border border-base-300 bg-base-100">
                        <div class="card-body">
                            <h4 class="font-semibold flex items-center gap-2">
                                <span class="iconify lucide--map-pin size-4" />
                                Shipping Address
                            </h4>
                            <div class="text-sm">
                                <p class="text-base-content/60">{{ order.shipping_phone || '' }}</p>
                                <p class="text-base-content/60 mt-1">
                                    {{ order.shipping_address || '' }}<br />
                                    {{ order.shipping_city || '' }},
                                    {{ order.shipping_province || '' }}<br />
                                    {{ order.shipping_postal_code || '' }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Order Items -->
                <div>
                    <h4 class="font-semibold mb-3 flex items-center gap-2">
                        <span class="iconify lucide--package size-4" />
                        Order Items
                    </h4>
                    <div class="overflow-x-auto">
                        <table class="table table-sm">
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
                                    <td>{{ item.product_name }}</td>
                                    <td class="text-sm text-base-content/60">
                                        {{ item.variant_name || '-' }}
                                    </td>
                                    <td class="text-right">{{ formatCurrency(item.price) }}</td>
                                    <td class="text-center">{{ item.quantity }}</td>
                                    <td class="text-right font-medium">{{ formatCurrency(item.subtotal) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Order Summary -->
                <div class="card border border-base-300 bg-base-100">
                    <div class="card-body">
                        <h4 class="font-semibold mb-3">Order Summary</h4>
                        <div class="space-y-2">
                            <div class="flex justify-between text-sm">
                                <span class="text-base-content/60">Subtotal</span>
                                <span>{{ formatCurrency(order.subtotal || 0) }}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-base-content/60">Shipping</span>
                                <span>{{ formatCurrency(order.shipping_cost || 0) }}</span>
                            </div>
                            <div class="flex justify-between text-sm" v-if="order.tax_amount > 0">
                                <span class="text-base-content/60">Tax</span>
                                <span>{{ formatCurrency(order.tax_amount || 0) }}</span>
                            </div>
                            <div class="flex justify-between text-sm" v-if="order.discount_amount > 0">
                                <span class="text-base-content/60">Discount</span>
                                <span class="text-error">-{{ formatCurrency(order.discount_amount || 0) }}</span>
                            </div>
                            <div class="divider my-2"></div>
                            <div class="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>{{ formatCurrency(order.total_amount || 0) }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Payment & Shipping Info -->
                <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div class="card border border-base-300 bg-base-100">
                        <div class="card-body">
                            <h4 class="font-semibold flex items-center gap-2">
                                <span class="iconify lucide--credit-card size-4" />
                                Payment Information
                            </h4>
                            <div class="space-y-1 text-sm">
                                <div class="flex justify-between">
                                    <span class="text-base-content/60">Method:</span>
                                    <span class="font-medium">{{ order.payment_method || 'N/A' }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-base-content/60">Status:</span>
                                    <span
                                        :class="[
                                            'badge badge-sm',
                                            order.payment_status === 'paid' ? 'badge-success' : 'badge-warning',
                                        ]">
                                        {{ order.payment_status }}
                                    </span>
                                </div>
                                <div class="flex justify-between" v-if="order.paid_at">
                                    <span class="text-base-content/60">Paid at:</span>
                                    <span>{{ formatDate(order.paid_at) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card border border-base-300 bg-base-100">
                        <div class="card-body">
                            <h4 class="font-semibold flex items-center gap-2">
                                <span class="iconify lucide--truck size-4" />
                                Shipping Information
                            </h4>
                            <div class="space-y-1 text-sm">
                                <div class="flex justify-between">
                                    <span class="text-base-content/60">Courier:</span>
                                    <span class="font-medium">{{ order.courier || 'N/A' }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-base-content/60">Cost:</span>
                                    <span>{{ formatCurrency(order.shipping_cost || 0) }}</span>
                                </div>
                                <div class="flex justify-between" v-if="order.tracking_number">
                                    <span class="text-base-content/60">Tracking:</span>
                                    <span class="font-mono text-xs">{{ order.tracking_number }}</span>
                                </div>
                                <div class="flex justify-between" v-if="order.shipped_at">
                                    <span class="text-base-content/60">Shipped at:</span>
                                    <span>{{ formatDate(order.shipped_at) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Notes -->
                <div v-if="order.notes" class="alert alert-info">
                    <span class="iconify lucide--sticky-note size-5" />
                    <div class="text-sm">
                        <p class="font-semibold">Order Notes:</p>
                        <p>{{ order.notes }}</p>
                    </div>
                </div>
            </div>

            <div class="modal-action">
                <button class="btn" @click="emit('close')">Close</button>
            </div>
        </div>
        <div class="modal-backdrop" @click="emit('close')"></div>
    </dialog>
</template>
