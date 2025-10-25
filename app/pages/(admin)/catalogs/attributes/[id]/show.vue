<script setup lang="ts">
import PageTitle from '~/components/PageTitle.vue';
import type {
    ProductAttribute,
    ProductAttributeValue,
    ProductAttributeValueFormData,
    BulkAttributeValuesFormData,
} from '~/types/catalogs/attributes';

definePageMeta({
    layout: 'admin',
});

const route = useRoute();
const attributeId = parseInt(route.params.id as string);

const {
    createAttributeValue,
    createAttributeValuesBulk,
    updateAttributeValue,
    deleteAttributeValue,
} = useAttributes();
const { success, error: showError } = useToast();

// Fetch attribute with values
const {
    data: attributeResponse,
    pending,
    refresh,
} = await useAsyncData(`attribute-${attributeId}`, () => {
    return $fetch(`/catalog/attributes/${attributeId}`, {
        baseURL: useRuntimeConfig().public.apiBase,
        headers: {
            Authorization: `Bearer ${useAuthStore().token}`,
        },
    });
});

const attribute = computed(() => {
    const response = attributeResponse.value as any;
    if (response?.data) {
        return response.data;
    }
    return null;
});

const values = computed(() => {
    return attribute.value?.values || [];
});

// Single value form
const showSingleValueModal = ref(false);
const editingValue = ref<ProductAttributeValue | null>(null);
const singleValueLoading = ref(false);

const singleValueForm = ref<ProductAttributeValueFormData>({
    product_attribute_id: attributeId,
    value: '',
    slug: '',
    meta: null,
    is_active: true,
    sort_order: 1,
});

const openSingleValueModal = (value?: ProductAttributeValue) => {
    if (value) {
        editingValue.value = value;
        singleValueForm.value = {
            product_attribute_id: attributeId,
            value: value.value,
            slug: value.slug,
            meta: value.meta,
            is_active: value.is_active ?? true,
            sort_order: value.sort_order || 1,
        };
    } else {
        editingValue.value = null;
        singleValueForm.value = {
            product_attribute_id: attributeId,
            value: '',
            slug: '',
            meta: null,
            is_active: true,
            sort_order: values.value.length + 1,
        };
    }
    showSingleValueModal.value = true;
};

// Auto-generate slug for single value
watch(
    () => singleValueForm.value.value,
    (newValue) => {
        if (newValue && !editingValue.value) {
            singleValueForm.value.slug = generateSlug(newValue);
        }
    },
);

const handleSingleValueSubmit = async () => {
    if (!singleValueForm.value.value) {
        showError('Value is required');
        return;
    }

    try {
        singleValueLoading.value = true;

        if (editingValue.value) {
            await updateAttributeValue(editingValue.value.id, singleValueForm.value);
            success('Value updated successfully!');
        } else {
            await createAttributeValue(singleValueForm.value);
            success('Value created successfully!');
        }

        showSingleValueModal.value = false;
        await refresh();
    } catch (err: any) {
        showError(err?.data?.message || 'Failed to save value');
    } finally {
        singleValueLoading.value = false;
    }
};

// Bulk values form
const showBulkValueModal = ref(false);
const bulkValueLoading = ref(false);
const bulkValuesText = ref('');

const openBulkValueModal = () => {
    bulkValuesText.value = '';
    showBulkValueModal.value = true;
};

const handleBulkValueSubmit = async () => {
    if (!bulkValuesText.value.trim()) {
        showError('Please enter at least one value');
        return;
    }

    try {
        bulkValueLoading.value = true;

        // Split by newlines and filter empty lines
        const values = bulkValuesText.value
            .split('\n')
            .map((v) => v.trim())
            .filter((v) => v.length > 0);

        if (values.length === 0) {
            showError('Please enter at least one value');
            return;
        }

        const bulkData: BulkAttributeValuesFormData = {
            product_attribute_id: attributeId,
            values: values,
        };

        await createAttributeValuesBulk(bulkData);
        success(`${values.length} value(s) created successfully!`);

        showBulkValueModal.value = false;
        bulkValuesText.value = '';
        await refresh();
    } catch (err: any) {
        showError(err?.data?.message || 'Failed to create values');
    } finally {
        bulkValueLoading.value = false;
    }
};

