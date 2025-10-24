<script setup lang="ts">
import { formatPrice, formatDate } from "~/utils/formatters";
import UpdateStatusModal from "./UpdateStatusModal.vue";
import UpdatePaymentModal from "./UpdatePaymentModal.vue";
import DetailModal from "./DetailModal.vue";

const emit = defineEmits<{
    'update:statistics': [stats: any]
}>();

const { getOrders, sendInvoiceEmail } = useOrders();
const { success, error: showError } = useToast();

const selectedStatus = ref("all");
const selectedPaymentStatus = ref("all");
const selectedPaymentMethod = ref("all");
const selectedCourier = ref("all");
const searchQuery = ref("");
const dateFrom = ref("");
const dateTo = ref("");
const minTotal = ref("");
const maxTotal = ref("");
const sortBy = ref("created_at");
const sortOrder = ref("desc");
const currentPage = ref(1);
const perPage = ref(20);

const goToPage = (pageNum: number) => {
    currentPage.value = pageNum;
};

// Watch filters - reset to page 1 when filters change
watch(
    [
        selectedStatus,
        selectedPaymentStatus,
        selectedPaymentMethod,
        selectedCourier,
        searchQuery,
        dateFrom,
        dateTo,
        minTotal,
        maxTotal,
        sortBy,
        sortOrder,
        perPage,
    ],
    () => {
        currentPage.value = 1;
    }
);

const params = computed(() => {
    const filters: Record<string, any> = {
        page: currentPage.value,
        per_page: perPage.value,
        sort_by: sortBy.value,
        sort_order: sortOrder.value,
    };

    if (selectedStatus.value !== "all") filters.status = selectedStatus.value;
    if (selectedPaymentStatus.value !== "all") filters.payment_status = selectedPaymentStatus.value;
    if (selectedPaymentMethod.value !== "all") filters.payment_method = selectedPaymentMethod.value;
    if (selectedCourier.value !== "all") filters.courier = selectedCourier.value;
    if (searchQuery.value) filters.search = searchQuery.value;
    if (dateFrom.value) filters.date_from = dateFrom.value;
    if (dateTo.value) filters.date_to = dateTo.value;
    if (minTotal.value) filters.min_total = minTotal.value;
    if (maxTotal.value) filters.max_total = maxTotal.value;

    return filters;
});

const { data: ordersResponse, pending: loading, refresh } = await getOrders(params, {
    watch: [params],
});

const orders = computed(() => (ordersResponse.value as any)?.data?.orders?.data || []);
const statistics = computed(() => (ordersResponse.value as any)?.data?.statistics || {});
const pagination = computed(() => {
    const ordersData = (ordersResponse.value as any)?.data?.orders || {};
    return {
        current_page: ordersData.current_page || 1,
        per_page: ordersData.per_page || 20,
        total: ordersData.total || 0,
        last_page: ordersData.last_page || 1,
        from: ((ordersData.current_page || 1) - 1) * (ordersData.per_page || 20) + 1,
        to: Math.min((ordersData.current_page || 1) * (ordersData.per_page || 20), ordersData.total || 0),
    };
});

// Emit statistics to parent component
watch(statistics, (newStats) => {
    emit('update:statistics', newStats);
}, { immediate: true });

const selectedOrder = ref<any>(null);
const showStatusModal = ref(false);
const showPaymentModal = ref(false);
const showDetailModal = ref(false);

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

const getPaymentStatusColor = (status: string) => {
    return status === "paid" ? "badge-success" : "badge-warning";
};

const handleStatusUpdated = () => {
    refresh();
    showStatusModal.value = false;
};

const handlePaymentUpdated = () => {
    refresh();
    showPaymentModal.value = false;
};

// Check if order status can be updated
const canUpdateStatus = (order: any) => {
    return order?.status !== "completed" && order?.status !== "cancelled";
};

// Check if payment status can be updated
const canUpdatePayment = (order: any) => {
    return order?.payment_status !== "paid";
};

// Get available actions for an order
const getAvailableActions = (order: any) => {
    const actions = [];

    if (canUpdateStatus(order)) {
        actions.push({ id: "status", label: "Update Status", icon: "lucide--package" });
    }

    if (canUpdatePayment(order)) {
        actions.push({ id: "payment", label: "Update Payment", icon: "lucide--credit-card" });
    }

    // Send Invoice - hanya jika ada customer email
    if (order?.customer?.email) {
        actions.push({ id: "invoice", label: "Send Invoice", icon: "lucide--mail" });
    }

    actions.push({ id: "detail", label: "View Details", icon: "lucide--eye" });

    return actions;
};

const handleSendInvoice = async (order: any) => {
    if (!order?.customer?.email) {
        showError("Customer email not found");
        return;
    }

    try {
        await sendInvoiceEmail(order.id);
        success(`Invoice sent to ${order.customer.email}`);
    } catch (err: any) {
        showError(err?.data?.message || "Failed to send invoice email");
    }
};

