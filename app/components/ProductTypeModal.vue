<script setup lang="ts">
const props = defineProps<{
    show: boolean;
}>();

const emit = defineEmits<{
    close: [];
    selectType: [type: 'single' | 'variant'];
}>();

const selectedType = ref<'single' | 'variant' | null>(null);

const handleSelectType = (type: 'single' | 'variant') => {
    selectedType.value = type;
};

const handleContinue = () => {
    if (selectedType.value) {
        emit('selectType', selectedType.value);
    }
};

const handleClose = () => {
    selectedType.value = null;
    emit('close');
};
</script>

<template>
    <dialog :open="show" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
            <h3 class="text-lg font-bold">Create New Product</h3>
            <p class="text-base-content/60 py-2">Choose product type to continue</p>

            <div class="mt-6 space-y-3">
                <!-- Single Product Option -->
                <div
                    class="flex cursor-pointer items-start gap-4 rounded-lg border-2 p-4 transition-all"
                    :class="selectedType === 'single' ? 'border-primary bg-primary/5' : 'border-base-300 hover:border-primary/50'"
                    @click="handleSelectType('single')"
                >
                    <input
                        type="radio"
                        name="product-type"
                        value="single"
                        class="radio radio-primary mt-1"
                        :checked="selectedType === 'single'"
                    />
                    <div class="flex-1">
                        <div class="flex items-center gap-2">
                            <span class="iconify lucide--package size-5 text-primary" />
                            <h4 class="font-semibold">Single Product</h4>
                        </div>
                        <p class="text-base-content/60 mt-1 text-sm">
                            Product without variants. One size, one color, one SKU. Default variant will be auto-created.
                        </p>
                        <div class="mt-2 flex gap-2">
                            <span class="badge badge-sm badge-ghost">No variants</span>
                            <span class="badge badge-sm badge-ghost">Quick setup</span>
                        </div>
                    </div>
                </div>

                <!-- Variant Product Option -->
                <div
                    class="flex cursor-pointer items-start gap-4 rounded-lg border-2 p-4 transition-all"
                    :class="selectedType === 'variant' ? 'border-primary bg-primary/5' : 'border-base-300 hover:border-primary/50'"
                    @click="handleSelectType('variant')"
                >
                    <input
                        type="radio"
                        name="product-type"
                        value="variant"
                        class="radio radio-primary mt-1"
                        :checked="selectedType === 'variant'"
                    />
                    <div class="flex-1">
                        <div class="flex items-center gap-2">
                            <span class="iconify lucide--boxes size-5 text-primary" />
                            <h4 class="font-semibold">Product with Variants</h4>
                        </div>
                        <p class="text-base-content/60 mt-1 text-sm">
                            Product with multiple variants (sizes, colors, etc.). Create variants manually or in bulk.
                        </p>
                        <div class="mt-2 flex gap-2">
                            <span class="badge badge-sm badge-ghost">Multiple variants</span>
                            <span class="badge badge-sm badge-ghost">Full control</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal-action">
                <button class="btn btn-ghost btn-sm" @click="handleClose">
                    <span class="iconify lucide--x size-4" />
                    Cancel
                </button>
                <button
                    class="btn btn-primary btn-sm"
                    :disabled="!selectedType"
                    @click="handleContinue"
                >
                    <span class="iconify lucide--arrow-right size-4" />
                    Continue
                </button>
            </div>
        </div>
        <div class="modal-backdrop" @click="handleClose"></div>
    </dialog>
</template>
