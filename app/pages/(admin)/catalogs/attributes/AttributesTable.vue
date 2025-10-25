<script setup lang="ts">
import type { ProductAttribute } from '~/types/catalogs/attributes';

const { deleteAttribute } = useAttributes();
const { success, error: showError } = useToast();

// Search and filters
const searchQuery = ref('');
const activeFilter = ref<boolean | ''>('');
const currentPage = ref(1);
const perPage = ref(15);

const filters = computed(() => ({
    search: searchQuery.value || undefined,
    active_only: activeFilter.value !== '' ? activeFilter.value : undefined,
}));

// Fetch attributes
const {
    data: attributesResponse,
    pending,
    error,
    refresh,
} = await useAsyncData(
    'attributes',
    () =>
        $fetch('/catalog/attributes', {
            baseURL: useRuntimeConfig().public.apiBase,
            headers: {
                Authorization: `Bearer ${useAuthStore().token}`,
            },
            params: {
                search: filters.value.search,
                active_only: filters.value.active_only,
            },
        }),
    {
        watch: [filters],
    },
);

const attributes = computed(() => {
    const response = attributesResponse.value as any;
    if (response?.data && Array.isArray(response.data)) {
        return response.data;
    }
    return [];
});

// Client-side pagination
const paginatedAttributes = computed(() => {
    const start = (currentPage.value - 1) * perPage.value;
    const end = start + perPage.value;
    return attributes.value.slice(start, end);
});

const pagination = computed(() => {
    const total = attributes.value.length;
    const lastPage = Math.ceil(total / perPage.value);
    const from = total > 0 ? (currentPage.value - 1) * perPage.value + 1 : 0;
    const to = Math.min(currentPage.value * perPage.value, total);

    return {
        current_page: currentPage.value,
        last_page: lastPage,
        per_page: perPage.value,
        total: total,
        from: from,
        to: to,
    };
});

const goToPage = (page: number) => {
    currentPage.value = page;
};

// Reset to page 1 when filters change
watch([searchQuery, activeFilter, perPage], () => {
    currentPage.value = 1;
});

// Delete modal
const confirmDelete = ref(false);
const attributeToDelete = ref<ProductAttribute | null>(null);

const openDeleteModal = (attribute: ProductAttribute) => {
    attributeToDelete.value = attribute;
    confirmDelete.value = true;
};

const handleDelete = async () => {
    if (!attributeToDelete.value) return;

    try {
        await deleteAttribute(attributeToDelete.value.id);
        success('Attribute deleted successfully!');
        confirmDelete.value = false;
        attributeToDelete.value = null;
        await refresh();
    } catch (err: any) {
        showError(err?.data?.message || 'Failed to delete attribute');
    }
};

// Helper functions
const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
        select: 'Select',
        color: 'Color',
        radio: 'Radio',
        checkbox: 'Checkbox',
    };
    return labels[type] || type;
};