const handleAction = (action: string, order: any) => {
    selectedOrder.value = order;
    if (action === "status") {
        showStatusModal.value = true;
    } else if (action === "payment") {
        showPaymentModal.value = true;
    } else if (action === "detail") {
        showDetailModal.value = true;
    } else if (action === "invoice") {
        handleSendInvoice(order);
    }
};
</script>

<template>
    <div>
        <!-- Orders Table -->
        <div class="card bg-base-100 shadow">
            <div class="card-body p-0">
                <!-- Filters -->
                <div class="px-5 pt-5 pb-4 space-y-4">
                    <!-- Row 1: Search & Main Filters -->
                    <div class="flex items-center justify-between gap-3 flex-wrap">
                        <div class="flex items-center gap-3 flex-wrap">
                            <label class="input input-sm">
                                <span class="iconify lucide--search text-base-content/80 size-3.5" />
                                <input
                                    v-model="searchQuery"
                                    type="search"
                                    class="w-24 sm:w-48"
                                    placeholder="Search orders..."
                                    aria-label="Search orders" />
                            </label>
                            <select v-model="selectedStatus" class="select select-sm w-32">
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                            <select v-model="selectedPaymentStatus" class="select select-sm w-36">
                                <option value="all">All Payment</option>
                                <option value="paid">Paid</option>
                                <option value="unpaid">Unpaid</option>
                            </select>
                        </div>
                        <NuxtLink to="/orders/create" class="btn btn-primary btn-sm">
                            <span class="iconify lucide--plus size-4" />
                            Create Order
                        </NuxtLink>
                    </div>

                    <!-- Row 2: Advanced Filters (Collapsible) -->
                    <details class="collapse collapse-arrow bg-base-200/50 rounded-lg border border-base-300">
                        <summary class="collapse-title text-sm font-medium py-2.5 min-h-0 flex items-center gap-2">
                            <span class="iconify lucide--sliders-horizontal size-4" />
                            Advanced Filters
                        </summary>
                        <div class="collapse-content">
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 pt-2">
                                <div class="form-control">
                                    <label class="label py-1">
                                        <span class="label-text text-xs flex items-center gap-1">
                                            <span class="iconify lucide--credit-card size-3" />
                                            Payment Method
                                        </span>
                                    </label>
                                    <select v-model="selectedPaymentMethod" class="select select-sm select-bordered">
                                        <option value="all">All Methods</option>
                                        <option value="bank_transfer">Bank Transfer</option>
                                        <option value="midtrans">Midtrans</option>
                                    </select>
                                </div>
                                <div class="form-control">
                                    <label class="label py-1">
                                        <span class="label-text text-xs flex items-center gap-1">
                                            <span class="iconify lucide--truck size-3" />
                                            Courier
                                        </span>
                                    </label>
                                    <select v-model="selectedCourier" class="select select-sm select-bordered">
                                        <option value="all">All Couriers</option>
                                        <option value="JNE">JNE</option>
                                        <option value="J&T">J&T</option>
                                        <option value="SiCepat">SiCepat</option>
                                        <option value="AnterAja">AnterAja</option>
                                    </select>
                                </div>
                                <div class="form-control">
                                    <label class="label py-1">
                                        <span class="label-text text-xs flex items-center gap-1">
                                            <span class="iconify lucide--calendar size-3" />
                                            Date From
                                        </span>
                                    </label>
                                    <input v-model="dateFrom" type="date" class="input input-sm input-bordered" />
                                </div>
                                <div class="form-control">
                                    <label class="label py-1">
                                        <span class="label-text text-xs flex items-center gap-1">
                                            <span class="iconify lucide--calendar size-3" />
                                            Date To
                                        </span>
                                    </label>
                                    <input v-model="dateTo" type="date" class="input input-sm input-bordered" />
                                </div>
                                <div class="form-control">
                                    <label class="label py-1">
                                        <span class="label-text text-xs flex items-center gap-1">
                                            <span class="iconify lucide--arrow-down-up size-3" />
                                            Sort By
                                        </span>
                                    </label>
                                    <div class="flex gap-1">
                                        <select v-model="sortBy" class="select select-sm select-bordered flex-1">
                                            <option value="created_at">Date</option>
                                            <option value="total_amount">Total</option>
                                            <option value="order_number">Order #</option>
                                        </select>
                                        <select v-model="sortOrder" class="select select-sm select-bordered w-20">
                                            <option value="desc">↓</option>
                                            <option value="asc">↑</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-control md:col-span-2 lg:col-span-2">
                                    <label class="label py-1">
                                        <span class="label-text text-xs flex items-center gap-1">
                                            <span class="iconify lucide--coins size-3" />
                                            Total Range
                                        </span>
                                    </label>
                                    <div class="flex gap-2">
                                        <input
                                            v-model="minTotal"
                                            type="number"
                                            placeholder="Min Total"
                                            class="input input-sm input-bordered w-full" />
                                        <input
                                            v-model="maxTotal"
                                            type="number"
                                            placeholder="Max Total"
                                            class="input input-sm input-bordered w-full" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </details>
                </div>

                <!-- Loading -->
                <div v-if="loading" class="flex items-center justify-center py-12">
                    <span class="loading loading-spinner loading-lg"></span>
                </div>

                <!-- Table -->
                <div v-else class="overflow-x-auto">
                    <table class="table table-zebra">
                        <thead>
                            <tr>
                                <th>Order Number</th>
                                <th>Customer</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Payment</th>
                                <th>Payment Method</th>
                                <th>Date</th>
                                <th class="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="order in orders" :key="order?.id">
                                <td>
                                    <button @click="handleAction('detail', order)" class="link link-primary font-medium">
                                        {{ order?.order_number || 'N/A' }}
                                    </button>
                                </td>
                                <td>
                                    <div>
                                        <p class="font-medium">{{ order?.customer?.name || 'N/A' }}</p>
                                        <p class="text-base-content/60 text-xs">{{ order?.customer?.email || '' }}</p>
                                    </div>
                                </td>
                                <td class="font-medium">{{ formatPrice(order?.total_amount || 0) }}</td>
                                <td>
                                    <div class="flex items-center gap-1">
                                        <span :class="['badge badge-sm', getStatusColor(order?.status || '')]">
                                            {{ order?.status || 'N/A' }}
                                        </span>
                                        <span
                                            v-if="!canUpdateStatus(order)"
                                            class="iconify lucide--lock size-3 text-base-content/40"
                                            title="Status locked" />
                                    </div>
                                </td>
                                <td>
                                    <div class="flex items-center gap-1">
                                        <span :class="['badge badge-sm', getPaymentStatusColor(order?.payment_status || '')]">
                                            {{ order?.payment_status || 'N/A' }}
                                        </span>
                                        <span
                                            v-if="!canUpdatePayment(order)"
                                            class="iconify lucide--lock size-3 text-success/40"
                                            title="Payment locked" />
                                    </div>
                                </td>
                                <td>
                                    <span class="badge badge-sm badge-outline">
                                        {{ order?.payment_method || 'N/A' }}
                                    </span>
                                </td>
                                <td class="text-sm">{{ order?.created_at ? formatDate(order.created_at, 'datetime') : 'N/A' }}</td>
                                <td>
                                    <div class="flex justify-end">
                                        <details class="dropdown dropdown-end">
                                            <summary class="btn btn-ghost btn-sm">
                                                <span class="iconify lucide--more-vertical size-4" />
                                            </summary>
                                            <ul class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-lg border border-base-300">
                                                <li v-for="action in getAvailableActions(order)" :key="action.id">
                                                    <a @click="handleAction(action.id, order)">
                                                        <span :class="['iconify', action.icon, 'size-4']" />
                                                        {{ action.label }}
                                                    </a>
                                                </li>
                                            </ul>
                                        </details>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div v-if="pagination" class="flex items-center justify-between p-6">
                    <div class="text-base-content/80 hover:text-base-content flex gap-2 text-sm">
                        <span class="hidden sm:inline">Per page</span>
                        <select v-model="perPage" class="select select-xs w-18" aria-label="Per page">
                            <option :value="10">10</option>
                            <option :value="20">20</option>
                            <option :value="50">50</option>
                            <option :value="100">100</option>
                        </select>
                    </div>
                    <span class="text-base-content/80 hidden text-sm lg:inline">
                        Showing
                        <span class="text-base-content font-medium">{{ pagination.from }} to {{ pagination.to }}</span>
                        of {{ pagination.total }} items
                    </span>
                    <div class="inline-flex items-center gap-1">
                        <button
                            class="btn btn-circle sm:btn-sm btn-xs btn-ghost"
                            aria-label="Prev"
                            :disabled="pagination.current_page === 1"
                            @click="goToPage(pagination.current_page - 1)">
                            <span class="iconify lucide--chevron-left" />
                        </button>
                        <button
                            v-for="pageNum in Math.min(pagination.last_page, 5)"
                            :key="pageNum"
                            :class="[
                                'btn btn-circle sm:btn-sm btn-xs',
                                pageNum === pagination.current_page ? 'btn-primary' : 'btn-ghost',
                            ]"
                            @click="goToPage(pageNum)">
                            {{ pageNum }}
                        </button>
                        <button
                            class="btn btn-circle sm:btn-sm btn-xs btn-ghost"
                            aria-label="Next"
                            :disabled="pagination.current_page === pagination.last_page"
                            @click="goToPage(pagination.current_page + 1)">
                            <span class="iconify lucide--chevron-right" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modals -->
        <UpdateStatusModal
            v-if="showStatusModal && selectedOrder"
            :order="selectedOrder"
            @close="showStatusModal = false"
            @updated="handleStatusUpdated" />

        <UpdatePaymentModal
            v-if="showPaymentModal && selectedOrder"
            :order="selectedOrder"
            @close="showPaymentModal = false"
            @updated="handlePaymentUpdated" />

        <DetailModal
            v-if="showDetailModal && selectedOrder"
            :order-id="selectedOrder.id"
            @close="showDetailModal = false" />
    </div>
</template>