// Delete value
const confirmDelete = ref(false);
const valueToDelete = ref<ProductAttributeValue | null>(null);

const openDeleteModal = (value: ProductAttributeValue) => {
    valueToDelete.value = value;
    confirmDelete.value = true;
};

const handleDelete = async () => {
    if (!valueToDelete.value) return;

    try {
        await deleteAttributeValue(valueToDelete.value.id);
        success('Value deleted successfully!');
        confirmDelete.value = false;
        valueToDelete.value = null;
        await refresh();
    } catch (err: any) {
        showError(err?.data?.message || 'Failed to delete value');
    }
};

// Color picker for meta (if type is color)
const handleColorChange = (event: Event) => {
    const colorValue = (event.target as HTMLInputElement).value;
    singleValueForm.value.meta = { hex: colorValue };
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
};
</script>

<template>
    <div>
        <PageTitle
            :title="'Attribute Details'"
            :items="[
                { label: 'Catalogs' },
                { label: 'Attributes', path: '/catalogs/attributes' },
                { label: 'Details', active: true },
            ]"
        />

        <div class="mt-6">
            <!-- Loading State -->
            <div v-if="pending" class="flex items-center justify-center py-12">
                <span class="loading loading-spinner loading-lg"></span>
            </div>

            <!-- Content -->
            <div v-else-if="attribute" class="grid gap-6">
                <!-- Attribute Info Card -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <div class="flex items-start justify-between">
                            <div>
                                <h2 class="text-2xl font-bold">{{ attribute.name }}</h2>
                                <code class="text-base-content/60 text-sm">{{ attribute.slug }}</code>
                                <div class="mt-2 flex items-center gap-2">
                                    <span
                                        class="badge"
                                        :class="attribute.is_active ? 'badge-success' : 'badge-error'"
                                    >
                                        {{ attribute.is_active ? 'Active' : 'Inactive' }}
                                    </span>
                                    <span class="badge badge-primary capitalize">{{ attribute.type }}</span>
                                    <span v-if="attribute.is_required" class="badge badge-warning">Required</span>
                                    <span class="badge badge-ghost">Sort: {{ attribute.sort_order }}</span>
                                </div>
                            </div>
                            <div class="inline-flex gap-2">
                                <NuxtLink
                                    :to="`/catalogs/attributes/${attribute.id}/edit`"
                                    class="btn btn-primary btn-sm"
                                >
                                    <span class="iconify lucide--pencil size-4" />
                                    Edit
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Description Card -->
                <div v-if="attribute.description" class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h3 class="card-title">Description</h3>
                        <p class="text-base-content/80">{{ attribute.description }}</p>
                    </div>
                </div>


                <!-- Values Management Card -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <div class="mb-4 flex items-center justify-between">
                            <h3 class="card-title">Attribute Values</h3>
                            <div class="flex gap-2">
                                <button class="btn btn-outline btn-sm" @click="openBulkValueModal">
                                    <span class="iconify lucide--list-plus size-4" />
                                    Bulk Add
                                </button>
                                <button class="btn btn-primary btn-sm" @click="openSingleValueModal()">
                                    <span class="iconify lucide--plus size-4" />
                                    Add Value
                                </button>
                            </div>
                        </div>

                        <!-- Empty State -->
                        <div
                            v-if="!values.length"
                            class="flex flex-col items-center justify-center py-12 text-center"
                        >
                            <span class="iconify lucide--inbox text-base-content/40 mb-4 size-16" />
                            <p class="text-base-content/60 mb-2 text-lg font-medium">No values yet</p>
                            <p class="text-base-content/50 text-sm">
                                Add values for this attribute to use in product variants
                            </p>
                        </div>

                        <!-- Values List -->
                        <div v-else class="space-y-3">
                            <div
                                v-for="value in values"
                                :key="value.id"
                                class="flex items-center justify-between rounded-lg bg-base-200 p-3"
                            >
                                <div class="flex items-center gap-3">
                                    <!-- Color preview for color type -->
                                    <div
                                        v-if="attribute.type === 'color' && value.meta?.hex"
                                        class="h-10 w-10 rounded border-2 border-base-300"
                                        :style="{ backgroundColor: value.meta.hex }"
                                    ></div>

                                    <div>
                                        <div class="font-semibold">{{ value.value }}</div>
                                        <div class="flex items-center gap-2">
                                            <code class="text-base-content/60 text-xs">{{ value.slug }}</code>
                                            <span
                                                v-if="attribute.type === 'color' && value.meta?.hex"
                                                class="text-base-content/60 text-xs"
                                            >
                                                • {{ value.meta.hex }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span
                                        class="badge badge-sm"
                                        :class="value.is_active ? 'badge-success' : 'badge-ghost'"
                                    >
                                        {{ value.is_active ? 'Active' : 'Inactive' }}
                                    </span>
                                    <button
                                        class="btn btn-ghost btn-sm"
                                        title="Edit"
                                        @click="openSingleValueModal(value)"
                                    >
                                        <span class="iconify lucide--pencil size-4" />
                                    </button>
                                    <button
                                        class="btn btn-ghost btn-sm text-error"
                                        title="Delete"
                                        @click="openDeleteModal(value)"
                                    >
                                        <span class="iconify lucide--trash-2 size-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Metadata Card -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h3 class="card-title">Metadata</h3>
                        <div class="grid gap-4">
                            <div class="flex flex-col gap-1">
                                <span class="text-base-content/60 text-sm">Created At</span>
                                <span class="font-medium">{{ formatDate(attribute.created_at) }}</span>
                            </div>
                            <div class="flex flex-col gap-1">
                                <span class="text-base-content/60 text-sm">Last Updated</span>
                                <span class="font-medium">{{ formatDate(attribute.updated_at) }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Back Button -->
                <div class="flex justify-end">
                    <NuxtLink to="/catalogs/attributes" class="btn btn-ghost">
                        <span class="iconify lucide--arrow-left size-4" />
                        Back to List
                    </NuxtLink>
                </div>
            </div>
        </div>

        <!-- Single Value Modal -->
        <dialog :open="showSingleValueModal" class="modal">
            <div class="modal-box">
                <h3 class="text-lg font-bold">
                    {{ editingValue ? 'Edit Value' : 'Add Value' }}
                </h3>
                <form @submit.prevent="handleSingleValueSubmit">
                    <div class="space-y-4 py-4">
                        <!-- Value -->
                        <div class="space-y-2">
                            <label class="fieldset-label" for="value">
                                Value <span class="text-error">*</span>
                            </label>
                            <input
                                id="value"
                                v-model="singleValueForm.value"
                                type="text"
                                placeholder="e.g. 5-6 tahun, Bright Pink"
                                class="input w-full"
                                required
                            />
                        </div>

                        <!-- Slug -->
                        <div class="space-y-2">
                            <label class="fieldset-label" for="value-slug">Slug</label>
                            <input
                                id="value-slug"
                                v-model="singleValueForm.slug"
                                type="text"
                                placeholder="e.g. 5-6, bright-pink"
                                class="input w-full bg-base-200"
                                readonly
                            />
                            <p class="text-base-content/60 text-xs">Auto-generated from value</p>
                        </div>

                        <!-- Color Picker (only for color type) -->
                        <div v-if="attribute?.type === 'color'" class="space-y-2">
                            <label class="fieldset-label" for="color">Color</label>
                            <div class="flex items-center gap-4">
                                <input
                                    id="color"
                                    :value="singleValueForm.meta?.hex || '#000000'"
                                    type="color"
                                    class="h-12 w-20 cursor-pointer rounded border-2 border-base-300"
                                    @input="handleColorChange"
                                />
                                <input
                                    :value="singleValueForm.meta?.hex || ''"
                                    type="text"
                                    placeholder="#000000"
                                    class="input flex-1 bg-base-200"
                                    readonly
                                />
                            </div>
                        </div>

                        <!-- Sort Order -->
                        <div class="space-y-2">
                            <label class="fieldset-label" for="value-sort">Sort Order</label>
                            <input
                                id="value-sort"
                                v-model.number="singleValueForm.sort_order"
                                type="number"
                                min="1"
                                class="input w-full"
                            />
                        </div>

                        <!-- Is Active -->
                        <div class="space-y-2">
                            <label class="fieldset-label">Status</label>
                            <select v-model="singleValueForm.is_active" class="select w-full">
                                <option :value="true">Active</option>
                                <option :value="false">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div class="modal-action">
                        <button
                            type="button"
                            class="btn btn-ghost btn-sm"
                            @click="showSingleValueModal = false"
                        >
                            <span class="iconify lucide--x size-4" />
                            Cancel
                        </button>
                        <button type="submit" class="btn btn-primary btn-sm" :disabled="singleValueLoading">
                            <span v-if="singleValueLoading" class="loading loading-spinner loading-xs"></span>
                            <span v-else class="iconify lucide--check size-4" />
                            {{ editingValue ? 'Update' : 'Create' }}
                        </button>
                    </div>
                </form>
            </div>
            <form method="dialog" class="modal-backdrop">
                <button @click="showSingleValueModal = false">close</button>
            </form>
        </dialog>

        <!-- Bulk Values Modal -->
        <dialog :open="showBulkValueModal" class="modal">
            <div class="modal-box">
                <h3 class="text-lg font-bold">Bulk Add Values</h3>
                <form @submit.prevent="handleBulkValueSubmit">
                    <div class="py-4">
                        <div class="space-y-2">
                            <label class="fieldset-label" for="bulk-values">
                                Values (one per line) <span class="text-error">*</span>
                            </label>
                            <textarea
                                id="bulk-values"
                                v-model="bulkValuesText"
                                placeholder="Enter one value per line, e.g.:&#10;5-6 tahun&#10;7-8 tahun&#10;9-10 tahun"
                                class="textarea textarea-bordered h-48 w-full font-mono"
                                required
                            ></textarea>
                            <p class="text-base-content/60 text-xs">
                                Slugs will be auto-generated from values
                            </p>
                        </div>
                    </div>

                    <div class="modal-action">
                        <button
                            type="button"
                            class="btn btn-ghost btn-sm"
                            @click="showBulkValueModal = false"
                        >
                            <span class="iconify lucide--x size-4" />
                            Cancel
                        </button>
                        <button type="submit" class="btn btn-primary btn-sm" :disabled="bulkValueLoading">
                            <span v-if="bulkValueLoading" class="loading loading-spinner loading-xs"></span>
                            <span v-else class="iconify lucide--check size-4" />
                            Create Values
                        </button>
                    </div>
                </form>
            </div>
            <form method="dialog" class="modal-backdrop">
                <button @click="showBulkValueModal = false">close</button>
            </form>
        </dialog>

        <!-- Delete Confirmation Modal -->
        <dialog :open="confirmDelete" class="modal">
            <div class="modal-box">
                <h3 class="text-lg font-bold">Delete Value</h3>
                <p class="py-4">
                    Are you sure you want to delete "{{ valueToDelete?.value }}"? This action cannot be
                    undone.
                </p>
                <div class="modal-action">
                    <button class="btn btn-ghost btn-sm" @click="confirmDelete = false">
                        <span class="iconify lucide--x size-4" />
                        Cancel
                    </button>
                    <button class="btn btn-error btn-sm" @click="handleDelete">
                        <span class="iconify lucide--trash-2 size-4" />
                        Delete
                    </button>
                </div>
            </div>
            <form method="dialog" class="modal-backdrop">
                <button @click="confirmDelete = false">close</button>
            </form>
        </dialog>
    </div>
</template>
