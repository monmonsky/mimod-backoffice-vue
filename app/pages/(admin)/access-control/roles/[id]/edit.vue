<script lang="ts" setup>
import PageTitle from "~/components/PageTitle.vue";

definePageMeta({
    layout: "admin",
});

const route = useRoute();
const router = useRouter();
const roleId = Number(route.params.id);

const { getRole, getRolePermissions, updateRole, updateRolePermissions } = useRoles();
const { getGroupedPermissions } = usePermissions();
const { success, error } = useToast();
const authStore = useAuthStore();

// Check if user is super admin
const isSuperAdmin = computed(() => {
    return authStore.user?.role?.name === "super_admin";
});

// Fetch role details
const { data: roleResponse, pending: rolePending, error: roleError } = getRole(roleId);
const role = computed(() => roleResponse.value?.data);

// Form data for role basic info
const formData = ref({
    name: "",
    display_name: "",
    description: "",
    priority: 1,
    is_active: true,
    is_system: false,
});

// Initialize form when role loads
watch(
    role,
    (roleData) => {
        if (roleData) {
            formData.value = {
                name: roleData.name,
                display_name: roleData.display_name,
                description: roleData.description || "",
                priority: roleData.priority,
                is_active: roleData.is_active,
                is_system: roleData.is_system,
            };
        }
    },
    { immediate: true },
);

// Fetch all permissions grouped
const { data: allPermissionsResponse, pending: permissionsPending } = getGroupedPermissions();
const permissionGroups = computed(() => allPermissionsResponse.value?.data || []);

// Fetch current role permissions
const { data: rolePermissionsResponse, pending: rolePermPending } = getRolePermissions(roleId);
const currentPermissionIds = computed(() => {
    const permissions = rolePermissionsResponse.value?.data?.permissions || [];
    return permissions.flatMap((group) => group.permissions.map((p) => p.id));
});

// Selected permission IDs
const selectedPermissions = ref<number[]>([]);

// Initialize selected permissions when current permissions load
watch(
    currentPermissionIds,
    (ids) => {
        if (ids && ids.length > 0) {
            selectedPermissions.value = [...ids];
        }
    },
    { immediate: true },
);

const togglePermission = (permissionId: number) => {
    const index = selectedPermissions.value.indexOf(permissionId);
    if (index > -1) {
        selectedPermissions.value.splice(index, 1);
    } else {
        selectedPermissions.value.push(permissionId);
    }
};

const isPermissionChecked = (permissionId: number) => {
    return selectedPermissions.value.includes(permissionId);
};

const toggleAllModulePermissions = (modulePermissions: number[]) => {
    const allChecked = modulePermissions.every((id) => selectedPermissions.value.includes(id));
    if (allChecked) {
        selectedPermissions.value = selectedPermissions.value.filter((id) => !modulePermissions.includes(id));
    } else {
        modulePermissions.forEach((id) => {
            if (!selectedPermissions.value.includes(id)) {
                selectedPermissions.value.push(id);
            }
        });
    }
};

const isAllModulePermissionsChecked = (modulePermissions: number[]) => {
    return modulePermissions.length > 0 && modulePermissions.every((id) => selectedPermissions.value.includes(id));
};

const pending = computed(() => rolePending.value || permissionsPending.value || rolePermPending.value);
const saving = ref(false);

