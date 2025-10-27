<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";
import ProductBasicInfoCard from "../components/ProductBasicInfoCard.vue";
import ProductSidebarSettings from "../components/ProductSidebarSettings.vue";
import ProductMediaCard from "../components/ProductMediaCard.vue";
import ProductSeoCard from "../components/ProductSeoCard.vue";
import { getErrorMessage } from "~/utils/errorHandlers";

definePageMeta({
    layout: "admin",
});

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

// Auto-generate slug from name
watch(
    () => form.value.name,
    (newName) => {
        form.value.slug = generateSlug(newName);
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

        const imageCount = response.data.images.filter((m: any) => m.media_type === 'image').length;
        const videoCount = response.data.images.filter((m: any) => m.media_type === 'video').length;

        let message = '';
        if (imageCount > 0 && videoCount > 0) {
            message = `${imageCount} image(s) and ${videoCount} video(s) uploaded successfully`;
        } else if (videoCount > 0) {
            message = `${videoCount} video(s) uploaded successfully`;
        } else {
            message = `${imageCount} image(s) uploaded successfully`;
        }

        success(message);
    } catch (err) {
        showError(getErrorMessage(err, 'Failed to upload media'));
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
            success('SEO metadata generated successfully');
        }
    } catch (err) {
        showError(getErrorMessage(err, 'Failed to generate SEO metadata'));
    } finally {
        generatingSeo.value = false;
    }
};

// Submit form
const handleSubmit = async () => {
    if (!form.value.name) {
        showError('Product name is required');
        return;
    }

    if (!form.value.brand_id) {
        showError('Brand is required');
        return;
    }

    if (selectedCategories.value.length === 0) {
        showError('At least one category is required');
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

        success('Product created successfully');

        // Redirect to Step 2: Add Variants (SPA navigation without reload)
        const redirectUrl = `/catalogs/products/create/${productId}/variants`;
        await navigateTo(redirectUrl);
    } catch (err) {
        showError(getErrorMessage(err, 'Failed to create product'));
        loading.value = false;
    }
};
</script>

<template>
    <div>
        <PageTitle
            :title="'Create Product'"
            :items="[{ label: 'Catalogs' }, { label: 'Products', path: '/catalogs/products' }, { label: 'Create', active: true }]" />

        <div class="mt-6">
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
                            :existing-images="[]"
                            :temp-media="tempMedia"
                            :uploading="uploading"
                            :total-images="form.images.length"
                            @upload="handleFileUpload"
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

                        <!-- Draft Notice -->
                        <div class="alert alert-info">
                            <span class="iconify lucide--info size-5"></span>
                            <span class="text-sm">Product will be created as <strong>Draft</strong>. After adding variants, it will be automatically set to <strong>Active</strong>.</span>
                        </div>
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
                        <span v-else class="iconify lucide--check size-4" />
                        {{ loading ? "Creating..." : "Create Product" }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
