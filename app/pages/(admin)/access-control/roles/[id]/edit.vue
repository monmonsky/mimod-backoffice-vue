<script lang="ts" setup>
import PageTitle from "~/components/PageTitle.vue";
import { rolesData } from "../data";
import { componentsPermissions, rolePermissions } from "../permissions-data";

const route = useRoute();
const roleId = Number(route.params.id);
const role = rolesData.find((r) => r.id === roleId);

const selectedPermissions = ref<string[]>(rolePermissions[roleId] || []);

const togglePermission = (permissionValue: string) => {
    const index = selectedPermissions.value.indexOf(permissionValue);
    if (index > -1) {
        selectedPermissions.value.splice(index, 1);
    } else {
        selectedPermissions.value.push(permissionValue);
    }
};

const isPermissionChecked = (permissionValue: string) => {
    return selectedPermissions.value.includes(permissionValue);
};

const toggleAllMenuPermissions = (menuPermissions: string[]) => {
    const allChecked = menuPermissions.every((p) => selectedPermissions.value.includes(p));
    if (allChecked) {
        selectedPermissions.value = selectedPermissions.value.filter((p) => !menuPermissions.includes(p));
    } else {
        menuPermissions.forEach((p) => {
            if (!selectedPermissions.value.includes(p)) {
                selectedPermissions.value.push(p);
            }
        });
    }
};

const isAllMenuPermissionsChecked = (menuPermissions: string[]) => {
    return menuPermissions.every((p) => selectedPermissions.value.includes(p));
};

const toggleAllComponentPermissions = (component: any) => {
    const allPermissions = component.menus.flatMap((menu: any) => menu.permissions.map((p: any) => p.value));
    const allChecked = allPermissions.every((p: string) => selectedPermissions.value.includes(p));
    if (allChecked) {
        selectedPermissions.value = selectedPermissions.value.filter((p) => !allPermissions.includes(p));
    } else {
        allPermissions.forEach((p: string) => {
            if (!selectedPermissions.value.includes(p)) {
                selectedPermissions.value.push(p);
            }
        });
    }
};

const isAllComponentPermissionsChecked = (component: any) => {
    const allPermissions = component.menus.flatMap((menu: any) => menu.permissions.map((p: any) => p.value));
    return allPermissions.every((p: string) => selectedPermissions.value.includes(p));
};

