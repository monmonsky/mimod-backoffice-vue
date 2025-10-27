<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";
import ProductVariantsManager from "~/pages/(admin)/catalogs/products/components/ProductVariantsManager.vue";
import { getErrorMessage } from "~/utils/errorHandlers";

definePageMeta({
    layout: "admin",
});

const route = useRoute();
const productId = parseInt(route.params.id as string);

const { success, error: showError } = useToast();

// Product type selection
const selectedProductType = ref<'single' | 'multiple' | null>(null);
const creatingDefaultVariant = ref(false);

// Handle product type selection
const handleSelectProductType = async (type: 'single' | 'multiple') => {
    selectedProductType.value = type;

    if (type === 'single') {
        // Auto-create default variant for single product
        try {
            creatingDefaultVariant.value = true;

            const defaultVariantPayload = {
                product_id: productId,
                size: 'One Size',
                color: 'Default',
                price: 0,
                stock_quantity: 0,
                weight_gram: 200,
            };

            await $fetch('/catalog/products/variants', {
                method: 'POST',
                baseURL: useRuntimeConfig().public.apiBase,
                headers: {
                    Authorization: `Bearer ${useAuthStore().token}`,
                },
                body: defaultVariantPayload,
            });

            success('Default variant created! Redirecting to edit page...');

            // Wait a bit then redirect to edit page with force reload
            setTimeout(() => {
                // Use window.location for hard reload to ensure fresh data
                window.location.href = `/catalogs/products/${productId}/edit`;
            }, 1500);

        } catch (variantErr) {
            showError(getErrorMessage(variantErr, 'Failed to create default variant. Please try manually.'));
            creatingDefaultVariant.value = false;
            selectedProductType.value = null;
        }
    }
};

// Fetch product details
const { data: productResponse, pending: loadingProduct } = await useAsyncData(`product-${productId}`, () =>
    $fetch(`/catalog/products/${productId}`, {
        baseURL: useRuntimeConfig().public.apiBase,
        headers: {
            Authorization: `Bearer ${useAuthStore().token}`,
        },
    }),
);

const product = computed(() => {
    const response = productResponse.value as any;
    return response?.data || null;
});

// Track variants count
const variantsCount = ref(0);

// Update variants count when variants change
watch(
    () => product.value?.variants,
    (variants) => {
        variantsCount.value = variants?.length || 0;
    },
    { immediate: true },
);

// Variants count will be updated via @variants-changed event from ProductVariantsManager

// Handle finish - update status to active and redirect
const handleFinish = async () => {
    if (variantsCount.value === 0) {
        showError("Please add at least 1 variant before finishing");
        return;
    }

    try {
        // Update product status to active
        await $fetch(`/catalog/products/${productId}/status`, {
            method: "PATCH",
            baseURL: useRuntimeConfig().public.apiBase,
            headers: {
                Authorization: `Bearer ${useAuthStore().token}`,
            },
            body: {
                status: "active",
            },
        });

        success("Product setup completed and activated successfully!");
        await navigateTo("/catalogs/products");
    } catch (err) {
        showError(getErrorMessage(err, "Failed to activate product"));
    }
};

// Skip variants - go back to products list with warning
const handleSkip = async () => {
    if (confirm("Are you sure? This product won't be sellable without variants.")) {
        await navigateTo("/catalogs/products");
    }
};
</script>

