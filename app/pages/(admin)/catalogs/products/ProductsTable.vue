<script setup lang="ts">
const { getProducts, deleteProduct } = useProducts();
const { success, error: showError } = useToast();

// Filters
const search = ref("");
const status = ref("");
const brand = ref("");
const featured = ref("");
const page = ref(1);
const per_page = ref(20);

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
const { data: productsResponse, pending, refresh } = await getProducts(params.value, {
    watch: [params],
});

const products = computed(() => {
    const response = productsResponse.value as any;
    const productsList = response?.data?.products?.data || [];

    console.log('=== Products API Response ===');
    console.log('Full response:', response);
    console.log('Products list:', productsList);
    if (productsList.length > 0) {
        console.log('First product sample:', productsList[0]);
        console.log('First product total_variants:', productsList[0]?.total_variants);
    }

    return productsList;
});

const statistics = computed(() => {
    const response = productsResponse.value as any;
    const stats = response?.data?.statistics || {};

    console.log('=== Statistics ===');
    console.log('Statistics object:', stats);
    console.log('Total variants in stats:', stats?.total_variants);

    return stats;
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
const debouncedSearch = ref(search.value);
watch(search, (newVal) => {
    setTimeout(() => {
        debouncedSearch.value = newVal;
        page.value = 1;
    }, 500);
});

// Watch filters - reset to page 1
watch([status, brand, featured], () => {
    page.value = 1;
});

// Delete product
const confirmDelete = ref(false);
const productToDelete = ref<number | null>(null);

const openDeleteModal = (id: number) => {
    productToDelete.value = id;
    confirmDelete.value = true;
};

const handleDelete = async () => {
    if (!productToDelete.value) return;

    try {
        await deleteProduct(productToDelete.value);
        success("Product deleted successfully!");
        confirmDelete.value = false;
        productToDelete.value = null;
        refresh();
    } catch (err: any) {
        showError(err?.data?.message || "Failed to delete product");
    }
};

// Status badge
const getStatusClass = (status: string) => {
    const classes: Record<string, string> = {
        active: "badge-success",
        inactive: "badge-warning",
        draft: "badge-ghost",
    };
    return classes[status] || "badge-ghost";
};

// Parse tags
const parseTags = (tags: string) => {
    try {
        return JSON.parse(tags);
    } catch {
        return [];
    }
};

// Get primary image or first image
const getPrimaryImage = (images: any[]) => {
    if (!images || images.length === 0) return null;
    const primary = images.find((img) => img.is_primary);
    return primary || images[0];
};
</script>

<template>
    <div>
        <!-- Statistics Cards - 4 Most Important -->
        <div class="mb-6 py-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div class="card bg-base-100 shadow">
                <div class="card-body p-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-base-content/60 text-xs">Total Products</div>
                            <div class="text-2xl font-bold">{{ statistics.total || 0 }}</div>
                        </div>
                        <span class="iconify lucide--package size-8 text-base-content/20" />
                    </div>
                </div>
            </div>
            <div class="card bg-base-100 shadow">
                <div class="card-body p-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-base-content/60 text-xs">Active</div>
                            <div class="text-2xl font-bold text-success">{{ statistics.active || 0 }}</div>
                        </div>
                        <span class="iconify lucide--check-circle size-8 text-success/20" />
                    </div>
                </div>
            </div>
            <div class="card bg-base-100 shadow">
                <div class="card-body p-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-base-content/60 text-xs">Total Variants</div>
                            <div class="text-2xl font-bold">{{ statistics.total_variants || 0 }}</div>
                        </div>
                        <span class="iconify lucide--layers size-8 text-base-content/20" />
                    </div>
                </div>
            </div>
            <div class="card bg-base-100 shadow">
                <div class="card-body p-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-base-content/60 text-xs">Low Stock</div>
                            <div class="text-2xl font-bold text-error">{{ statistics.low_stock || 0 }}</div>
                        </div>
                        <span class="iconify lucide--alert-triangle size-8 text-error/20" />
                    </div>
                </div>
            </div>
        </div>

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
                                placeholder="Search products..."
                                aria-label="Search products" />
                        </label>
                        <div class="hidden sm:block">
                            <select v-model="status" class="select select-sm w-32">
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="draft">Draft</option>
                            </select>
                        </div>
                        <div class="hidden sm:block">
                            <select v-model="featured" class="select select-sm w-36">
                                <option value="">All Products</option>
                                <option value="1">Featured</option>
                                <option value="0">Not Featured</option>
                            </select>
                        </div>
                    </div>
                    <div class="inline-flex items-center gap-3">
                        <NuxtLink
                            to="/catalogs/products/create"
                            aria-label="Create product link"
                            class="btn btn-primary btn-sm max-sm:btn-square">
                            <span class="iconify lucide--plus size-4" />
                            <span class="hidden sm:inline">Add Product</span>
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
                                <th>Image</th>
                                <th>Product</th>
                                <th>Brand</th>
                                <th>Categories</th>
                                <th>Age Range</th>
                                <th>Variants</th>
                                <th>Status</th>
                                <th>Featured</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="product in products" :key="product.id">
                                <td>
                                    <div class="avatar">
                                        <div class="mask mask-squircle h-12 w-12">
                                            <img
                                                v-if="getPrimaryImage(product.images)"
                                                :src="getPrimaryImage(product.images).url"
                                                :alt="product.name"
                                                class="object-cover" />
                                            <div
                                                v-else
                                                class="bg-base-200 flex h-full w-full items-center justify-center">
                                                <span class="iconify lucide--image size-6 text-base-content/40" />
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div class="flex flex-col">
                                        <span class="font-medium">{{ product.name }}</span>
                                        <span class="text-base-content/60 text-xs">{{ product.slug }}</span>
                                    </div>
                                </td>
                                <td>
                                    <span class="badge badge-sm badge-outline">{{ product.brand_name }}</span>
                                </td>
                                <td>
                                    <div class="flex flex-wrap gap-1">
                                        <span
                                            v-for="(category, idx) in product.category_names"
                                            :key="idx"
                                            class="badge badge-sm badge-ghost">
                                            {{ category }}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <span class="text-sm">{{ product.age_min }} - {{ product.age_max }} years</span>
                                </td>
                                <td>
                                    <span class="badge badge-sm badge-info">
                                        {{ product.total_variants || product.variants?.length || 0 }}
                                    </span>
                                </td>
                                <td>
                                    <span class="badge badge-sm" :class="getStatusClass(product.status)">
                                        {{ capitalize(product.status) }}
                                    </span>
                                </td>
                                <td>
                                    <span v-if="product.is_featured" class="iconify lucide--star size-5 text-warning" />
                                    <span v-else class="text-base-content/20">-</span>
                                </td>
                                <td>
                                    <div class="flex items-center gap-2">
                                        <NuxtLink :href="`/catalogs/products/${product.id}/show`" class="btn btn-ghost btn-xs">
                                            <span class="iconify lucide--eye size-4" />
                                        </NuxtLink>
                                        <NuxtLink :href="`/catalogs/products/${product.id}/edit`" class="btn btn-ghost btn-xs">
                                            <span class="iconify lucide--pencil size-4" />
                                        </NuxtLink>
                                        <button @click="openDeleteModal(product.id)" class="btn btn-ghost btn-xs text-error">
                                            <span class="iconify lucide--trash-2 size-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="products.length === 0">
                                <td colspan="10" class="text-center">No products found</td>
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

        <!-- Delete Confirmation Modal -->
        <dialog :open="confirmDelete" class="modal">
            <div class="modal-box">
                <h3 class="text-lg font-bold">Delete Product</h3>
                <p class="py-4">Are you sure you want to delete this product? This action cannot be undone.</p>
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
