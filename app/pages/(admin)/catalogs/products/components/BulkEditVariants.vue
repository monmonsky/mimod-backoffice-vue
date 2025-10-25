<script setup lang="ts">
import type { ProductVariant } from '~/types/catalogs/products/types';

interface Props {
    variants: ProductVariant[];
    productId: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
    updated: [];
    close: [];
}>();

const { success, error: showError } = useToast();
const { uploadTempImages, moveImages } = useImageUpload();
const { getMediaUrl } = useMediaUrl();

// State
const loading = ref(false);
const editableVariants = ref<any[]>([]);

// Initialize editable variants from props
onMounted(() => {
    editableVariants.value = props.variants.map((v) => ({
        id: v.id,
        sku: v.sku,
        barcode: v.barcode,
        price: v.price,
        compare_at_price: v.compare_at_price,
        stock_quantity: v.stock_quantity,
        weight_gram: v.weight_gram,
        size: v.size,
        color: v.color,
        existingImages: (v.images || []).map(img => img.url),
        newImages: [] as string[],
        tempImages: [] as Array<{ url: string; path: string; file_size?: number }>,
        uploading: false,
    }));
});

// Bulk update fields
const bulkPrice = ref<number | null>(null);
const bulkComparePrice = ref<number | null>(null);
const bulkStock = ref<number | null>(null);
const bulkWeight = ref<number | null>(null);

const applyBulkUpdate = (field: string) => {
    switch (field) {
        case 'price':
            if (bulkPrice.value !== null) {
                editableVariants.value.forEach((v) => {
                    v.price = bulkPrice.value!;
                });
            }
            break;
        case 'compare_at_price':
            if (bulkComparePrice.value !== null) {
                editableVariants.value.forEach((v) => {
                    v.compare_at_price = bulkComparePrice.value!;
                });
            }
            break;
        case 'stock_quantity':
            if (bulkStock.value !== null) {
                editableVariants.value.forEach((v) => {
                    v.stock_quantity = bulkStock.value!;
                });
            }
            break;
        case 'weight_gram':
            if (bulkWeight.value !== null) {
                editableVariants.value.forEach((v) => {
                    v.weight_gram = bulkWeight.value!;
                });
            }
            break;
    }
};

// Handle image upload for specific variant
const handleVariantImageUpload = async (event: Event, variant: any) => {
    const target = event.target as HTMLInputElement;
    const files = target.files;

    if (!files || files.length === 0) return;

    try {
        variant.uploading = true;
        const fileArray = Array.from(files);

        const response = await uploadTempImages(
            fileArray,
            {
                type: 'product' as any,
                maxSizeMB: 10,
                allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
            }
        );

        response.data.images.forEach((img: any) => {
            variant.tempImages.push({
                url: img.url,
                path: img.path,
                file_size: img.file_size || null,
            });
            variant.newImages.push(img.url);
        });

        success(`${response.data.images.length} image(s) uploaded`);
    } catch (err: any) {
        showError(err.message || 'Failed to upload images');
    } finally {
        variant.uploading = false;
        target.value = '';
    }
};

// Remove new image from variant
const removeNewImage = (variant: any, index: number) => {
    variant.tempImages.splice(index, 1);
    variant.newImages.splice(index, 1);
};

