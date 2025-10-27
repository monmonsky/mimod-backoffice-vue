<script setup lang="ts">
import { extractListData, extractPaginationMeta } from "~/utils/responseHelpers";
import { getErrorMessage } from "~/utils/errorHandlers";
import { getActiveBadgeClass } from "~/utils/statusHelpers";

const { deleteCategory } = useCategories();
const { success, error: showError } = useToast();

// Permission checks
const { canCreate, canUpdate, canDelete, canShow } = usePermissionCheck();

// Delete confirmation composable
const {
    confirmDelete,
    itemToDelete: categoryToDelete,
    openDeleteModal: openDeleteModalComposable,
    handleDelete
} = useDeleteConfirmation(
    (category: any) => deleteCategory(category.id),
    "category",
    async () => await refresh()
);

const searchQuery = ref("");
const activeFilter = ref<boolean | "">("");
const currentPage = ref(1);
const perPage = ref(15);

const filters = computed(() => ({
    search: searchQuery.value || undefined,
    is_active: activeFilter.value !== "" ? activeFilter.value : undefined,
}));

const { data: categoriesResponse, pending, error, refresh } = await useAsyncData(
    "categories",
    () => {
        return $fetch("/catalog/categories", {
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

const categories = computed(() => {
    const response = categoriesResponse.value as any;
    // Response format: { data: [{ data: [...categories] }] }
    if (response && Array.isArray(response.data) && response.data.length > 0) {
        return response.data[0].data || [];
    }
    return [];
});

const pagination = computed(() => {
    const response = categoriesResponse.value as any;
    // Response format: { data: [{ current_page, total, ... }] }
    if (response && Array.isArray(response.data) && response.data.length > 0) {
        return response.data[0];
    }
    return {
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
    };
});

const goToPage = (page: number) => {
    currentPage.value = page;
};

const openDeleteModal = (category: any) => {
    openDeleteModalComposable(category);
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
                                placeholder="Search categories"
                                aria-label="Search categories" />
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
                        <NuxtLink
                            v-if="canCreate('categories')"
                            to="/catalogs/categories/create"
                            aria-label="Create category link"
                            class="btn btn-primary btn-sm max-sm:btn-square">
                            <span class="iconify lucide--plus size-4" />
                            <span class="hidden sm:inline">New Category</span>
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
                        <span>Failed to load categories. Please try again.</span>
                    </div>

                    <!-- Empty State -->
                    <div v-else-if="categories.length === 0" class="flex flex-col items-center justify-center py-12">
                        <span class="iconify lucide--folder-tree text-base-content/30 mb-4 size-16" />
                        <p class="text-base-content/60">No categories found</p>
                    </div>

                    <!-- Table -->
                    <table v-else class="table">
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Slug</th>
                                <th>Parent</th>
                                <th>Products</th>
                                <th>Sort Order</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="category in categories" :key="category.id" class="hover">
                                <td>
                                    <div class="flex items-center gap-3">
                                        <div v-if="category.image" class="avatar">
                                            <div class="w-10 rounded">
                                                <img :src="category.image" :alt="category.name" />
                                            </div>
                                        </div>
                                        <div v-else class="avatar placeholder">
                                            <div class="bg-neutral text-neutral-content w-10 rounded">
                                                <span class="text-xs">{{ category.name?.charAt(0) || "C" }}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <div class="font-semibold">{{ category.name }}</div>
                                            <div v-if="category.description" class="text-base-content/60 max-w-xs truncate text-xs">
                                                {{ category.description }}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <code class="text-xs">{{ category.slug }}</code>
                                </td>
                                <td>
                                    <span v-if="category.parent_id" class="text-base-content/60 text-sm">
                                        ID: {{ category.parent_id }}
                                    </span>
                                    <span v-else class="text-base-content/40 text-sm">Root</span>
                                </td>
                                <td>
                                    <span class="badge badge-ghost badge-sm">{{ category.product_count || 0 }}</span>
                                </td>
                                <td>
                                    <span class="badge badge-ghost badge-sm">{{ category.sort_order }}</span>
                                </td>
                                <td>
                                    <span class="badge badge-sm" :class="getActiveBadgeClass(category.is_active)">
                                        {{ category.is_active ? "Active" : "Inactive" }}
                                    </span>
                                </td>
                                <td>
                                    <div class="inline-flex">
                                        <NuxtLink
                                            v-if="canShow('categories')"
                                            :href="`/catalogs/categories/${category.id}/show`"
                                            class="btn btn-ghost btn-sm btn-square">
                                            <span class="iconify lucide--eye size-4" />
                                        </NuxtLink>
                                        <NuxtLink
                                            v-if="canUpdate('categories')"
                                            :href="`/catalogs/categories/${category.id}/edit`"
                                            class="btn btn-ghost btn-sm btn-square">
                                            <span class="iconify lucide--pencil size-4" />
                                        </NuxtLink>
                                        <button
                                            v-if="canDelete('categories')"
                                            class="btn btn-ghost btn-sm btn-square text-error"
                                            @click="openDeleteModal(category)">
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
                <h3 class="text-lg font-bold">Delete Category</h3>
                <p class="py-4">Are you sure you want to delete "{{ categoryToDelete?.name }}"? This action cannot be undone.</p>
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
