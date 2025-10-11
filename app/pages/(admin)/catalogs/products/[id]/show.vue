<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";

definePageMeta({
    layout: "admin",
});

const route = useRoute();
const productId = parseInt(route.params.id as string);

// Fetch product
const { data: productResponse, pending } = await useAsyncData(
    `product-${productId}`,
    () => {
        return $fetch(`/catalog/products/${productId}`, {
            baseURL: useRuntimeConfig().public.apiBase,
            headers: {
                Authorization: `Bearer ${useAuthStore().token}`,
            },
        });
    },
);

const product = computed(() => {
    const response = productResponse.value as any;
    return response?.data || null;
});

// Parse tags
const tags = computed(() => {
    try {
        return JSON.parse(product.value?.tags || "[]");
    } catch {
        return [];
    }
});

// Status badge
const getStatusClass = (status: string) => {
    const classes: Record<string, string> = {
        active: "badge-success",
        inactive: "badge-warning",
        draft: "badge-ghost",
    };
    return classes[status] || "badge-ghost";
};

// Get primary image
const getPrimaryImage = (variant: any) => {
    const primaryImg = variant?.images?.find((img: any) => img.is_primary);
    return primaryImg?.url || variant?.images?.[0]?.url || null;
};

// Calculate total stock
const totalStock = computed(() => {
    return product.value?.variants?.reduce((sum: number, v: any) => sum + (v.stock_quantity || 0), 0) || 0;
});

// Calculate lowest price
const lowestPrice = computed(() => {
    if (!product.value?.variants?.length) return 0;
    return Math.min(...product.value.variants.map((v: any) => parseFloat(v.price)));
});

// Calculate highest price
const highestPrice = computed(() => {
    if (!product.value?.variants?.length) return 0;
    return Math.max(...product.value.variants.map((v: any) => parseFloat(v.price)));
});
</script>

