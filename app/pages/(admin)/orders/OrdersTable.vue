<script setup lang="ts">
import { getErrorMessage } from "~/utils/errorHandlers";
import { formatDate, formatPrice } from "~/utils/formatters";
import { getOrderStatusBadgeClass, getPaymentStatusBadgeClass } from "~/utils/statusHelpers";

import OrdersFilterDrawer from "./components/OrdersFilterDrawer.vue";
import UpdatePaymentModal from "./components/UpdatePaymentModal.vue";
import UpdateStatusModal from "./components/UpdateStatusModal.vue";

const props = defineProps<{
    initialFilters?: {
        payment_status?: string;
        status?: string;
        payment_method?: string;
        courier?: string;
    };
    lockedFilters?: string[]; // Array of filter names that should be locked/disabled
}>();

const { sendInvoiceEmail } = useOrders();
const { success, error: showError } = useToast();

// Initialize filters with props.initialFilters if provided
const selectedStatus = ref(props.initialFilters?.status || "all");
const selectedPaymentStatus = ref(props.initialFilters?.payment_status || "all");
const selectedPaymentMethod = ref(props.initialFilters?.payment_method || "all");
const selectedCourier = ref(props.initialFilters?.courier || "all");
const searchQuery = ref("");
const dateFrom = ref("");
const dateTo = ref("");
const minTotal = ref("");
const maxTotal = ref("");
const sortBy = ref("created_at");
const sortOrder = ref<"asc" | "desc">("desc");
const currentPage = ref(1);
const perPage = ref(20);

// Handle column sorting
const handleSort = (column: string) => {
    if (sortBy.value === column) {
        sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
    } else {
        sortBy.value = column;
        sortOrder.value = "desc";
    }
};

// Get sort icon for column
const getSortIcon = (column: string) => {
    if (sortBy.value !== column) return "lucide--chevrons-up-down";
    return sortOrder.value === "asc" ? "lucide--chevron-up" : "lucide--chevron-down";
};

// Clear all filters
const clearFilters = () => {
    selectedStatus.value = props.initialFilters?.status || "all";
    selectedPaymentStatus.value = props.initialFilters?.payment_status || "all";
    selectedPaymentMethod.value = props.initialFilters?.payment_method || "all";
    selectedCourier.value = props.initialFilters?.courier || "all";
    searchQuery.value = "";
    dateFrom.value = "";
    dateTo.value = "";
    minTotal.value = "";
    maxTotal.value = "";
    sortBy.value = "created_at";
    sortOrder.value = "desc";
};

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
    },
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

// Fetch orders using $fetch
const loading = ref(false);
const ordersResponse = ref<any>(null);

const orders = computed(() => {
    const response = ordersResponse.value as any;
    const ordersList = response?.data?.orders?.data || [];
    return ordersList;
});

const pagination = computed(() => {
    const response = ordersResponse.value as any;
    const ordersData = response?.data?.orders;
    return {
        current_page: ordersData?.current_page || 1,
        last_page: ordersData?.last_page || 1,
        per_page: ordersData?.per_page || 20,
        total: ordersData?.total || 0,
        from: ordersData?.from || 0,
        to: ordersData?.to || 0,
    };
});

const fetchOrders = async () => {
    try {
        loading.value = true;
        ordersResponse.value = await $fetch("/orders", {
            baseURL: useRuntimeConfig().public.apiBase,
            headers: {
                Authorization: `Bearer ${useAuthStore().token}`,
            },
            params: params.value,
        });
    } catch (error) {
        console.error("Failed to fetch orders:", error);
        showError(getErrorMessage(error, "Failed to fetch orders"));
    } finally {
        loading.value = false;
    }
};

const refresh = () => {
    fetchOrders();
};

// Watch params and fetch
watch(
    params,
    () => {
        fetchOrders();
    },
    { immediate: true },
);

const selectedOrder = ref<any>(null);
const showStatusModal = ref(false);
const showPaymentModal = ref(false);

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

    actions.push({ id: "detail", label: "View Details", icon: "lucide--eye" });
    actions.push({ id: "view-invoice", label: "View Invoice", icon: "lucide--file-text" });

    if (order?.customer?.email) {
        actions.push({ id: "send-invoice", label: "Send Invoice", icon: "lucide--mail" });
    }

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
    } catch (err) {
        showError(getErrorMessage(err, "Failed to send invoice email"));
    }
};

const router = useRouter();

const handleAction = (action: string, order: any) => {
    selectedOrder.value = order;
    if (action === "status") {
        showStatusModal.value = true;
    } else if (action === "payment") {
        showPaymentModal.value = true;
    } else if (action === "detail") {
        router.push(`/orders/${order.id}/show`);
    } else if (action === "view-invoice") {
        router.push(`/orders/${order.id}/invoice`);
    } else if (action === "send-invoice") {
        handleSendInvoice(order);
    }
};
</script>

