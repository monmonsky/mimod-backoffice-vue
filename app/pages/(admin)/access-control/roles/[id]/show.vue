<script lang="ts" setup>
import PageTitle from "~/components/PageTitle.vue";
import { rolesData } from "../data";
import { componentsPermissions, rolePermissions } from "../permissions-data";

const route = useRoute();
const roleId = Number(route.params.id);
const role = rolesData.find((r) => r.id === roleId);
const permissions = rolePermissions[roleId] || [];

const hasPermission = (permissionValue: string) => {
    return permissions.includes(permissionValue);
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
                { label: 'View', active: true },
            ]"
            title="View Role" />
        <div class="mt-6">
            <div class="card bg-base-100 shadow">
                <div class="card-body">
                    <div class="flex items-center justify-between">
                        <h2 class="card-title">Role Information</h2>
                        <NuxtLink
                            :href="`/access-control/roles/${roleId}/edit`"
                            class="btn btn-primary btn-sm">
                            <span class="iconify lucide--pencil size-4" />
                            Edit Role
                        </NuxtLink>
                    </div>
                    <div v-if="role" class="mt-6">
                        <div class="flex flex-col gap-6">
                            <!-- Basic Info -->
                            <div>
                                <h3 class="text-2xl font-semibold">{{ role.displayName }}</h3>
                                <p class="text-base-content/60 font-mono text-sm">{{ role.roleName }}</p>
                            </div>

                            <hr class="border-base-300" />

                            <!-- Details Grid -->
                            <div class="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label class="text-base-content/60 text-sm font-medium">Description</label>
                                    <p class="mt-1 font-medium">{{ role.description }}</p>
                                </div>
                                <div>
                                    <label class="text-base-content/60 text-sm font-medium">Priority</label>
                                    <p class="mt-1">
                                        <span class="badge badge-ghost">{{ role.priority }}</span>
                                    </p>
                                </div>
                                <div>
                                    <label class="text-base-content/60 text-sm font-medium">Type</label>
                                    <p class="mt-1">
                                        <span
                                            :class="[
                                                'badge',
                                                role.type === 'system' ? 'badge-info' : 'badge-ghost',
                                            ]">
                                            {{ role.type }}
                                        </span>
                                    </p>
                                </div>
                                <div>
                                    <label class="text-base-content/60 text-sm font-medium">Status</label>
                                    <p class="mt-1">
                                        <span
                                            :class="[
                                                'badge',
                                                role.status === 'active' ? 'badge-success' : 'badge-error',
                                            ]">
                                            {{ role.status }}
                                        </span>
                                    </p>
                                </div>
                                <div>
                                    <label class="text-base-content/60 text-sm font-medium">Total Users</label>
                                    <p class="mt-1 font-medium">{{ role.totalUsers }} users</p>
                                </div>
                                <div>
                                    <label class="text-base-content/60 text-sm font-medium">Created At</label>
                                    <p class="mt-1 font-medium">{{ role.createdAt }}</p>
                                </div>
                            </div>

                            <hr class="border-base-300" />

                            <!-- Permissions -->
                            <div>
                                <h3 class="text-lg font-semibold">Permissions</h3>
                                <p class="text-base-content/60 text-sm">Permissions assigned to this role</p>
                                <div class="mt-4 space-y-4">
                                    <div
                                        v-for="component in componentsPermissions"
                                        :key="component.name"
                                        class="border-base-300 rounded-lg border p-4">
                                        <h4 class="mb-3 font-semibold">{{ component.name }}</h4>
                                        <div class="space-y-3">
                                            <div
                                                v-for="menu in component.menus"
                                                :key="menu.name"
                                                class="flex items-start gap-4">
                                                <div class="min-w-32">
                                                    <span class="text-base-content/70 text-sm font-medium">{{ menu.name }}</span>
                                                </div>
                                                <div class="flex flex-wrap gap-2">
                                                    <span
                                                        v-for="permission in menu.permissions"
                                                        :key="permission.value"
                                                        :class="[
                                                            'badge badge-sm',
                                                            hasPermission(permission.value) ? 'badge-success' : 'badge-ghost',
                                                        ]">
                                                        <span
                                                            v-if="hasPermission(permission.value)"
                                                            class="iconify lucide--check size-3 mr-1" />
                                                        {{ permission.name }}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr class="border-base-300" />

                            <!-- Actions -->
                            <div class="flex gap-3">
                                <NuxtLink
                                    href="/access-control/roles"
                                    class="btn btn-ghost">
                                    <span class="iconify lucide--arrow-left size-4" />
                                    Back to Roles
                                </NuxtLink>
                                <button
                                    class="btn btn-error btn-outline ml-auto"
                                    :disabled="role.type === 'system'">
                                    <span class="iconify lucide--trash size-4" />
                                    Delete Role
                                </button>
                            </div>
                        </div>
                    </div>
                    <div v-else class="py-8 text-center">
                        <p class="text-base-content/60">Role not found</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