<template>
    <div>
        <PageTitle
            :title="`Add Variants - ${product?.name || 'Product'}`"
            :items="[
                { label: 'Catalogs' },
                { label: 'Products', path: '/catalogs/products' },
                { label: 'Create', path: '/catalogs/products/create' },
                { label: 'Add Variants', active: true },
            ]" />

        <div v-if="loadingProduct" class="mt-6 flex items-center justify-center py-12">
            <span class="loading loading-spinner loading-lg"></span>
        </div>

        <div v-else class="mt-6">
            <!-- Progress Indicator -->
            <div class="card bg-base-100 mb-6 shadow">
                <div class="card-body">
                    <div class="flex items-center justify-between">
                        <div>
                            <h3 class="text-lg font-semibold">Step 2 of 2: Add Product Variants</h3>
                            <p class="text-base-content/60 mt-1 text-sm">Add at least one variant to complete the product setup</p>
                        </div>
                        <div class="badge badge-lg badge-primary">Step 2/2</div>
                    </div>

                    <!-- Step Progress Bar -->
                    <div class="mt-4">
                        <div class="flex items-center gap-2">
                            <div class="flex flex-1 items-center gap-2">
                                <div class="badge badge-success badge-sm">✓</div>
                                <span class="text-sm font-medium">Product Created</span>
                            </div>
                            <div class="bg-base-300 h-0.5 w-12"></div>
                            <div class="flex flex-1 items-center gap-2">
                                <div class="badge badge-primary badge-sm">2</div>
                                <span class="text-sm font-medium">Add Variants</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Warning Banner -->
            <div
                v-if="variantsCount === 0"
                role="alert"
                class="alert alert-warning mb-6 shadow-lg">
                <span class="iconify lucide--alert-triangle size-6"></span>
                <div>
                    <h3 class="font-bold">Action Required</h3>
                    <div class="text-sm">You must add at least 1 variant to make this product sellable.</div>
                </div>
            </div>

            <!-- Success Banner -->
            <div
                v-else
                role="alert"
                class="alert alert-success mb-6 shadow-lg">
                <span class="iconify lucide--check-circle size-6"></span>
                <div>
                    <h3 class="font-bold">Great! Variants Added</h3>
                    <div class="text-sm">You've added {{ variantsCount }} variant{{ variantsCount > 1 ? 's' : '' }}. Click "Finish" to complete.</div>
                </div>
            </div>

            <!-- Product Type Selection -->
            <div v-if="!selectedProductType && variantsCount === 0" class="card bg-base-100 mb-6 shadow">
                <div class="card-body">
                    <h3 class="card-title">Choose Product Type</h3>
                    <p class="text-base-content/60 text-sm mb-4">
                        Select how you want to manage variants for this product
                    </p>

                    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <!-- Single Product Option -->
                        <button
                            class="flex items-start gap-4 rounded-lg border-2 border-base-300 p-6 text-left transition-all hover:border-primary hover:bg-primary/5"
                            @click="handleSelectProductType('single')"
                        >
                            <span class="iconify lucide--package size-8 text-primary flex-shrink-0" />
                            <div class="flex-1">
                                <h4 class="font-semibold text-lg mb-2">Single Product</h4>
                                <p class="text-base-content/60 text-sm mb-3">
                                    Best for products without size/color variations. One SKU, quick setup.
                                </p>
                                <div class="flex flex-wrap gap-2">
                                    <span class="badge badge-sm badge-ghost">No variants</span>
                                    <span class="badge badge-sm badge-ghost">Auto-created</span>
                                    <span class="badge badge-sm badge-success">Recommended for simple items</span>
                                </div>
                            </div>
                        </button>

                        <!-- Multiple Variants Option -->
                        <button
                            class="flex items-start gap-4 rounded-lg border-2 border-base-300 p-6 text-left transition-all hover:border-primary hover:bg-primary/5"
                            @click="handleSelectProductType('multiple')"
                        >
                            <span class="iconify lucide--boxes size-8 text-secondary flex-shrink-0" />
                            <div class="flex-1">
                                <h4 class="font-semibold text-lg mb-2">Product with Variants</h4>
                                <p class="text-base-content/60 text-sm mb-3">
                                    For products with multiple sizes, colors, or other variations. Full control over each variant.
                                </p>
                                <div class="flex flex-wrap gap-2">
                                    <span class="badge badge-sm badge-ghost">Multiple variants</span>
                                    <span class="badge badge-sm badge-ghost">Bulk generate</span>
                                    <span class="badge badge-sm badge-info">For clothing, shoes, etc</span>
                                </div>
                            </div>
                        </button>
                    </div>

                    <!-- Loading State for Single Product -->
                    <div v-if="creatingDefaultVariant" class="mt-4 flex items-center justify-center gap-3 rounded-lg bg-primary/10 py-4">
                        <span class="loading loading-spinner loading-md text-primary"></span>
                        <span class="text-primary font-medium">Creating default variant...</span>
                    </div>
                </div>
            </div>

            <!-- Product Info Summary -->
            <div v-if="selectedProductType === 'multiple' || variantsCount > 0" class="card bg-base-100 mb-6 shadow">
                <div class="card-body">
                    <h3 class="card-title text-base">Product Information</h3>
                    <div class="grid grid-cols-2 gap-4 mt-2 md:grid-cols-4">
                        <div>
                            <p class="text-base-content/60 text-xs">Product Name</p>
                            <p class="font-medium">{{ product?.name }}</p>
                        </div>
                        <div>
                            <p class="text-base-content/60 text-xs">Brand</p>
                            <p class="font-medium">{{ product?.brand_name }}</p>
                        </div>
                        <div>
                            <p class="text-base-content/60 text-xs">Categories</p>
                            <p class="font-medium">{{ product?.categories?.length || 0 }} selected</p>
                        </div>
                        <div>
                            <p class="text-base-content/60 text-xs">Images</p>
                            <p class="font-medium">{{ product?.images?.length || 0 }} uploaded</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Variants Manager -->
            <ProductVariantsManager
                v-if="product && selectedProductType === 'multiple'"
                :product-id="productId"
                :product-name="product.name"
                :initial-variants="product.variants || []"
                @variants-changed="variantsCount = $event" />

            <!-- Action Buttons -->
            <div class="mt-6 flex items-center justify-between gap-3">
                <button type="button" @click="handleSkip" class="btn btn-ghost btn-sm">
                    <span class="iconify lucide--skip-forward size-4" />
                    Skip for Now
                </button>

                <div class="flex gap-3">
                    <NuxtLink :to="`/catalogs/products/${productId}/edit`" class="btn btn-outline btn-sm">
                        <span class="iconify lucide--arrow-left size-4" />
                        Back to Edit Product
                    </NuxtLink>
                    <button
                        type="button"
                        @click="handleFinish"
                        class="btn btn-primary btn-sm"
                        :disabled="variantsCount === 0">
                        <span class="iconify lucide--check size-4" />
                        Finish Setup
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
