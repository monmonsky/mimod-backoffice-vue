<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";
import ProductVariantsManager from "../components/ProductVariantsManager.vue";
import ProductBasicInfoCard from "../components/ProductBasicInfoCard.vue";
import ProductSidebarSettings from "../components/ProductSidebarSettings.vue";
import ProductMediaCard from "../components/ProductMediaCard.vue";
import ProductSeoCard from "../components/ProductSeoCard.vue";
import { getErrorMessage } from "~/utils/errorHandlers";

definePageMeta({
    layout: "admin",
});

const route = useRoute();
const productId = parseInt(route.params.id as string);

const { updateProduct } = useProducts();
const { success, error: showError } = useToast();
const { uploadTempImages, moveImages } = useImageUpload();
const { generateSeo } = useAISeo();

// Fetch product
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

const form = ref({
    name: "",
    slug: "",
    description: "",
    brand_id: "",
    age_min: 5,
    age_max: 10,
    tags: [] as string[],
    images: [] as string[],
    status: "active",
    is_featured: false,
    seo_meta: {
        title: "",
        description: "",
        keywords: "",
    },
});

// Store existing media from product (separate from form.images for display)
const existingImages = ref<Array<{
    id: number;
    url: string;
    is_primary: boolean;
    sort_order: number;
    media_type?: string;
    thumbnail_url?: string;
    duration?: number;
}>>([]);

// Store temp media data (for newly uploaded images + videos)
const tempMedia = ref<Array<{
    url: string;
    path: string;
    media_type: string;
    thumbnail_url?: string;
    duration?: number;
    file_size?: number;
}>>([]);
const sessionId = ref<string>("");

const loading = ref(false);
const uploading = ref(false);
const generatingSeo = ref(false);

// Fetch brands for dropdown
const { getBrands } = useBrands();
const { data: brandsResponse } = getBrands({ per_page: 100 });

const brands = computed(() => {
    const response = brandsResponse.value as any;
    // Structure: { status, statusCode, message, data: [{ current_page, data: [...], ... }] }
    return response?.data?.[0]?.data || [];
});

// Fetch categories for dropdown
const { getCategories } = useCategories();
const { data: categoriesResponse } = getCategories({ per_page: 100 });

const categories = computed(() => {
    const response = categoriesResponse.value as any;
    // Response format: { data: [{ data: [...categories] }] }
    if (response && Array.isArray(response.data) && response.data.length > 0) {
        return response.data[0]?.data || [];
    }
    return [];
});

const selectedCategories = ref<number[]>([]);

// Helper to safely parse JSON
const safeJSONParse = (value: any, fallback: any = []) => {
    if (!value) return fallback;
    try {
        return typeof value === "string" ? JSON.parse(value) : value;
    } catch {
        return fallback;
    }
};

// Initialize form with product data
watch(
    product,
    (newProduct) => {
        if (newProduct) {
            // Store existing media (images + videos)
            if (Array.isArray(newProduct.images)) {
                existingImages.value = newProduct.images.map((img: any) => ({
                    id: img.id,
                    url: img.url,
                    is_primary: img.is_primary,
                    sort_order: img.sort_order,
                    media_type: img.media_type || 'image',
                    thumbnail_url: img.thumbnail_url,
                    duration: img.duration,
                }));
            }

            // Parse SEO meta - could be JSON string or object
            let seoMeta = { title: "", description: "", keywords: "" };
            if (newProduct.seo_meta) {
                try {
                    const parsed = typeof newProduct.seo_meta === "string" ? JSON.parse(newProduct.seo_meta) : newProduct.seo_meta;
                    seoMeta = {
                        title: parsed.title || "",
                        description: parsed.description || "",
                        keywords: parsed.keywords || "",
                    };
                } catch {
                    // If parsing fails, check for individual fields
                    seoMeta = {
                        title: newProduct.seo_title || "",
                        description: newProduct.seo_description || "",
                        keywords: newProduct.seo_keywords || "",
                    };
                }
            } else {
                // Fallback to individual fields
                seoMeta = {
                    title: newProduct.seo_title || "",
                    description: newProduct.seo_description || "",
                    keywords: newProduct.seo_keywords || "",
                };
            }

            form.value = {
                name: newProduct.name || "",
                slug: newProduct.slug || "",
                description: newProduct.description || "",
                brand_id: newProduct.brand_id?.toString() || "",
                age_min: newProduct.age_min || 5,
                age_max: newProduct.age_max || 10,
                tags: safeJSONParse(newProduct.tags, []),
                images: Array.isArray(newProduct.images) ? newProduct.images.map((img: any) => img.url) : [],
                status: newProduct.status || "active",
                is_featured: newProduct.is_featured || false,
                seo_meta: seoMeta,
            };

            // Set selected categories
            selectedCategories.value = newProduct.categories?.map((c: any) => c.id) || [];
        }
    },
    { immediate: true },
);

