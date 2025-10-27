<script setup lang="ts">
import { formatPrice } from "~/utils/formatters";
import { getPaymentTypeLabel, getPaymentTypeBadgeClass, getPaymentProviderBadgeClass } from "~/utils/badgeHelpers";
import PaymentMethodsFilterDrawer from "./components/PaymentMethodsFilterDrawer.vue";

const { deletePaymentMethod } = usePaymentMethods();
const { success, error: showError } = useToast();

// Store the payment method object for displaying in modal
const selectedMethod = ref<any>(null);

// Delete confirmation composable
const {
    confirmDelete,
    itemToDelete: paymentMethodIdToDelete,
    openDeleteModal: openDeleteModalById,
    handleDelete
} = useDeleteConfirmation(
    deletePaymentMethod,
    "payment method",
    async () => await refresh()
);

// Wrapper to open modal with method object
const openDeleteModal = (method: any) => {
    selectedMethod.value = method;
    openDeleteModalById(method.id);
};

// Filters
const search = ref("");
const isActive = ref("");
const type = ref("");
const provider = ref("");
const page = ref(1);
const per_page = ref(15);

// Clear filters
const clearFilters = () => {
    isActive.value = "";
    type.value = "";
    provider.value = "";
};

// Build params reactively
const params = computed(() => ({
    page: page.value,
    per_page: per_page.value,
    ...(search.value && { search: search.value }),
    ...(isActive.value && { is_active: isActive.value }),
    ...(type.value && { type: type.value }),
    ...(provider.value && { provider: provider.value }),
}));

// Fetch payment methods
const { data: paymentMethodsResponse, pending, refresh, error: fetchError } = await useAsyncData(
    "payment-methods",
    () =>
        $fetch("/payment-methods", {
            baseURL: useRuntimeConfig().public.apiBase,
            headers: {
                Authorization: `Bearer ${useAuthStore().token}`,
            },
            params: params.value,
        }),
    {
        watch: [params],
    }
);

const paymentMethods = computed(() => {
    const response = paymentMethodsResponse.value as any;
    // Response structure: { status, statusCode, message, data: [...] }
    // If data is an array, return it directly
    if (Array.isArray(response?.data)) {
        return response.data;
    }
    // If data is an object with data property (paginated), return data.data
    return response?.data?.data || [];
});

const pagination = computed(() => {
    const response = paymentMethodsResponse.value as any;

    // If response.data is array (not paginated), create manual pagination
    if (Array.isArray(response?.data)) {
        const total = response.data.length;
        return {
            current_page: 1,
            last_page: 1,
            per_page: total,
            total: total,
            from: total > 0 ? 1 : 0,
            to: total,
        };
    }

    // If paginated response
    const paginationData = response?.data?.pagination;
    return {
        current_page: paginationData?.current_page || 1,
        last_page: paginationData?.last_page || 1,
        per_page: paginationData?.per_page || 15,
        total: paginationData?.total || 0,
        from: paginationData?.from || 0,
        to: paginationData?.to || 0,
    };
});

// Pagination
const goToPage = (pageNum: number) => {
    page.value = pageNum;
};

// Watch search with debounce
const { debouncedValue: debouncedSearch } = useSearchDebounce(search);
watch(debouncedSearch, () => {
    page.value = 1;
});

// Watch filters - reset to page 1
watch([isActive, type, provider, per_page], () => {
    page.value = 1;
});

// Use global badge helpers (imported from ~/utils/badgeHelpers)
</script>

