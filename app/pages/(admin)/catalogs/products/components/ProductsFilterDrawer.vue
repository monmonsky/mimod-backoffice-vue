<script setup lang="ts">
const props = defineProps<{
    status: string;
    brand: string;
    featured: string;
}>();

const emit = defineEmits<{
    'update:status': [value: string];
    'update:brand': [value: string];
    'update:featured': [value: string];
    'clear': [];
}>();

// Fetch brands for filter dropdown
const { data: brandsResponse } = await useAsyncData(
    'brands-filter',
    () => $fetch('/catalog/brands', {
        baseURL: useRuntimeConfig().public.apiBase,
        headers: {
            Authorization: `Bearer ${useAuthStore().token}`,
        },
        params: {
            per_page: 100,
        },
    })
);

const brands = computed(() => {
    const response = brandsResponse.value as any;
    return response?.data?.brands?.data || [];
});

const handleClear = () => {
    emit('update:status', '');
    emit('update:brand', '');
    emit('update:featured', '');
    emit('clear');
};

const handleApply = () => {
    // Close drawer
    const checkbox = document.getElementById('products-filter-drawer') as HTMLInputElement;
    if (checkbox) checkbox.checked = false;
};
</script>

<template>
    <div class="drawer drawer-end">
        <input id="products-filter-drawer" type="checkbox" class="drawer-toggle" />
        <div class="drawer-side z-50">
            <label for="products-filter-drawer" aria-label="close sidebar" class="drawer-overlay" />
            <div class="bg-base-100 text-base-content h-full w-80 sm:w-96 flex flex-col">
                <!-- Header -->
                <div class="border-base-300 flex items-center justify-between border-b px-6 py-4">
                    <h3 class="text-lg font-semibold">Advanced Filters</h3>
                    <label for="products-filter-drawer" class="btn btn-ghost btn-sm btn-circle">
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
                                :value="props.status"
                                @input="emit('update:status', ($event.target as HTMLSelectElement).value)"
                                class="select select-bordered w-full">
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="draft">Draft</option>
                            </select>
                        </div>

                        <!-- Brand Filter -->
                        <div>
                            <label class="label">
                                <span class="label-text font-medium">Brand</span>
                            </label>
                            <select
                                :value="props.brand"
                                @input="emit('update:brand', ($event.target as HTMLSelectElement).value)"
                                class="select select-bordered w-full">
                                <option value="">All Brands</option>
                                <option v-for="brand in brands" :key="brand.id" :value="brand.id">
                                    {{ brand.name }}
                                </option>
                            </select>
                        </div>

                        <!-- Featured Filter -->
                        <div>
                            <label class="label">
                                <span class="label-text font-medium">Featured</span>
                            </label>
                            <select
                                :value="props.featured"
                                @input="emit('update:featured', ($event.target as HTMLSelectElement).value)"
                                class="select select-bordered w-full">
                                <option value="">All Products</option>
                                <option value="1">Featured Only</option>
                                <option value="0">Not Featured</option>
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