<template>
    <div>
        <PageTitle
            :title="product?.name || 'Product Detail'"
            :items="[{ label: 'Catalogs' }, { label: 'Products', path: '/catalogs/products' }, { label: 'Detail', active: true }]">
        </PageTitle>

        <div v-if="pending" class="mt-6 flex items-center justify-center py-12">
            <span class="loading loading-spinner loading-lg"></span>
        </div>

        <div v-else-if="product" class="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
            <!-- Left Column - Product Info -->
            <div class="lg:col-span-2 space-y-5">
                <!-- Basic Information -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h3 class="card-title">Basic Information</h3>
                        <div class="grid gap-4 md:grid-cols-2">
                            <div>
                                <label class="text-base-content/60 text-sm">Product Name</label>
                                <p class="font-medium">{{ product.name }}</p>
                            </div>
                            <div>
                                <label class="text-base-content/60 text-sm">Slug</label>
                                <p class="font-mono text-sm">{{ product.slug }}</p>
                            </div>
                            <div>
                                <label class="text-base-content/60 text-sm">Brand</label>
                                <p>
                                    <span class="badge badge-outline">{{ product.brand_name }}</span>
                                </p>
                            </div>
                            <div>
                                <label class="text-base-content/60 text-sm">Age Range</label>
                                <p>{{ product.age_min }} - {{ product.age_max }} years</p>
                            </div>
                            <div class="md:col-span-2">
                                <label class="text-base-content/60 text-sm">Description</label>
                                <p class="text-base-content/80">{{ product.description }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Product Images -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h3 class="card-title">Product Images ({{ product.images?.length || 0 }})</h3>
                        <div v-if="product.images && product.images.length > 0" class="mt-4">
                            <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                                <div
                                    v-for="image in product.images"
                                    :key="image.id"
                                    class="relative overflow-hidden rounded-lg border-2"
                                    :class="image.is_primary ? 'border-primary' : 'border-base-300'">
                                    <div class="aspect-square">
                                        <img :src="image.url" :alt="image.alt_text || product.name" class="h-full w-full object-cover" />
                                    </div>
                                    <div
                                        v-if="image.is_primary"
                                        class="absolute right-1 top-1 badge badge-primary badge-sm">
                                        <span class="iconify lucide--star size-3" />
                                        Primary
                                    </div>
                                    <div class="bg-base-100/80 absolute bottom-0 left-0 right-0 p-2 text-center backdrop-blur-sm">
                                        <span class="text-xs">Sort: {{ image.sort_order }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else class="text-base-content/60 py-8 text-center">
                            <span class="iconify lucide--image size-12 text-base-content/20" />
                            <p class="mt-2 text-sm">No images uploaded</p>
                        </div>
                    </div>
                </div>

                <!-- Categories & Tags -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h3 class="card-title">Categories & Tags</h3>
                        <div class="space-y-4">
                            <div>
                                <label class="text-base-content/60 text-sm">Categories</label>
                                <div class="mt-2 flex flex-wrap gap-2">
                                    <span
                                        v-for="category in product?.categories"
                                        :key="category.id"
                                        class="badge badge-lg badge-ghost">
                                        {{ category.name }}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label class="text-base-content/60 text-sm">Tags</label>
                                <div class="mt-2 flex flex-wrap gap-2">
                                    <span v-for="tag in tags" :key="tag" class="badge badge-sm badge-primary">
                                        {{ tag }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Variants -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h3 class="card-title mb-4">Product Variants ({{ product.variants?.length || 0 }})</h3>

                        <div class="overflow-x-auto">
                            <table class="table table-zebra table-sm">
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>SKU</th>
                                        <th>Size</th>
                                        <th>Color</th>
                                        <th>Price</th>
                                        <th>Compare Price</th>
                                        <th>Stock</th>
                                        <th>Weight</th>
                                        <th>Barcode</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="variant in product.variants" :key="variant.id">
                                        <td>
                                            <div class="avatar">
                                                <div class="mask mask-squircle h-10 w-10">
                                                    <img
                                                        v-if="getPrimaryImage(variant)"
                                                        :src="getPrimaryImage(variant)"
                                                        :alt="variant.sku"
                                                        class="object-cover" />
                                                    <div
                                                        v-else
                                                        class="bg-base-200 flex h-full w-full items-center justify-center">
                                                        <span class="iconify lucide--image size-4 text-base-content/40" />
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span class="font-mono text-xs">{{ variant.sku }}</span>
                                        </td>
                                        <td>{{ variant.size }}</td>
                                        <td>{{ variant.color }}</td>
                                        <td>
                                            <span class="font-medium">{{ formatPrice(variant.price) }}</span>
                                        </td>
                                        <td>
                                            <span class="text-base-content/60 line-through text-sm">
                                                {{ formatPrice(variant.compare_at_price) }}
                                            </span>
                                        </td>
                                        <td>
                                            <span
                                                :class="[
                                                    'badge badge-sm',
                                                    variant.stock_quantity > 10 ? 'badge-success' : variant.stock_quantity > 0 ? 'badge-warning' : 'badge-error'
                                                ]">
                                                {{ variant.stock_quantity }}
                                            </span>
                                        </td>
                                        <td>{{ variant.weight_gram }}g</td>
                                        <td>
                                            <span class="font-mono text-xs">{{ variant.barcode }}</span>
                                        </td>
                                    </tr>
                                    <tr v-if="!product.variants || product.variants.length === 0">
                                        <td colspan="9" class="text-center">No variants found</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Column - Statistics & Status -->
            <div class="space-y-5">
                <!-- Status & Featured -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h3 class="card-title">Status</h3>
                        <div class="space-y-3">
                            <div>
                                <label class="text-base-content/60 text-sm">Product Status</label>
                                <div class="mt-1">
                                    <span class="badge" :class="getStatusClass(product.status)">
                                        {{ capitalize(product.status) }}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label class="text-base-content/60 text-sm">Featured Product</label>
                                <div class="mt-1">
                                    <span v-if="product.is_featured" class="badge badge-warning">
                                        <span class="iconify lucide--star size-3" />
                                        Featured
                                    </span>
                                    <span v-else class="text-base-content/60">Not Featured</span>
                                </div>
                            </div>
                            <div>
                                <label class="text-base-content/60 text-sm">View Count</label>
                                <p class="text-xl font-bold">{{ product.view_count }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Stock & Pricing Summary -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h3 class="card-title">Summary</h3>
                        <div class="space-y-4">
                            <div>
                                <label class="text-base-content/60 text-sm">Total Variants</label>
                                <p class="text-2xl font-bold">{{ product.variants?.length || 0 }}</p>
                            </div>
                            <div>
                                <label class="text-base-content/60 text-sm">Total Stock</label>
                                <p class="text-2xl font-bold text-success">{{ totalStock }}</p>
                            </div>
                            <div>
                                <label class="text-base-content/60 text-sm">Price Range</label>
                                <p class="text-lg font-bold">
                                    {{ formatPrice(lowestPrice) }}
                                    <span v-if="lowestPrice !== highestPrice" class="text-base-content/60">
                                        - {{ formatPrice(highestPrice) }}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Timestamps -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h3 class="card-title">Information</h3>
                        <div class="space-y-3">
                            <div>
                                <label class="text-base-content/60 text-sm">Created At</label>
                                <p class="text-sm">{{ formatDate(product.created_at, 'datetime') }}</p>
                            </div>
                            <div>
                                <label class="text-base-content/60 text-sm">Last Updated</label>
                                <p class="text-sm">{{ formatDate(product.updated_at, 'datetime') }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
