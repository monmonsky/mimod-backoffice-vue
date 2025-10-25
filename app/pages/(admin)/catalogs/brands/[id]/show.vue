<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";
import { extractListData, extractNestedValue } from "~/utils/responseHelpers";
import { getActiveBadgeClass } from "~/utils/statusHelpers";
import { formatDate, formatPrice } from "~/utils/formatters";

definePageMeta({
    layout: "admin",
});

const route = useRoute();
const brandId = parseInt(route.params.id as string);

const { data: brandResponse, pending, error } = await useAsyncData(`brand-${brandId}`, () => {
    return $fetch(`/catalog/brands/${brandId}`, {
        baseURL: useRuntimeConfig().public.apiBase,
        headers: {
            Authorization: `Bearer ${useAuthStore().token}`,
        },
    });
});

const brand = computed(() => {
    const response = brandResponse.value as any;
    return extractNestedValue(response, "data", null);
});

// Fetch products for this brand
const { data: productsResponse, pending: productsPending } = await useAsyncData(`brand-products-${brandId}`, () => {
    return $fetch(`/catalog/products/brand/${brandId}`, {
        baseURL: useRuntimeConfig().public.apiBase,
        headers: {
            Authorization: `Bearer ${useAuthStore().token}`,
        },
        params: {
            per_page: 10,
            is_active: true,
        },
    });
});

const products = computed(() => {
    const response = productsResponse.value as any;
    const data = extractListData(response, "data");
    // Filter out null/undefined values and ensure array
    return Array.isArray(data) ? data.filter(item => item != null) : [];
});
</script>
<template>
    <div>
        <PageTitle
            :title="'Brand Details'"
            :items="[{ label: 'Catalogs' }, { label: 'Brands', url: '/catalogs/brands' }, { label: 'Details', active: true }]" />

        <div class="mt-6">
            <!-- Loading State -->
            <div v-if="pending" class="flex items-center justify-center py-12">
                <span class="loading loading-spinner loading-lg"></span>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="alert alert-error">
                <span class="iconify lucide--alert-circle size-5" />
                <span>Failed to load brand details. Please try again.</span>
            </div>

            <!-- Content -->
            <div v-else-if="brand" class="grid gap-6">
                <!-- Brand Info Card -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <div class="flex items-start justify-between">
                            <div class="flex items-center gap-4">
                                <div v-if="brand.logo" class="avatar">
                                    <div class="w-20 rounded-lg">
                                        <img :src="brand.logo" :alt="brand.name" />
                                    </div>
                                </div>
                                <div v-else class="avatar placeholder">
                                    <div class="bg-neutral text-neutral-content w-20 rounded-lg">
                                        <span class="text-3xl">{{ brand.name?.charAt(0) || "B" }}</span>
                                    </div>
                                </div>
                                <div>
                                    <h2 class="text-2xl font-bold">{{ brand.name }}</h2>
                                    <code class="text-base-content/60 text-sm">{{ brand.slug }}</code>
                                    <div class="mt-2">
                                        <span class="badge" :class="getActiveBadgeClass(brand.is_active)">
                                            {{ brand.is_active ? "Active" : "Inactive" }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="inline-flex gap-2">
                                <NuxtLink :to="`/catalogs/brands/${brand.id}/edit`" class="btn btn-primary btn-sm">
                                    <span class="iconify lucide--pencil size-4" />
                                    Edit
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Description Card -->
                <div v-if="brand.description" class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h3 class="card-title">Description</h3>
                        <p class="text-base-content/80">{{ brand.description }}</p>
                    </div>
                </div>

                <!-- Statistics Card -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h3 class="card-title">Statistics</h3>
                        <div class="grid gap-4 sm:grid-cols-2">
                            <div class="stat bg-base-200 rounded-lg">
                                <div class="stat-figure text-primary">
                                    <span class="iconify lucide--package size-8" />
                                </div>
                                <div class="stat-title">Total Products</div>
                                <div class="stat-value text-primary">{{ brand.product_count || 0 }}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Products Card -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h3 class="card-title">Products</h3>

                        <!-- Loading State -->
                        <div v-if="productsPending" class="flex items-center justify-center py-8">
                            <span class="loading loading-spinner loading-md"></span>
                        </div>

                        <!-- Empty State -->
                        <div v-else-if="products.length === 0" class="text-center py-8">
                            <span class="text-base-content/60">No products found</span>
                        </div>

                        <!-- Products List -->
                        <div v-else class="space-y-3">
                            <div v-for="product in products" :key="product.id" class="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                                <div class="flex items-center gap-3">
                                    <div v-if="product.image" class="avatar">
                                        <div class="w-12 rounded">
                                            <img :src="product.image" :alt="product.name" />
                                        </div>
                                    </div>
                                    <div v-else class="avatar placeholder">
                                        <div class="bg-neutral text-neutral-content w-12 rounded">
                                            <span class="text-xs">{{ product.name?.charAt(0) }}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="font-semibold">{{ product.name }}</div>
                                        <div class="text-base-content/60 text-xs">SKU: {{ product.sku || "-" }}</div>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <span class="badge" :class="getActiveBadgeClass(product.status)">
                                        {{ product.status ? "Active" : "Inactive" }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Metadata Card -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h3 class="card-title">Metadata</h3>
                        <div class="grid gap-4">
                            <div class="flex flex-col gap-1">
                                <span class="text-base-content/60 text-sm">Created At</span>
                                <span class="font-medium">{{ formatDate(brand.created_at) }}</span>
                            </div>
                            <div class="flex flex-col gap-1">
                                <span class="text-base-content/60 text-sm">Last Updated</span>
                                <span class="font-medium">{{ formatDate(brand.updated_at) }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Back Button -->
                <div class="flex justify-end">
                    <NuxtLink to="/catalogs/brands" class="btn btn-ghost">
                        <span class="iconify lucide--arrow-left size-4" />
                        Back to List
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>
