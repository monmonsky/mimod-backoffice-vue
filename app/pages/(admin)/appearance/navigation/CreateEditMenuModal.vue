<script setup lang="ts">
import type { Menu, MenuFormData } from "~/types/appearance/navigation";

const props = defineProps<{
    menu: Menu | null;
}>();

const emit = defineEmits<{
    close: [];
    saved: [];
}>();

const { createMenu, updateMenu } = useMenus();
const { getCategories } = useCategories();
const { success, error: showError } = useToast();

const isEdit = computed(() => !!props.menu);
const modalTitle = computed(() => (isEdit.value ? "Edit Menu" : "Create Menu"));

// Helper function to parse menu locations from various formats
const parseMenuLocations = (menuLocations: any): ('header' | 'footer' | 'mobile')[] => {
    if (!menuLocations) return [];

    // If it's a string that looks like JSON array, parse it
    if (typeof menuLocations === 'string') {
        try {
            const parsed = JSON.parse(menuLocations);
            if (Array.isArray(parsed)) {
                return parsed as ('header' | 'footer' | 'mobile')[];
            }
            return menuLocations.split(',').map(l => l.trim()) as ('header' | 'footer' | 'mobile')[];
        } catch (e) {
            return menuLocations.split(',').map(l => l.trim()) as ('header' | 'footer' | 'mobile')[];
        }
    }

    // If it's already an array
    if (Array.isArray(menuLocations)) {
        return menuLocations.map(ml => {
            // If it's an object with location property
            if (typeof ml === 'object' && ml.location) {
                return ml.location;
            }
            // If it's a string that might be JSON
            if (typeof ml === 'string') {
                try {
                    const parsed = JSON.parse(ml);
                    if (Array.isArray(parsed)) {
                        return parsed[0];
                    }
                    return parsed;
                } catch (e) {
                    return ml;
                }
            }
            return ml;
        }).flat() as ('header' | 'footer' | 'mobile')[];
    }

    return [];
};

// Form data
const formData = ref<Partial<MenuFormData>>({
    title: props.menu?.title || "",
    link_type: props.menu?.link_type || "static",
    url: props.menu?.url || "",
    category_id: props.menu?.category_id || undefined,
    parent_id: props.menu?.parent_id || undefined,
    order: props.menu?.order || 1,
    is_clickable: props.menu?.is_clickable ?? true,
    is_active: props.menu?.is_active ?? true,
    menu_locations: parseMenuLocations(props.menu?.menu_locations),
});

const errors = ref<Record<string, string[]>>({});
const loading = ref(false);

// Fetch categories
const { data: categoriesResponse } = await getCategories({
    per_page: 1000,
    status: "active",
});
const categories = computed(() => {
    const response = categoriesResponse.value as any;
    // Response format: { data: [{ data: [...categories] }] }
    if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
        return response.data[0]?.data || [];
    }
    return [];
});

// Fetch parent menus (for hierarchical menu)
const config = useRuntimeConfig();
const authStore = useAuthStore();
const { data: menusResponse } = await useAsyncData(
    "parent-menus",
    () =>
        $fetch("/appearance/navigation/menus", {
            baseURL: config.public.apiBase,
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
            params: {
                per_page: 1000,
                status: "active",
            },
        })
);
const parentMenus = computed(() => {
    const response = menusResponse.value as any;
    const allMenus = response?.data?.data || [];
    // Filter out current menu if editing to prevent self-parent
    return isEdit.value
        ? allMenus.filter((m: Menu) => m.id !== props.menu?.id && !m.parent_id)
        : allMenus.filter((m: Menu) => !m.parent_id);
});

// Computed: Preview URL based on link type
const previewUrl = computed(() => {
    const linkType = formData.value.link_type;

    if (linkType === 'static' || linkType === 'external') {
        return formData.value.url || '-';
    }

    if (linkType === 'category' && formData.value.category_id) {
        const category = categories.value.find((c: any) => c.id === formData.value.category_id);
        return category ? `/collections/${category.slug}` : '-';
    }

    return '-';
});

// Watch link_type changes to clear irrelevant fields
watch(() => formData.value.link_type, () => {
    formData.value.url = "";
    formData.value.category_id = undefined;
});

// Auto-fill title when selecting category
watch(() => formData.value.category_id, (categoryId) => {
    if (categoryId && !formData.value.title) {
        const category = categories.value.find((c: any) => c.id === categoryId);
        if (category) {
            formData.value.title = category.name;
        }
    }
});

