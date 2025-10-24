<script setup lang="ts">
import type { ProductVariant } from "~/types/catalogs/products/types";

interface Props {
    productId: number;
    productName: string;
    initialVariants?: ProductVariant[];
}

const props = withDefaults(defineProps<Props>(), {
    initialVariants: () => [],
});

// Emit events to parent
const emit = defineEmits<{
    variantAdded: [];
    variantDeleted: [];
    variantsChanged: [count: number];
}>();

const { success, error: showError } = useToast();

// Variants state
const variants = ref<ProductVariant[]>([...props.initialVariants]);
const showModal = ref(false);
const editingVariant = ref<ProductVariant | null>(null);

// Form state
const form = ref({
    sku: "",
    size: "",
    color: "",
    weight_gram: 0,
    price: "",
    compare_at_price: "",
    stock_quantity: 0,
    reserved_quantity: 0,
    barcode: "",
    images: [] as string[],
});

const uploading = ref(false);
const sessionId = ref<string>("");
const tempImagePaths = ref<Array<{ url: string; path: string }>>([]);

// Watch for prop changes
watch(
    () => props.initialVariants,
    (newVariants) => {
        variants.value = [...newVariants];
    },
);

// Open modal for add
const openAddModal = () => {
    editingVariant.value = null;
    form.value = {
        sku: "",
        size: "",
        color: "",
        weight_gram: 0,
        price: "",
        compare_at_price: "",
        stock_quantity: 0,
        reserved_quantity: 0,
        barcode: "",
        images: [],
    };
    tempImagePaths.value = [];
    sessionId.value = "";
    showModal.value = true;
};

// Open modal for edit
const openEditModal = (variant: ProductVariant) => {
    editingVariant.value = variant;

    // Get image URLs from images array
    const imageUrls = variant.images?.map(img => img.url) || [];

    form.value = {
        sku: variant.sku || "",
        size: variant.size || "",
        color: variant.color || "",
        weight_gram: variant.weight_gram || 0,
        price: variant.price || "",
        compare_at_price: variant.compare_at_price || "",
        stock_quantity: variant.stock_quantity || 0,
        reserved_quantity: variant.reserved_quantity || 0,
        barcode: variant.barcode || "",
        images: imageUrls,
    };
    tempImagePaths.value = [];
    showModal.value = true;
};

// Close modal
const closeModal = () => {
    showModal.value = false;
    editingVariant.value = null;
    tempImagePaths.value = [];
};

// Auto-generate SKU & Barcode
const generating = ref(false);

const generateSkuBarcode = async () => {
    if (!editingVariant.value?.id) {
        showError("Please save the variant first before generating SKU & Barcode");
        return;
    }

    try {
        generating.value = true;

        const response = await $fetch<{
            status: boolean;
            statusCode: string;
            message: string;
            data: {
                variant_id: number;
                sku: string;
                barcode: string;
                sku_format: string;
                barcode_type: string;
            };
        }>(`/catalog/products/variants/${editingVariant.value.id}/generate-sku-barcode`, {
            method: "POST",
            baseURL: useRuntimeConfig().public.apiBase,
            headers: {
                Authorization: `Bearer ${useAuthStore().token}`,
            },
        });

        // Update form with generated SKU & Barcode
        form.value.sku = response.data.sku;
        form.value.barcode = response.data.barcode;

        success(`SKU & Barcode generated! Format: ${response.data.sku_format}, ${response.data.barcode_type}`);
    } catch (err: any) {
        showError(err?.data?.message || "Failed to generate SKU & Barcode");
    } finally {
        generating.value = false;
    }
};

