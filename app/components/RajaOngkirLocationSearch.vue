<script setup lang="ts">
const props = defineProps<{
    modelValue: any;
    placeholder?: string;
    required?: boolean;
}>();

const emit = defineEmits<{
    'update:modelValue': [value: any];
}>();

const search = ref('');
const isSearching = ref(false);
const showResults = ref(false);
const locations = ref<any[]>([]);
const selectedLocation = ref<any>(props.modelValue || null);

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
    selectedLocation.value = newValue;
});

// Debounced search
const { debouncedValue: debouncedSearch } = useSearchDebounce(search);

// Watch debounced search and fetch locations
watch(debouncedSearch, async (searchValue) => {
    if (!searchValue || searchValue.length < 3) {
        locations.value = [];
        showResults.value = false;
        return;
    }

    try {
        isSearching.value = true;
        showResults.value = true;

        const config = useRuntimeConfig();
        const authStore = useAuthStore();

        // Use local API proxy instead of direct RajaOngkir API
        const url = `${config.public.apiBase}/rajaongkir/search-destination`;
        const response = await $fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
            query: {
                search: searchValue,
                limit: 10
            }
        });

        const data = response as any;
        if (data.status && data.data) {
            locations.value = data.data;
        } else {
            locations.value = [];
        }
    } catch (error) {
        console.error('Failed to fetch locations:', error);
        locations.value = [];
    } finally {
        isSearching.value = false;
    }
});

// Select location
const selectLocation = (location: any) => {
    selectedLocation.value = location;
    emit('update:modelValue', location);
    search.value = '';
    showResults.value = false;
};

// Clear selection
const clearSelection = () => {
    selectedLocation.value = null;
    emit('update:modelValue', null);
    search.value = '';
};

// Close dropdown when clicking outside
const dropdownRef = ref<HTMLElement | null>(null);
onMounted(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
            showResults.value = false;
        }
    };
    document.addEventListener('click', handleClickOutside);
    onBeforeUnmount(() => {
        document.removeEventListener('click', handleClickOutside);
    });
});
</script>

<template>
    <div ref="dropdownRef" class="relative">
        <!-- Selected Location Display -->
        <div v-if="selectedLocation" class="border border-base-300 rounded-lg p-3 bg-base-50">
            <div class="flex items-start justify-between gap-3">
                <div class="flex-1">
                    <div class="font-medium text-sm">{{ selectedLocation.label }}</div>
                    <div class="text-xs text-base-content/70 mt-1">
                        <div>{{ selectedLocation.subdistrict_name }}, {{ selectedLocation.district_name }}</div>
                        <div>{{ selectedLocation.city_name }}, {{ selectedLocation.province_name }}</div>
                        <div v-if="selectedLocation.zip_code" class="mt-1">
                            <span class="badge badge-sm badge-ghost">{{ selectedLocation.zip_code }}</span>
                        </div>
                    </div>
                </div>
                <button
                    type="button"
                    @click="clearSelection"
                    class="btn btn-ghost btn-sm btn-circle"
                    aria-label="Clear selection">
                    <span class="iconify lucide--x size-4" />
                </button>
            </div>
        </div>

        <!-- Search Input -->
        <div v-else>
            <label class="input input-bordered flex items-center gap-2">
                <span class="iconify lucide--search size-4 text-base-content/60" />
                <input
                    v-model="search"
                    type="text"
                    class="grow"
                    :placeholder="placeholder || 'Search location...'"
                    :required="required && !selectedLocation"
                    @focus="showResults = search.length >= 3" />
                <span v-if="isSearching" class="loading loading-spinner loading-xs"></span>
            </label>

            <!-- Search Results Dropdown -->
            <div
                v-if="showResults"
                class="absolute z-50 w-full mt-2 bg-base-100 border border-base-300 rounded-lg shadow-lg max-h-96 overflow-y-auto">
                <!-- Loading State -->
                <div v-if="isSearching" class="p-4 text-center text-sm text-base-content/60">
                    <span class="loading loading-spinner loading-sm"></span>
                    <span class="ml-2">Searching...</span>
                </div>

                <!-- Results -->
                <div v-else-if="locations.length > 0">
                    <button
                        v-for="location in locations"
                        :key="location.id"
                        type="button"
                        @click="selectLocation(location)"
                        class="w-full text-left p-3 hover:bg-base-200 border-b border-base-200 last:border-0 transition-colors">
                        <div class="font-medium text-sm">{{ location.label }}</div>
                        <div class="text-xs text-base-content/70 mt-1">
                            <div>{{ location.subdistrict_name }}, {{ location.district_name }}</div>
                            <div>{{ location.city_name }}, {{ location.province_name }}</div>
                            <div v-if="location.zip_code" class="mt-1">
                                <span class="badge badge-xs badge-ghost">{{ location.zip_code }}</span>
                            </div>
                        </div>
                    </button>
                </div>

                <!-- No Results -->
                <div v-else class="p-4 text-center text-sm text-base-content/60">
                    <span class="iconify lucide--search-x size-8 block mx-auto mb-2 opacity-30" />
                    <p>No locations found</p>
                    <p class="text-xs mt-1">Try a different search term</p>
                </div>
            </div>

            <!-- Helper Text -->
            <div v-if="!showResults && search.length > 0 && search.length < 3" class="text-xs text-base-content/60 mt-1 px-1">
                Type at least 3 characters to search
            </div>
        </div>
    </div>
</template>
