<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";

definePageMeta({
    layout: "admin",
});

const { t } = useI18n();
const { createProduct } = useProducts();
const { success, error: showError } = useToast();
const { uploadTempImages, moveImages } = useImageUpload();
const { generateSeo } = useAISeo();

const form = ref({
    name: "",
    slug: "",
    description: "",
    brand_id: "",
    age_min: 5,
    age_max: 10,
    tags: [] as string[],
    images: [] as string[],
    status: "draft", // Auto-set to draft, will be activated after variants added
    is_featured: false,
    seo_meta: {
        title: "",
        description: "",
        keywords: "",
    },
});

// Store temp media data (images + videos)
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

// Auto-generate slug from name
watch(
    () => form.value.name,
    (newName) => {
        form.value.slug = generateSlug(newName);
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

        const imageCount = response.data.images.filter((m: any) => m.media_type === 'image').length;
        const videoCount = response.data.images.filter((m: any) => m.media_type === 'video').length;

        let message = '';
        if (imageCount > 0 && videoCount > 0) {
            message = t('product.success.mediaUploaded', { imageCount, videoCount });
        } else if (videoCount > 0) {
            message = t('product.success.videoUploaded', { count: videoCount });
        } else {
            message = t('product.success.imageUploaded', { count: imageCount });
        }

        success(message);
    } catch (err: any) {
        showError(err.message || t('product.error.uploadFailed'));
    } finally {
        uploading.value = false;
    }
};

// Remove media (image or video)
const removeMedia = (index: number) => {
    tempMedia.value.splice(index, 1);
    form.value.images.splice(index, 1);
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
            success(t('product.success.seoGenerated'));
        }
    } catch (err: any) {
        showError(err?.data?.message || t('product.error.seoGenerateFailed'));
    } finally {
        generatingSeo.value = false;
    }
};

// Submit form
const handleSubmit = async () => {
    if (!form.value.name) {
        showError(t('product.validation.nameRequired'));
        return;
    }

    if (!form.value.brand_id) {
        showError(t('product.validation.brandRequired'));
        return;
    }

    if (selectedCategories.value.length === 0) {
        showError(t('product.validation.categoryRequired'));
        return;
    }

    try {
        loading.value = true;

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

        // Create product first
        const productResponse = (await createProduct(payload)) as any;

        // Try different possible response structures
        const productId = productResponse?.data?.id || productResponse?.id;

        if (!productId) {
            showError("Failed to get product ID from response");
            loading.value = false;
            return;
        }

        // Move temp media (images + video) to permanent location if any
        if (tempMedia.value.length > 0) {
            console.log("=== BEFORE MOVE IMAGES ===");
            console.log("tempMedia.value:", tempMedia.value);
            console.log("tempMedia count:", tempMedia.value.length);

            const tempPaths = tempMedia.value.map((media) => media.path);
            const metadata = tempMedia.value.map((media) => ({
                media_type: media.media_type,
                duration: media.duration,
                file_size: media.file_size,
                thumbnail_url: media.thumbnail_url,
            }));

            console.log("Temp Paths to move:", tempPaths);
            console.log("Metadata:", metadata);
            console.log("Product ID:", productId);
            console.log("==========================");

            await moveImages({
                temp_paths: tempPaths,
                type: "product",
                product_id: productId,
                metadata: metadata,
            });

            console.log("=== AFTER MOVE IMAGES ===");
            console.log("Move images completed successfully");
            console.log("=========================");
        } else {
            console.log("=== NO TEMP MEDIA TO MOVE ===");
            console.log("tempMedia.value is empty, skipping moveImages");
            console.log("==============================");
        }

        success(t('product.success.created'));

        // Redirect to Step 2: Add Variants (SPA navigation without reload)
        const redirectUrl = `/catalogs/products/create/${productId}/variants`;

        // Don't reset loading here, let the navigation complete
        await navigateTo(redirectUrl);
    } catch (err: any) {
        showError(err?.data?.message || t('product.error.createFailed'));
        loading.value = false;
    }
};
</script>

