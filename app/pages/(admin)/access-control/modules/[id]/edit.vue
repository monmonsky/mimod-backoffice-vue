<script lang="ts" setup>
import PageTitle from "~/components/PageTitle.vue";

definePageMeta({
    layout: "admin",
});

const route = useRoute();
const router = useRouter();
const moduleId = Number(route.params.id);

const { getModule, getModules, updateModule } = useModules();
const { success, error } = useToast();

// Fetch module details
const { data: moduleResponse, pending, error: fetchError } = getModule(moduleId);
const module = computed(() => moduleResponse.value?.data);

// Fetch all modules for parent dropdown
const { data: allModulesResponse } = getModules();
const parentModules = computed(() => {
    const modules = allModulesResponse.value?.data?.data || [];
    // Filter out current module and its children
    return modules.filter((m) => m.id !== moduleId);
});

// Form data
const formData = ref({
    name: "",
    display_name: "",
    description: "",
    icon: "",
    parent_id: null as number | null,
    group_name: "",
    route: "",
    permission_name: "",
    component: "",
    sort_order: 1,
    is_active: true,
    is_visible: true,
});

// Initialize form when module loads
watch(
    module,
    (moduleData) => {
        if (moduleData) {
            formData.value = {
                name: moduleData.name,
                display_name: moduleData.display_name,
                description: moduleData.description || "",
                icon: moduleData.icon || "",
                parent_id: moduleData.parent_id,
                group_name: moduleData.group_name || "",
                route: moduleData.route,
                permission_name: moduleData.permission_name,
                component: moduleData.component,
                sort_order: moduleData.sort_order,
                is_active: moduleData.is_active,
                is_visible: moduleData.is_visible,
            };
        }
    },
    { immediate: true },
);

const saving = ref(false);

const handleSubmit = async () => {
    try {
        saving.value = true;
        const submitData = {
            name: formData.value.name,
            display_name: formData.value.display_name,
            description: formData.value.description || undefined,
            icon: formData.value.icon || undefined,
            parent_id: formData.value.parent_id || undefined,
            group_name: formData.value.group_name || undefined,
            route: formData.value.route,
            permission_name: formData.value.permission_name,
            component: formData.value.component,
            sort_order: formData.value.sort_order,
            is_active: formData.value.is_active,
            is_visible: formData.value.is_visible,
        };

        await updateModule(moduleId, submitData);
        success("Module updated successfully!");
        router.push("/access-control/modules");
    } catch (err: any) {
        const errorMessage = err?.data?.message || "Failed to update module";
        error(errorMessage);
    } finally {
        saving.value = false;
    }
};
</script>

