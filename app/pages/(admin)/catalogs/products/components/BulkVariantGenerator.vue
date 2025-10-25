<script setup lang="ts">
import type { ProductAttribute, ProductAttributeValue } from '~/types/catalogs/attributes';

interface Props {
    productId: number;
    productName: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
    variantsGenerated: [];
    close: [];
}>();

const { success, error: showError } = useToast();
const { uploadTempImages, moveImages } = useImageUpload();

// State
const step = ref(1); // 1: Select attributes, 2: Review & edit variants
const loading = ref(false);
const loadingAttributes = ref(false);
const attributes = ref<ProductAttribute[]>([]);

// Fetch all active attributes with their values
const fetchAttributes = async () => {
    try {
        loadingAttributes.value = true;
        const response = await $fetch('/catalog/attributes', {
            baseURL: useRuntimeConfig().public.apiBase,
            headers: {
                Authorization: `Bearer ${useAuthStore().token}`,
            },
            params: {
                active_only: true,
            },
        });

        // Fetch values for each attribute
        const attributesData = (response as any).data || [];
        const attributesWithValues = await Promise.all(
            attributesData.map(async (attr: ProductAttribute) => {
                const valuesResponse = await $fetch(`/catalog/attributes/${attr.id}`, {
                    baseURL: useRuntimeConfig().public.apiBase,
                    headers: {
                        Authorization: `Bearer ${useAuthStore().token}`,
                    },
                });
                return (valuesResponse as any).data;
            })
        );

        attributes.value = attributesWithValues;
    } catch (err) {
        showError('Failed to load attributes');
        console.error(err);
    } finally {
        loadingAttributes.value = false;
    }
};

// Load attributes on mount
onMounted(() => {
    fetchAttributes();
});

// Selected attributes and their values
interface SelectedAttribute {
    attributeId: number;
    attributeName: string;
    attributeSlug: string;
    selectedValues: number[]; // Array of value IDs
}

const selectedAttributes = ref<SelectedAttribute[]>([]);

// Toggle attribute selection
const toggleAttribute = (attribute: ProductAttribute) => {
    const index = selectedAttributes.value.findIndex((a) => a.attributeId === attribute.id);
    if (index > -1) {
        selectedAttributes.value.splice(index, 1);
    } else {
        selectedAttributes.value.push({
            attributeId: attribute.id,
            attributeName: attribute.name,
            attributeSlug: attribute.slug,
            selectedValues: [],
        });
    }
};

const isAttributeSelected = (attributeId: number) => {
    return selectedAttributes.value.some((a) => a.attributeId === attributeId);
};

// Toggle value selection
const toggleValue = (attributeId: number, valueId: number) => {
    const attr = selectedAttributes.value.find((a) => a.attributeId === attributeId);
    if (!attr) return;

    const index = attr.selectedValues.indexOf(valueId);
    if (index > -1) {
        attr.selectedValues.splice(index, 1);
    } else {
        attr.selectedValues.push(valueId);
    }
};

const isValueSelected = (attributeId: number, valueId: number) => {
    const attr = selectedAttributes.value.find((a) => a.attributeId === attributeId);
    return attr ? attr.selectedValues.includes(valueId) : false;
};

// Select all values for an attribute
const selectAllValues = (attributeId: number) => {
    const attribute = attributes.value.find((a) => a.id === attributeId);
    const selectedAttr = selectedAttributes.value.find((a) => a.attributeId === attributeId);

    if (!attribute || !selectedAttr || !attribute.values) return;

    const activeValueIds = attribute.values
        .filter((v: ProductAttributeValue) => v.is_active)
        .map((v: ProductAttributeValue) => v.id);

    selectedAttr.selectedValues = activeValueIds;
};

// Generated variants
interface GeneratedVariant {
    tempId: string;
    sku: string;
    attributes: Array<{
        attributeId: number;
        attributeName: string;
        valueId: number;
        value: string;
        slug: string;
        meta?: any;
    }>;
    price: number;
    compare_at_price: number | null;
    stock_quantity: number;
    weight_gram: number;
    barcode: string;
}

const generatedVariants = ref<GeneratedVariant[]>([]);

