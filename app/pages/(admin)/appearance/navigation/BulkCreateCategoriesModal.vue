<script setup lang="ts">
import type { Menu, BulkCreateCategoriesData } from "~/types/appearance/navigation";

const emit = defineEmits<{
    close: [];
    saved: [];
}>();

const { bulkCreateCategories } = useMenus();
const { getCategories } = useCategories();
const { success, error: showError } = useToast();

// Form data
const formData = ref<Partial<BulkCreateCategoriesData>>({
    parent_id: undefined,
    categories: [],
    auto_title: true,
    is_clickable: true,
    is_active: true,
    menu_locations: [],
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
    return response?.data?.categories?.data || [];
});

// Fetch parent menus
const config = useRuntimeConfig();
const authStore = useAuthStore();
const { data: menusResponse } = await useAsyncData(
    "parent-menus-bulk",
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
    // Only root menus can be parents
    return allMenus.filter((m: Menu) => !m.parent_id);
});

const handleSubmit = async () => {
    loading.value = true;
    errors.value = {};

    try {
        const response = await bulkCreateCategories(formData.value as BulkCreateCategoriesData);
        const count = (response as any)?.data?.count || 0;
        success(`Successfully created ${count} menu items from categories!`);
        emit("saved");
        emit("close");
    } catch (err: any) {
        if (err?.data?.errors) {
            errors.value = err.data.errors;
        }
        showError(err?.data?.message || "Failed to bulk create menus");
    } finally {
        loading.value = false;
    }
};

const toggleCategory = (categoryId: number) => {
    const categories = formData.value.categories || [];
    const index = categories.indexOf(categoryId);

    if (index > -1) {
        categories.splice(index, 1);
    } else {
        categories.push(categoryId);
    }

    formData.value.categories = [...categories];
};