<template>
    <div>
        <PageTitle
            :items="[
                { label: 'Access Control' },
                { label: 'Modules', path: '/access-control/modules' },
                { label: 'Edit', active: true },
            ]"
            title="Edit Module" />

        <!-- Loading State -->
        <div v-if="pending" class="mt-6 flex items-center justify-center py-12">
            <span class="loading loading-spinner loading-lg"></span>
        </div>

        <!-- Error State -->
        <div v-else-if="fetchError" class="mt-6">
            <div class="alert alert-error">
                <span class="iconify lucide--alert-circle size-5" />
                <span>Failed to load module. Please try again.</span>
            </div>
        </div>

        <!-- Form -->
        <div v-else-if="module" class="mt-6">
            <form @submit.prevent="handleSubmit">
                <div class="grid grid-cols-1 gap-5">
                    <!-- Basic Information -->
                    <div class="card bg-base-100 shadow">
                        <div class="card-body">
                            <div class="card-title">Basic Information</div>
                            <div class="fieldset mt-2 grid grid-cols-1 gap-4 lg:grid-cols-2">
                                <div class="space-y-2">
                                    <label class="fieldset-label" for="name">
                                        Module Name
                                        <span class="text-error">*</span>
                                    </label>
                                    <input
                                        id="name"
                                        v-model="formData.name"
                                        type="text"
                                        class="input w-full"
                                        placeholder="e.g., dashboard, products"
                                        required />
                                </div>
                                <div class="space-y-2">
                                    <label class="fieldset-label" for="display_name">
                                        Display Name
                                        <span class="text-error">*</span>
                                    </label>
                                    <input
                                        id="display_name"
                                        v-model="formData.display_name"
                                        type="text"
                                        class="input w-full"
                                        placeholder="e.g., Dashboard"
                                        required />
                                </div>
                                <div class="col-span-2 space-y-2">
                                    <label class="fieldset-label" for="description">Description</label>
                                    <textarea
                                        id="description"
                                        v-model="formData.description"
                                        class="textarea textarea-bordered w-full"
                                        placeholder="Describe the module"
                                        rows="3" />
                                </div>
                                <div class="space-y-2">
                                    <label class="fieldset-label" for="icon">Icon</label>
                                    <input
                                        id="icon"
                                        v-model="formData.icon"
                                        type="text"
                                        class="input w-full"
                                        placeholder="e.g., lucide--home" />
                                    <p class="text-base-content/60 text-xs">Iconify class name</p>
                                </div>
                                <div class="space-y-2">
                                    <label class="fieldset-label" for="group_name">Group Name</label>
                                    <input
                                        id="group_name"
                                        v-model="formData.group_name"
                                        type="text"
                                        class="input w-full"
                                        placeholder="e.g., overview, management" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Technical Details -->
                    <div class="card bg-base-100 shadow">
                        <div class="card-body">
                            <div class="card-title">Technical Details</div>
                            <div class="fieldset mt-2 grid grid-cols-1 gap-4 lg:grid-cols-2">
                                <div class="space-y-2">
                                    <label class="fieldset-label" for="route">
                                        Route
                                        <span class="text-error">*</span>
                                    </label>
                                    <input
                                        id="route"
                                        v-model="formData.route"
                                        type="text"
                                        class="input w-full"
                                        placeholder="e.g., dashboard"
                                        required />
                                </div>
                                <div class="space-y-2">
                                    <label class="fieldset-label" for="component">
                                        Component
                                        <span class="text-error">*</span>
                                    </label>
                                    <input
                                        id="component"
                                        v-model="formData.component"
                                        type="text"
                                        class="input w-full"
                                        placeholder="e.g., Dashboard"
                                        required />
                                </div>
                                <div class="col-span-2 space-y-2">
                                    <label class="fieldset-label" for="permission_name">
                                        Permission Name
                                        <span class="text-error">*</span>
                                    </label>
                                    <input
                                        id="permission_name"
                                        v-model="formData.permission_name"
                                        type="text"
                                        class="input w-full"
                                        placeholder="e.g., dashboard.view"
                                        required />
                                </div>
                                <div class="space-y-2">
                                    <label class="fieldset-label" for="parent_id">Parent Module</label>
                                    <select id="parent_id" v-model="formData.parent_id" class="select w-full">
                                        <option :value="null">None (Root Module)</option>
                                        <option v-for="parent in parentModules" :key="parent.id" :value="parent.id">
                                            {{ parent.display_name }}
                                        </option>
                                    </select>
                                </div>
                                <div class="space-y-2">
                                    <label class="fieldset-label" for="sort_order">
                                        Sort Order
                                        <span class="text-error">*</span>
                                    </label>
                                    <input
                                        id="sort_order"
                                        v-model.number="formData.sort_order"
                                        type="number"
                                        class="input w-full"
                                        placeholder="1"
                                        min="1"
                                        required />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Settings -->
                    <div class="card bg-base-100 shadow">
                        <div class="card-body">
                            <div class="card-title">Settings</div>
                            <div class="fieldset mt-2 grid grid-cols-1 gap-4 lg:grid-cols-2">
                                <div class="space-y-2">
                                    <label class="fieldset-label" for="is_active">Active Status</label>
                                    <select id="is_active" v-model="formData.is_active" class="select w-full">
                                        <option :value="true">Active</option>
                                        <option :value="false">Inactive</option>
                                    </select>
                                </div>
                                <div class="space-y-2">
                                    <label class="fieldset-label" for="is_visible">Visibility</label>
                                    <select id="is_visible" v-model="formData.is_visible" class="select w-full">
                                        <option :value="true">Visible</option>
                                        <option :value="false">Hidden</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div class="mt-6 flex justify-end gap-3">
                    <NuxtLink class="btn btn-sm btn-ghost" href="/access-control/modules">
                        <span class="iconify lucide--x size-4" />
                        Cancel
                    </NuxtLink>
                    <button type="submit" class="btn btn-sm btn-primary" :disabled="saving">
                        <span v-if="!saving" class="iconify lucide--save size-4" />
                        <span v-else class="loading loading-spinner loading-sm"></span>
                        {{ saving ? "Saving..." : "Save Changes" }}
                    </button>
                </div>
            </form>
        </div>

        <!-- Not Found -->
        <div v-else class="mt-6">
            <div class="card bg-base-100 shadow">
                <div class="card-body py-8 text-center">
                    <p class="text-base-content/60">Module not found</p>
                </div>
            </div>
        </div>
    </div>
</template>
