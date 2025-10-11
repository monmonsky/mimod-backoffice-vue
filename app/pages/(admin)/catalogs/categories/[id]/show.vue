<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";

definePageMeta({
    layout: "admin",
});

const route = useRoute();
const categoryId = parseInt(route.params.id as string);

const { data: categoryResponse, pending, error } = await useAsyncData(`category-${categoryId}`, () => {
    return $fetch(`/catalog/categories/${categoryId}`, {
        baseURL: useRuntimeConfig().public.apiBase,
        headers: {
            Authorization: `Bearer ${useAuthStore().token}`,
        },
    });
});

const category = computed(() => {
    const response = categoryResponse.value as any;
    if (response?.data) {
        if (Array.isArray(response.data) && response.data[0]) {
            return response.data[0];
        }
        return response.data;
    }
    return null;
});

// Fetch products for this category
const { data: productsResponse, pending: productsPending } = await useAsyncData(`category-products-${categoryId}`, () => {
    return $fetch(`/catalog/products/category/${categoryId}`, {
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
    return response?.data?.data || [];
});

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
};

const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(price);
};
</script>
<template>
    <div>
        <PageTitle
            :title="'Category Details'"
            :items="[{ label: 'Catalogs' }, { label: 'Categories', url: '/catalogs/categories' }, { label: 'Details', active: true }]" />

        <div class="mt-6">
            <!-- Loading State -->
            <div v-if="pending" class="flex items-center justify-center py-12">
                <span class="loading loading-spinner loading-lg"></span>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="alert alert-error">
                <span class="iconify lucide--alert-circle size-5" />
                <span>Failed to load category details. Please try again.</span>
            </div>

            <!-- Content -->
            <div v-else-if="category" class="grid gap-6">
                <!-- Category Info Card -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <div class="flex items-start justify-between">
                            <div class="flex items-center gap-4">
                                <div v-if="category.image" class="avatar">
                                    <div class="w-20 rounded-lg">
                                        <img :src="category.image" :alt="category.name" />
                                    </div>
                                </div>
                                <div v-else class="avatar placeholder">
                                    <div class="bg-neutral text-neutral-content w-20 rounded-lg">
                                        <span class="text-3xl">{{ category.name?.charAt(0) || "C" }}</span>
                                    </div>
                                </div>
                                <div>
                                    <h2 class="text-2xl font-bold">{{ category.name }}</h2>
                                    <code class="text-base-content/60 text-sm">{{ category.slug }}</code>
                                    <div class="mt-2 flex items-center gap-2">
                                        <span class="badge" :class="category.is_active ? 'badge-success' : 'badge-error'">
                                            {{ category.is_active ? "Active" : "Inactive" }}
                                        </span>
                                        <span class="badge badge-ghost">Sort: {{ category.sort_order }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="inline-flex gap-2">
                                <NuxtLink :to="`/catalogs/categories/${category.id}/edit`" class="btn btn-primary btn-sm">
                                    <span class="iconify lucide--pencil size-4" />
                                    Edit
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Parent Category Card -->
                <div v-if="category.parent_id" class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h3 class="card-title">Parent Category</h3>
                        <div class="flex items-center gap-2">
                            <span class="iconify lucide--corner-down-right text-base-content/60 size-5" />
                            <span class="text-base-content/80">Parent ID: {{ category.parent_id }}</span>
                        </div>
                    </div>
                </div>

                <!-- Description Card -->
                <div v-if="category.description" class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h3 class="card-title">Description</h3>
                        <p class="text-base-content/80">{{ category.description }}</p>
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
                                <div class="stat-value text-primary">{{ category.product_count || 0 }}</div>
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
                                    <span class="badge badge-sm" :class="product.status ? 'badge-success' : 'badge-error'">
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
                                <span class="font-medium">{{ formatDate(category.created_at) }}</span>
                            </div>
                            <div class="flex flex-col gap-1">
                                <span class="text-base-content/60 text-sm">Last Updated</span>
                                <span class="font-medium">{{ formatDate(category.updated_at) }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Back Button -->
                <div class="flex justify-end">
                    <NuxtLink to="/catalogs/categories" class="btn btn-ghost">
                        <span class="iconify lucide--arrow-left size-4" />
                        Back to List
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>