definePageMeta({
    layout: "admin",
});
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
        <div v-if="role" class="mt-6">
            <div class="grid grid-cols-1 gap-5">
                <!-- Basic Information -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <div class="card-title">Basic Information</div>
                        <div class="fieldset mt-2 grid grid-cols-1 gap-4 lg:grid-cols-2">
                            <div class="space-y-2">
                                <label class="fieldset-label" for="role-name">Role Name</label>
                                <input
                                    id="role-name"
                                    type="text"
                                    class="input w-full"
                                    placeholder="e.g., admin, manager"
                                    :value="role.roleName"
                                    :disabled="role.type === 'system'" />
                                <p class="text-base-content/60 text-xs">
                                    Unique identifier for the role (lowercase, no spaces)
                                </p>
                            </div>
                            <div class="space-y-2">
                                <label class="fieldset-label" for="display-name">Display Name</label>
                                <input
                                    id="display-name"
                                    type="text"
                                    class="input w-full"
                                    placeholder="e.g., Administrator"
                                    :value="role.displayName" />
                                <p class="text-base-content/60 text-xs">
                                    Human-readable name for the role
                                </p>
                            </div>
                            <div class="col-span-2 space-y-2">
                                <label class="fieldset-label" for="description">Description</label>
                                <textarea
                                    id="description"
                                    class="textarea textarea-bordered w-full"
                                    placeholder="Describe the role's responsibilities"
                                    rows="3"
                                    :value="role.description" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Settings -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <div class="card-title">Settings</div>
                        <div class="fieldset mt-2 grid grid-cols-1 gap-4 lg:grid-cols-3">
                            <div class="space-y-2">
                                <label class="fieldset-label" for="priority">Priority</label>
                                <input
                                    id="priority"
                                    type="number"
                                    class="input w-full"
                                    placeholder="1"
                                    min="1"
                                    :value="role.priority" />
                                <p class="text-base-content/60 text-xs">
                                    Lower number = higher priority
                                </p>
                            </div>
                            <div class="space-y-2">
                                <label class="fieldset-label" for="type">Type</label>
                                <select id="type" class="select w-full" :disabled="role.type === 'system'">
                                    <option :selected="role.type === 'system'">system</option>
                                    <option :selected="role.type === 'custom'">custom</option>
                                </select>
                                <p class="text-base-content/60 text-xs">
                                    System roles cannot be deleted
                                </p>
                            </div>
                            <div class="space-y-2">
                                <label class="fieldset-label" for="status">Status</label>
                                <select id="status" class="select w-full">
                                    <option :selected="role.status === 'active'">active</option>
                                    <option :selected="role.status === 'inactive'">inactive</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Permissions -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <div class="card-title">Permissions</div>
                        <div class="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <div
                                v-for="component in componentsPermissions"
                                :key="component.name"
                                class="border-base-300 rounded-lg border p-4">
                                <!-- Component Header with Select All -->
                                <div class="mb-3 flex items-center gap-2">
                                    <input
                                        :id="`select-all-component-${component.name}`"
                                        type="checkbox"
                                        class="checkbox checkbox-sm"
                                        :checked="isAllComponentPermissionsChecked(component)"
                                        @change="toggleAllComponentPermissions(component)" />
                                    <label
                                        :for="`select-all-component-${component.name}`"
                                        class="cursor-pointer font-semibold">
                                        {{ component.name }}
                                    </label>
                                </div>
                                <!-- Menus -->
                                <div class="space-y-3">
                                    <div
                                        v-for="menu in component.menus"
                                        :key="menu.name"
                                        class="space-y-2">
                                        <!-- Menu Header with Select All -->
                                        <div class="flex items-center gap-2">
                                            <input
                                                :id="`select-all-menu-${component.name}-${menu.name}`"
                                                type="checkbox"
                                                class="checkbox checkbox-xs"
                                                :checked="isAllMenuPermissionsChecked(menu.permissions.map((p) => p.value))"
                                                @change="toggleAllMenuPermissions(menu.permissions.map((p) => p.value))" />
                                            <label
                                                :for="`select-all-menu-${component.name}-${menu.name}`"
                                                class="text-base-content/70 cursor-pointer text-sm font-medium">
                                                {{ menu.name }}
                                            </label>
                                        </div>
                                        <!-- Permissions -->
                                        <div class="flex flex-wrap gap-x-4 gap-y-2 pl-6">
                                            <label
                                                v-for="permission in menu.permissions"
                                                :key="permission.value"
                                                class="flex cursor-pointer items-center gap-1.5">
                                                <input
                                                    type="checkbox"
                                                    class="checkbox checkbox-xs"
                                                    :checked="isPermissionChecked(permission.value)"
                                                    @change="togglePermission(permission.value)" />
                                                <span class="text-sm">{{ permission.name }}</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Statistics -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <div class="card-title">Statistics</div>
                        <div class="fieldset mt-2 grid grid-cols-1 gap-4 lg:grid-cols-2">
                            <div class="space-y-2">
                                <label class="fieldset-label">Total Users</label>
                                <p class="text-base-content font-medium">{{ role.totalUsers }} users assigned to this role</p>
                            </div>
                            <div class="space-y-2">
                                <label class="fieldset-label">Created At</label>
                                <p class="text-base-content font-medium">{{ role.createdAt }}</p>
                            </div>
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
                <button type="submit" class="btn btn-sm btn-primary">
                    <span class="iconify lucide--arrow-up-from-line size-4" />
                    Update
                </button>
            </div>
        </div>
        <div v-else class="mt-6">
            <div class="card bg-base-100 shadow">
                <div class="card-body py-8 text-center">
                    <p class="text-base-content/60">Role not found</p>
                </div>
            </div>
        </div>
    </div>
</template>
