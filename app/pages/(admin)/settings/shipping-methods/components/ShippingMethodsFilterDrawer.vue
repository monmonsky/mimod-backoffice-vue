<script setup lang="ts">
const props = defineProps<{
    isActive: string;
    type: string;
    provider: string;
}>();

const emit = defineEmits<{
    'update:isActive': [value: string];
    'update:type': [value: string];
    'update:provider': [value: string];
    'clear': [];
}>();

const handleClear = () => {
    emit('update:isActive', '');
    emit('update:type', '');
    emit('update:provider', '');
    emit('clear');
};

const handleApply = () => {
    // Close drawer
    const checkbox = document.getElementById('shipping-methods-filter-drawer') as HTMLInputElement;
    if (checkbox) checkbox.checked = false;
};
</script>

<template>
    <div class="drawer drawer-end">
        <input id="shipping-methods-filter-drawer" type="checkbox" class="drawer-toggle" />
        <div class="drawer-side z-50">
            <label for="shipping-methods-filter-drawer" aria-label="close sidebar" class="drawer-overlay" />
            <div class="bg-base-100 text-base-content h-full w-80 sm:w-96 flex flex-col">
                <!-- Header -->
                <div class="border-base-300 flex items-center justify-between border-b px-6 py-4">
                    <h3 class="text-lg font-semibold">Advanced Filters</h3>
                    <label for="shipping-methods-filter-drawer" class="btn btn-ghost btn-sm btn-circle">
                        <span class="iconify lucide--x size-5" />
                    </label>
                </div>

                <!-- Content -->
                <div class="flex-1 overflow-y-auto p-6">
                    <div class="space-y-6">
                        <!-- Status Filter -->
                        <div>
                            <label class="label">
                                <span class="label-text font-medium">Status</span>
                            </label>
                            <select
                                :value="props.isActive"
                                @input="emit('update:isActive', ($event.target as HTMLSelectElement).value)"
                                class="select select-bordered w-full">
                                <option value="">All Status</option>
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </select>
                        </div>

                        <!-- Type Filter -->
                        <div>
                            <label class="label">
                                <span class="label-text font-medium">Shipping Type</span>
                            </label>
                            <select
                                :value="props.type"
                                @input="emit('update:type', ($event.target as HTMLSelectElement).value)"
                                class="select select-bordered w-full">
                                <option value="">All Types</option>
                                <option value="manual">Manual</option>
                                <option value="custom">Custom</option>
                                <option value="rajaongkir">RajaOngkir</option>
                            </select>
                        </div>

                        <!-- Provider Filter -->
                        <div>
                            <label class="label">
                                <span class="label-text font-medium">Provider</span>
                            </label>
                            <select
                                :value="props.provider"
                                @input="emit('update:provider', ($event.target as HTMLSelectElement).value)"
                                class="select select-bordered w-full">
                                <option value="">All Providers</option>
                                <option value="jne">JNE</option>
                                <option value="jnt">J&T</option>
                                <option value="sicepat">SiCepat</option>
                                <option value="pos">POS Indonesia</option>
                                <option value="gosend">GoSend</option>
                                <option value="grab">Grab</option>
                                <option value="custom">Custom</option>
                                <option value="rajaongkir">RajaOngkir</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="border-base-300 border-t p-6">
                    <div class="flex gap-3">
                        <button @click="handleClear" class="btn btn-ghost flex-1">
                            <span class="iconify lucide--rotate-ccw size-4" />
                            Reset
                        </button>
                        <button @click="handleApply" class="btn btn-primary flex-1">
                            <span class="iconify lucide--check size-4" />
                            Apply
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
