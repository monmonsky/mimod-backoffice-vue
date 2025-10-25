<script setup lang="ts">
import PageTitle from '~/components/PageTitle.vue';
import type { ProductAttributeFormData } from '~/types/catalogs/attributes';

definePageMeta({
    layout: 'admin',
});

const route = useRoute();
const attributeId = parseInt(route.params.id as string);

const { updateAttribute } = useAttributes();
const { success, error: showError } = useToast();

const loading = ref(false);

// Fetch attribute data
const { data: attributeResponse, pending } = await useAsyncData(
    `attribute-${attributeId}`,
    () => {
        return $fetch(`/catalog/attributes/${attributeId}`, {
            baseURL: useRuntimeConfig().public.apiBase,
            headers: {
                Authorization: `Bearer ${useAuthStore().token}`,
            },
        });
    },
);

const attribute = computed(() => {
    const response = attributeResponse.value as any;
    if (response?.data) {
        return response.data;
    }
    return null;
});

const form = ref<ProductAttributeFormData>({
    name: '',
    slug: '',
    type: 'select',
    description: '',
    is_required: false,
    is_active: true,
    sort_order: 1,
});

// Watch for attribute data and populate form
watch(
    attribute,
    (newAttribute) => {
        if (newAttribute) {
            form.value = {
                name: newAttribute.name || '',
                slug: newAttribute.slug || '',
                type: newAttribute.type || 'select',
                description: newAttribute.description || '',
                is_required: newAttribute.is_required ?? false,
                is_active: newAttribute.is_active ?? true,
                sort_order: newAttribute.sort_order || 1,
            };
        }
    },
    { immediate: true },
);

// Auto-generate slug from name
const originalSlug = ref('');
watch(
    attribute,
    (newAttribute) => {
        if (newAttribute) {
            originalSlug.value = newAttribute.slug;
        }
    },
    { immediate: true },
);

watch(
    () => form.value.name,
    (newName) => {
        // Only auto-generate if slug hasn't been manually changed
        if (newName && form.value.slug === originalSlug.value) {
            form.value.slug = generateSlug(newName);
        }
    },
);

const handleSubmit = async () => {
    if (!form.value.name) {
        showError('Name is required');
        return;
    }

    if (!form.value.type) {
        showError('Type is required');
        return;
    }

    try {
        loading.value = true;
        await updateAttribute(attributeId, form.value);
        success('Attribute updated successfully!');
        await navigateTo('/catalogs/attributes');
    } catch (err: any) {
        showError(err?.data?.message || 'Failed to update attribute');
        loading.value = false;
    }
};
</script>

<template>
    <div>
        <PageTitle
            :title="'Edit Attribute'"
            :items="[
                { label: 'Catalogs' },
                { label: 'Attributes', path: '/catalogs/attributes' },
                { label: 'Edit', active: true },
            ]"
        />

        <div class="mt-6">
            <!-- Loading State -->
            <div v-if="pending" class="flex justify-center py-12">
                <span class="loading loading-spinner loading-lg"></span>
            </div>

            <!-- Form -->
            <form v-else @submit.prevent="handleSubmit">
                <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <!-- Attribute Information -->
                    <div class="card bg-base-100 shadow">
                        <div class="card-body">
                            <div class="card-title">Attribute Information</div>
                            <div class="fieldset mt-2 grid grid-cols-1 gap-4">
                                <div class="space-y-2">
                                    <label class="fieldset-label" for="name">
                                        Attribute Name <span class="text-error">*</span>
                                    </label>
                                    <input
                                        id="name"
                                        v-model="form.name"
                                        type="text"
                                        class="input w-full"
                                        placeholder="e.g. Size, Color, Material"
                                        required
                                    />
                                </div>

                                <div class="space-y-2">
                                    <label class="fieldset-label" for="slug">Slug</label>
                                    <input
                                        id="slug"
                                        v-model="form.slug"
                                        type="text"
                                        class="input w-full bg-base-200"
                                        placeholder="Auto-generated from name"
                                        readonly
                                    />
                                    <p class="text-base-content/60 text-xs">Auto-generated from attribute name</p>
                                </div>

                                <div class="space-y-2">
                                    <label class="fieldset-label" for="type">
                                        Type <span class="text-error">*</span>
                                    </label>
                                    <select id="type" v-model="form.type" class="select w-full" required>
                                        <option value="select">Select (Dropdown)</option>
                                        <option value="color">Color (Color Picker)</option>
                                        <option value="radio">Radio (Single Choice)</option>
                                        <option value="checkbox">Checkbox (Multiple Choice)</option>
                                    </select>
                                    <p class="text-base-content/60 text-xs">
                                        How this attribute will be displayed in forms
                                    </p>
                                </div>

                                <div class="space-y-2">
                                    <label class="fieldset-label" for="sort_order">Sort Order</label>
                                    <input
                                        id="sort_order"
                                        v-model.number="form.sort_order"
                                        type="number"
                                        min="1"
                                        class="input w-full"
                                        placeholder="1"
                                    />
                                    <p class="text-base-content/60 text-xs">Lower numbers appear first</p>
                                </div>

                                <div class="space-y-2">
                                    <label class="fieldset-label" for="status">
                                        Status <span class="text-error">*</span>
                                    </label>
                                    <select id="status" v-model="form.is_active" class="select w-full" required>
                                        <option :value="true">Active</option>
                                        <option :value="false">Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Attribute Settings -->
                    <div class="card bg-base-100 shadow">
                        <div class="card-body">
                            <div class="card-title">Attribute Settings</div>
                            <div class="fieldset mt-2 grid grid-cols-1 gap-4">
                                <div class="space-y-2">
                                    <label class="fieldset-label">Options</label>
                                    <div class="form-control">
                                        <label class="label cursor-pointer justify-start gap-3">
                                            <input
                                                v-model="form.is_required"
                                                type="checkbox"
                                                class="checkbox checkbox-primary"
                                            />
                                            <div>
                                                <span class="label-text font-medium">Required</span>
                                                <p class="text-base-content/60 text-xs">
                                                    All variants must have a value for this attribute
                                                </p>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div class="divider my-2"></div>

                                <div class="alert alert-info">
                                    <span class="iconify lucide--info size-5" />
                                    <div class="text-sm">
                                        <p class="font-semibold mb-1">Manage Values</p>
                                        <p>Go to the detail page to add, edit, or remove attribute values.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Description -->
                    <div class="card bg-base-100 shadow md:col-span-2">
                        <div class="card-body gap-0">
                            <div class="card-title">Description</div>
                            <p class="text-base-content/60 mb-4 text-sm">Provide details about the attribute</p>
                            <div class="fieldset">
                                <div class="space-y-2">
                                    <textarea
                                        v-model="form.description"
                                        class="textarea textarea-bordered w-full"
                                        placeholder="Enter attribute description..."
                                        rows="5"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div class="mt-6 flex justify-end gap-3">
                    <NuxtLink class="btn btn-sm btn-ghost" href="/catalogs/attributes">
                        <span class="iconify lucide--x size-4" />
                        Cancel
                    </NuxtLink>
                    <button type="submit" class="btn btn-sm btn-primary" :disabled="loading">
                        <span v-if="loading" class="loading loading-spinner loading-xs"></span>
                        <span v-else class="iconify lucide--save size-4" />
                        {{ loading ? 'Updating...' : 'Update Attribute' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