// Handle multiple image upload
const handleImageUpload = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (!files || files.length === 0) return;

    try {
        uploading.value = true;
        const fileArray = Array.from(files);

        // Generate alt_text: Product Name - SKU
        const altText = `${props.productName} - ${form.value.sku}`;

        // If editing existing variant, upload directly to variant
        if (editingVariant.value) {

            const formData = new FormData();
            fileArray.forEach((file) => {
                formData.append("images[]", file);
            });
            formData.append("type", "variant");
            formData.append("variant_id", editingVariant.value!.id.toString());
            formData.append("alt_text", altText);

            const response = await $fetch("/upload/temp", {
                method: "POST",
                baseURL: useRuntimeConfig().public.apiBase,
                headers: {
                    Authorization: `Bearer ${useAuthStore().token}`,
                },
                body: formData,
            });

            const data = (response as any).data;
            if (data.images && data.images.length > 0) {
                // Add uploaded images to form
                data.images.forEach((img: any) => {
                    form.value.images.push(img.url);
                });
                success(`${data.count} image(s) uploaded successfully!`);
            }
        } else {

            const formData = new FormData();
            fileArray.forEach((file) => {
                formData.append("images[]", file);
            });
            formData.append("type", "variant");
            formData.append("alt_text", altText);
            if (sessionId.value) {
                formData.append("session_id", sessionId.value);
            }

            // Upload to temp folder for new variant
            const response = await $fetch("/upload/temp", {
                method: "POST",
                baseURL: useRuntimeConfig().public.apiBase,
                headers: {
                    Authorization: `Bearer ${useAuthStore().token}`,
                },
                body: formData,
            });

            const data = (response as any).data;
            if (!sessionId.value && data.session_id) {
                sessionId.value = data.session_id;
            }

            if (data.images && data.images.length > 0) {
                data.images.forEach((img: any) => {
                    tempImagePaths.value.push({ url: img.url, path: img.path });
                    form.value.images.push(img.url);
                });
                success(`${data.count} image(s) uploaded successfully!`);
            }
        }
    } catch (err: any) {
        showError(err?.data?.message || "Failed to upload images");
    } finally {
        uploading.value = false;
    }
};

// Remove image from form
const removeImage = (index: number) => {
    const removedUrl = form.value.images[index];
    form.value.images.splice(index, 1);

    // Also remove from temp paths if exists
    const tempIndex = tempImagePaths.value.findIndex((img) => img.url === removedUrl);
    if (tempIndex !== -1) {
        tempImagePaths.value.splice(tempIndex, 1);
    }
};

// Save variant (add or update)
const saveVariant = async () => {
    // For edit mode, SKU is required. For add mode, SKU will be auto-generated if empty
    if (editingVariant.value && !form.value.sku) {
        showError("SKU is required");
        return;
    }

    if (!form.value.size || !form.value.color || !form.value.price) {
        showError("Please fill all required fields (Size, Color, Price)");
        return;
    }

    try {
        if (editingVariant.value) {
            // Update existing variant
            const response = await $fetch(`/catalog/products/variants/${editingVariant.value.id}`, {
                method: "PUT",
                baseURL: useRuntimeConfig().public.apiBase,
                headers: {
                    Authorization: `Bearer ${useAuthStore().token}`,
                },
                body: {
                    sku: form.value.sku,
                    size: form.value.size,
                    color: form.value.color,
                    weight_gram: form.value.weight_gram,
                    price: parseFloat(form.value.price),
                    compare_at_price: form.value.compare_at_price ? parseFloat(form.value.compare_at_price) : null,
                    stock_quantity: form.value.stock_quantity,
                    reserved_quantity: form.value.reserved_quantity,
                    barcode: form.value.barcode || null,
                },
            });

            // Update in local state with response data
            const index = variants.value.findIndex((v) => v.id === editingVariant.value!.id);
            if (index !== -1) {
                const updatedVariant = (response as any).data;
                // Ensure images array exists
                if (!updatedVariant.images) {
                    updatedVariant.images = [];
                }
                variants.value[index] = updatedVariant;
            }

            // Emit event for update
            emit('variantsChanged', variants.value.length);

            success("Variant updated successfully!");
        } else {
            // Create new variant

            const requestBody = {
                product_id: props.productId,
                sku: form.value.sku,
                size: form.value.size,
                color: form.value.color,
                weight_gram: form.value.weight_gram,
                price: parseFloat(form.value.price),
                compare_at_price: form.value.compare_at_price ? parseFloat(form.value.compare_at_price) : null,
                stock_quantity: form.value.stock_quantity,
                reserved_quantity: form.value.reserved_quantity,
                barcode: form.value.barcode || null,
                images: form.value.images.length > 0 ? form.value.images : undefined,
            };

            const response = await $fetch("/catalog/products/variants", {
                method: "POST",
                baseURL: useRuntimeConfig().public.apiBase,
                headers: {
                    Authorization: `Bearer ${useAuthStore().token}`,
                },
                body: requestBody,
            });

            // Add to local state with response data
            const newVariant = (response as any).data;
            // Ensure images array exists
            if (!newVariant.images) {
                console.warn('⚠️ No images in API response, initializing empty array');
                newVariant.images = [];
            } else {
                console.log('✓ Images found in response:', newVariant.images.length);
            }

            // Auto-generate SKU & Barcode for newly created variant
            if (newVariant.id && (!form.value.sku || !form.value.barcode)) {
                try {
                    const genResponse = await $fetch<{
                        status: boolean;
                        data: {
                            sku: string;
                            barcode: string;
                            sku_format: string;
                            barcode_type: string;
                        };
                    }>(`/catalog/products/variants/${newVariant.id}/generate-sku-barcode`, {
                        method: "POST",
                        baseURL: useRuntimeConfig().public.apiBase,
                        headers: {
                            Authorization: `Bearer ${useAuthStore().token}`,
                        },
                    });

                    // Update newVariant with generated SKU & Barcode
                    newVariant.sku = genResponse.data.sku;
                    newVariant.barcode = genResponse.data.barcode;
                } catch (genErr) {
                    console.warn('⚠️ Failed to auto-generate SKU & Barcode:', genErr);
                    // Continue anyway, variant is already created
                }
            }

            variants.value.push(newVariant);

            // Clear session ID and temp paths after successful creation
            sessionId.value = "";
            tempImagePaths.value = [];

            // Emit event to parent
            emit('variantAdded');
            emit('variantsChanged', variants.value.length);

            success("Variant added successfully!");
        }

        closeModal();
    } catch (err: any) {
        showError(err?.data?.message || "Failed to save variant");
    }
};