const isCategorySelected = (categoryId: number) => {
    return formData.value.categories?.includes(categoryId) || false;
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

const selectAll = () => {
    formData.value.categories = categories.value.map((c: any) => c.id);
};

const deselectAll = () => {
    formData.value.categories = [];
};
</script>

<template>
    <dialog open class="modal">
        <div class="modal-box max-w-2xl">
            <h3 class="text-lg font-bold mb-4">Bulk Create Menus from Categories</h3>
            <p class="text-sm text-base-content/60 mb-4">
                Quickly create multiple menu items from your existing categories. Each selected category will become a
                menu item.
            </p>

            <form @submit.prevent="handleSubmit" class="space-y-4">
                <!-- Parent Menu -->
                <div class="form-control">
                    <label class="label">
                        <span class="label-text">Parent Menu</span>
                        <span class="label-text-alt text-base-content/60">Optional - for submenu</span>
                    </label>
                    <select
                        v-model="formData.parent_id"
                        class="select select-bordered"
                        :class="{ 'select-error': errors.parent_id }">
                        <option :value="undefined">None (Root Menu)</option>
                        <option v-for="menu in parentMenus" :key="menu.id" :value="menu.id">
                            {{ menu.title }}
                        </option>
                    </select>
                    <label v-if="errors.parent_id" class="label">
                        <span class="label-text-alt text-error">{{ errors.parent_id[0] }}</span>
                    </label>
                </div>

                <!-- Categories Selection -->
                <div class="form-control">
                    <label class="label">
                        <span class="label-text">Select Categories <span class="text-error">*</span></span>
                        <div class="flex gap-2">
                            <button type="button" @click="selectAll" class="btn btn-xs btn-ghost">
                                Select All
                            </button>
                            <button type="button" @click="deselectAll" class="btn btn-xs btn-ghost">
                                Deselect All
                            </button>
                        </div>
                    </label>
                    <div class="border border-base-300 rounded-lg p-4 max-h-64 overflow-y-auto">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <label
                                v-for="category in categories"
                                :key="category.id"
                                class="label cursor-pointer justify-start gap-2 p-2 hover:bg-base-200 rounded">
                                <input
                                    type="checkbox"
                                    class="checkbox checkbox-primary checkbox-sm"
                                    :checked="isCategorySelected(category.id)"
                                    @change="toggleCategory(category.id)" />
                                <span class="label-text">{{ category.name }}</span>
                            </label>
                        </div>
                        <div v-if="categories.length === 0" class="text-center text-base-content/60 py-4">
                            No categories available
                        </div>
                    </div>
                    <label class="label">
                        <span class="label-text-alt">
                            {{ formData.categories?.length || 0 }} categories selected
                        </span>
                    </label>
                    <label v-if="errors.categories" class="label">
                        <span class="label-text-alt text-error">{{ errors.categories[0] }}</span>
                    </label>
                </div>

                <!-- Menu Locations -->
                <div class="form-control">
                    <label class="label">
                        <span class="label-text">Menu Locations <span class="text-error">*</span></span>
                        <span class="label-text-alt text-base-content/60">Select at least one</span>
                    </label>
                    <div class="flex gap-4">
                        <label class="label cursor-pointer gap-2">
                            <input
                                type="checkbox"
                                class="checkbox checkbox-primary"
                                :checked="isLocationSelected('header')"
                                @change="toggleLocation('header')" />
                            <span class="label-text">Header</span>
                        </label>
                        <label class="label cursor-pointer gap-2">
                            <input
                                type="checkbox"
                                class="checkbox checkbox-secondary"
                                :checked="isLocationSelected('footer')"
                                @change="toggleLocation('footer')" />
                            <span class="label-text">Footer</span>
                        </label>
                        <label class="label cursor-pointer gap-2">
                            <input
                                type="checkbox"
                                class="checkbox checkbox-accent"
                                :checked="isLocationSelected('mobile')"
                                @change="toggleLocation('mobile')" />
                            <span class="label-text">Mobile</span>
                        </label>
                    </div>
                    <label v-if="errors.menu_locations" class="label">
                        <span class="label-text-alt text-error">{{ errors.menu_locations[0] }}</span>
                    </label>
                </div>

                <!-- Options -->
                <div class="space-y-3">
                    <div class="form-control">
                        <label class="label cursor-pointer gap-2 justify-start">
                            <input
                                v-model="formData.auto_title"
                                type="checkbox"
                                class="toggle toggle-primary" />
                            <div>
                                <span class="label-text font-medium">Auto Title</span>
                                <p class="text-xs text-base-content/60">Use category name as menu title</p>
                            </div>
                        </label>
                    </div>
                    <div class="form-control">
                        <label class="label cursor-pointer gap-2 justify-start">
                            <input
                                v-model="formData.is_clickable"
                                type="checkbox"
                                class="toggle toggle-primary" />
                            <div>
                                <span class="label-text font-medium">Is Clickable</span>
                                <p class="text-xs text-base-content/60">Make menu items clickable</p>
                            </div>
                        </label>
                    </div>
                    <div class="form-control">
                        <label class="label cursor-pointer gap-2 justify-start">
                            <input
                                v-model="formData.is_active"
                                type="checkbox"
                                class="toggle toggle-success" />
                            <div>
                                <span class="label-text font-medium">Is Active</span>
                                <p class="text-xs text-base-content/60">Activate menu items immediately</p>
                            </div>
                        </label>
                    </div>
                </div>

                <!-- Actions -->
                <div class="modal-action">
                    <button type="button" class="btn btn-ghost" @click="emit('close')" :disabled="loading">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        class="btn btn-primary"
                        :disabled="loading || !formData.categories?.length">
                        <span v-if="loading" class="loading loading-spinner loading-sm"></span>
                        Create {{ formData.categories?.length || 0 }} Menus
                    </button>
                </div>
            </form>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button @click="emit('close')">close</button>
        </form>
    </dialog>
</template>