// Auto-generate slug from name
watch(
    () => form.value.name,
    (newName) => {
        if (!product.value || newName !== product.value.name) {
            form.value.slug = generateSlug(newName);
        }
    },
);

// Handle file upload to temp (images + video)
const handleFileUpload = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const files = target.files;

    if (!files || files.length === 0) return;

    try {
        uploading.value = true;
        const fileArray = Array.from(files);

        // Upload to temp folder (API handles both images and video)
        const response = await uploadTempImages(
            fileArray,
            {
                type: "product",
                maxSizeMB: 100,
                allowedTypes: [
                    "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp",
                    "video/mp4", "video/quicktime", "video/x-msvideo"
                ]
            },
            sessionId.value
        );

        // Store session ID for future uploads
        if (!sessionId.value) {
            sessionId.value = response.data.session_id;
        }

        // Store temp media data (images + video)
        response.data.images.forEach((media: any) => {
            tempMedia.value.push({
                url: media.url,
                path: media.path,
                media_type: media.media_type || 'image',
                thumbnail_url: media.thumbnail_url,
                duration: media.duration,
                file_size: media.file_size
            });
            form.value.images.push(media.url);
        });

        // Smart success message based on uploaded content
        const imageCount = response.data.images.filter((m: any) => m.media_type === 'image').length;
        const videoCount = response.data.images.filter((m: any) => m.media_type === 'video').length;

        let message = '';
        if (imageCount > 0 && videoCount > 0) {
            message = `${imageCount} image(s) and ${videoCount} video(s) uploaded successfully!`;
        } else if (videoCount > 0) {
            message = `${videoCount} video(s) uploaded successfully!`;
        } else {
            message = `${imageCount} image(s) uploaded successfully!`;
        }
        success(message);
    } catch (err) {
        showError(getErrorMessage(err, "Failed to upload media"));
    } finally {
        uploading.value = false;
    }
};

// Set image as primary
const setPrimaryImage = async (imageId: number) => {
    try {
        await $fetch(`/upload/product-image/${imageId}/set-primary`, {
            method: "PATCH",
            baseURL: useRuntimeConfig().public.apiBase,
            headers: {
                Authorization: `Bearer ${useAuthStore().token}`,
            },
        });

        // Update local state - set all to false, then set selected to true
        existingImages.value.forEach((img) => {
            img.is_primary = img.id === imageId;
        });

        success("Primary image updated");
    } catch (err) {
        showError(getErrorMessage(err, "Failed to set primary image"));
    }
};

// Remove media (image or video)
const removeMedia = async (index: number) => {
    // Check if removing from existing media or temp media
    if (index < existingImages.value.length) {
        // Removing existing media - need to call API
        const mediaToRemove = existingImages.value[index];
        if (!mediaToRemove) return;

        try {
            await $fetch(`/upload/product-image/${mediaToRemove.id}`, {
                method: "DELETE",
                baseURL: useRuntimeConfig().public.apiBase,
                headers: {
                    Authorization: `Bearer ${useAuthStore().token}`,
                },
            });

            // Remove from existingImages array
            existingImages.value.splice(index, 1);

            // Also remove from form.images by URL
            const formIndex = form.value.images.indexOf(mediaToRemove.url);
            if (formIndex !== -1) {
                form.value.images.splice(formIndex, 1);
            }

            success(mediaToRemove.media_type === 'video' ? "Video deleted successfully" : "Image deleted successfully");
        } catch (err) {
            showError(getErrorMessage(err, "Failed to delete media"));
        }
    } else {
        // Removing temp media - just remove from arrays
        const tempIndex = index - existingImages.value.length;
        const removedTemp = tempMedia.value[tempIndex];
        if (!removedTemp) return;

        tempMedia.value.splice(tempIndex, 1);

        // Remove from form.images by URL
        const formIndex = form.value.images.indexOf(removedTemp.url);
        if (formIndex !== -1) {
            form.value.images.splice(formIndex, 1);
        }
    }
};

// Generate SEO by AI
const handleGenerateSeo = async () => {
    // Validation
    if (!form.value.name) {
        showError("Product name is required to generate SEO");
        return;
    }

    if (!form.value.description) {
        showError("Product description is required to generate SEO");
        return;
    }

    try {
        generatingSeo.value = true;

        // Get brand name
        const brandName = brands.value.find((b: any) => b.id == form.value.brand_id)?.name || "";

        // Get category names
        const categoryNames = categories.value
            .filter((c: any) => selectedCategories.value.includes(c.id))
            .map((c: any) => c.name);

        // Prepare params
        const params = {
            name: form.value.name,
            description: form.value.description,
            brand_name: brandName,
            categories: categoryNames,
            tags: form.value.tags,
            age_min: form.value.age_min,
            age_max: form.value.age_max,
        };

        const response = await generateSeo(params);

        if (response.data) {
            form.value.seo_meta.title = response.data.title;
            form.value.seo_meta.description = response.data.description;
            form.value.seo_meta.keywords = response.data.keywords;
            success("SEO generated successfully!");
        }
    } catch (err) {
        showError(getErrorMessage(err, "Failed to generate SEO"));
    } finally {
        generatingSeo.value = false;
    }
};

