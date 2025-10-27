<script setup lang="ts">
import { extractListData, extractPaginationMeta } from "~/utils/responseHelpers";
import { getErrorMessage } from "~/utils/errorHandlers";
import { getCouponStatusBadgeClass } from "~/utils/statusHelpers";

const { deleteCoupon } = useCoupons();
const { success, error: showError } = useToast();

// Permission checks
const { canCreate, canUpdate, canDelete, canShow } = usePermissionCheck();

// Delete confirmation composable
const {
    confirmDelete,
    itemToDelete: couponToDelete,
    openDeleteModal,
    handleDelete
} = useDeleteConfirmation(
    deleteCoupon,
    "coupon",
    async () => await refresh()
);

// Filters
const search = ref("");
const status = ref("");
const type = ref("");
const page = ref(1);
const per_page = ref(20);

// Build params reactively
const params = computed(() => ({
    page: page.value,
    per_page: per_page.value,
    ...(search.value && { search: search.value }),
    ...(status.value && { status: status.value }),
    ...(type.value && { type: type.value }),
}));

// Fetch coupons
const { data: couponsResponse, pending, refresh } = await useAsyncData(
    "coupons",
    () =>
        $fetch("/marketing/coupons", {
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

const coupons = computed(() => {
    const response = couponsResponse.value as any;
    return extractListData(response, "data.coupons");
});

const statistics = computed(() => {
    const response = couponsResponse.value as any;
    return response?.data?.statistics || {};
});

const pagination = computed(() => {
    const response = couponsResponse.value as any;
    return extractPaginationMeta(response, "data.coupons");
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
watch([status, type], () => {
    page.value = 1;
});

// Status & Type badge

const getTypeClass = (type: string) => {
    const classes: Record<string, string> = {
        percentage: "badge-primary",
        fixed: "badge-secondary",
        free_shipping: "badge-accent",
    };
    return classes[type] || "badge-ghost";
};

const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
        percentage: "Percentage",
        fixed: "Fixed Amount",
        free_shipping: "Free Shipping",
    };
    return labels[type] || type;
};

// Check if expired
const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
};
</script>

<template>
    <div>
        <!-- Table Card -->
        <div class="card bg-base-100 shadow">
            <div class="card-body p-0">
                <!-- Filters & Actions -->
                <div class="flex items-center justify-between px-5 pt-5 pb-4">
                    <div class="inline-flex items-center gap-3">
                        <label class="input input-sm">
                            <span class="iconify lucide--search text-base-content/80 size-3.5" />
                            <input
                                v-model="search"
                                type="search"
                                class="w-24 sm:w-48"
                                placeholder="Search coupons..."
                                aria-label="Search coupons" />
                        </label>
                        <div class="hidden sm:block">
                            <select v-model="status" class="select select-sm w-32">
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                        <div class="hidden sm:block">
                            <select v-model="type" class="select select-sm w-40">
                                <option value="">All Types</option>
                                <option value="percentage">Percentage</option>
                                <option value="fixed">Fixed Amount</option>
                                <option value="free_shipping">Free Shipping</option>
                            </select>
                        </div>
                    </div>
                    <div class="inline-flex items-center gap-3">
                        <NuxtLink
                            v-if="canCreate('coupons')"
                            to="/marketing/coupons/create"
                            aria-label="Create coupon link"
                            class="btn btn-primary btn-sm max-sm:btn-square">
                            <span class="iconify lucide--plus size-4" />
                            <span class="hidden sm:inline">Add Coupon</span>
                        </NuxtLink>
                    </div>
                </div>

                <!-- Loading -->
                <div v-if="pending" class="flex items-center justify-center py-12">
                    <span class="loading loading-spinner loading-lg"></span>
                </div>

                <!-- Table -->
                <div v-else class="overflow-x-auto">
                    <table class="table table-zebra">
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Value</th>
                                <th>Min Purchase</th>
                                <th>Usage</th>
                                <th>Valid Period</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="coupon in coupons" :key="coupon.id">
                                <td>
                                    <span class="badge badge-lg font-mono font-bold">{{ coupon.code }}</span>
                                </td>
                                <td>
                                    <div class="flex flex-col">
                                        <span class="font-medium">{{ coupon.name }}</span>
                                        <span v-if="coupon.description" class="text-base-content/60 text-xs">
                                            {{ coupon.description }}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <span class="badge badge-sm" :class="getTypeClass(coupon.type)">
                                        {{ getTypeLabel(coupon.type) }}
                                    </span>
                                </td>
                                <td>
                                    <div class="flex flex-col">
                                        <span class="font-medium">
                                            <template v-if="coupon.type === 'percentage'">
                                                {{ coupon.value }}%
                                            </template>
                                            <template v-else-if="coupon.type === 'fixed'">
                                                {{ formatPrice(coupon.value) }}
                                            </template>
                                            <template v-else>
                                                Free
                                            </template>
                                        </span>
                                        <span v-if="coupon.max_discount" class="text-base-content/60 text-xs">
                                            Max: {{ formatPrice(coupon.max_discount) }}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <span class="text-sm">{{ formatPrice(coupon.min_purchase) }}</span>
                                </td>
                                <td>
                                    <div class="flex flex-col">
                                        <span class="font-medium">{{ coupon.used_count }}</span>
                                        <span v-if="coupon.usage_limit" class="text-base-content/60 text-xs">
                                            / {{ coupon.usage_limit }}
                                        </span>
                                        <span v-else class="text-base-content/60 text-xs">Unlimited</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="flex flex-col text-xs">
                                        <span>{{ formatDate(coupon.start_date) }}</span>
                                        <span class="text-base-content/60">to</span>
                                        <span>{{ formatDate(coupon.end_date) }}</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="flex flex-col gap-1">
                                        <span class="badge badge-sm" :class="getStatusClass(coupon.is_active)">
                                            {{ coupon.is_active ? 'Active' : 'Inactive' }}
                                        </span>
                                        <span v-if="isExpired(coupon.end_date)" class="badge badge-sm badge-error">
                                            Expired
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <div class="flex items-center gap-2">
                                        <NuxtLink
                                            v-if="canShow('coupons')"
                                            :href="`/marketing/coupons/${coupon.id}/show`"
                                            class="btn btn-ghost btn-xs">
                                            <span class="iconify lucide--eye size-4" />
                                        </NuxtLink>
                                        <NuxtLink
                                            v-if="canUpdate('coupons')"
                                            :href="`/marketing/coupons/${coupon.id}/edit`"
                                            class="btn btn-ghost btn-xs">
                                            <span class="iconify lucide--pencil size-4" />
                                        </NuxtLink>
                                        <button
                                            v-if="canDelete('coupons')"
                                            @click="openDeleteModal(coupon.id)"
                                            class="btn btn-ghost btn-xs text-error">
                                            <span class="iconify lucide--trash-2 size-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="coupons.length === 0">
                                <td colspan="9" class="text-center">No coupons found</td>
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
                            v-for="pageNum in pagination.last_page"
                            :key="pageNum"
                            v-show="Math.abs(pageNum - pagination.current_page) < 3 || pageNum === 1 || pageNum === pagination.last_page"
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

        <!-- Delete Confirmation Modal -->
        <dialog :open="confirmDelete" class="modal">
            <div class="modal-box">
                <h3 class="text-lg font-bold">Delete Coupon</h3>
                <p class="py-4">Are you sure you want to delete this coupon? This action cannot be undone.</p>
                <div class="modal-action">
                    <button class="btn btn-ghost" @click="confirmDelete = false">Cancel</button>
                    <button class="btn btn-error" @click="handleDelete">Delete</button>
                </div>
            </div>
            <form method="dialog" class="modal-backdrop">
                <button @click="confirmDelete = false">close</button>
            </form>
        </dialog>
    </div>
</template>