const handleSubmit = async () => {
    try {
        saving.value = true;

        // Update role with all data including permissions
        const roleUpdateData: any = {
            name: formData.value.name,
            display_name: formData.value.display_name,
            description: formData.value.description || undefined,
            priority: formData.value.priority,
            is_active: formData.value.is_active,
            permission_ids: selectedPermissions.value,
        };

        // Only super admin can change is_system
        if (isSuperAdmin.value) {
            roleUpdateData.is_system = formData.value.is_system;
        }

        await updateRole(roleId, roleUpdateData);

        success("Role updated successfully!");
        router.push("/access-control/roles");
    } catch (err: any) {
        const errorMessage = err?.data?.message || "Failed to update role";
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
                { label: 'Roles', path: '/access-control/roles' },
                { label: 'Edit', active: true },
            ]"
            title="Edit Role" />

        <!-- Loading State -->
        <div v-if="pending" class="mt-6 flex items-center justify-center py-12">
            <span class="loading loading-spinner loading-lg"></span>
        </div>

        <!-- Error State -->
        <div v-else-if="roleError" class="mt-6">
            <div class="alert alert-error">
                <span class="iconify lucide--alert-circle size-5" />
                <span>Failed to load role. Please try again.</span>
            </div>
        </div>

        <!-- Content -->
        <div v-else-if="role" class="mt-6">
            <form @submit.prevent="handleSubmit">
                <div class="grid grid-cols-1 gap-5">
                    <!-- Basic Information -->
                    <div class="card bg-base-100 shadow">
                        <div class="card-body">
                            <div class="card-title">Role Information</div>
                            <div class="fieldset mt-2 grid grid-cols-1 gap-4 lg:grid-cols-2">
                                <div class="space-y-2">
                                    <label class="fieldset-label" for="name">
                                        Role Name
                                        <span class="text-error">*</span>
                                    </label>
                                    <input
                                        id="name"
                                        v-model="formData.name"
                                        type="text"
                                        class="input w-full"
                                        placeholder="e.g., admin, manager"
                                        required
                                        :disabled="role.is_system && !isSuperAdmin" />
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
                                        placeholder="e.g., Administrator"
                                        required />
                                </div>
                                <div class="col-span-2 space-y-2">
                                    <label class="fieldset-label" for="description">Description</label>
                                    <textarea
                                        id="description"
                                        v-model="formData.description"
                                        class="textarea textarea-bordered w-full"
                                        placeholder="Describe the role's responsibilities"
                                        rows="3" />
                                </div>
                                <div class="space-y-2">
                                    <label class="fieldset-label" for="priority">
                                        Priority
                                        <span class="text-error">*</span>
                                    </label>
                                    <input
                                        id="priority"
                                        v-model.number="formData.priority"
                                        type="number"
                                        class="input w-full"
                                        placeholder="1"
                                        min="1"
                                        required />
                                </div>
                                <div class="space-y-2">
                                    <label class="fieldset-label" for="is_active">Status</label>
                                    <select id="is_active" v-model="formData.is_active" class="select w-full">
                                        <option :value="true">Active</option>
                                        <option :value="false">Inactive</option>
                                    </select>
                                </div>
                                <div v-if="isSuperAdmin" class="space-y-2">
                                    <label class="fieldset-label" for="is_system">Type</label>
                                    <select id="is_system" v-model="formData.is_system" class="select w-full">
                                        <option :value="false">Custom</option>
                                        <option :value="true">System</option>
                                    </select>
                                </div>
                                <div v-else class="space-y-2">
                                    <label class="fieldset-label">Type</label>
                                    <div>
                                        <span class="badge badge-sm" :class="role.is_system ? 'badge-info' : 'badge-ghost'">
                                            {{ role.is_system ? "System" : "Custom" }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Permissions -->
                    <div class="card bg-base-100 shadow">
                        <div class="card-body">
                            <div class="card-title">Permissions</div>
                            <p class="text-base-content/60 text-sm">Select permissions for this role</p>

                            <!-- Empty State -->
                            <div
                                v-if="permissionGroups.length === 0"
                                class="mt-4 flex flex-col items-center justify-center py-12">
                                <span class="iconify lucide--shield text-base-content/30 mb-4 size-16" />
                                <p class="text-base-content/60">No permissions available</p>
                            </div>

                            <!-- Permission Groups -->
                            <div v-else class="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
                                <div
                                    v-for="group in permissionGroups"
                                    :key="group.module"
                                    class="border-base-300 rounded-lg border p-4">
                                    <!-- Module Header with Select All -->
                                    <div class="mb-3 flex items-center gap-2">
                                        <input
                                            :id="`select-all-module-${group.module}`"
                                            type="checkbox"
                                            class="checkbox checkbox-sm"
                                            :checked="isAllModulePermissionsChecked(group.permissions.map((p) => p.id))"
                                            @change="toggleAllModulePermissions(group.permissions.map((p) => p.id))" />
                                        <label :for="`select-all-module-${group.module}`" class="cursor-pointer font-semibold">
                                            {{ group.module }}
                                        </label>
                                    </div>

                                    <!-- Permissions -->
                                    <div class="flex flex-col gap-2">
                                        <label
                                            v-for="permission in group.permissions"
                                            :key="permission.id"
                                            class="flex cursor-pointer items-start gap-2"
                                            :class="{ 'opacity-50': !permission.is_active }">
                                            <input
                                                type="checkbox"
                                                class="checkbox checkbox-xs mt-0.5"
                                                :checked="isPermissionChecked(permission.id)"
                                                :disabled="!permission.is_active"
                                                @change="togglePermission(permission.id)" />
                                            <div class="flex-1 min-w-0">
                                                <div class="text-sm">{{ permission.display_name }}</div>
                                                <code class="text-base-content/50 text-xs">{{ permission.name }}</code>
                                                <div v-if="permission.description" class="text-base-content/60 mt-0.5 text-xs">
                                                    {{ permission.description }}
                                                </div>
                                            </div>
                                            <div class="badge badge-xs" :class="permission.is_active ? 'badge-success' : 'badge-ghost'">
                                                {{ permission.action }}
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <!-- Selected Count -->
                            <div class="mt-4 text-sm text-base-content/60">
                                Selected: <span class="font-medium">{{ selectedPermissions.length }}</span> permissions
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div class="mt-6 flex justify-end gap-3">
                    <NuxtLink class="btn btn-sm btn-ghost" href="/access-control/roles">
                        <span class="iconify lucide--x size-4" />
                        Cancel
                    </NuxtLink>
                    <button type="submit" class="btn btn-sm btn-primary" :disabled="saving || role.is_system">
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
                    <p class="text-base-content/60">Role not found</p>
                </div>
            </div>
        </div>
    </div>
</template>
