<script setup lang="ts">
const props = defineProps<{
    customerId: number;
}>();

// Pagination
const orderPage = ref(1);
const orderPerPage = ref(10);

// Fetch customer orders
const { data: ordersResponse, pending: ordersPending } = await useAsyncData(
    `customer-orders-${props.customerId}`,
    () => {
        return $fetch(`/orders/customer/${props.customerId}`, {
            baseURL: useRuntimeConfig().public.apiBase,
            headers: {
                Authorization: `Bearer ${useAuthStore().token}`,
            },
            params: {
                page: orderPage.value,
                per_page: orderPerPage.value,
            },
        });
    },
    {
        watch: [orderPage, orderPerPage],
    },
);

const orders = computed(() => {
    const response = ordersResponse.value as any;
    return response?.data?.data || [];
});

const orderPagination = computed(() => {
    const response = ordersResponse.value as any;
    const data = response?.data;
    return {
        current_page: data?.current_page || 1,
        last_page: data?.last_page || 1,
        per_page: data?.per_page || 10,
        total: data?.total || 0,
        from: data?.from || 0,
        to: data?.to || 0,
    };
});

const goToOrderPage = (pageNum: number) => {
    orderPage.value = pageNum;
};

// Order status badge
const getOrderStatusClass = (status: string) => {
    const classes: Record<string, string> = {
        pending: "badge-warning",
        processing: "badge-info",
        shipped: "badge-primary",
        delivered: "badge-success",
        cancelled: "badge-error",
    };
    return classes[status] || "badge-ghost";
};

// Payment status badge
const getPaymentStatusClass = (status: string) => {
    const classes: Record<string, string> = {
        paid: "badge-success",
        unpaid: "badge-warning",
        refunded: "badge-error",
        partial: "badge-info",
    };
    return classes[status] || "badge-ghost";
};

// View Order Detail
const showOrderModal = ref(false);
const selectedOrderId = ref<number | null>(null);
const selectedOrder = ref<any>(null);
const orderDetailPending = ref(false);

const viewOrderDetail = async (orderId: number) => {
    selectedOrderId.value = orderId;
    showOrderModal.value = true;
    orderDetailPending.value = true;

    try {
        const response = await $fetch(`/orders/${orderId}`, {
            baseURL: useRuntimeConfig().public.apiBase,
            headers: {
                Authorization: `Bearer ${useAuthStore().token}`,
            },
        });
        selectedOrder.value = (response as any)?.data;
    } catch (error) {
        console.error("Failed to fetch order details:", error);
    } finally {
        orderDetailPending.value = false;
    }
};

const closeOrderModal = () => {
    showOrderModal.value = false;
    selectedOrderId.value = null;
    selectedOrder.value = null;
};
</script>