// Save all changes
const saveChanges = async () => {
    try {
        loading.value = true;

        // Update each variant
        for (const variant of editableVariants.value) {
            // Update variant data
            await $fetch(`/catalog/products/variants/${variant.id}`, {
                baseURL: useRuntimeConfig().public.apiBase,
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${useAuthStore().token}`,
                },
                body: {
                    sku: variant.sku,
                    barcode: variant.barcode,
                    price: variant.price,
                    compare_at_price: variant.compare_at_price,
                    stock_quantity: variant.stock_quantity,
                    weight_gram: variant.weight_gram,
                    size: variant.size,
                    color: variant.color,
                },
            });

            // Move temp images if any
            if (variant.tempImages && variant.tempImages.length > 0) {
                const tempPaths = variant.tempImages.map((img: any) => img.path);
                const metadata = variant.tempImages.map((img: any) => ({
                    media_type: 'image',
                    file_size: img.file_size || null,
                }));

                await moveImages({
                    temp_paths: tempPaths,
                    type: 'variant',
                    product_id: props.productId,
                    variant_id: variant.id,
                    metadata: metadata,
                });
            }
        }

        success(`${editableVariants.value.length} variant(s) updated successfully!`);
        emit('updated');
        emit('close');
    } catch (err: any) {
        showError(err?.data?.message || 'Failed to update variants');
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="alert alert-info">
            <span class="iconify lucide--info size-5" />
            <span>Editing {{ editableVariants.length }} variant(s). Changes will be applied to all variants.</span>
        </div>

        <!-- Bulk Actions -->
        <div class="card bg-base-100 shadow">
            <div class="card-body">
                <div class="card-title text-sm">Bulk Actions</div>
                <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div class="space-y-2">
                        <label class="fieldset-label text-xs">Price</label>
                        <div class="join w-full">
                            <input
                                v-model.number="bulkPrice"
                                type="number"
                                placeholder="0"
                                class="input input-sm join-item w-full"
                            />
                            <button type="button" class="btn btn-sm join-item" @click="applyBulkUpdate('price')">
                                Apply
                            </button>
                        </div>
                    </div>
                    <div class="space-y-2">
                        <label class="fieldset-label text-xs">Compare Price</label>
                        <div class="join w-full">
                            <input
                                v-model.number="bulkComparePrice"
                                type="number"
                                placeholder="0"
                                class="input input-sm join-item w-full"
                            />
                            <button type="button" class="btn btn-sm join-item" @click="applyBulkUpdate('compare_at_price')">
                                Apply
                            </button>
                        </div>
                    </div>
                    <div class="space-y-2">
                        <label class="fieldset-label text-xs">Stock</label>
                        <div class="join w-full">
                            <input
                                v-model.number="bulkStock"
                                type="number"
                                placeholder="0"
                                class="input input-sm join-item w-full"
                            />
                            <button type="button" class="btn btn-sm join-item" @click="applyBulkUpdate('stock_quantity')">
                                Apply
                            </button>
                        </div>
                    </div>
                    <div class="space-y-2">
                        <label class="fieldset-label text-xs">Weight (gram)</label>
                        <div class="join w-full">
                            <input
                                v-model.number="bulkWeight"
                                type="number"
                                placeholder="200"
                                class="input input-sm join-item w-full"
                            />
                            <button type="button" class="btn btn-sm join-item" @click="applyBulkUpdate('weight_gram')">
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Variants Table -->
        <div class="card bg-base-100 shadow">
            <div class="card-body p-0">
                <div class="overflow-x-auto">
                    <table class="table table-sm">
                        <thead>
                            <tr>
                                <th>Variant</th>
                                <th>SKU</th>
                                <th>Barcode</th>
                                <th>Price <span class="text-error">*</span></th>
                                <th>Compare Price</th>
                                <th>Stock</th>
                                <th>Weight (g)</th>
                                <th>Images</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="variant in editableVariants" :key="variant.id">
                                <td>
                                    <div class="text-sm">
                                        <div class="font-medium">{{ variant.size }} - {{ variant.color }}</div>
                                        <div class="text-xs text-base-content/60">ID: {{ variant.id }}</div>
                                    </div>
                                </td>
                                <td>
                                    <input
                                        v-model="variant.sku"
                                        type="text"
                                        class="input input-sm w-32"
                                        placeholder="SKU"
                                    />
                                </td>
                                <td>
                                    <input
                                        v-model="variant.barcode"
                                        type="text"
                                        class="input input-sm w-32"
                                        placeholder="Barcode"
                                    />
                                </td>
                                <td>
                                    <input
                                        v-model.number="variant.price"
                                        type="number"
                                        class="input input-sm w-24"
                                        placeholder="0"
                                        required
                                    />
                                </td>
                                <td>
                                    <input
                                        v-model.number="variant.compare_at_price"
                                        type="number"
                                        class="input input-sm w-24"
                                        placeholder="0"
                                    />
                                </td>
                                <td>
                                    <input
                                        v-model.number="variant.stock_quantity"
                                        type="number"
                                        class="input input-sm w-20"
                                        placeholder="0"
                                    />
                                </td>
                                <td>
                                    <input
                                        v-model.number="variant.weight_gram"
                                        type="number"
                                        class="input input-sm w-20"
                                        placeholder="200"
                                    />
                                </td>
                                <td>
                                    <div class="flex items-center gap-2">
                                        <!-- Existing images -->
                                        <div v-if="variant.existingImages && variant.existingImages.length > 0" class="flex gap-1">
                                            <img
                                                v-for="(imgPath, idx) in variant.existingImages"
                                                :key="idx"
                                                :src="getMediaUrl(imgPath)"
                                                class="h-10 w-10 object-cover rounded border border-base-300"
                                                :alt="`Image ${idx + 1}`"
                                            />
                                        </div>

                                        <!-- New images preview -->
                                        <div v-if="variant.tempImages && variant.tempImages.length > 0" class="flex gap-1">
                                            <div
                                                v-for="(img, imgIdx) in variant.tempImages"
                                                :key="imgIdx"
                                                class="relative group">
                                                <img
                                                    :src="img.url"
                                                    class="h-10 w-10 object-cover rounded border border-primary"
                                                    :alt="`New image ${imgIdx + 1}`"
                                                />
                                                <button
                                                    type="button"
                                                    @click="removeNewImage(variant, imgIdx)"
                                                    class="absolute -top-1 -right-1 btn btn-circle btn-error btn-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span class="iconify lucide--x size-3" />
                                                </button>
                                            </div>
                                        </div>

                                        <!-- Upload button -->
                                        <label class="btn btn-ghost btn-sm btn-square cursor-pointer" :class="{ 'loading loading-spinner': variant.uploading }">
                                            <span v-if="!variant.uploading" class="iconify lucide--upload size-4" />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                class="hidden"
                                                @change="handleVariantImageUpload($event, variant)"
                                                :disabled="variant.uploading"
                                            />
                                        </label>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3">
            <button class="btn btn-ghost btn-sm" @click="emit('close')">
                <span class="iconify lucide--x size-4" />
                Cancel
            </button>
            <button
                class="btn btn-primary btn-sm"
                :disabled="loading"
                @click="saveChanges"
            >
                <span v-if="loading" class="loading loading-spinner loading-xs"></span>
                <span v-else class="iconify lucide--save size-4" />
                {{ loading ? 'Saving...' : `Save ${editableVariants.length} Variant(s)` }}
            </button>
        </div>
    </div>
</template>