const handleSubmit = async () => {
    loading.value = true;
    errors.value = {};

    try {
        if (isEdit.value && props.menu) {
            await updateMenu(props.menu.id, formData.value);
            success("Menu updated successfully!");
        } else {
            await createMenu(formData.value);
            success("Menu created successfully!");
        }
        emit("saved");
        emit("close");
    } catch (err: any) {
        if (err?.data?.errors) {
            errors.value = err.data.errors;
        }
        showError(err?.data?.message || "Failed to save menu");
    } finally {
        loading.value = false;
    }
};

const toggleLocation = (location: 'header' | 'footer' | 'mobile') => {
    const locations = formData.value.menu_locations || [];
    const index = locations.indexOf(location);

    if (index > -1) {
        locations.splice(index, 1);
    } else {
        locations.push(location);
    }

    formData.value.menu_locations = [...locations];
};

const isLocationSelected = (location: 'header' | 'footer' | 'mobile') => {
    return formData.value.menu_locations?.includes(location) || false;
};

// Link type options with labels (Product and Brand removed as requested)
const linkTypeOptions = [
    { value: 'static', label: 'Static URL', icon: 'lucide--link', description: 'Link to internal page' },
    { value: 'category', label: 'Category', icon: 'lucide--folder', description: 'Link to category page' },
    { value: 'external', label: 'External URL', icon: 'lucide--external-link', description: 'Link to external website' },
] as const;
</script>

