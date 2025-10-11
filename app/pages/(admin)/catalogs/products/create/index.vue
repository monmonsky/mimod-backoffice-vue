<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";

definePageMeta({
    layout: "admin",
});

const { createProduct } = useProducts();
const { success, error: showError } = useToast();
const { uploadTempImages, moveImages } = useImageUpload();

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
});

// Store temp images data
const tempImages = ref<Array<{ url: string; path: string }>>([]);
const sessionId = ref<string>("");

const tagInput = ref("");
const loading = ref(false);
const uploading = ref(false);

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

// Handle file upload to temp
const handleFileUpload = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const files = target.files;

    if (!files || files.length === 0) return;

    try {
        uploading.value = true;
        const fileArray = Array.from(files);

        // Upload to temp folder
        const response = await uploadTempImages(fileArray, { type: "product", maxSizeMB: 10 }, sessionId.value);

        // Store session ID for future uploads
        if (!sessionId.value) {
            sessionId.value = response.data.session_id;
        }

        // Store temp image data
        response.data.images.forEach((img) => {
            tempImages.value.push({ url: img.url, path: img.path });
            form.value.images.push(img.url);
        });

        success(`${response.data.count} image(s) uploaded successfully!`);
    } catch (err: any) {
        showError(err.message || "Failed to upload images");
    } finally {
        uploading.value = false;
    }
};

// Remove image
const removeImage = (index: number) => {
    tempImages.value.splice(index, 1);
    form.value.images.splice(index, 1);
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
        };

        // Create product first
        const productResponse = (await createProduct(payload)) as any;

        console.log('Full product response:', JSON.stringify(productResponse, null, 2));

        // Try different possible response structures
        const productId = productResponse?.data?.id || productResponse?.id;

        console.log('Extracted productId:', productId);

        if (!productId) {
            console.error('Failed to extract product ID. Response:', productResponse);
            showError("Failed to get product ID from response");
            loading.value = false;
            return;
        }

        // Move temp images to permanent location if any
        if (tempImages.value.length > 0) {
            console.log('Moving temp images for product:', productId);
            const tempPaths = tempImages.value.map((img) => img.path);
            await moveImages({
                temp_paths: tempPaths,
                type: "product",
                product_id: productId,
            });
        }

        success("Product created successfully! Now add variants.");

        // Redirect to Step 2: Add Variants (SPA navigation without reload)
        const redirectUrl = `/catalogs/products/create/${productId}/variants`;
        console.log('Redirecting to:', redirectUrl);

        // Don't reset loading here, let the navigation complete
        await navigateTo(redirectUrl);
    } catch (err: any) {
        console.error('Create product error:', err);
        showError(err?.data?.message || "Failed to create product");
        loading.value = false;
    }
};
</script>

<template>
    <div>
        <PageTitle
            :title="'Create Product'"
            :items="[{ label: 'Catalogs' }, { label: 'Products' }, { label: 'Create', active: true }]" />

        <div class="mt-6">
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

                    <!-- Product Images -->
                    <div class="card bg-base-100 shadow md:col-span-2">
                        <div class="card-body">
                            <div class="card-title">Product Images</div>
                            <div class="mt-2">
                                <!-- Preview images -->
                                <div v-if="form.images.length > 0" class="mb-4">
                                    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                                        <div
                                            v-for="(image, index) in form.images"
                                            :key="index"
                                            class="group relative aspect-square overflow-hidden rounded-lg border-2 border-base-300">
                                            <img :src="image" :alt="`Product image ${index + 1}`" class="h-full w-full object-cover" />
                                            <button
                                                type="button"
                                                @click="removeImage(index)"
                                                class="btn btn-circle btn-error btn-xs absolute -right-1 -top-1">
                                                <span class="iconify lucide--x size-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <!-- Upload Area -->
                                <div class="space-y-3">
                                    <div class="border-2 border-dashed border-base-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                                        <span class="iconify lucide--images text-base-content/40 mb-2 size-10 block mx-auto" />
                                        <p class="text-base-content/60 mb-3 text-sm">
                                            {{ form.images.length > 0 ? "Add more images" : "Upload product images" }}
                                        </p>
                                        <label class="btn btn-primary btn-sm">
                                            <span v-if="uploading" class="loading loading-spinner loading-xs"></span>
                                            <span v-else class="iconify lucide--upload size-4" />
                                            {{ uploading ? "Uploading..." : "Choose Files" }}
                                            <input type="file" accept="image/*" multiple class="hidden" @change="handleFileUpload" :disabled="uploading" />
                                        </label>
                                    </div>
                                </div>

                                <p class="text-base-content/60 mt-3 text-xs">
                                    You can select multiple images. Supported: JPG, PNG, GIF, WebP. Max 10MB per image.
                                </p>
                            </div>
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