// Generate variants from selected attributes
const generateVariants = () => {
    // Validate
    if (selectedAttributes.value.length === 0) {
        showError('Please select at least one attribute');
        return;
    }

    const hasEmptySelection = selectedAttributes.value.some((attr) => attr.selectedValues.length === 0);
    if (hasEmptySelection) {
        showError('Please select at least one value for each selected attribute');
        return;
    }

    // Get attribute data with selected values
    const attributesData = selectedAttributes.value.map((sel) => {
        const attr = attributes.value.find((a) => a.id === sel.attributeId);
        if (!attr || !attr.values) return null;

        return {
            ...attr,
            selectedValues: attr.values.filter((v: ProductAttributeValue) =>
                sel.selectedValues.includes(v.id)
            ),
        };
    }).filter(Boolean);

    // Generate cartesian product
    function cartesianProduct(arrays: any[]): any[] {
        return arrays.reduce(
            (acc, curr) => {
                return acc.flatMap((a: any) => curr.map((b: any) => [...a, b]));
            },
            [[]]
        );
    }

    const valueCombinations = cartesianProduct(
        attributesData.map((attr: any) => attr.selectedValues)
    );

    // Create variant objects
    const variants = valueCombinations.map((combination: any, index: number) => {
        return {
            tempId: `temp_${Date.now()}_${index}`,
            attributes: combination.map((val: any, idx: number) => {
                const attrData = attributesData[idx];
                if (!attrData) return null;
                return {
                    attributeId: attrData.id,
                    attributeName: attrData.name,
                    attributeSlug: attrData.slug,
                    valueId: val.id,
                    value: val.value,
                    slug: val.slug,
                    meta: val.meta,
                };
            }).filter(Boolean),
            price: 0,
            compare_at_price: null,
            stock_quantity: 0,
            weight_gram: 200,
            images: [] as string[],
            tempImages: [] as Array<{ url: string; path: string }>,
            uploading: false,
        };
    });

    generatedVariants.value = variants;
    step.value = 2;
};

// Bulk update fields
const bulkPrice = ref<number | null>(null);
const bulkComparePrice = ref<number | null>(null);
const bulkStock = ref<number | null>(null);
const bulkWeight = ref<number | null>(null);

const applyBulkUpdate = (field: string) => {
    switch (field) {
        case 'price':
            if (bulkPrice.value !== null) {
                generatedVariants.value.forEach((v) => {
                    v.price = bulkPrice.value!;
                });
            }
            break;
        case 'compare_at_price':
            if (bulkComparePrice.value !== null) {
                generatedVariants.value.forEach((v) => {
                    v.compare_at_price = bulkComparePrice.value!;
                });
            }
            break;
        case 'stock_quantity':
            if (bulkStock.value !== null) {
                generatedVariants.value.forEach((v) => {
                    v.stock_quantity = bulkStock.value!;
                });
            }
            break;
        case 'weight_gram':
            if (bulkWeight.value !== null) {
                generatedVariants.value.forEach((v) => {
                    v.weight_gram = bulkWeight.value!;
                });
            }
            break;
    }
};

// Remove variant
const removeVariant = (tempId: string) => {
    const index = generatedVariants.value.findIndex((v) => v.tempId === tempId);
    if (index > -1) {
        generatedVariants.value.splice(index, 1);
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

        // Upload to temp folder
        const response = await uploadTempImages(
            fileArray,
            {
                type: 'variant',
                maxSizeMB: 10,
                allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
            }
        );

        // Store temp image data
        response.data.images.forEach((img: any) => {
            variant.tempImages.push({
                url: img.url,
                path: img.path,
                file_size: img.file_size || null,
            });
            variant.images.push(img.url);
        });

        success(`${response.data.images.length} image(s) uploaded`);
    } catch (err: any) {
        showError(err.message || 'Failed to upload images');
    } finally {
        variant.uploading = false;
        // Reset input
        target.value = '';
    }
};

// Remove image from variant
const removeVariantImage = (variant: any, index: number) => {
    variant.tempImages.splice(index, 1);
    variant.images.splice(index, 1);
};

