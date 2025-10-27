<script setup lang="ts">
import { getStatusBadgeClass } from "~/utils/statusHelpers";
import { getErrorMessage } from "~/utils/errorHandlers";
import ProductsFilterDrawer from "./components/ProductsFilterDrawer.vue";

const { deleteProduct } = useProducts();
const { success, error: showError } = useToast();

// Permission checks
const { canCreate, canUpdate, canDelete, canShow } = usePermissionCheck();

// Delete confirmation composable
const {
    confirmDelete,
    itemToDelete: productToDelete,
    openDeleteModal,
    handleDelete
} = useDeleteConfirmation(
    deleteProduct,
    "product",
    async () => await refresh()
);
const { getMediaUrl, getThumbnailUrl } = useMediaUrl();

// Filters
const search = ref("");
const status = ref("");
const brand = ref("");
const featured = ref("");
const page = ref(1);
const per_page = ref(20);

// Clear filters
const clearFilters = () => {
    status.value = "";
    brand.value = "";
    featured.value = "";
};

// Build params reactively
const params = computed(() => ({
    page: page.value,
    per_page: per_page.value,
    ...(search.value && { search: search.value }),
    ...(status.value && { status: status.value }),
    ...(brand.value && { brand_id: brand.value }),
    ...(featured.value && { is_featured: featured.value }),
}));