const getTypeBadgeClass = (type: string) => {
    const classes: Record<string, string> = {
        select: 'badge-primary',
        color: 'badge-secondary',
        radio: 'badge-accent',
        checkbox: 'badge-info',
    };
    return classes[type] || 'badge-ghost';
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
                                placeholder="Search attributes"
                                aria-label="Search attributes"
                            />
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
                            to="/catalogs/attributes/create"
                            aria-label="Create attribute link"
                            class="btn btn-primary btn-sm max-sm:btn-square"
                        >
                            <span class="iconify lucide--plus size-4" />
                            <span class="hidden sm:inline">New Attribute</span>
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
                        <span>Failed to load attributes. Please try again.</span>
                    </div>

                    <!-- Empty State -->
                    <div
                        v-else-if="paginatedAttributes.length === 0"
                        class="flex flex-col items-center justify-center py-12"
                    >
                        <span class="iconify lucide--sliders-horizontal text-base-content/30 mb-4 size-16" />
                        <p class="text-base-content/60">No attributes found</p>
                    </div>

                    <!-- Table -->
                    <table v-else class="table">
                        <thead>
                            <tr>
                                <th>Attribute</th>
                                <th>Slug</th>
                                <th>Type</th>
                                <th>Values</th>
                                <th>Required</th>
                                <th>Sort Order</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="attribute in paginatedAttributes" :key="attribute.id" class="hover">
                                <td>
                                    <div>
                                        <div class="font-semibold">{{ attribute.name }}</div>
                                        <div
                                            v-if="attribute.description"
                                            class="text-base-content/60 max-w-xs truncate text-xs"
                                        >
                                            {{ attribute.description }}
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <code class="text-xs">{{ attribute.slug }}</code>
                                </td>
                                <td>
                                    <span class="badge badge-sm" :class="getTypeBadgeClass(attribute.type)">
                                        {{ getTypeLabel(attribute.type) }}
                                    </span>
                                </td>
                                <td>
                                    <span class="badge badge-ghost badge-sm">{{ attribute.values_count || 0 }}</span>
                                </td>
                                <td>
                                    <span v-if="attribute.is_required" class="badge badge-warning badge-sm">
                                        Required
                                    </span>
                                    <span v-else class="text-base-content/40 text-sm">Optional</span>
                                </td>
                                <td>
                                    <span class="badge badge-ghost badge-sm">{{ attribute.sort_order }}</span>
                                </td>
                                <td>
                                    <span
                                        class="badge badge-sm"
                                        :class="attribute.is_active ? 'badge-success' : 'badge-error'"
                                    >
                                        {{ attribute.is_active ? 'Active' : 'Inactive' }}
                                    </span>
                                </td>
                                <td>
                                    <div class="inline-flex">
                                        <NuxtLink
                                            :href="`/catalogs/attributes/${attribute.id}/show`"
                                            class="btn btn-ghost btn-sm btn-square"
                                        >
                                            <span class="iconify lucide--eye size-4" />
                                        </NuxtLink>
                                        <NuxtLink
                                            :href="`/catalogs/attributes/${attribute.id}/edit`"
                                            class="btn btn-ghost btn-sm btn-square"
                                        >
                                            <span class="iconify lucide--pencil size-4" />
                                        </NuxtLink>
                                        <button
                                            class="btn btn-ghost btn-sm btn-square text-error"
                                            @click="openDeleteModal(attribute)"
                                            :disabled="!!(attribute.values_count && attribute.values_count > 0)"
                                        >
                                            <span class="iconify lucide--trash-2 size-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div v-if="pagination && pagination.total > 0" class="flex items-center justify-between p-6">
                    <div class="text-base-content/80 hover:text-base-content flex gap-2 text-sm">
                        <span class="hidden sm:inline">Per page</span>
                        <select v-model.number="perPage" class="select select-xs w-18" aria-label="Per page">
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
                            @click="goToPage(pagination.current_page - 1)"
                        >
                            <span class="iconify lucide--chevron-left" />
                        </button>
                        <button
                            v-for="page in Math.min(pagination.last_page, 5)"
                            :key="page"
                            :class="[
                                'btn btn-circle sm:btn-sm btn-xs',
                                page === pagination.current_page ? 'btn-primary' : 'btn-ghost',
                            ]"
                            @click="goToPage(page)"
                        >
                            {{ page }}
                        </button>
                        <button
                            class="btn btn-circle sm:btn-sm btn-xs btn-ghost"
                            aria-label="Next"
                            :disabled="pagination.current_page === pagination.last_page"
                            @click="goToPage(pagination.current_page + 1)"
                        >
                            <span class="iconify lucide--chevron-right" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <dialog :open="confirmDelete" class="modal">
            <div class="modal-box">
                <h3 class="text-lg font-bold">Delete Attribute</h3>
                <p class="py-4">
                    Are you sure you want to delete "{{ attributeToDelete?.name }}"?
                    <span
                        v-if="attributeToDelete?.values_count && attributeToDelete.values_count > 0"
                        class="mt-2 block text-sm text-error"
                    >
                        This attribute has {{ attributeToDelete.values_count }} value(s). You must delete all values
                        first.
                    </span>
                </p>
                <div class="modal-action">
                    <button class="btn btn-ghost btn-sm" @click="confirmDelete = false">
                        <span class="iconify lucide--x size-4" />
                        Cancel
                    </button>
                    <button
                        class="btn btn-error btn-sm"
                        :disabled="!!(attributeToDelete?.values_count && attributeToDelete.values_count > 0)"
                        @click="handleDelete"
                    >
                        <span class="iconify lucide--trash-2 size-4" />
                        Delete
                    </button>
                </div>
            </div>
            <form method="dialog" class="modal-backdrop">
                <button @click="confirmDelete = false">close</button>
            </form>
        </dialog>
    </div>
</template>