// Save variants
const saveVariants = async () => {
    if (generatedVariants.value.length === 0) {
        showError('No variants to save');
        return;
    }

    // Validate
    const hasInvalidPrice = generatedVariants.value.some((v) => !v.price || v.price <= 0);
    if (hasInvalidPrice) {
        showError('All variants must have a valid price');
        return;
    }

    try {
        loading.value = true;

        // Create variants one by one
        for (const variant of generatedVariants.value) {
            // Map attributes to old format (size, color, etc.)
            const variantData: any = {
                product_id: props.productId,
                // SKU and Barcode will be auto-generated by API
                price: variant.price,
                compare_at_price: variant.compare_at_price,
                stock_quantity: variant.stock_quantity,
                weight_gram: variant.weight_gram,
            };

            // Map attributes to legacy fields (for backward compatibility)
            variant.attributes.forEach((attr: any) => {
                if (attr && attr.attributeSlug === 'size') {
                    variantData.size = attr.value;
                }
                if (attr && attr.attributeSlug === 'color') {
                    variantData.color = attr.value;
                }
            });

            // Create variant
            const response = await $fetch('/catalog/products/variants', {
                baseURL: useRuntimeConfig().public.apiBase,
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${useAuthStore().token}`,
                },
                body: variantData,
            });

            const createdVariant = (response as any).data;

            // Auto-generate SKU & Barcode
            try {
                const skuBarcodeResponse = await $fetch(`/catalog/products/variants/${createdVariant.id}/generate-sku-barcode`, {
                    method: 'POST',
                    baseURL: useRuntimeConfig().public.apiBase,
                    headers: {
                        Authorization: `Bearer ${useAuthStore().token}`,
                    },
                });

                console.log(`✅ SKU & Barcode generated for variant ${createdVariant.id}:`, (skuBarcodeResponse as any).data);
            } catch (skuErr: any) {
                console.error(`⚠️ Failed to generate SKU & Barcode for variant ${createdVariant.id}:`, skuErr);
                // Don't throw, continue with other variants
            }

            // Create attribute relationships
            for (const attr of variant.attributes) {
                await $fetch('/catalog/product-variant-attributes', {
                    baseURL: useRuntimeConfig().public.apiBase,
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${useAuthStore().token}`,
                    },
                    body: {
                        product_variant_id: createdVariant.id,
                        product_attribute_id: attr.attributeId,
                        product_attribute_value_id: attr.valueId,
                    },
                });
            }

            // Move temp images to permanent location if any
            if (variant.tempImages && variant.tempImages.length > 0) {
                const tempPaths = variant.tempImages.map((img: any) => img.path);
                const metadata = variant.tempImages.map((img: any) => ({
                    media_type: 'image',
                    file_size: img.file_size || null,
                }));

                const movePayload = {
                    temp_paths: tempPaths,
                    type: 'variant',
                    product_id: props.productId,
                    variant_id: createdVariant.id,
                    metadata: metadata,
                };

                console.log('=== MOVE IMAGES REQUEST ===');
                console.log('Payload:', JSON.stringify(movePayload, null, 2));
                console.log('==========================');

                try {
                    const moveResponse = await moveImages(movePayload);
                    console.log('=== MOVE IMAGES RESPONSE ===');
                    console.log('Response:', JSON.stringify(moveResponse, null, 2));
                    console.log('============================');
                } catch (moveErr: any) {
                    console.error('=== MOVE IMAGES ERROR ===');
                    console.error('Error:', moveErr);
                    console.error('Error Data:', moveErr?.data);
                    console.error('=========================');
                    throw moveErr;
                }
            }
        }

        success(`${generatedVariants.value.length} variant(s) created successfully!`);
        emit('variantsGenerated');
        handleClose();
    } catch (err: any) {
        showError(err?.data?.message || 'Failed to create variants');
    } finally {
        loading.value = false;
    }
};

// Go back to step 1
const goBack = () => {
    step.value = 1;
};

// Reset all state
const resetState = () => {
    step.value = 1;
    selectedAttributes.value = [];
    generatedVariants.value = [];
    bulkPrice.value = null;
    bulkComparePrice.value = null;
    bulkStock.value = null;
    bulkWeight.value = null;
};

// Handle close
const handleClose = () => {
    resetState();
    emit('close');
};

// Expose handleClose to template
defineExpose({
    resetState,
});
</script>

