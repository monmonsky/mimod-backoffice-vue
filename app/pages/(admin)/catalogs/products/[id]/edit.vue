<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";
import ProductVariantsManager from "../components/ProductVariantsManager.vue";

definePageMeta({
    layout: "admin",
});

const route = useRoute();
const productId = parseInt(route.params.id as string);

const { updateProduct } = useProducts();
const { success, error: showError } = useToast();
const { uploadTempImages, moveImages } = useImageUpload();
const { generateSeo } = useAISeo();
const { getMediaUrl, getThumbnailUrl } = useMediaUrl();

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

const tagInput = ref("");
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
    // Structure: { status, statusCode, message, data: { categories: { data: [...] }, statistics: {...} } }
    return response?.data?.categories?.data || [];
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

// Add tag
const addTag = () => {
    if (tagInput.value.trim() && !form.value.tags.includes(tagInput.value.trim())) {
        form.value.tags.push(tagInput.value.trim());
        tagInput.value = "";
    }
};

// Remove tag
const removeTag = (index: number) => {
    form.value.tags.splice(index, 1);
};

// Handle tag input keydown
const handleTagKeydown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
        event.preventDefault();
        addTag();
    }
};

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
    } catch (err: any) {
        showError(err.message || "Failed to upload media");
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
    } catch (err: any) {
        showError(err?.data?.message || "Failed to set primary image");
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
        } catch (err: any) {
            showError(err?.data?.message || "Failed to delete media");
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
    } catch (err: any) {
        showError(err?.data?.message || "Failed to generate SEO");
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
    } catch (err: any) {
        showError(err?.data?.message || "Failed to update product");
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
                <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <!-- Basic Information -->
                    <div class="card bg-base-100 shadow">
                        <div class="card-body">
                            <div class="card-title">Basic Information</div>
                            <fieldset class="fieldset mt-2 grid grid-cols-1 gap-4">
                                <div class="space-y-2">
                                    <label class="fieldset-label" for="name">
                                        Name <span class="text-error">*</span>
                                    </label>
                                    <input
                                        id="name"
                                        v-model="form.name"
                                        type="text"
                                        class="input w-full"
                                        placeholder="Product name"
                                        required />
                                </div>
                                <div class="space-y-2">
                                    <label class="fieldset-label" for="slug">Slug</label>
                                    <input
                                        id="slug"
                                        v-model="form.slug"
                                        type="text"
                                        class="input w-full bg-base-200"
                                        placeholder="Auto-generated from name"
                                        readonly />
                                    <p class="text-base-content/60 text-xs">Auto-generated from product name</p>
                                </div>
                                <div class="space-y-2">
                                    <label class="fieldset-label" for="description"> Description </label>
                                    <textarea
                                        id="description"
                                        v-model="form.description"
                                        placeholder="Product description"
                                        class="textarea w-full"
                                        rows="4"></textarea>
                                </div>
                            </fieldset>
                        </div>
                    </div>

                    <!-- Brand & Categories -->
                    <div class="card bg-base-100 shadow">
                        <div class="card-body">
                            <div class="card-title">Brand & Categories</div>
                            <fieldset class="fieldset mt-2 grid grid-cols-1 gap-4">
                                <div class="space-y-2">
                                    <label class="fieldset-label" for="brand">
                                        Brand <span class="text-error">*</span>
                                    </label>
                                    <select id="brand" v-model="form.brand_id" class="select w-full" required>
                                        <option value="" disabled>Select brand</option>
                                        <option v-for="brand in brands" :key="brand.id" :value="brand.id">
                                            {{ brand.name }}
                                        </option>
                                    </select>
                                </div>
                                <div class="space-y-2">
                                    <label class="fieldset-label">
                                        Categories <span class="text-error">*</span>
                                    </label>
                                    <div class="space-y-2 max-h-48 overflow-y-auto p-2 border border-base-300 rounded-lg">
                                        <label
                                            v-for="category in categories"
                                            :key="category.id"
                                            class="flex cursor-pointer items-center gap-2 hover:bg-base-200 p-2 rounded">
                                            <input
                                                v-model="selectedCategories"
                                                type="checkbox"
                                                :value="category.id"
                                                class="checkbox checkbox-sm checkbox-primary" />
                                            <span class="label-text">{{ category.name }}</span>
                                        </label>
                                    </div>
                                    <p v-if="selectedCategories.length > 0" class="text-primary text-xs">
                                        {{ selectedCategories.length }} {{ selectedCategories.length === 1 ? 'category' : 'categories' }} selected
                                    </p>
                                </div>
                            </fieldset>
                        </div>
                    </div>

                    <!-- Age Range -->
                    <div class="card bg-base-100 shadow">
                        <div class="card-body">
                            <div class="card-title">Age Range</div>
                            <fieldset class="fieldset mt-2 grid grid-cols-2 gap-4">
                                <div class="space-y-2">
                                    <label class="fieldset-label" for="age_min"> Minimum Age </label>
                                    <label class="input w-full">
                                        <input
                                            id="age_min"
                                            v-model.number="form.age_min"
                                            class="grow"
                                            placeholder="0"
                                            type="number"
                                            min="0"
                                            required />
                                        <span class="text-base-content/60">years</span>
                                    </label>
                                </div>
                                <div class="space-y-2">
                                    <label class="fieldset-label" for="age_max"> Maximum Age </label>
                                    <label class="input w-full">
                                        <input
                                            id="age_max"
                                            v-model.number="form.age_max"
                                            class="grow"
                                            placeholder="0"
                                            type="number"
                                            min="0"
                                            required />
                                        <span class="text-base-content/60">years</span>
                                    </label>
                                </div>
                            </fieldset>
                        </div>
                    </div>

                    <!-- Tags -->
                    <div class="card bg-base-100 shadow">
                        <div class="card-body">
                            <div class="card-title">Tags</div>
                            <fieldset class="fieldset mt-2 gap-4">
                                <div class="space-y-2">
                                    <label class="fieldset-label" for="tag-input"> Add Tags </label>
                                    <div class="flex gap-2">
                                        <input
                                            id="tag-input"
                                            v-model="tagInput"
                                            type="text"
                                            placeholder="Enter tag and press Enter"
                                            class="input input-sm flex-1"
                                            @keydown="handleTagKeydown" />
                                        <button type="button" @click="addTag" class="btn btn-primary btn-sm">
                                            <span class="iconify lucide--plus size-4" />
                                        </button>
                                    </div>
                                </div>
                                <div v-if="form.tags.length > 0" class="flex flex-wrap gap-2 mt-2">
                                    <span
                                        v-for="(tag, index) in form.tags"
                                        :key="index"
                                        class="badge badge-primary gap-2 py-3">
                                        {{ tag }}
                                        <button
                                            type="button"
                                            @click="removeTag(index)"
                                            class="btn btn-circle btn-ghost btn-xs">
                                            <span class="iconify lucide--x size-3" />
                                        </button>
                                    </span>
                                </div>
                            </fieldset>
                        </div>
                    </div>

                    <!-- Product Media (Images & Video) -->
                    <div class="card bg-base-100 shadow md:col-span-2">
                        <div class="card-body">
                            <div class="card-title">
                                <span class="iconify lucide--images size-5" />
                                Product Media (Images & Video)
                            </div>
                            <div class="mt-2">
                                <!-- Existing Media from Product -->
                                <div v-if="existingImages.length > 0" class="mb-4">
                                    <label class="text-base-content/60 mb-2 block text-sm">Existing Media</label>
                                    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                                        <div
                                            v-for="(media, index) in existingImages"
                                            :key="media.id"
                                            class="group relative aspect-square overflow-hidden rounded-lg border-2"
                                            :class="media.is_primary ? 'border-primary' : media.media_type === 'video' ? 'border-primary' : 'border-base-300'">
                                            <!-- Image Preview -->
                                            <img v-if="media.media_type === 'image'" :src="getMediaUrl(media.url)" :alt="`Product image ${index + 1}`" class="h-full w-full object-cover" />

                                            <!-- Video Preview with Thumbnail -->
                                            <div v-else class="relative h-full w-full">
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
                                                        <span class="iconify lucide--play size-6 text-white" />
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Media Type Badge for Video -->
                                            <div v-if="media.media_type === 'video'" class="absolute top-2 left-2 badge badge-primary badge-sm gap-1 z-10">
                                                <span class="iconify lucide--video size-3" />
                                                Video
                                            </div>

                                            <!-- Video Duration -->
                                            <div v-if="media.media_type === 'video' && media.duration" class="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs z-10">
                                                {{ Math.floor(media.duration / 60) }}:{{ String(media.duration % 60).padStart(2, '0') }}
                                            </div>

                                            <!-- Primary Badge -->
                                            <div
                                                v-if="media.is_primary && media.media_type === 'image'"
                                                class="absolute left-1 top-1 badge badge-primary badge-xs">
                                                <span class="iconify lucide--star size-3" />
                                            </div>

                                            <!-- Sort Order -->
                                            <div class="bg-base-100/80 absolute bottom-0 left-0 right-0 p-1 text-center backdrop-blur-sm">
                                                <span class="text-xs">Sort: {{ media.sort_order }}</span>
                                            </div>

                                            <!-- Action buttons - show on hover -->
                                            <div class="absolute right-1 top-1 flex flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                                <button
                                                    v-if="!media.is_primary && media.media_type === 'image'"
                                                    type="button"
                                                    @click="setPrimaryImage(media.id)"
                                                    class="btn btn-circle btn-primary btn-xs"
                                                    title="Set as primary">
                                                    <span class="iconify lucide--star size-3" />
                                                </button>
                                                <button
                                                    type="button"
                                                    @click="removeMedia(index)"
                                                    class="btn btn-circle btn-error btn-xs"
                                                    :title="`Remove ${media.media_type}`">
                                                    <span class="iconify lucide--trash-2 size-3" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Newly Uploaded Media (Temp) -->
                                <div v-if="tempMedia.length > 0" class="mb-4">
                                    <label class="text-base-content/60 mb-2 block text-sm">New Media (Not Saved Yet)</label>
                                    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                                        <div
                                            v-for="(media, index) in tempMedia"
                                            :key="media.path"
                                            class="group relative aspect-square overflow-hidden rounded-lg border-2 border-warning">
                                            <!-- Image Preview -->
                                            <img v-if="media.media_type === 'image'" :src="getMediaUrl(media.url)" :alt="`New image ${index + 1}`" class="h-full w-full object-cover" />

                                            <!-- Video Preview with Thumbnail -->
                                            <div v-else class="relative h-full w-full">
                                                <img
                                                    v-if="media.thumbnail_url"
                                                    :src="getThumbnailUrl(media.thumbnail_url)"
                                                    :alt="`New video thumbnail ${index + 1}`"
                                                    class="h-full w-full object-cover" />
                                                <div v-else class="h-full w-full bg-base-300 flex items-center justify-center">
                                                    <span class="iconify lucide--video size-12 text-base-content/40" />
                                                </div>
                                                <!-- Play Icon Overlay -->
                                                <div class="absolute inset-0 flex items-center justify-center bg-black/30">
                                                    <div class="bg-warning rounded-full p-3">
                                                        <span class="iconify lucide--play size-6 text-white" />
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Media Type Badge -->
                                            <div class="absolute left-1 top-1 badge badge-warning badge-xs gap-1 z-10">
                                                <span v-if="media.media_type === 'video'" class="iconify lucide--video size-3" />
                                                {{ media.media_type === 'video' ? 'New Video' : 'New' }}
                                            </div>

                                            <!-- Video Duration -->
                                            <div v-if="media.media_type === 'video' && media.duration" class="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs z-10">
                                                {{ Math.floor(media.duration / 60) }}:{{ String(media.duration % 60).padStart(2, '0') }}
                                            </div>

                                            <button
                                                type="button"
                                                @click="removeMedia(existingImages.length + index)"
                                                class="btn btn-circle btn-error btn-xs absolute -right-1 -top-1 opacity-0 transition-opacity group-hover:opacity-100">
                                                <span class="iconify lucide--x size-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <!-- Upload Area -->
                                <div class="space-y-3">
                                    <div class="border-2 border-dashed border-base-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                                        <span class="iconify lucide--upload-cloud text-base-content/40 mb-2 size-10 block mx-auto" />
                                        <p class="text-base-content/60 mb-3 text-sm">
                                            {{ form.images.length > 0 ? "Add more images or video" : "Upload product images & video" }}
                                        </p>
                                        <label class="btn btn-primary btn-sm">
                                            <span v-if="uploading" class="loading loading-spinner loading-xs"></span>
                                            <span v-else class="iconify lucide--upload size-4" />
                                            {{ uploading ? "Uploading..." : "Choose Files" }}
                                            <input type="file" accept="image/*,video/*" multiple class="hidden" @change="handleFileUpload" :disabled="uploading" />
                                        </label>
                                    </div>
                                </div>

                                <div class="alert alert-info mt-3">
                                    <span class="iconify lucide--info size-4" />
                                    <div class="text-xs">
                                        <p><strong>Images:</strong> JPG, PNG, GIF, WebP. Max 10MB per image.</p>
                                        <p><strong>Video:</strong> MP4, MOV, AVI. Max 100MB. Max 1 video per product.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- SEO Meta -->
                    <div class="card bg-base-100 shadow md:col-span-2">
                        <div class="card-body">
                            <div class="flex items-center justify-between">
                                <div class="card-title">
                                    <span class="iconify lucide--search size-5" />
                                    SEO Meta Information
                                </div>
                                <button
                                    type="button"
                                    @click="handleGenerateSeo"
                                    class="btn btn-primary btn-sm"
                                    :disabled="generatingSeo || !form.name || !form.description">
                                    <span v-if="generatingSeo" class="loading loading-spinner loading-xs"></span>
                                    <span v-else class="iconify lucide--sparkles size-4" />
                                    {{ generatingSeo ? "Generating..." : "Generate by AI" }}
                                </button>
                            </div>
                            <fieldset class="fieldset mt-2 grid grid-cols-1 gap-4">
                                <div class="space-y-2">
                                    <label class="fieldset-label" for="seo_title">
                                        SEO Title
                                    </label>
                                    <input
                                        id="seo_title"
                                        v-model="form.seo_meta.title"
                                        type="text"
                                        class="input w-full"
                                        placeholder="SEO Title untuk Google Search"
                                        maxlength="60" />
                                    <p class="text-base-content/60 text-xs">
                                        Recommended: 50-60 characters ({{ form.seo_meta.title.length }}/60)
                                    </p>
                                </div>
                                <div class="space-y-2">
                                    <label class="fieldset-label" for="seo_description">
                                        SEO Meta Description
                                    </label>
                                    <textarea
                                        id="seo_description"
                                        v-model="form.seo_meta.description"
                                        placeholder="Meta description untuk snippet Google Search Results"
                                        class="textarea w-full"
                                        rows="3"
                                        maxlength="160"></textarea>
                                    <p class="text-base-content/60 text-xs">
                                        Recommended: 120-160 characters ({{ form.seo_meta.description.length }}/160)
                                    </p>
                                </div>
                                <div class="space-y-2">
                                    <label class="fieldset-label" for="seo_keywords">
                                        SEO Keywords
                                    </label>
                                    <input
                                        id="seo_keywords"
                                        v-model="form.seo_meta.keywords"
                                        type="text"
                                        class="input w-full"
                                        placeholder="keyword1, keyword2, keyword3" />
                                    <p class="text-base-content/60 text-xs">
                                        Separate keywords with commas
                                    </p>
                                </div>
                            </fieldset>
                        </div>
                    </div>

                    <!-- Status & Settings -->
                    <div class="card bg-base-100 shadow md:col-span-2">
                        <div class="card-body">
                            <div class="card-title">Status & Settings</div>
                            <fieldset class="fieldset mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div class="space-y-2">
                                    <label class="fieldset-label" for="status"> Product Status </label>
                                    <select id="status" v-model="form.status" class="select w-full">
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="draft">Draft</option>
                                    </select>
                                </div>
                                <div class="flex items-center gap-4 pt-8">
                                    <label class="label cursor-pointer gap-3" for="featured">
                                        <span class="label-text">Featured Product</span>
                                        <input
                                            id="featured"
                                            v-model="form.is_featured"
                                            class="toggle toggle-primary"
                                            type="checkbox" />
                                    </label>
                                </div>
                            </fieldset>
                        </div>
                    </div>

                    <!-- Product Variants -->
                    <div class="md:col-span-2">
                        <ProductVariantsManager
                            :product-id="productId"
                            :product-name="product?.name || ''"
                            :initial-variants="product?.variants || []" />
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