// Submit form
const handleSubmit = async () => {
    if (!form.value.name) {
        showError("Product name is required");
        return;
    }

    if (!form.value.brand_id) {
        showError("Brand is required");
        return;
    }

    if (selectedCategories.value.length === 0) {
        showError("At least one category is required");
        return;
    }

    try {
        loading.value = true;

        // Move temp media (images + video) to permanent location if any
        if (tempMedia.value.length > 0) {
            const tempPaths = tempMedia.value.map((media) => media.path);
            const metadata = tempMedia.value.map((media) => ({
                media_type: media.media_type,
                duration: media.duration,
                file_size: media.file_size,
                thumbnail_url: media.thumbnail_url,
            }));

            await moveImages({
                temp_paths: tempPaths,
                type: "product",
                product_id: productId,
                metadata: metadata,
            });
        }

        const payload = {
            name: form.value.name,
            slug: form.value.slug,
            description: form.value.description,
            brand_id: parseInt(form.value.brand_id),
            category_ids: selectedCategories.value,
            age_min: form.value.age_min,
            age_max: form.value.age_max,
            tags: form.value.tags,
            images: form.value.images,
            status: form.value.status as "active" | "inactive" | "draft",
            is_featured: form.value.is_featured,
            seo_meta: form.value.seo_meta,
        };

        await updateProduct(productId, payload);

        success("Product updated successfully!");

        // Use navigateTo instead of router.push to avoid unmount issues
        await navigateTo("/catalogs/products");
    } catch (err) {
        showError(getErrorMessage(err, "Failed to update product"));
        loading.value = false;
    }
};
</script>

<template>
    <div>
        <PageTitle
            :title="'Edit Product'"
            :items="[
                { label: 'Catalogs' },
                { label: 'Products', path: '/catalogs/products' },
                { label: product?.name || 'Edit', active: true },
            ]" />

        <div v-if="loadingProduct" class="mt-6 flex items-center justify-center py-12">
            <span class="loading loading-spinner loading-lg"></span>
        </div>

        <div v-else class="mt-6">
            <form @submit.prevent="handleSubmit">
                <!-- 70/30 Layout -->
                <div class="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
                    <!-- LEFT COLUMN (70%) -->
                    <div class="space-y-6">
                        <!-- Basic Information -->
                        <ProductBasicInfoCard
                            v-model:name="form.name"
                            v-model:slug="form.slug"
                            v-model:description="form.description"
                        />

                        <!-- Product Media (Images & Video) -->
                        <ProductMediaCard
                            :existing-images="existingImages"
                            :temp-media="tempMedia"
                            :uploading="uploading"
                            :total-images="form.images.length"
                            @upload="handleFileUpload"
                            @set-primary="setPrimaryImage"
                            @remove="removeMedia"
                        />

                        <!-- SEO Meta -->
                        <ProductSeoCard
                            v-model:title="form.seo_meta.title"
                            v-model:description="form.seo_meta.description"
                            v-model:keywords="form.seo_meta.keywords"
                            :generating-seo="generatingSeo"
                            :can-generate="!!form.name && !!form.description"
                            @generate="handleGenerateSeo"
                        />

                        <!-- Product Variants -->
                        <ProductVariantsManager
                            :product-id="productId"
                            :product-name="product?.name || ''"
                            :initial-variants="product?.variants || []"
                        />
                    </div>

                    <!-- RIGHT COLUMN (30%) - Sidebar -->
                    <div class="space-y-6">
                        <ProductSidebarSettings
                            v-model:brand-id="form.brand_id"
                            v-model:selected-categories="selectedCategories"
                            v-model:age-min="form.age_min"
                            v-model:age-max="form.age_max"
                            v-model:tags="form.tags"
                            v-model:status="form.status"
                            v-model:is-featured="form.is_featured"
                            :brands="brands"
                            :categories="categories"
                        />
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="mt-6 flex justify-end gap-3">
                    <NuxtLink class="btn btn-sm btn-ghost" href="/catalogs/products">
                        <span class="iconify lucide--x size-4" />
                        Cancel
                    </NuxtLink>
                    <button type="submit" class="btn btn-sm btn-primary" :disabled="loading">
                        <span v-if="loading" class="loading loading-spinner loading-sm"></span>
                        <span v-else class="iconify lucide--save size-4" />
                        {{ loading ? "Saving..." : "Update Product" }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