<template>
    <div>
        <PageTitle
            :title="$t('product.create')"
            :items="[{ label: $t('nav.catalogs') }, { label: $t('nav.products'), path: '/catalogs/products' }, { label: $t('common.create'), active: true }]" />

        <div class="mt-6">
            <form @submit.prevent="handleSubmit">
                <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <!-- Basic Information -->
                    <div class="card bg-base-100 shadow">
                        <div class="card-body">
                            <div class="card-title">{{ $t('product.info.basicInformation') }}</div>
                            <fieldset class="fieldset mt-2 grid grid-cols-1 gap-4">
                                <div class="space-y-2">
                                    <label class="fieldset-label" for="name">
                                        {{ $t('product.name') }} <span class="text-error">*</span>
                                    </label>
                                    <input
                                        id="name"
                                        v-model="form.name"
                                        type="text"
                                        class="input w-full"
                                        :placeholder="$t('product.name')"
                                        required />
                                </div>
                                <div class="space-y-2">
                                    <label class="fieldset-label" for="slug">{{ $t('product.slug') }}</label>
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

                    <!-- Product Media (Images + Video) -->
                    <div class="card bg-base-100 shadow md:col-span-2">
                        <div class="card-body">
                            <div class="card-title">
                                <span class="iconify lucide--images size-5" />
                                {{ $t('product.media.title') }}
                            </div>
                            <div class="mt-2">
                                <!-- Preview media -->
                                <div v-if="tempMedia.length > 0" class="mb-4">
                                    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                                        <div
                                            v-for="(media, index) in tempMedia"
                                            :key="index"
                                            class="group relative aspect-square overflow-hidden rounded-lg border-2"
                                            :class="media.media_type === 'video' ? 'border-primary' : 'border-base-300'">
                                            <!-- Image Preview -->
                                            <img v-if="media.media_type === 'image'" :src="media.url" :alt="`Product image ${index + 1}`" class="h-full w-full object-cover" />

                                            <!-- Video Preview with Thumbnail -->
                                            <div v-else class="relative h-full w-full">
                                                <img
                                                    v-if="media.thumbnail_url"
                                                    :src="media.thumbnail_url"
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

                                            <!-- Media Type Badge -->
                                            <div v-if="media.media_type === 'video'" class="absolute top-2 left-2 badge badge-primary badge-sm gap-1 z-10">
                                                <span class="iconify lucide--video size-3" />
                                                {{ $t('product.media.video') }}
                                            </div>

                                            <!-- Video Duration -->
                                            <div v-if="media.media_type === 'video' && media.duration" class="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs z-10">
                                                {{ Math.floor(media.duration / 60) }}:{{ String(media.duration % 60).padStart(2, '0') }}
                                            </div>
                                            <!-- Remove Button -->
                                            <button
                                                type="button"
                                                @click="removeMedia(index)"
                                                class="btn btn-circle btn-error btn-xs absolute -right-1 -top-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
                                            {{ tempMedia.length > 0 ? $t('product.media.addMore') : $t('product.media.uploadMedia') }}
                                        </p>
                                        <label class="btn btn-primary btn-sm">
                                            <span v-if="uploading" class="loading loading-spinner loading-xs"></span>
                                            <span v-else class="iconify lucide--upload size-4" />
                                            {{ uploading ? $t('product.media.uploading') : $t('product.media.upload') }}
                                            <input type="file" accept="image/*,video/*" multiple class="hidden" @change="handleFileUpload" :disabled="uploading" />
                                        </label>
                                    </div>
                                </div>

                                <div class="alert alert-info mt-3">
                                    <span class="iconify lucide--info size-4" />
                                    <div class="text-xs">
                                        <p>{{ $t('product.media.imageInfo') }}</p>
                                        <p>{{ $t('product.media.videoInfo') }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- SEO Meta -->
                    <div class="card bg-base-100 shadow md:col-span-2">
                        <div class="card-body">
                            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                <div class="card-title">
                                    <span class="iconify lucide--search size-5" />
                                    {{ $t('product.seo.title') }}
                                </div>
                                <div class="flex flex-col items-end gap-1">
                                    <button
                                        type="button"
                                        @click="handleGenerateSeo"
                                        class="btn btn-primary btn-sm"
                                        :disabled="generatingSeo || !form.name || !form.description">
                                        <span v-if="generatingSeo" class="loading loading-spinner loading-xs"></span>
                                        <span v-else class="iconify lucide--sparkles size-4" />
                                        {{ generatingSeo ? $t('common.loading') : $t('product.seo.generateBySeo') }}
                                    </button>
                                    <p v-if="!form.name || !form.description" class="text-xs text-warning">
                                        {{ $t('product.validation.descriptionRequired') }}
                                    </p>
                                </div>
                            </div>
                            <fieldset class="fieldset mt-2 grid grid-cols-1 gap-4">
                                <div class="space-y-2">
                                    <label class="fieldset-label" for="seo_title">
                                        {{ $t('product.seo.seoTitle') }}
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

                    <!-- Settings -->
                    <div class="card bg-base-100 shadow md:col-span-2">
                        <div class="card-body">
                            <div class="card-title">Settings</div>
                            <fieldset class="fieldset mt-2">
                                <!-- Status auto-set to draft, will be activated after variants added -->
                                <div class="alert alert-info">
                                    <span class="iconify lucide--info size-5"></span>
                                    <span class="text-sm">Product will be created as <strong>Draft</strong>. After adding variants, it will be automatically set to <strong>Active</strong>.</span>
                                </div>

                                <div class="mt-4">
                                    <label class="label cursor-pointer gap-3 justify-start" for="featured">
                                        <input
                                            id="featured"
                                            v-model="form.is_featured"
                                            class="toggle toggle-primary"
                                            type="checkbox" />
                                        <span class="label-text">Featured Product</span>
                                    </label>
                                </div>
                            </fieldset>
                        </div>
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
                        <span v-else class="iconify lucide--check size-4" />
                        {{ loading ? "Creating..." : "Create Product" }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
