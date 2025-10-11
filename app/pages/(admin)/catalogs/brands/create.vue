<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";

definePageMeta({
    layout: "admin",
});

const { createBrand } = useBrands();
const { success, error: showError } = useToast();

const form = ref({
    name: "",
    slug: "",
    logo: "",
    description: "",
    is_active: true,
});

const loading = ref(false);
const uploading = ref(false);
const logoPreview = ref("");

// Auto-generate slug from name
watch(
    () => form.value.name,
    (newName) => {
        form.value.slug = generateSlug(newName);
    },
);

// Watch logo for preview
watch(
    () => form.value.logo,
    (newLogo) => {
        logoPreview.value = newLogo;
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
        formData.append("type", "brand"); // Type: brand, category, product, avatar, etc

        console.log("=== UPLOAD IMAGE ===");
        console.log("File:", file.name, file.type, formatFileSize(file.size));
        console.log("Type: brand");
        console.log("===================");

        const response = (await $fetch("/upload/image", {
            baseURL: useRuntimeConfig().public.apiBase,
            method: "POST",
            headers: {
                Authorization: `Bearer ${useAuthStore().token}`,
            },
            body: formData,
        })) as any;

        console.log("=== UPLOAD RESPONSE ===");
        console.log("Response:", response);
        console.log("======================");

        form.value.logo = response.data.url;
        logoPreview.value = response.data.url;
        success("Image uploaded successfully!");
    } catch (err: any) {
        console.error("=== UPLOAD ERROR ===");
        console.error("Error:", err);
        console.error("====================");
        showError(err?.data?.message || "Failed to upload image");
    } finally {
        uploading.value = false;
    }
};

const removeLogo = () => {
    form.value.logo = "";
    logoPreview.value = "";
};

const handleSubmit = async () => {
    try {
        loading.value = true;

        // Debug: Log data yang akan dikirim
        console.log("=== DEBUG CREATE BRAND ===");
        console.log("Form Data:", JSON.stringify(form.value, null, 2));
        console.log("API Endpoint:", `/catalog/brands`);
        console.log("Method: POST");
        console.log("========================");

        await createBrand(form.value);
        success("Brand created successfully!");

        // Use navigateTo instead of router.push
        await navigateTo("/catalogs/brands");
    } catch (err: any) {
        console.error("=== ERROR CREATE BRAND ===");
        console.error("Error:", err);
        console.error("Error Data:", err?.data);
        console.error("Error Message:", err?.data?.message);
        console.error("========================");

        const errorMessage = err?.data?.message || "Failed to create brand";
        showError(errorMessage);
        loading.value = false;
    }
};
</script>
<template>
    <div>
        <PageTitle
            :title="'Create Brand'"
            :items="[{ label: 'Catalogs' }, { label: 'Brands' }, { label: 'Create', active: true }]" />

        <!-- Form -->
        <form class="mt-6" @submit.prevent="handleSubmit">
            <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
                <!-- Brand Information -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <div class="card-title">Brand Information</div>
                        <div class="fieldset mt-2 grid grid-cols-1 gap-4">
                            <div class="space-y-2">
                                <label class="fieldset-label" for="name">
                                    Brand Name <span class="text-error">*</span>
                                </label>
                                <input
                                    id="name"
                                    v-model="form.name"
                                    type="text"
                                    class="input w-full"
                                    placeholder="e.g. Nike, Adidas"
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
                                <p class="text-base-content/60 text-xs">Auto-generated from brand name</p>
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

                <!-- Brand Logo -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <div class="card-title">Brand Logo</div>
                        <div class="mt-2">
                            <!-- Preview if logo exists -->
                            <div v-if="logoPreview || form.logo" class="mb-4">
                                <div class="relative inline-block">
                                    <img :src="logoPreview || form.logo" alt="Logo preview" class="h-32 w-32 rounded-lg border-2 border-base-300 object-cover" />
                                    <button
                                        type="button"
                                        @click="removeLogo"
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
                                        {{ logoPreview || form.logo ? "Change logo" : "Upload brand logo" }}
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
                                    <label class="fieldset-label" for="logo_url">Logo URL</label>
                                    <input
                                        id="logo_url"
                                        v-model="form.logo"
                                        type="url"
                                        class="input input-sm w-full"
                                        placeholder="https://example.com/logo.png" />
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
                        <p class="text-base-content/60 mb-4 text-sm">Provide details about the brand</p>
                        <div class="fieldset">
                            <div class="space-y-2">
                                <textarea
                                    v-model="form.description"
                                    class="textarea textarea-bordered w-full"
                                    placeholder="Enter brand description, story, or key features..."
                                    rows="5"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div class="mt-6 flex justify-end gap-3">
                <NuxtLink class="btn btn-sm btn-ghost" href="/catalogs/brands">
                    <span class="iconify lucide--x size-4" />
                    Cancel
                </NuxtLink>
                <button type="submit" class="btn btn-sm btn-primary" :disabled="loading">
                    <span v-if="loading" class="loading loading-spinner loading-xs"></span>
                    <span v-else class="iconify lucide--plus size-4" />
                    {{ loading ? 'Creating...' : 'Create Brand' }}
                </button>
            </div>
        </form>
    </div>
</template>