<template>
    <div>
        <div class="card bg-base-100 shadow">
            <div class="card-body p-0">
                <!-- Filters (Match UserTable style) -->
                <div class="flex items-center justify-between px-5 pt-5">
                    <div class="inline-flex items-center gap-3">
                        <label class="input input-sm">
                            <span class="iconify lucide--search text-base-content/80 size-3.5" />
                            <input
                                v-model="searchQuery"
                                type="search"
                                class="w-24 sm:w-48"
                                placeholder="Search orders..."
                                aria-label="Search orders" />
                        </label>
                    </div>
                    <div class="inline-flex items-center gap-3">
                        <NuxtLink
                            to="/orders/create"
                            aria-label="Create order link"
                            class="btn btn-primary btn-sm max-sm:btn-square">
                            <span class="iconify lucide--plus size-4" />
                            <span class="hidden sm:inline">New Order</span>
                        </NuxtLink>
                        <label
                            for="orders-filter-drawer"
                            class="btn btn-ghost border-base-300 btn-sm btn-square"
                            aria-label="More filters">
                            <span class="iconify lucide--settings-2 size-4" />
                        </label>
                    </div>
                </div>

                <!-- Table (Match UserTable style) -->
                <div class="mt-4 overflow-auto">
                    <!-- Loading State -->
                    <div v-if="loading" class="flex items-center justify-center py-12">
                        <span class="loading loading-spinner loading-lg"></span>
                    </div>

                    <!-- Empty State -->
                    <div v-else-if="orders.length === 0" class="flex flex-col items-center justify-center py-12">
                        <span class="iconify lucide--shopping-cart text-base-content/30 mb-4 size-16" />
                        <p class="text-base-content/60">No orders found</p>
                    </div>

                    <!-- Table -->
                    <table v-else class="table">
                        <thead>
                            <tr>
                                <th>
                                    <button
                                        @click="handleSort('order_number')"
                                        class="hover:text-primary flex items-center gap-1.5 transition-colors">
                                        <span>Order Number</span>
                                        <span :class="['iconify', getSortIcon('order_number'), 'size-4']" />
                                    </button>
                                </th>
                                <th>Customer</th>
                                <th>
                                    <button
                                        @click="handleSort('total_amount')"
                                        class="hover:text-primary flex items-center gap-1.5 transition-colors">
                                        <span>Total</span>
                                        <span :class="['iconify', getSortIcon('total_amount'), 'size-4']" />
                                    </button>
                                </th>
                                <th>Status</th>
                                <th>Payment</th>
                                <th>Payment Method</th>
                                <th>
                                    <button
                                        @click="handleSort('created_at')"
                                        class="hover:text-primary flex items-center gap-1.5 transition-colors">
                                        <span>Date</span>
                                        <span :class="['iconify', getSortIcon('created_at'), 'size-4']" />
                                    </button>
                                </th>
                                <th class="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="order in orders" :key="order?.id">
                                <td>
                                    <button
                                        @click="handleAction('detail', order)"
                                        class="link link-primary font-medium">
                                        {{ order?.order_number || "N/A" }}
                                    </button>
                                </td>
                                <td>
                                    <div>
                                        <p class="font-medium">{{ order?.customer?.name || "N/A" }}</p>
                                        <p class="text-base-content/60 text-xs">{{ order?.customer?.email || "" }}</p>
                                    </div>
                                </td>
                                <td class="font-medium">{{ formatPrice(order?.total_amount || 0) }}</td>
                                <td>
                                    <div class="flex items-center gap-1">
                                        <span :class="['badge badge-sm', getOrderStatusBadgeClass(order?.status)]">
                                            {{ order?.status || "N/A" }}
                                        </span>
                                        <span
                                            v-if="!canUpdateStatus(order)"
                                            class="iconify lucide--lock text-base-content/40 size-3"
                                            title="Status locked" />
                                    </div>
                                </td>
                                <td>
                                    <div class="flex items-center gap-1">
                                        <span
                                            :class="[
                                                'badge badge-sm',
                                                getPaymentStatusBadgeClass(order?.payment_status),
                                            ]">
                                            {{ order?.payment_status || "N/A" }}
                                        </span>
                                        <span
                                            v-if="!canUpdatePayment(order)"
                                            class="iconify lucide--lock text-success/40 size-3"
                                            title="Payment locked" />
                                    </div>
                                </td>
                                <td>
                                    <span class="badge badge-sm badge-outline">
                                        {{ order?.payment_method || "N/A" }}
                                    </span>
                                </td>
                                <td class="text-sm">
                                    {{ order?.created_at ? formatDate(order.created_at, "datetime") : "N/A" }}
                                </td>
                                <td>
                                    <div class="flex justify-end">
                                        <details class="dropdown dropdown-end">
                                            <summary class="btn btn-ghost btn-sm">
                                                <span class="iconify lucide--more-vertical size-4" />
                                            </summary>
                                            <ul
                                                class="dropdown-content menu bg-base-100 rounded-box border-base-300 z-[1] w-52 border p-2 shadow-lg">
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

        <!-- Filter Drawer Component -->
        <OrdersFilterDrawer
            v-model:selected-payment-method="selectedPaymentMethod"
            v-model:selected-courier="selectedCourier"
            v-model:date-from="dateFrom"
            v-model:date-to="dateTo"
            v-model:min-total="minTotal"
            v-model:max-total="maxTotal"
            @clear="clearFilters" />
    </div>
</template>
