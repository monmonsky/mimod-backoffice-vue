<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";
import { getStatusBadgeClass } from "~/utils/statusHelpers";

definePageMeta({
    layout: "admin",
});

const route = useRoute();
const productId = parseInt(route.params.id as string);
const { getMediaUrl, getThumbnailUrl, isVideo, isImage } = useMediaUrl();

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
    const productData = response?.data || null;

    // Auto-detect media_type from URL if not provided by API
    if (productData?.images) {

        productData.images = productData.images.map((media: any) => {
            // If media_type not provided, detect from URL
            if (!media.media_type && media.url) {
                const url = media.url.toLowerCase();
                if (url.includes('.mp4') || url.includes('.mov') || url.includes('.avi') || url.includes('.webm')) {
                    media.media_type = 'video';
                } else {
                    media.media_type = 'image';
                }
            }
            return media;
        });

    }

    return productData;
});

// Parse tags
const tags = computed(() => {
    try {
        return JSON.parse(product.value?.tags || "[]");
    } catch {
        return [];
    }
});

// Get primary image
const getPrimaryImage = (variant: any) => {
    const primaryImg = variant?.images?.find((img: any) => img.is_primary);
    return primaryImg?.url || variant?.images?.[0]?.url || null;
};

// Stock quantity badge helper
const getStockBadgeClass = (quantity: number) => {
    if (quantity > 10) return "badge badge-sm badge-success";
    if (quantity > 0) return "badge badge-sm badge-warning";
    return "badge badge-sm badge-error";
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

// Parse SEO meta
const seoMeta = computed(() => {
    if (!product.value) return null;

    let seoData = {
        title: "",
        description: "",
        keywords: "",
    };

    // Try to parse seo_meta JSON field
    if (product.value.seo_meta) {
        try {
            const parsed = typeof product.value.seo_meta === "string"
                ? JSON.parse(product.value.seo_meta)
                : product.value.seo_meta;
            seoData = {
                title: parsed.title || "",
                description: parsed.description || "",
                keywords: parsed.keywords || "",
            };
        } catch {
            // Fallback to individual fields
            seoData = {
                title: product.value.seo_title || "",
                description: product.value.seo_description || "",
                keywords: product.value.seo_keywords || "",
            };
        }
    } else {
        // Fallback to individual fields
        seoData = {
            title: product.value.seo_title || "",
            description: product.value.seo_description || "",
            keywords: product.value.seo_keywords || "",
        };
    }

    return seoData;
});

// Parse keywords array
const seoKeywords = computed(() => {
    if (!seoMeta.value || !seoMeta.value.keywords) return [];
    return seoMeta.value.keywords
        .split(',')
        .map((k: string) => k.trim())
        .filter(Boolean);
});

// Image viewer state
const showImageViewer = ref(false);
const currentImageIndex = ref(0);

const openImageViewer = (index: number) => {
    currentImageIndex.value = index;
    showImageViewer.value = true;
};

const closeImageViewer = () => {
    showImageViewer.value = false;
};

const nextImage = () => {
    if (product.value?.images && currentImageIndex.value < product.value.images.length - 1) {
        currentImageIndex.value++;
    }
};

const prevImage = () => {
    if (currentImageIndex.value > 0) {
        currentImageIndex.value--;
    }
};

const currentImage = computed(() => {
    return product.value?.images?.[currentImageIndex.value] || null;
});

// Variant image viewer state
const showVariantImageViewer = ref(false);
const currentVariantImageIndex = ref(0);
const currentVariantImages = ref<any[]>([]);

const openVariantImageViewer = (variant: any, imageIndex: number = 0) => {
    currentVariantImages.value = variant.images || [];
    currentVariantImageIndex.value = imageIndex;
    showVariantImageViewer.value = true;
};

const closeVariantImageViewer = () => {
    showVariantImageViewer.value = false;
};

const nextVariantImage = () => {
    if (currentVariantImageIndex.value < currentVariantImages.value.length - 1) {
        currentVariantImageIndex.value++;
    }
};

const prevVariantImage = () => {
    if (currentVariantImageIndex.value > 0) {
        currentVariantImageIndex.value--;
    }
};

const currentVariantImage = computed(() => {
    return currentVariantImages.value[currentVariantImageIndex.value] || null;
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
                                <p class="text-base-content/80 whitespace-pre-line mt-2">{{ product.description }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Product Media (Images & Video) -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h3 class="card-title">
                            <span class="iconify lucide--images size-5" />
                            Product Media ({{ product.images?.length || 0 }})
                        </h3>
                        <div v-if="product.images && product.images.length > 0" class="mt-4">
                            <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                                <div
                                    v-for="(media, index) in product.images"
                                    :key="media.id"
                                    @click="openImageViewer(index)"
                                    class="group relative overflow-hidden rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg hover:scale-105"
                                    :class="media.is_primary ? 'border-primary' : media.media_type === 'video' ? 'border-primary' : 'border-base-300'">

                                    <div class="aspect-square relative">
                                        <!-- Image -->
                                        <img v-if="!media.media_type || media.media_type === 'image'" :src="getMediaUrl(media.url)" :alt="media.alt_text || product.name" class="h-full w-full object-cover" />

                                        <!-- Video with Thumbnail -->
                                        <div v-else-if="media.media_type === 'video'" class="h-full w-full relative">
                                            <img
                                                v-if="media.thumbnail_url"
                                                :src="getThumbnailUrl(media.thumbnail_url)"
                                                :alt="`Video thumbnail ${index + 1}`"
                                                class="h-full w-full object-cover" />
                                            <div v-else class="h-full w-full bg-base-300 flex items-center justify-center">
                                                <span class="iconify lucide--video size-12 text-base-content/40" />
                                            </div>
                                            <!-- Play Icon Overlay -->
                                            <div class="absolute inset-0 flex items-center justify-center bg-black/30">
                                                <div class="bg-primary rounded-full p-3">
                                                    <span class="iconify lucide--play size-8 text-white" />
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Hover Overlay (only for images) -->
                                        <div v-if="media.media_type === 'image'" class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span class="iconify lucide--eye size-8 text-white" />
                                        </div>
                                    </div>

                                    <!-- Video Badge -->
                                    <div v-if="media.media_type === 'video'" class="absolute top-2 left-2 badge badge-primary badge-sm gap-1 z-10">
                                        <span class="iconify lucide--video size-3" />
                                        Video
                                    </div>

                                    <!-- Video Duration -->
                                    <div v-if="media.media_type === 'video' && media.duration" class="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs z-10">
                                        {{ Math.floor(media.duration / 60) }}:{{ String(media.duration % 60).padStart(2, '0') }}
                                    </div>

                                    <!-- Primary Badge (for images only) -->
                                    <div
                                        v-if="media.is_primary && media.media_type === 'image'"
                                        class="absolute right-1 top-1 badge badge-primary badge-sm">
                                        <span class="iconify lucide--star size-3" />
                                        Primary
                                    </div>

                                    <!-- Sort Order -->
                                    <div class="bg-base-100/80 absolute bottom-0 left-0 right-0 p-2 text-center backdrop-blur-sm">
                                        <span class="text-xs">Sort: {{ media.sort_order }}</span>
                                    </div>
                                </div>
                            </div>
                            <p class="text-xs text-base-content/60 mt-3 flex items-center gap-1">
                                <span class="iconify lucide--info size-3" />
                                Click on images to view full size. Videos can be played directly.
                            </p>
                        </div>
                        <div v-else class="text-base-content/60 py-8 text-center">
                            <span class="iconify lucide--image size-12 text-base-content/20" />
                            <p class="mt-2 text-sm">No media uploaded</p>
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

                <!-- SEO Meta Information -->
                <div v-if="seoMeta && (seoMeta.title || seoMeta.description || seoMeta.keywords)" class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h3 class="card-title">
                            <span class="iconify lucide--search size-5" />
                            SEO Meta Information
                        </h3>
                        <div class="space-y-4">
                            <div v-if="seoMeta.title">
                                <label class="text-base-content/60 text-sm">SEO Title</label>
                                <p class="font-medium mt-1">{{ seoMeta.title }}</p>
                                <p class="text-base-content/60 text-xs mt-1">{{ seoMeta.title.length }} characters</p>
                            </div>
                            <div v-if="seoMeta.description">
                                <label class="text-base-content/60 text-sm">Meta Description</label>
                                <p class="text-base-content/80 mt-1">{{ seoMeta.description }}</p>
                                <p class="text-base-content/60 text-xs mt-1">{{ seoMeta.description.length }} characters</p>
                            </div>
                            <div v-if="seoKeywords.length > 0">
                                <label class="text-base-content/60 text-sm">Keywords</label>
                                <div class="mt-2 flex flex-wrap gap-2">
                                    <span
                                        v-for="keyword in seoKeywords"
                                        :key="keyword"
                                        class="badge badge-sm badge-outline">
                                        {{ keyword }}
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
                                            <div
                                                v-if="variant.images && variant.images.length > 0"
                                                class="avatar cursor-pointer group relative"
                                                @click="openVariantImageViewer(variant, 0)">
                                                <div class="mask mask-squircle h-10 w-10 relative">
                                                    <img
                                                        v-if="getPrimaryImage(variant)"
                                                        :src="getMediaUrl(getPrimaryImage(variant))"
                                                        :alt="variant.sku"
                                                        class="object-cover" />
                                                    <!-- Hover overlay -->
                                                    <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <span class="iconify lucide--eye size-4 text-white" />
                                                    </div>
                                                </div>
                                                <!-- Image count badge -->
                                                <div v-if="variant.images.length > 1" class="badge badge-xs badge-primary absolute -top-1 -right-1">
                                                    {{ variant.images.length }}
                                                </div>
                                            </div>
                                            <div v-else class="avatar">
                                                <div class="mask mask-squircle h-10 w-10">
                                                    <div class="bg-base-200 flex h-full w-full items-center justify-center">
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
                                            <span :class="getStockBadgeClass(variant.stock_quantity)">
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
                                    <span :class="getStatusBadgeClass(product.status)">
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

        <!-- Image Lightbox Modal -->
        <div v-if="showImageViewer" class="modal modal-open modal-bottom sm:modal-middle" @click.self="closeImageViewer">
            <div class="modal-box max-w-5xl p-0 overflow-hidden">
                <div class="relative bg-black">
                    <!-- Close Button -->
                    <button
                        @click="closeImageViewer"
                        class="btn btn-circle btn-sm absolute top-4 right-4 z-10 bg-black/50 border-none hover:bg-black/70">
                        <span class="iconify lucide--x size-5 text-white" />
                    </button>

                    <!-- Image Counter -->
                    <div class="absolute top-4 left-4 z-10 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                        {{ currentImageIndex + 1 }} / {{ product.images?.length || 0 }}
                    </div>

                    <!-- Main Media -->
                    <div class="flex items-center justify-center min-h-[60vh] max-h-[80vh] relative">
                        <!-- Image -->
                        <img
                            v-if="currentImage && currentImage.media_type === 'image'"
                            :src="getMediaUrl(currentImage.url)"
                            :alt="currentImage.alt_text || product.name"
                            class="max-w-full max-h-[80vh] object-contain" />

                        <!-- Video -->
                        <video
                            v-else-if="currentImage && currentImage.media_type === 'video'"
                            :src="getMediaUrl(currentImage.url)"
                            :poster="getThumbnailUrl(currentImage.thumbnail_url)"
                            controls
                            class="max-w-full max-h-[80vh] object-contain"
                            autoplay>
                        </video>

                        <!-- Navigation Buttons -->
                        <button
                            v-if="currentImageIndex > 0"
                            @click="prevImage"
                            class="btn btn-circle absolute left-4 bg-black/50 border-none hover:bg-black/70">
                            <span class="iconify lucide--chevron-left size-6 text-white" />
                        </button>
                        <button
                            v-if="product.images && currentImageIndex < product.images.length - 1"
                            @click="nextImage"
                            class="btn btn-circle absolute right-4 bg-black/50 border-none hover:bg-black/70">
                            <span class="iconify lucide--chevron-right size-6 text-white" />
                        </button>
                    </div>

                    <!-- Media Info -->
                    <div class="bg-base-100 p-4">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="font-medium">
                                    {{ currentImage?.alt_text || (currentImage?.media_type === 'video' ? 'Product Video' : 'Product Image') }}
                                </p>
                                <div class="flex gap-3 text-sm text-base-content/60 mt-1">
                                    <span>Sort Order: {{ currentImage?.sort_order }}</span>
                                    <span v-if="currentImage?.media_type === 'video' && currentImage?.duration">
                                        Duration: {{ Math.floor(currentImage.duration / 60) }}:{{ String(currentImage.duration % 60).padStart(2, '0') }}
                                    </span>
                                </div>
                            </div>
                            <div class="flex gap-2">
                                <div v-if="currentImage?.media_type === 'video'" class="badge badge-primary gap-2">
                                    <span class="iconify lucide--video size-3" />
                                    Video
                                </div>
                                <div v-if="currentImage?.is_primary && currentImage?.media_type === 'image'" class="badge badge-primary gap-2">
                                    <span class="iconify lucide--star size-3" />
                                    Primary Image
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-backdrop" @click="closeImageViewer"></div>
        </div>

        <!-- Variant Image Lightbox Modal -->
        <div v-if="showVariantImageViewer" class="modal modal-open modal-bottom sm:modal-middle" @click.self="closeVariantImageViewer">
            <div class="modal-box max-w-5xl p-0 overflow-hidden">
                <div class="relative bg-black">
                    <!-- Close Button -->
                    <button
                        @click="closeVariantImageViewer"
                        class="btn btn-circle btn-sm absolute top-4 right-4 z-10 bg-black/50 border-none hover:bg-black/70">
                        <span class="iconify lucide--x size-5 text-white" />
                    </button>

                    <!-- Image Counter -->
                    <div class="absolute top-4 left-4 z-10 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                        {{ currentVariantImageIndex + 1 }} / {{ currentVariantImages.length }}
                    </div>

                    <!-- Badge: Variant Image -->
                    <div class="absolute top-4 left-1/2 -translate-x-1/2 z-10 badge badge-primary gap-2">
                        <span class="iconify lucide--package size-3" />
                        Variant Image
                    </div>

                    <!-- Main Image -->
                    <div class="flex items-center justify-center min-h-[60vh] max-h-[80vh] relative">
                        <img
                            v-if="currentVariantImage"
                            :src="getMediaUrl(currentVariantImage.url)"
                            :alt="currentVariantImage.alt_text || 'Variant Image'"
                            class="max-w-full max-h-[80vh] object-contain" />

                        <!-- Navigation Buttons -->
                        <button
                            v-if="currentVariantImageIndex > 0"
                            @click="prevVariantImage"
                            class="btn btn-circle absolute left-4 bg-black/50 border-none hover:bg-black/70">
                            <span class="iconify lucide--chevron-left size-6 text-white" />
                        </button>
                        <button
                            v-if="currentVariantImageIndex < currentVariantImages.length - 1"
                            @click="nextVariantImage"
                            class="btn btn-circle absolute right-4 bg-black/50 border-none hover:bg-black/70">
                            <span class="iconify lucide--chevron-right size-6 text-white" />
                        </button>
                    </div>

                    <!-- Image Info -->
                    <div class="bg-base-100 p-4">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="font-medium">{{ currentVariantImage?.alt_text || 'Variant Image' }}</p>
                                <p class="text-sm text-base-content/60">Sort Order: {{ currentVariantImage?.sort_order }}</p>
                            </div>
                            <div v-if="currentVariantImage?.is_primary" class="badge badge-primary gap-2">
                                <span class="iconify lucide--star size-3" />
                                Primary
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-backdrop" @click="closeVariantImageViewer"></div>
        </div>
    </div>
</template>