// Fetch products using composable - reactively watch params
const { data: productsResponse, pending, refresh } = await useAsyncData(
    "products",
    () =>
        $fetch("/catalog/products", {
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

const products = computed(() => {
    const response = productsResponse.value as any;
    return response?.data?.products?.data || [];
});

const pagination = computed(() => {
    const response = productsResponse.value as any;
    const productsData = response?.data?.products;
    return {
        current_page: productsData?.current_page || 1,
        last_page: productsData?.last_page || 1,
        per_page: productsData?.per_page || 20,
        total: productsData?.total || 0,
        from: productsData?.from || 0,
        to: productsData?.to || 0,
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
watch([status, brand, featured, per_page], () => {
    page.value = 1;
});


// Parse tags
const parseTags = (tags: string) => {
    try {
        return JSON.parse(tags);
    } catch {
        return [];
    }
};

// Get primary image or first media (support video thumbnail)
const getPrimaryImage = (images: any[]) => {
    if (!images || images.length === 0) return null;

    // Find primary image first
    const primary = images.find((img) => img.is_primary && img.media_type === 'image');
    if (primary) return primary;

    // If no primary image, find first image
    const firstImage = images.find((img) => img.media_type === 'image' || !img.media_type);
    if (firstImage) return firstImage;

    // If no images, use first video's thumbnail
    const firstVideo = images.find((img) => img.media_type === 'video');
    if (firstVideo && firstVideo.thumbnail_url) {
        return {
            ...firstVideo,
            url: firstVideo.thumbnail_url, // Use thumbnail as URL
            is_video_thumbnail: true
        };
    }

    return images[0];
};

// Get display URL for media (handles both image and video thumbnail)
const getDisplayUrl = (media: any) => {
    if (!media) return '';

    // If it's a video thumbnail flag, URL is already set to thumbnail
    if (media.is_video_thumbnail) {
        return getThumbnailUrl(media.url);
    }

    // For regular images
    return getMediaUrl(media.url);
};
</script>

<template>
    <div>
        <div class="card bg-base-100 shadow">
            <div class="card-body p-0">
                <!-- Filters (Match UserTable/OrdersTable style) -->
                <div class="flex items-center justify-between px-5 pt-5">
                    <div class="inline-flex items-center gap-3">
                        <label class="input input-sm">
                            <span class="iconify lucide--search text-base-content/80 size-3.5" />
                            <input
                                v-model="search"
                                type="search"
                                class="w-24 sm:w-48"
                                placeholder="Search products..."
                                aria-label="Search products" />
                        </label>
                    </div>
                    <div class="inline-flex items-center gap-3">
                        <NuxtLink
                            v-if="canCreate('products')"
                            to="/catalogs/products/create"
                            aria-label="Create product link"
                            class="btn btn-primary btn-sm max-sm:btn-square">
                            <span class="iconify lucide--plus size-4" />
                            <span class="hidden sm:inline">New Product</span>
                        </NuxtLink>
                        <label
                            for="products-filter-drawer"
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
                    <div v-else-if="products.length === 0" class="flex flex-col items-center justify-center py-12">
                        <span class="iconify lucide--package text-base-content/30 mb-4 size-16" />
                        <p class="text-base-content/60">No products found</p>
                    </div>

                    <!-- Table -->
                    <table v-else class="table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Brand</th>
                                <th>Categories</th>
                                <th>Age Range</th>
                                <th>Variants</th>
                                <th>Status</th>
                                <th class="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="product in products" :key="product.id">
                                <td>
                                    <div class="flex items-center gap-3">
                                        <div class="avatar">
                                            <div class="mask mask-squircle h-12 w-12">
                                                <img
                                                    v-if="getPrimaryImage(product.images)"
                                                    :src="getDisplayUrl(getPrimaryImage(product.images))"
                                                    :alt="product.name"
                                                    class="object-cover" />
                                                <div
                                                    v-else
                                                    class="bg-base-200 flex h-full w-full items-center justify-center">
                                                    <span class="iconify lucide--image size-6 text-base-content/40" />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <div class="font-bold">{{ product.name }}</div>
                                            <div class="text-base-content/60 text-xs">{{ product.slug }}</div>
                                            <div v-if="product.is_featured" class="badge badge-warning badge-xs mt-1">
                                                Featured
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span class="badge badge-sm badge-outline">
                                        {{ product.brand_name || 'N/A' }}
                                    </span>
                                </td>
                                <td>
                                    <div v-if="product.categories && product.categories.length > 0" class="flex flex-wrap gap-1">
                                        <span
                                            v-for="category in product.categories.slice(0, 2)"
                                            :key="category.id"
                                            class="badge badge-sm badge-ghost">
                                            {{ category.name }}
                                        </span>
                                        <span
                                            v-if="product.categories.length > 2"
                                            class="badge badge-sm badge-primary">
                                            +{{ product.categories.length - 2 }}
                                        </span>
                                    </div>
                                    <span v-else class="text-base-content/60 text-sm">-</span>
                                </td>
                                <td class="text-sm text-base-content/80">
                                    {{ product.age_min }} - {{ product.age_max }} years
                                </td>
                                <td>
                                    <span class="badge badge-sm badge-info">
                                        {{ product.total_variants || product.variants?.length || 0 }}
                                    </span>
                                </td>
                                <td>
                                    <span :class="['badge badge-sm', getStatusBadgeClass(product.status)]">
                                        {{ product.status }}
                                    </span>
                                </td>
                                <td>
                                    <div class="flex justify-end gap-2">
                                        <NuxtLink
                                            :to="`/catalogs/products/${product.id}/show`"
                                            class="btn btn-ghost btn-xs"
                                            aria-label="View">
                                            <span class="iconify lucide--eye size-4" />
                                        </NuxtLink>
                                        <NuxtLink
                                            v-if="canUpdate('products')"
                                            :to="`/catalogs/products/${product.id}/edit`"
                                            class="btn btn-ghost btn-xs"
                                            aria-label="Edit">
                                            <span class="iconify lucide--pencil size-4" />
                                        </NuxtLink>
                                        <button
                                            v-if="canDelete('products')"
                                            @click="openDeleteModal(product.id)"
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

        <!-- Delete Confirmation Dialog -->
        <dialog v-if="confirmDelete" class="modal modal-open">
            <div class="modal-box">
                <h3 class="text-lg font-bold">Confirm Deletion</h3>
                <p class="py-4">
                    Are you sure you want to delete product
                    <strong>{{ productToDelete?.name }}</strong>? This action cannot be undone.
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
        <ProductsFilterDrawer
            v-model:status="status"
            v-model:brand="brand"
            v-model:featured="featured"
            @clear="clearFilters" />
    </div>
</template>