// Delete variant
const deleteVariant = async (variant: ProductVariant) => {
    if (!confirm(`Are you sure you want to delete variant ${variant.sku}?`)) {
        return;
    }

    try {
        await $fetch(`/catalog/products/variants/${variant.id}`, {
            method: "DELETE",
            baseURL: useRuntimeConfig().public.apiBase,
            headers: {
                Authorization: `Bearer ${useAuthStore().token}`,
            },
        });

        // Remove from local state
        const index = variants.value.findIndex((v) => v.id === variant.id);
        if (index !== -1) {
            variants.value.splice(index, 1);
        }

        // Emit event to parent
        emit('variantDeleted');
        emit('variantsChanged', variants.value.length);

        success("Variant deleted successfully!");
    } catch (err: any) {
        showError(err?.data?.message || "Failed to delete variant");
    }
};

// Get primary image from variant
const getPrimaryImage = (variant: ProductVariant) => {
    if (!variant.images || variant.images.length === 0) return null;
    return variant.images.find(img => img.is_primary) || variant.images[0];
};

// Format price
const formatPrice = (price: string | number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(typeof price === "string" ? parseFloat(price) : price);
};
</script>

<template>
    <div class="card bg-base-100 shadow">
        <div class="card-body">
            <div class="flex items-center justify-between">
                <h3 class="card-title">Product Variants ({{ variants.length }})</h3>
                <button type="button" @click="openAddModal" class="btn btn-primary btn-sm">
                    <span class="iconify lucide--plus size-4" />
                    Add Variant
                </button>
            </div>

            <!-- Variants List -->
            <div v-if="variants.length > 0" class="mt-4">
                <div class="overflow-x-auto">
                    <table class="table table-zebra">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>SKU</th>
                                <th>Size</th>
                                <th>Color</th>
                                <th>Price</th>
                                <th>Compare Price</th>
                                <th>Stock</th>
                                <th>Weight</th>
                                <th class="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="variant in variants" :key="variant.id">
                                <td>
                                    <div class="avatar">
                                        <div class="h-12 w-12 rounded">
                                            <img
                                                v-if="getPrimaryImage(variant)"
                                                :src="getPrimaryImage(variant)!.url"
                                                :alt="variant.sku" />
                                            <div
                                                v-else
                                                class="bg-base-200 flex h-full w-full items-center justify-center">
                                                <span class="iconify lucide--image size-6 text-base-content/20" />
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="font-mono text-sm">{{ variant.sku }}</td>
                                <td>{{ variant.size }}</td>
                                <td>{{ variant.color }}</td>
                                <td class="font-semibold">{{ formatPrice(variant.price) }}</td>
                                <td class="text-base-content/60 text-sm">
                                    {{ variant.compare_at_price ? formatPrice(variant.compare_at_price) : '-' }}
                                </td>
                                <td>
                                    <span
                                        class="badge"
                                        :class="variant.stock_quantity < 10 ? 'badge-error' : variant.stock_quantity < 50 ? 'badge-warning' : 'badge-success'">
                                        {{ variant.stock_quantity }}
                                    </span>
                                </td>
                                <td class="text-sm">{{ variant.weight_gram }}g</td>
                                <td class="text-right">
                                    <div class="flex justify-end gap-2">
                                        <button
                                            type="button"
                                            @click="openEditModal(variant)"
                                            class="btn btn-ghost btn-xs"
                                            title="Edit">
                                            <span class="iconify lucide--pencil size-4" />
                                        </button>
                                        <button
                                            type="button"
                                            @click="deleteVariant(variant)"
                                            class="btn btn-ghost btn-xs text-error"
                                            title="Delete">
                                            <span class="iconify lucide--trash-2 size-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div v-else class="text-base-content/60 py-8 text-center">
                <span class="iconify lucide--package size-12 text-base-content/20" />
                <p class="mt-2">No variants added yet</p>
                <button type="button" @click="openAddModal" class="btn btn-primary btn-sm mt-4">
                    <span class="iconify lucide--plus size-4" />
                    Add Your First Variant
                </button>
            </div>
        </div>

        <!-- Modal -->
        <dialog :open="showModal" class="modal" @click.self="closeModal">
            <div class="modal-box max-w-3xl">
                <h3 class="text-lg font-bold">{{ editingVariant ? "Edit Variant" : "Add Variant" }}</h3>

                <div class="mt-4 space-y-4">
                    <!-- SKU & Barcode -->
                    <div class="space-y-3">
                        <div class="flex items-center justify-between">
                            <span class="text-sm font-medium">SKU & Barcode</span>
                            <button
                                v-if="editingVariant"
                                type="button"
                                @click="generateSkuBarcode"
                                class="btn btn-primary btn-xs"
                                :disabled="generating">
                                <span v-if="generating" class="loading loading-spinner loading-xs"></span>
                                <span v-else class="iconify lucide--sparkles size-3" />
                                {{ generating ? "Generating..." : "Auto Generate" }}
                            </button>
                            <span v-else class="text-xs text-info flex items-center gap-1">
                                <span class="iconify lucide--info size-3" />
                                Will auto-generate if left empty
                            </span>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="space-y-2">
                                <label class="fieldset-label" for="sku">
                                    SKU <span v-if="editingVariant" class="text-error">*</span>
                                    <span v-else class="text-xs text-base-content/60">(optional)</span>
                                </label>
                                <input
                                    id="sku"
                                    v-model="form.sku"
                                    type="text"
                                    class="input input-sm w-full"
                                    :placeholder="editingVariant ? 'e.g., PRD-001-S-BLK' : 'Leave empty to auto-generate'"
                                    :readonly="generating" />
                            </div>
                            <div class="space-y-2">
                                <label class="fieldset-label" for="barcode">
                                    Barcode <span class="text-xs text-base-content/60">(optional)</span>
                                </label>
                                <input
                                    id="barcode"
                                    v-model="form.barcode"
                                    type="text"
                                    class="input input-sm w-full"
                                    :placeholder="editingVariant ? 'e.g., 9789850279295' : 'Leave empty to auto-generate'"
                                    :readonly="generating" />
                            </div>
                        </div>
                    </div>

                    <!-- Size & Color -->
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <label class="fieldset-label">
                                Size <span class="text-error">*</span>
                            </label>
                            <div class="grid grid-cols-2 gap-2">
                                <label
                                    v-for="sizeOption in ['5-6', '7-8', '9-10', '11-12']"
                                    :key="sizeOption"
                                    class="flex items-center gap-2 cursor-pointer hover:bg-base-200 p-2 rounded-lg border border-base-300"
                                    :class="{ 'bg-primary/10 border-primary': form.size === sizeOption }">
                                    <input
                                        type="radio"
                                        name="size"
                                        :value="sizeOption"
                                        v-model="form.size"
                                        class="radio radio-primary radio-sm" />
                                    <span class="text-sm">{{ sizeOption }}</span>
                                </label>
                            </div>
                        </div>
                        <div class="space-y-2">
                            <label class="fieldset-label" for="color">
                                Color <span class="text-error">*</span>
                            </label>
                            <input
                                id="color"
                                v-model="form.color"
                                type="text"
                                class="input input-sm w-full"
                                placeholder="e.g., Cream, Light Blue" />
                        </div>
                    </div>

                    <!-- Price & Compare Price -->
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <label class="fieldset-label" for="price">
                                Price <span class="text-error">*</span>
                            </label>
                            <label class="input input-sm flex items-center gap-2">
                                <span class="text-base-content/60">Rp</span>
                                <input
                                    id="price"
                                    v-model="form.price"
                                    type="number"
                                    step="0.01"
                                    class="grow"
                                    placeholder="0" />
                            </label>
                        </div>
                        <div class="space-y-2">
                            <label class="fieldset-label" for="compare_at_price">Compare At Price</label>
                            <label class="input input-sm flex items-center gap-2">
                                <span class="text-base-content/60">Rp</span>
                                <input
                                    id="compare_at_price"
                                    v-model="form.compare_at_price"
                                    type="number"
                                    step="0.01"
                                    class="grow"
                                    placeholder="0" />
                            </label>
                        </div>
                    </div>

                    <!-- Stock & Weight -->
                    <div class="grid grid-cols-3 gap-4">
                        <div class="space-y-2">
                            <label class="fieldset-label" for="stock_quantity">Stock Quantity</label>
                            <input
                                id="stock_quantity"
                                v-model.number="form.stock_quantity"
                                type="number"
                                class="input input-sm w-full"
                                placeholder="0"
                                min="0" />
                        </div>
                        <div class="space-y-2">
                            <label class="fieldset-label" for="reserved_quantity">Reserved</label>
                            <input
                                id="reserved_quantity"
                                v-model.number="form.reserved_quantity"
                                type="number"
                                class="input input-sm w-full"
                                placeholder="0"
                                min="0" />
                        </div>
                        <div class="space-y-2">
                            <label class="fieldset-label" for="weight_gram">Weight (gram)</label>
                            <input
                                id="weight_gram"
                                v-model.number="form.weight_gram"
                                type="number"
                                class="input input-sm w-full"
                                placeholder="0"
                                min="0" />
                        </div>
                    </div>

                    <!-- Images Upload -->
                    <div class="space-y-2">
                        <label class="fieldset-label">Variant Images</label>

                        <!-- Preview Images -->
                        <div v-if="form.images.length > 0" class="mb-3">
                            <div class="grid grid-cols-4 gap-2">
                                <div v-for="(image, index) in form.images" :key="index" class="group relative aspect-square">
                                    <img :src="image" :alt="`Variant image ${index + 1}`" class="h-full w-full rounded object-cover" />
                                    <button
                                        type="button"
                                        @click="removeImage(index)"
                                        class="btn btn-circle btn-error btn-xs absolute -right-1 -top-1 opacity-0 transition-opacity group-hover:opacity-100">
                                        <span class="iconify lucide--x size-3" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Upload Button -->
                        <label class="btn btn-outline btn-sm">
                            <span v-if="uploading" class="loading loading-spinner loading-xs"></span>
                            <span v-else class="iconify lucide--upload size-4" />
                            {{ uploading ? "Uploading..." : "Upload Images" }}
                            <input type="file" accept="image/*" multiple class="hidden" @change="handleImageUpload" :disabled="uploading" />
                        </label>
                        <p class="text-base-content/60 text-xs">You can upload multiple images. Max 10MB per image.</p>
                    </div>
                </div>

                <div class="modal-action">
                    <button type="button" @click="closeModal" class="btn btn-ghost btn-sm">Cancel</button>
                    <button type="button" @click="saveVariant" class="btn btn-primary btn-sm">
                        <span class="iconify lucide--save size-4" />
                        {{ editingVariant ? "Update" : "Add" }} Variant
                    </button>
                </div>
            </div>
            <div class="modal-backdrop" @click="closeModal"></div>
        </dialog>
    </div>
</template>
