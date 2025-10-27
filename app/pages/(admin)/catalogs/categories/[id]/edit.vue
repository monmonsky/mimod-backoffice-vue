<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";
import { getErrorMessage } from "~/utils/errorHandlers";

definePageMeta({
    layout: "admin",
});

const route = useRoute();
const categoryId = parseInt(route.params.id as string);

const { updateCategory } = useCategories();
const { success, error: showError } = useToast();

// Fetch all categories for parent dropdown
const { data: categoriesResponse } = await useAsyncData("all-categories", () => {
    return $fetch("/catalog/categories", {
        baseURL: useRuntimeConfig().public.apiBase,
        headers: {
            Authorization: `Bearer ${useAuthStore().token}`,
        },
        params: {
            per_page: 100,
        },
    });
});

const allCategories = computed(() => {
    const response = categoriesResponse.value as any;
    const categories = response?.data?.categories?.data || [];
    // Exclude current category from parent options
    return categories.filter((cat: any) => cat.id !== categoryId);
});

const { data: categoryResponse, pending } = await useAsyncData(`category-${categoryId}`, () => {
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

const form = ref({
    name: "",
    slug: "",
    parent_id: null as number | null,
    image: "",
    description: "",
    sort_order: 0,
    is_active: true,
});

watch(
    category,
    (newCategory) => {
        if (newCategory) {
            form.value = {
                name: newCategory.name || "",
                slug: newCategory.slug || "",
                parent_id: newCategory.parent_id || null,
                image: newCategory.image || "",
                description: newCategory.description || "",
                sort_order: newCategory.sort_order || 0,
                is_active: newCategory.is_active ?? true,
            };
        }
    },
    { immediate: true },
);

const loading = ref(false);
const uploading = ref(false);
const imagePreview = ref("");

// Auto-generate slug from name
watch(
    () => form.value.name,
    (newName) => {
        form.value.slug = generateSlug(newName);
    },
);

// Watch image for preview
watch(
    () => form.value.image,
    (newImage) => {
        imagePreview.value = newImage;
    },
    { immediate: true },
);

// Handle file upload
const handleFileUpload = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
        showError("Please upload an image file");
        return;
    }

    if (file.size > 2 * 1024 * 1024) {
        showError("Image size must be less than 2MB");
        return;
    }

    try {
        uploading.value = true;

        const formData = new FormData();
        formData.append("image", file);
        formData.append("type", "category"); // Type: category

        const response = (await $fetch("/upload/image", {
            baseURL: useRuntimeConfig().public.apiBase,
            method: "POST",
            headers: {
                Authorization: `Bearer ${useAuthStore().token}`,
            },
            body: formData,
        })) as any;

        form.value.image = response.data.url;
        imagePreview.value = response.data.url;
        success("Image uploaded successfully!");
    } catch (err) {
        console.error("=== UPLOAD ERROR ===");
        console.error("Error:", err);
        console.error("====================");
        showError(getErrorMessage(err, "Failed to upload image"));
    } finally {
        uploading.value = false;
    }
};

const removeImage = () => {
    form.value.image = "";
    imagePreview.value = "";
};