<template>
    <div class="card bg-base-100 shadow">
        <div class="card-body">
            <h3 class="card-title mb-4">Order History</h3>

            <!-- Loading -->
            <div v-if="ordersPending" class="flex items-center justify-center py-12">
                <span class="loading loading-spinner loading-lg"></span>
            </div>

            <!-- Table -->
            <div v-else class="overflow-x-auto">
                <table class="table table-zebra">
                    <thead>
                        <tr>
                            <th>Order Number</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Payment</th>
                            <th>Courier</th>
                            <th>Total</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="order in orders" :key="order.id">
                            <td>
                                <span class="font-mono font-medium">{{ order.order_number }}</span>
                            </td>
                            <td>
                                <div class="flex flex-col">
                                    <span class="text-sm">{{ formatDate(order.created_at, 'long') }}</span>
                                    <span class="text-base-content/60 text-xs">{{ formatDate(order.created_at, 'time') }}</span>
                                </div>
                            </td>
                            <td>
                                <span class="badge badge-sm" :class="getOrderStatusClass(order.status)">
                                    {{ capitalize(order.status) }}
                                </span>
                            </td>
                            <td>
                                <div class="flex flex-col gap-1">
                                    <span class="badge badge-sm" :class="getPaymentStatusClass(order.payment_status)">
                                        {{ capitalize(order.payment_status) }}
                                    </span>
                                    <span class="text-base-content/60 text-xs uppercase">{{ order.payment_method }}</span>
                                </div>
                            </td>
                            <td>
                                <div class="flex flex-col">
                                    <span class="text-sm font-medium">{{ order.courier || "-" }}</span>
                                    <span v-if="order.tracking_number" class="text-base-content/60 font-mono text-xs">{{ order.tracking_number }}</span>
                                </div>
                            </td>
                            <td>
                                <span class="font-medium">{{ formatPrice(order.total_amount) }}</span>
                            </td>
                            <td>
                                <button @click="viewOrderDetail(order.id)" class="btn btn-ghost btn-xs">
                                    <span class="iconify lucide--eye size-4" />
                                    View
                                </button>
                            </td>
                        </tr>
                        <tr v-if="orders.length === 0">
                            <td colspan="7" class="text-center">No orders found</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div v-if="orderPagination && orders.length > 0" class="flex items-center justify-between pt-4">
                <div class="text-base-content/80 hover:text-base-content flex gap-2 text-sm">
                    <span class="hidden sm:inline">Per page</span>
                    <select v-model="orderPerPage" class="select select-xs w-18" aria-label="Per page">
                        <option :value="10">10</option>
                        <option :value="15">15</option>
                        <option :value="20">20</option>
                        <option :value="50">50</option>
                    </select>
                </div>
                <span class="text-base-content/80 hidden text-sm lg:inline">
                    Showing
                    <span class="text-base-content font-medium">{{ orderPagination.from }} to {{ orderPagination.to }}</span>
                    of {{ orderPagination.total }} orders
                </span>
                <div class="inline-flex items-center gap-1">
                    <button
                        class="btn btn-circle sm:btn-sm btn-xs btn-ghost"
                        aria-label="Prev"
                        :disabled="orderPagination.current_page === 1"
                        @click="goToOrderPage(orderPagination.current_page - 1)">
                        <span class="iconify lucide--chevron-left" />
                    </button>
                    <button
                        v-for="page in Math.min(orderPagination.last_page, 5)"
                        :key="page"
                        :class="[
                            'btn btn-circle sm:btn-sm btn-xs',
                            page === orderPagination.current_page ? 'btn-primary' : 'btn-ghost',
                        ]"
                        @click="goToOrderPage(page)">
                        {{ page }}
                    </button>
                    <button
                        class="btn btn-circle sm:btn-sm btn-xs btn-ghost"
                        aria-label="Next"
                        :disabled="orderPagination.current_page === orderPagination.last_page"
                        @click="goToOrderPage(orderPagination.current_page + 1)">
                        <span class="iconify lucide--chevron-right" />
                    </button>
                </div>
            </div>
        </div>

        <!-- Order Detail Modal -->
        <dialog :open="showOrderModal" class="modal">
            <div class="modal-box max-w-4xl">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-bold">Order Detail</h3>
                    <button @click="closeOrderModal" class="btn btn-ghost btn-sm btn-circle">
                        <span class="iconify lucide--x size-5" />
                    </button>
                </div>

                <!-- Loading -->
                <div v-if="orderDetailPending" class="flex items-center justify-center py-12">
                    <span class="loading loading-spinner loading-lg"></span>
                </div>

                <!-- Order Content -->
                <div v-else-if="selectedOrder" class="space-y-4">
                    <!-- Order Info -->
                    <div class="grid grid-cols-2 gap-4 p-4 bg-base-200 rounded-lg">
                        <div>
                            <label class="text-base-content/60 text-sm">Order Number</label>
                            <p class="font-mono font-medium">{{ selectedOrder.order_number }}</p>
                        </div>
                        <div>
                            <label class="text-base-content/60 text-sm">Order Date</label>
                            <p>{{ formatDate(selectedOrder.created_at, 'long') }}</p>
                        </div>
                        <div>
                            <label class="text-base-content/60 text-sm">Status</label>
                            <div class="mt-1">
                                <span class="badge badge-sm" :class="getOrderStatusClass(selectedOrder.status)">
                                    {{ capitalize(selectedOrder.status) }}
                                </span>
                            </div>
                        </div>
                        <div>
                            <label class="text-base-content/60 text-sm">Payment Status</label>
                            <div class="mt-1">
                                <span class="badge badge-sm" :class="getPaymentStatusClass(selectedOrder.payment_status)">
                                    {{ capitalize(selectedOrder.payment_status) }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Customer Info -->
                    <div class="p-4 bg-base-200 rounded-lg">
                        <h4 class="font-semibold mb-3">Customer Information</h4>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="text-base-content/60 text-sm">Name</label>
                                <p>{{ selectedOrder.customer_name }}</p>
                            </div>
                            <div>
                                <label class="text-base-content/60 text-sm">Email</label>
                                <p>{{ selectedOrder.customer_email }}</p>
                            </div>
                            <div>
                                <label class="text-base-content/60 text-sm">Phone</label>
                                <p>{{ selectedOrder.customer_phone }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Shipping Info -->
                    <div class="p-4 bg-base-200 rounded-lg">
                        <h4 class="font-semibold mb-3">Shipping Information</h4>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="text-base-content/60 text-sm">Address</label>
                                <p>{{ selectedOrder.shipping_address }}</p>
                            </div>
                            <div>
                                <label class="text-base-content/60 text-sm">City</label>
                                <p>{{ selectedOrder.shipping_city }}</p>
                            </div>
                            <div>
                                <label class="text-base-content/60 text-sm">Province</label>
                                <p>{{ selectedOrder.shipping_province }}</p>
                            </div>
                            <div>
                                <label class="text-base-content/60 text-sm">Postal Code</label>
                                <p>{{ selectedOrder.shipping_postal_code }}</p>
                            </div>
                            <div>
                                <label class="text-base-content/60 text-sm">Courier</label>
                                <p>{{ selectedOrder.courier }}</p>
                            </div>
                            <div>
                                <label class="text-base-content/60 text-sm">Tracking Number</label>
                                <p class="font-mono">{{ selectedOrder.tracking_number || "-" }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Order Items -->
                    <div class="p-4 bg-base-200 rounded-lg">
                        <h4 class="font-semibold mb-3">Order Items</h4>
                        <div class="overflow-x-auto">
                            <table class="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>SKU</th>
                                        <th>Variant</th>
                                        <th>Qty</th>
                                        <th>Price</th>
                                        <th>Subtotal</th>
                                        <th>Discount</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in selectedOrder.items" :key="item.id">
                                        <td>{{ item.product_name }}</td>
                                        <td class="font-mono text-xs">{{ item.sku }}</td>
                                        <td>
                                            <div class="flex flex-col text-xs">
                                                <span>{{ item.size }}</span>
                                                <span class="text-base-content/60">{{ item.color }}</span>
                                            </div>
                                        </td>
                                        <td>{{ item.quantity }}</td>
                                        <td>{{ formatPrice(item.price) }}</td>
                                        <td>{{ formatPrice(item.subtotal) }}</td>
                                        <td class="text-error">-{{ formatPrice(item.discount_amount) }}</td>
                                        <td class="font-medium">{{ formatPrice(item.total) }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Order Summary -->
                    <div class="p-4 bg-base-200 rounded-lg">
                        <h4 class="font-semibold mb-3">Order Summary</h4>
                        <div class="space-y-2">
                            <div class="flex justify-between">
                                <span class="text-base-content/60">Subtotal</span>
                                <span>{{ formatPrice(selectedOrder.subtotal) }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-base-content/60">Shipping Cost</span>
                                <span>{{ formatPrice(selectedOrder.shipping_cost) }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-base-content/60">Tax</span>
                                <span>{{ formatPrice(selectedOrder.tax_amount) }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-base-content/60">Discount</span>
                                <span class="text-error">-{{ formatPrice(selectedOrder.discount_amount) }}</span>
                            </div>
                            <div class="divider my-2"></div>
                            <div class="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>{{ formatPrice(selectedOrder.total_amount) }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Payment & Dates -->
                    <div class="p-4 bg-base-200 rounded-lg">
                        <h4 class="font-semibold mb-3">Additional Information</h4>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="text-base-content/60 text-sm">Payment Method</label>
                                <p class="uppercase">{{ selectedOrder.payment_method }}</p>
                            </div>
                            <div v-if="selectedOrder.paid_at">
                                <label class="text-base-content/60 text-sm">Paid At</label>
                                <p>{{ formatDate(selectedOrder.paid_at, 'datetime') }}</p>
                            </div>
                            <div v-if="selectedOrder.shipped_at">
                                <label class="text-base-content/60 text-sm">Shipped At</label>
                                <p>{{ formatDate(selectedOrder.shipped_at, 'datetime') }}</p>
                            </div>
                            <div v-if="selectedOrder.completed_at">
                                <label class="text-base-content/60 text-sm">Completed At</label>
                                <p>{{ formatDate(selectedOrder.completed_at, 'datetime') }}</p>
                            </div>
                        </div>
                        <div v-if="selectedOrder.notes" class="mt-3">
                            <label class="text-base-content/60 text-sm">Notes</label>
                            <p class="text-sm">{{ selectedOrder.notes }}</p>
                        </div>
                        <div v-if="selectedOrder.shipping_notes" class="mt-3">
                            <label class="text-base-content/60 text-sm">Shipping Notes</label>
                            <p class="text-sm">{{ selectedOrder.shipping_notes }}</p>
                        </div>
                    </div>
                </div>

                <div class="modal-action">
                    <button class="btn" @click="closeOrderModal">Close</button>
                </div>
            </div>
            <form method="dialog" class="modal-backdrop">
                <button @click="closeOrderModal">close</button>
            </form>
        </dialog>
    </div>
</template>
