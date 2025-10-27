<script setup lang="ts">
import { getStatusBadgeClass, getCustomerSegmentBadgeClass } from "~/utils/statusHelpers";
import { getErrorMessage } from "~/utils/errorHandlers";

const { deleteCustomer } = useCustomers();
const { success, error: showError } = useToast();

// Permission checks
const { canCreate, canUpdate, canDelete, canShow } = usePermissionCheck();

// Delete confirmation composable
const {
    confirmDelete,
    itemToDelete: customerToDelete,
    openDeleteModal,
    handleDelete
} = useDeleteConfirmation(
    deleteCustomer,
    "customer",
    async () => await refresh()
);

// Filters
const search = ref("");
const status = ref("");
const page = ref(1);
const per_page = ref(10);

// Build params reactively
const params = computed(() => ({
    page: page.value,
    per_page: per_page.value,
    ...(search.value && { search: search.value }),
    ...(status.value && { status: status.value }),
}));

// Fetch customers - reactively watch params
const { data: customersResponse, pending, refresh } = await useAsyncData(
    "customers",
    () => {
        return $fetch("/customers", {
            baseURL: useRuntimeConfig().public.apiBase,
            headers: {
                Authorization: `Bearer ${useAuthStore().token}`,
            },
            params: params.value,
        });
    },
    {
        watch: [params],
    },
);

const customers = computed(() => {
    const response = customersResponse.value as any;
    return response?.data?.customers?.data || [];
});

const pagination = computed(() => {
    const response = customersResponse.value as any;
    const customersData = response?.data?.customers;
    return {
        current_page: customersData?.current_page || 1,
        last_page: customersData?.last_page || 1,
        per_page: customersData?.per_page || 10,
        total: customersData?.total || 0,
        from: customersData?.from || 0,
        to: customersData?.to || 0,
    };
});

// Pagination
const goToPage = (pageNum: number) => {
    page.value = pageNum;
};

// Watch search with debounce
const { debouncedValue: debouncedSearch } = useSearchDebounce(search);
watch(debouncedSearch, () => {
    page.value = 1; // Reset to page 1 when searching
});

// Watch status - reset to page 1
watch(status, () => {
    page.value = 1;
});

</script>

<template>
    <div class="card bg-base-100 shadow">
        <div class="card-body">
            <!-- Filters -->
            <div class="mb-4 flex gap-3">
                <input
                    v-model="search"
                    type="text"
                    placeholder="Search customers..."
                    class="input input-bordered input-sm flex-1" />

                <select v-model="status" class="select select-bordered select-sm w-48">
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                </select>
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
                            <th>Customer Code</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Total Orders</th>
                            <th>Total Spent</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="customer in customers" :key="customer.id">
                            <td>
                                <span class="font-mono font-medium">{{ customer.customer_code }}</span>
                            </td>
                            <td>
                                <div class="flex flex-col">
                                    <span class="font-medium">{{ customer.name }}</span>
                                    <span class="text-base-content/60 text-xs">{{ customer.gender }}</span>
                                </div>
                            </td>
                            <td>{{ customer.email }}</td>
                            <td>{{ customer.phone || "-" }}</td>
                            <td>
                                <span class="font-medium">{{ customer.total_orders }}</span>
                            </td>
                            <td>
                                <span class="font-medium">{{ formatPrice(customer.total_spent) }}</span>
                            </td>
                            <td>
                                <span class="badge badge-sm" :class="getStatusBadgeClass(customer.status)">
                                    {{ capitalize(customer.status) }}
                                </span>
                            </td>
                            <td>
                                <div class="flex items-center gap-2">
                                    <NuxtLink
                                        v-if="canShow('customers')"
                                        :href="`/customers/${customer.id}/show`"
                                        class="btn btn-ghost btn-xs">
                                        <span class="iconify lucide--eye size-4" />
                                    </NuxtLink>
                                    <NuxtLink
                                        v-if="canUpdate('customers')"
                                        :href="`/customers/${customer.id}/edit`"
                                        class="btn btn-ghost btn-xs">
                                        <span class="iconify lucide--pencil size-4" />
                                    </NuxtLink>
                                    <!-- <button
                                        v-if="canDelete('customers')"
                                        @click="openDeleteModal(customer.id)"
                                        class="btn btn-ghost btn-xs text-error">
                                        <span class="iconify lucide--trash-2 size-4" />
                                    </button> -->
                                </div>
                            </td>
                        </tr>
                        <tr v-if="customers.length === 0">
                            <td colspan="10" class="text-center">No customers found</td>
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
                        v-for="page in Math.min(pagination.last_page, 5)"
                        :key="page"
                        :class="[
                            'btn btn-circle sm:btn-sm btn-xs',
                            page === pagination.current_page ? 'btn-primary' : 'btn-ghost',
                        ]"
                        @click="goToPage(page)">
                        {{ page }}
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
            <h3 class="text-lg font-bold">Delete Customer</h3>
            <p class="py-4">Are you sure you want to delete this customer? This action cannot be undone.</p>
            <div class="modal-action">
                <button class="btn btn-ghost" @click="confirmDelete = false">Cancel</button>
                <button class="btn btn-error" @click="handleDelete">Delete</button>
            </div>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button @click="confirmDelete = false">close</button>
        </form>
    </dialog>
</template>