const handleSubmit = async () => {
    try {
        loading.value = true;

        await updateCategory(categoryId, form.value);
        success("Category updated successfully!");

        await navigateTo("/catalogs/categories");
    } catch (err) {
        console.error("=== ERROR UPDATE CATEGORY ===");
        console.error("Error:", err);
        console.error("============================");

        const errorMessage = getErrorMessage(err, "Failed to update category");
        showError(errorMessage);
        loading.value = false;
    }
};
</script>
<template>
    <div>
        <PageTitle
            :title="'Edit Category'"
            :items="[{ label: 'Catalogs' }, { label: 'Categories' }, { label: 'Edit', active: true }]" />

        <div v-if="pending" class="mt-6 flex items-center justify-center py-12">
            <span class="loading loading-spinner loading-lg"></span>
        </div>

        <!-- Form -->
        <form v-else class="mt-6" @submit.prevent="handleSubmit">
            <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
                <!-- Category Information -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <div class="card-title">Category Information</div>
                        <div class="fieldset mt-2 grid grid-cols-1 gap-4">
                            <div class="space-y-2">
                                <label class="fieldset-label" for="name">
                                    Category Name <span class="text-error">*</span>
                                </label>
                                <input
                                    id="name"
                                    v-model="form.name"
                                    type="text"
                                    class="input w-full"
                                    placeholder="e.g. Electronics, Clothing"
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
                                <p class="text-base-content/60 text-xs">Auto-generated from category name</p>
                            </div>
                            <div class="space-y-2">
                                <label class="fieldset-label" for="parent">Parent Category</label>
                                <select id="parent" v-model="form.parent_id" class="select w-full">
                                    <option :value="null">None (Root Category)</option>
                                    <option v-for="cat in allCategories" :key="cat.id" :value="cat.id">
                                        {{ cat.name }}
                                    </option>
                                </select>
                            </div>
                            <div class="space-y-2">
                                <label class="fieldset-label" for="sort_order">Sort Order</label>
                                <input
                                    id="sort_order"
                                    v-model.number="form.sort_order"
                                    type="number"
                                    min="0"
                                    class="input w-full"
                                    placeholder="0" />
                                <p class="text-base-content/60 text-xs">Lower numbers appear first</p>
                            </div>
                            <div class="space-y-2">
                                <label class="fieldset-label" for="status">Status <span class="text-error">*</span></label>
                                <select id="status" v-model="form.is_active" class="select w-full" required>
                                    <option :value="true">Active</option>
                                    <option :value="false">Inactive</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Category Image -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <div class="card-title">Category Image</div>
                        <div class="mt-2">
                            <!-- Preview if image exists -->
                            <div v-if="imagePreview || form.image" class="mb-4">
                                <div class="relative inline-block">
                                    <img :src="imagePreview || form.image" alt="Image preview" class="h-32 w-32 rounded-lg border-2 border-base-300 object-cover" />
                                    <button
                                        type="button"
                                        @click="removeImage"
                                        class="btn btn-circle btn-error btn-xs absolute -right-2 -top-2">
                                        <span class="iconify lucide--x size-3" />
                                    </button>
                                </div>
                            </div>

                            <!-- Upload Area -->
                            <div class="space-y-3">
                                <div class="border-2 border-dashed border-base-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                                    <span class="iconify lucide--image text-base-content/40 mb-2 size-10 block mx-auto" />
                                    <p class="text-base-content/60 mb-3 text-sm">
                                        {{ imagePreview || form.image ? "Change image" : "Upload category image" }}
                                    </p>
                                    <label class="btn btn-primary btn-sm">
                                        <span v-if="uploading" class="loading loading-spinner loading-xs"></span>
                                        <span v-else class="iconify lucide--upload size-4" />
                                        {{ uploading ? "Uploading..." : "Choose File" }}
                                        <input type="file" accept="image/*" class="hidden" @change="handleFileUpload" :disabled="uploading" />
                                    </label>
                                </div>

                                <!-- Manual URL Input -->
                                <div class="divider text-xs">OR</div>
                                <div class="space-y-2">
                                    <label class="fieldset-label" for="image_url">Image URL</label>
                                    <input
                                        id="image_url"
                                        v-model="form.image"
                                        type="url"
                                        class="input input-sm w-full"
                                        placeholder="https://example.com/image.png" />
                                </div>
                            </div>

                            <p class="text-base-content/60 mt-3 text-xs">
                                Recommended: Square image, at least 400x400px, max 2MB
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Description -->
                <div class="card bg-base-100 shadow md:col-span-2">
                    <div class="card-body gap-0">
                        <div class="card-title">Description</div>
                        <p class="text-base-content/60 mb-4 text-sm">Provide details about the category</p>
                        <div class="fieldset">
                            <div class="space-y-2">
                                <textarea
                                    v-model="form.description"
                                    class="textarea textarea-bordered w-full"
                                    placeholder="Enter category description..."
                                    rows="5"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div class="mt-6 flex justify-end gap-3">
                <NuxtLink class="btn btn-sm btn-ghost" href="/catalogs/categories">
                    <span class="iconify lucide--x size-4" />
                    Cancel
                </NuxtLink>
                <button type="submit" class="btn btn-sm btn-primary" :disabled="loading">
                    <span v-if="loading" class="loading loading-spinner loading-xs"></span>
                    <span v-else class="iconify lucide--check size-4" />
                    {{ loading ? 'Updating...' : 'Update Category' }}
                </button>
            </div>
        </form>
    </div>
</template>