<template>
    <dialog open class="modal">
        <div class="modal-box max-w-2xl">
            <h3 class="text-lg font-bold mb-4">{{ modalTitle }}</h3>

            <form @submit.prevent="handleSubmit" class="space-y-4">
                <!-- Title -->
                <div class="form-control w-full">
                    <div class="mb-2">
                        <span class="text-sm font-medium">Title <span class="text-error">*</span></span>
                    </div>
                    <input
                        v-model="formData.title"
                        type="text"
                        class="input input-bordered w-full"
                        :class="{ 'input-error': errors.title }"
                        placeholder="Menu Title" />
                    <div v-if="errors.title" class="mt-1">
                        <span class="text-xs text-error">{{ errors.title[0] }}</span>
                    </div>
                </div>

                <!-- Link Type -->
                <div class="form-control w-full">
                    <div class="mb-2">
                        <span class="text-sm font-medium">Link Type <span class="text-error">*</span></span>
                    </div>
                    <select
                        v-model="formData.link_type"
                        class="select select-bordered w-full"
                        :class="{ 'select-error': errors.link_type }">
                        <option v-for="option in linkTypeOptions" :key="option.value" :value="option.value">
                            {{ option.label }}
                        </option>
                    </select>
                    <div v-if="errors.link_type" class="mt-1">
                        <span class="text-xs text-error">{{ errors.link_type[0] }}</span>
                    </div>
                </div>

                <!-- URL (for static/external) -->
                <div v-if="formData.link_type === 'static' || formData.link_type === 'external'" class="form-control w-full">
                    <div class="mb-2">
                        <span class="text-sm font-medium">URL <span class="text-error">*</span></span>
                    </div>
                    <input
                        v-model="formData.url"
                        type="text"
                        class="input input-bordered w-full"
                        :class="{ 'input-error': errors.url }"
                        :placeholder="formData.link_type === 'external' ? 'https://example.com' : '/about'" />
                    <div v-if="errors.url" class="mt-1">
                        <span class="text-xs text-error">{{ errors.url[0] }}</span>
                    </div>
                </div>

                <!-- Category (Dynamic from API) -->
                <div v-if="formData.link_type === 'category'" class="form-control w-full">
                    <div class="mb-2">
                        <span class="text-sm font-medium">Category <span class="text-error">*</span></span>
                    </div>
                    <select
                        v-model="formData.category_id"
                        class="select select-bordered w-full"
                        :class="{ 'select-error': errors.category_id }">
                        <option :value="undefined">Select Category</option>
                        <option v-for="category in categories" :key="category.id" :value="category.id">
                            {{ category.name }}
                        </option>
                    </select>
                    <div v-if="errors.category_id" class="mt-1">
                        <span class="text-xs text-error">{{ errors.category_id[0] }}</span>
                    </div>
                </div>

                <!-- URL Preview -->
                <div v-if="previewUrl !== '-'" class="alert alert-info">
                    <span class="iconify lucide--link size-5" />
                    <div class="flex flex-col">
                        <span class="text-xs font-medium">Generated URL:</span>
                        <span class="font-mono text-sm">{{ previewUrl }}</span>
                    </div>
                </div>

                <!-- Parent Menu -->
                <div class="form-control w-full">
                    <div class="mb-2">
                        <span class="text-sm font-medium">Parent Menu</span>
                        <span class="text-xs text-base-content/60 ml-2">Optional - for submenu</span>
                    </div>
                    <select
                        v-model="formData.parent_id"
                        class="select select-bordered w-full"
                        :class="{ 'select-error': errors.parent_id }">
                        <option :value="undefined">None (Root Menu)</option>
                        <option v-for="menu in parentMenus" :key="menu.id" :value="menu.id">
                            {{ menu.title }}
                        </option>
                    </select>
                    <div v-if="errors.parent_id" class="mt-1">
                        <span class="text-xs text-error">{{ errors.parent_id[0] }}</span>
                    </div>
                </div>

                <!-- Menu Locations -->
                <div class="form-control w-full">
                    <div class="mb-2">
                        <span class="text-sm font-medium">Menu Locations <span class="text-error">*</span></span>
                        <span class="text-xs text-base-content/60 ml-2">Select at least one</span>
                    </div>
                    <div class="flex gap-4">
                        <label class="cursor-pointer flex items-center gap-2">
                            <input
                                type="checkbox"
                                class="checkbox checkbox-primary checkbox-sm"
                                :checked="isLocationSelected('header')"
                                @change="toggleLocation('header')" />
                            <span class="text-sm">Header</span>
                        </label>
                        <label class="cursor-pointer flex items-center gap-2">
                            <input
                                type="checkbox"
                                class="checkbox checkbox-secondary checkbox-sm"
                                :checked="isLocationSelected('footer')"
                                @change="toggleLocation('footer')" />
                            <span class="text-sm">Footer</span>
                        </label>
                        <label class="cursor-pointer flex items-center gap-2">
                            <input
                                type="checkbox"
                                class="checkbox checkbox-accent checkbox-sm"
                                :checked="isLocationSelected('mobile')"
                                @change="toggleLocation('mobile')" />
                            <span class="text-sm">Mobile</span>
                        </label>
                    </div>
                    <div v-if="errors.menu_locations" class="mt-1">
                        <span class="text-xs text-error">{{ errors.menu_locations[0] }}</span>
                    </div>
                </div>

                <!-- Order -->
                <div class="form-control w-full">
                    <div class="mb-2">
                        <span class="text-sm font-medium">Order</span>
                        <span class="text-xs text-base-content/60 ml-2">Display order (lower = first)</span>
                    </div>
                    <input
                        v-model.number="formData.order"
                        type="number"
                        min="1"
                        class="input input-bordered w-full"
                        :class="{ 'input-error': errors.order }" />
                    <div v-if="errors.order" class="mt-1">
                        <span class="text-xs text-error">{{ errors.order[0] }}</span>
                    </div>
                </div>

                <!-- Switches -->
                <div class="grid grid-cols-2 gap-4">
                    <div class="form-control">
                        <div class="mb-2">
                            <span class="text-sm font-medium">Is Clickable</span>
                        </div>
                        <label class="cursor-pointer flex items-center gap-2">
                            <input
                                v-model="formData.is_clickable"
                                type="checkbox"
                                class="toggle toggle-primary toggle-sm" />
                            <span class="text-xs text-base-content/60">Acts as label if disabled</span>
                        </label>
                    </div>
                    <div class="form-control">
                        <div class="mb-2">
                            <span class="text-sm font-medium">Is Active</span>
                        </div>
                        <label class="cursor-pointer flex items-center gap-2">
                            <input
                                v-model="formData.is_active"
                                type="checkbox"
                                class="toggle toggle-success toggle-sm" />
                            <span class="text-xs text-base-content/60">Show/hide menu</span>
                        </label>
                    </div>
                </div>

                <!-- Actions -->
                <div class="modal-action">
                    <button type="button" class="btn btn-ghost" @click="emit('close')" :disabled="loading">
                        Cancel
                    </button>
                    <button type="submit" class="btn btn-primary" :disabled="loading">
                        <span v-if="loading" class="loading loading-spinner loading-sm"></span>
                        {{ isEdit ? 'Update' : 'Create' }}
                    </button>
                </div>
            </form>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button @click="emit('close')">close</button>
        </form>
    </dialog>
</template>
