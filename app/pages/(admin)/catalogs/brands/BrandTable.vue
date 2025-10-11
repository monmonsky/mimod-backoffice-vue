<script setup lang="ts">
const { deleteBrand } = useBrands();
const { success, error: showError } = useToast();

const searchQuery = ref("");
const activeFilter = ref<boolean | "">("");
const currentPage = ref(1);
const perPage = ref(15);

const filters = computed(() => ({
    search: searchQuery.value || undefined,
    is_active: activeFilter.value !== "" ? activeFilter.value : undefined,
}));

const { data: brandsResponse, pending, error, refresh } = await useAsyncData(
    "brands",
    () => {
        return $fetch("/catalog/brands", {
            baseURL: useRuntimeConfig().public.apiBase,
            headers: {
                Authorization: `Bearer ${useAuthStore().token}`,
            },
            params: {
                page: currentPage.value,
                per_page: perPage.value,
                search: filters.value.search,
                is_active: filters.value.is_active,
            },
        });
    },
    {
        watch: [filters, currentPage, perPage],
    },
);

const brands = computed(() => {
    const response = brandsResponse.value as any;
    // Handle structure: { data: [{ current_page, data: [...] }] }
    if (response?.data && Array.isArray(response.data) && response.data[0]) {
        return response.data[0].data || [];
    }
    return [];
});

const pagination = computed(() => {
    const response = brandsResponse.value as any;
    // Handle structure: { data: [{ current_page, data: [...] }] }
    if (response?.data && Array.isArray(response.data) && response.data[0]) {
        const paginationData = response.data[0];
        return {
            current_page: paginationData.current_page || 1,
            last_page: paginationData.last_page || 1,
            per_page: paginationData.per_page || 15,
            total: paginationData.total || 0,
            from: paginationData.from || 0,
            to: paginationData.to || 0,
        };
    }
    return null;
});

const goToPage = (page: number) => {
    currentPage.value = page;
};

const confirmDelete = ref(false);
const brandToDelete = ref<any>(null);

const openDeleteModal = (brand: any) => {
    brandToDelete.value = brand;
    confirmDelete.value = true;
};

const handleDelete = async () => {
    if (!brandToDelete.value) return;

    try {
        await deleteBrand(brandToDelete.value.id);
        success("Brand deleted successfully!");
        confirmDelete.value = false;
        brandToDelete.value = null;
        await refresh();
    } catch (err: any) {
        const errorMessage = err?.data?.message || "Failed to delete brand";
        showError(errorMessage);
    }
};
</script>
<template>
    <div>
        <div class="card bg-base-100 shadow">
            <div class="card-body p-0">
                <div class="flex items-center justify-between px-5 pt-5">
                    <div class="inline-flex items-center gap-3">
                        <label class="input input-sm">
                            <span class="iconify lucide--search text-base-content/80 size-3.5" />
                            <input
                                v-model="searchQuery"
                                type="search"
                                class="w-24 sm:w-48"
                                placeholder="Search brands"
                                aria-label="Search brands" />
                        </label>
                        <div class="hidden sm:block">
                            <select v-model="activeFilter" class="select select-sm w-40" aria-label="Active Status">
                                <option value="">All Status</option>
                                <option :value="true">Active</option>
                                <option :value="false">Inactive</option>
                            </select>
                        </div>
                    </div>
                    <div class="inline-flex items-center gap-3">
                        <NuxtLink to="/catalogs/brands/create" aria-label="Create brand link" class="btn btn-primary btn-sm max-sm:btn-square">
                            <span class="iconify lucide--plus size-4" />
                            <span class="hidden sm:inline">New Brand</span>
                        </NuxtLink>
                    </div>
                </div>

                <div class="mt-4 overflow-auto">
                    <!-- Loading State -->
                    <div v-if="pending" class="flex items-center justify-center py-12">
                        <span class="loading loading-spinner loading-lg"></span>
                    </div>

                    <!-- Error State -->
                    <div v-else-if="error" class="alert alert-error m-4">
                        <span class="iconify lucide--alert-circle size-5" />
                        <span>Failed to load brands. Please try again.</span>
                    </div>

                    <!-- Empty State -->
                    <div v-else-if="brands.length === 0" class="flex flex-col items-center justify-center py-12">
                        <span class="iconify lucide--tag text-base-content/30 mb-4 size-16" />
                        <p class="text-base-content/60">No brands found</p>
                    </div>

                    <!-- Table -->
                    <table v-else class="table">
                        <thead>
                            <tr>
                                <th>Brand</th>
                                <th>Slug</th>
                                <th>Products</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="brand in brands" :key="brand.id" class="hover">
                                <td>
                                    <div class="flex items-center gap-3">
                                        <div v-if="brand.logo" class="avatar">
                                            <div class="w-10 rounded">
                                                <img :src="brand.logo" :alt="brand.name" />
                                            </div>
                                        </div>
                                        <div v-else class="avatar placeholder">
                                            <div class="bg-neutral text-neutral-content w-10 rounded">
                                                <span class="text-xs">{{ brand.name?.charAt(0) || "B" }}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <div class="font-semibold">{{ brand.name }}</div>
                                            <div v-if="brand.description" class="text-base-content/60 max-w-xs truncate text-xs">
                                                {{ brand.description }}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <code class="text-xs">{{ brand.slug }}</code>
                                </td>
                                <td>
                                    <span class="badge badge-ghost badge-sm">{{ brand.product_count || 0 }} products</span>
                                </td>
                                <td>
                                    <span class="badge badge-sm" :class="brand.is_active ? 'badge-success' : 'badge-error'">
                                        {{ brand.is_active ? "Active" : "Inactive" }}
                                    </span>
                                </td>
                                <td>
                                    <div class="inline-flex">
                                        <NuxtLink :href="`/catalogs/brands/${brand.id}/show`" class="btn btn-ghost btn-sm btn-square">
                                            <span class="iconify lucide--eye size-4" />
                                        </NuxtLink>
                                        <NuxtLink :href="`/catalogs/brands/${brand.id}/edit`" class="btn btn-ghost btn-sm btn-square">
                                            <span class="iconify lucide--pencil size-4" />
                                        </NuxtLink>
                                        <button class="btn btn-ghost btn-sm btn-square text-error" @click="openDeleteModal(brand)">
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
                        <select v-model="perPage" class="select select-xs w-18" aria-label="Per page">
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
                <h3 class="text-lg font-bold">Delete Brand</h3>
                <p class="py-4">Are you sure you want to delete "{{ brandToDelete?.name }}"? This action cannot be undone.</p>
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