<template>
    <div>
        <div class="card bg-base-100 shadow">
            <div class="card-body p-0">
                <!-- Filters -->
                <div class="flex items-center justify-between px-5 pt-5">
                    <div class="inline-flex items-center gap-3">
                        <label class="input input-sm">
                            <span class="iconify lucide--search text-base-content/80 size-3.5" />
                            <input
                                v-model="search"
                                type="search"
                                class="w-24 sm:w-48"
                                placeholder="Search payment methods..."
                                aria-label="Search payment methods" />
                        </label>
                    </div>
                    <div class="inline-flex items-center gap-3">
                        <NuxtLink
                            to="/settings/payment-methods/create"
                            aria-label="Create payment method"
                            class="btn btn-primary btn-sm max-sm:btn-square">
                            <span class="iconify lucide--plus size-4" />
                            <span class="hidden sm:inline">New Payment Method</span>
                        </NuxtLink>
                        <label
                            for="payment-methods-filter-drawer"
                            class="btn btn-ghost border-base-300 btn-sm btn-square"
                            aria-label="More filters">
                            <span class="iconify lucide--settings-2 size-4" />
                        </label>
                    </div>
                </div>

                <!-- Table -->
                <div class="mt-4 overflow-auto">
                    <!-- Loading State -->
                    <div v-if="pending" class="flex items-center justify-center py-12">
                        <span class="loading loading-spinner loading-lg"></span>
                    </div>

                    <!-- Empty State -->
                    <div v-else-if="paymentMethods.length === 0" class="flex flex-col items-center justify-center py-12">
                        <span class="iconify lucide--credit-card text-base-content/30 mb-4 size-16" />
                        <p class="text-base-content/60">No payment methods found</p>
                    </div>

                    <!-- Table -->
                    <table v-else class="table">
                        <thead>
                            <tr>
                                <th>Payment Method</th>
                                <th>Type</th>
                                <th>Provider</th>
                                <th>Fee</th>
                                <th>Status</th>
                                <th class="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="method in paymentMethods" :key="method.id">
                                <td>
                                    <div class="flex items-center gap-3">
                                        <div v-if="method.logo_url" class="avatar">
                                            <div class="mask mask-squircle h-10 w-10">
                                                <img :src="method.logo_url" :alt="method.name" class="object-cover" />
                                            </div>
                                        </div>
                                        <div v-else class="avatar placeholder">
                                            <div class="bg-neutral text-neutral-content mask mask-squircle h-10 w-10">
                                                <span class="iconify lucide--credit-card size-5" />
                                            </div>
                                        </div>
                                        <div>
                                            <div class="font-bold">{{ method.name }}</div>
                                            <div class="text-base-content/60 text-xs">{{ method.code }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span :class="['badge badge-sm', getPaymentTypeBadgeClass(method.type)]">
                                        {{ getPaymentTypeLabel(method.type) }}
                                    </span>
                                </td>
                                <td>
                                    <span :class="['badge badge-sm badge-outline', getPaymentProviderBadgeClass(method.provider)]">
                                        {{ method.provider }}
                                    </span>
                                </td>
                                <td class="text-sm">
                                    <div v-if="method.fee_percentage > 0 || method.fee_fixed > 0">
                                        <span v-if="method.fee_percentage > 0">{{ method.fee_percentage }}%</span>
                                        <span v-if="method.fee_percentage > 0 && method.fee_fixed > 0"> + </span>
                                        <span v-if="method.fee_fixed > 0">{{ formatPrice(method.fee_fixed) }}</span>
                                    </div>
                                    <span v-else class="text-base-content/60">Free</span>
                                </td>
                                <td>
                                    <span :class="['badge badge-sm', method.is_active ? 'badge-success' : 'badge-error']">
                                        {{ method.is_active ? 'Active' : 'Inactive' }}
                                    </span>
                                </td>
                                <td>
                                    <div class="flex justify-end gap-2">
                                        <NuxtLink
                                            :to="`/settings/payment-methods/${method.id}/show`"
                                            class="btn btn-ghost btn-xs"
                                            aria-label="View">
                                            <span class="iconify lucide--eye size-4" />
                                        </NuxtLink>
                                        <NuxtLink
                                            :to="`/settings/payment-methods/${method.id}/edit`"
                                            class="btn btn-ghost btn-xs"
                                            aria-label="Edit">
                                            <span class="iconify lucide--pencil size-4" />
                                        </NuxtLink>
                                        <button
                                            @click="openDeleteModal(method)"
                                            class="btn btn-ghost btn-xs text-error"
                                            aria-label="Delete">
                                            <span class="iconify lucide--trash-2 size-4" />
                                        </button>
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
                        <select v-model="per_page" class="select select-xs w-18" aria-label="Per page">
                            <option :value="10">10</option>
                            <option :value="15">15</option>
                            <option :value="20">20</option>
                            <option :value="50">50</option>
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

        <!-- Delete Confirmation Dialog -->
        <dialog v-if="confirmDelete" class="modal modal-open">
            <div class="modal-box">
                <h3 class="text-lg font-bold">Confirm Deletion</h3>
                <p class="py-4">
                    Are you sure you want to delete payment method
                    <strong>{{ selectedMethod?.name }}</strong>? This action cannot be undone.
                </p>
                <div class="modal-action">
                    <button class="btn" @click="confirmDelete = false">Cancel</button>
                    <button class="btn btn-error" @click="handleDelete">Delete</button>
                </div>
            </div>
            <form method="dialog" class="modal-backdrop" @submit.prevent="confirmDelete = false">
                <button>close</button>
            </form>
        </dialog>

        <!-- Filter Drawer Component -->
        <PaymentMethodsFilterDrawer
            v-model:is-active="isActive"
            v-model:type="type"
            v-model:provider="provider"
            @clear="clearFilters" />
    </div>
</template>