<template>
    <div class="space-y-6">
        <!-- Step 1: Select Attributes & Values -->
        <div v-if="step === 1" class="space-y-6">
            <div class="alert alert-info">
                <span class="iconify lucide--info size-5" />
                <div class="text-sm">
                    <p class="font-semibold">Bulk Variant Generation</p>
                    <p>Select attributes and their values to automatically generate all possible variant combinations.</p>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="loadingAttributes" class="flex justify-center py-12">
                <span class="loading loading-spinner loading-lg"></span>
            </div>

            <!-- Attributes Selection -->
            <div v-else-if="attributes.length > 0" class="space-y-4">
                <div v-for="attribute in attributes" :key="attribute.id" class="card bg-base-100 shadow">
                    <div class="card-body">
                        <div class="flex items-center justify-between">
                            <label class="label cursor-pointer gap-3">
                                <input
                                    type="checkbox"
                                    class="checkbox checkbox-primary"
                                    :checked="isAttributeSelected(attribute.id)"
                                    @change="toggleAttribute(attribute)"
                                />
                                <div>
                                    <span class="font-semibold">{{ attribute.name }}</span>
                                    <span class="badge badge-sm ml-2" :class="attribute.is_required ? 'badge-warning' : 'badge-ghost'">
                                        {{ attribute.is_required ? 'Required' : 'Optional' }}
                                    </span>
                                </div>
                            </label>
                            <button
                                v-if="isAttributeSelected(attribute.id)"
                                class="btn btn-ghost btn-sm"
                                @click="selectAllValues(attribute.id)"
                            >
                                Select All
                            </button>
                        </div>

                        <!-- Values Selection -->
                        <div v-if="isAttributeSelected(attribute.id) && attribute.values" class="mt-4">
                            <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                                <label
                                    v-for="value in attribute.values.filter((v: ProductAttributeValue) => v.is_active)"
                                    :key="value.id"
                                    class="label cursor-pointer justify-start gap-2 rounded-lg border p-3"
                                    :class="isValueSelected(attribute.id, value.id) ? 'border-primary bg-primary/10' : 'border-base-300'"
                                >
                                    <input
                                        type="checkbox"
                                        class="checkbox checkbox-sm checkbox-primary"
                                        :checked="isValueSelected(attribute.id, value.id)"
                                        @change="toggleValue(attribute.id, value.id)"
                                    />
                                    <div class="flex items-center gap-2">
                                        <!-- Color preview for color type -->
                                        <div
                                            v-if="attribute.type === 'color' && value.meta?.hex"
                                            class="h-5 w-5 rounded border border-base-300"
                                            :style="{ backgroundColor: value.meta.hex }"
                                        ></div>
                                        <span class="text-sm">{{ value.value }}</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- No Attributes -->
            <div v-else class="alert alert-warning">
                <span class="iconify lucide--alert-triangle size-5" />
                <span>No active attributes found. Please create attributes first.</span>
            </div>

            <!-- Actions -->
            <div class="flex justify-end gap-3">
                <button class="btn btn-ghost btn-sm" @click="handleClose">
                    <span class="iconify lucide--x size-4" />
                    Cancel
                </button>
                <button
                    class="btn btn-primary btn-sm"
                    :disabled="selectedAttributes.length === 0 || loadingAttributes"
                    @click="generateVariants"
                >
                    <span class="iconify lucide--arrow-right size-4" />
                    Generate Variants
                </button>
            </div>
        </div>

        <!-- Step 2: Review & Edit Variants -->
        <div v-if="step === 2" class="space-y-6">
            <div class="alert alert-success">
                <span class="iconify lucide--check-circle size-5" />
                <span>{{ generatedVariants.length }} variant(s) generated. Review and adjust as needed.</span>
            </div>

            <!-- Bulk Actions -->
            <div class="card bg-base-100 shadow">
                <div class="card-body">
                    <h3 class="card-title text-base">Bulk Actions</h3>
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
                                    <th>Price <span class="text-error">*</span></th>
                                    <th>Compare Price</th>
                                    <th>Stock</th>
                                    <th>Weight (g)</th>
                                    <th>Images</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="variant in generatedVariants" :key="variant.tempId">
                                    <td>
                                        <div class="flex items-center gap-2">
                                            <div
                                                v-for="attr in variant.attributes.filter((a) => a.meta?.hex)"
                                                :key="attr.valueId"
                                                class="h-6 w-6 rounded border border-base-300"
                                                :style="{ backgroundColor: attr.meta.hex }"
                                            ></div>
                                            <div class="text-sm">
                                                <div class="font-medium">{{ variant.attributes.map((a) => a.value).join(' - ') }}</div>
                                                <div class="text-xs text-base-content/60">SKU & Barcode auto-generated</div>
                                            </div>
                                        </div>
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
                                            <!-- Image previews -->
                                            <div v-if="variant.tempImages && variant.tempImages.length > 0" class="flex gap-1">
                                                <div
                                                    v-for="(img, imgIdx) in variant.tempImages"
                                                    :key="imgIdx"
                                                    class="relative group">
                                                    <img
                                                        :src="img.url"
                                                        class="h-10 w-10 object-cover rounded border border-base-300"
                                                        :alt="`Variant image ${imgIdx + 1}`"
                                                    />
                                                    <button
                                                        type="button"
                                                        @click="removeVariantImage(variant, imgIdx)"
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
                                    <td>
                                        <button
                                            type="button"
                                            class="btn btn-ghost btn-sm btn-square text-error"
                                            @click="removeVariant(variant.tempId)"
                                        >
                                            <span class="iconify lucide--trash-2 size-4" />
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-between gap-3">
                <button class="btn btn-ghost btn-sm" @click="goBack">
                    <span class="iconify lucide--arrow-left size-4" />
                    Back
                </button>
                <div class="flex gap-3">
                    <button class="btn btn-ghost btn-sm" @click="handleClose">
                        <span class="iconify lucide--x size-4" />
                        Cancel
                    </button>
                    <button
                        class="btn btn-primary btn-sm"
                        :disabled="loading || generatedVariants.length === 0"
                        @click="saveVariants"
                    >
                        <span v-if="loading" class="loading loading-spinner loading-xs"></span>
                        <span v-else class="iconify lucide--save size-4" />
                        {{ loading ? 'Saving...' : `Save ${generatedVariants.length} Variant(s)` }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
