<script lang="ts" setup>
import PageTitle from "~/components/PageTitle.vue";
import { getActiveBadgeClass } from "~/utils/statusHelpers";

definePageMeta({
    layout: "admin",
});

const route = useRoute();
const roleId = Number(route.params.id);

const { getRolePermissions } = useRoles();

// Fetch role with permissions
const { data: rolePermissionsResponse, pending, error } = getRolePermissions(roleId);

const role = computed(() => rolePermissionsResponse.value?.data?.role);
const permissionGroups = computed(() => rolePermissionsResponse.value?.data?.permissions || []);

const totalPermissions = computed(() => {
    return permissionGroups.value.reduce((total, group) => total + group.permissions.length, 0);
});

// Helper for is_system badge (system roles are special)
const getSystemBadgeClass = (isSystem: boolean) => isSystem ? "badge-info" : "badge-ghost";
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

        <!-- Loading State -->
        <div v-if="pending" class="mt-6 flex items-center justify-center py-12">
            <span class="loading loading-spinner loading-lg"></span>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="mt-6">
            <div class="alert alert-error">
                <span class="iconify lucide--alert-circle size-5" />
                <span>Failed to load role. Please try again.</span>
            </div>
        </div>

        <!-- Content -->
        <div v-else-if="role" class="mt-6">
            <div class="card bg-base-100 shadow">
                <div class="card-body">
                    <div class="flex items-center justify-between">
                        <h2 class="card-title">Role Information</h2>
                        <NuxtLink :href="`/access-control/roles/${roleId}/edit`" class="btn btn-primary btn-sm">
                            <span class="iconify lucide--pencil size-4" />
                            Edit Permissions
                        </NuxtLink>
                    </div>
                    <div class="mt-6">
                        <div class="flex flex-col gap-6">
                            <!-- Basic Info -->
                            <div>
                                <h3 class="text-2xl font-semibold">{{ role.display_name }}</h3>
                                <p class="text-base-content/60 font-mono text-sm">{{ role.name }}</p>
                            </div>

                            <hr class="border-base-300" />

                            <!-- Details Grid -->
                            <div class="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label class="text-base-content/60 text-sm font-medium">Description</label>
                                    <p class="mt-1 font-medium">{{ role.description || "-" }}</p>
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
                                        <span class="badge" :class="getSystemBadgeClass(role.is_system)">
                                            {{ role.is_system ? "System" : "Custom" }}
                                        </span>
                                    </p>
                                </div>
                                <div>
                                    <label class="text-base-content/60 text-sm font-medium">Status</label>
                                    <p class="mt-1">
                                        <span class="badge" :class="getActiveBadgeClass(role.is_active)">
                                            {{ role.is_active ? "Active" : "Inactive" }}
                                        </span>
                                    </p>
                                </div>
                                <div>
                                    <label class="text-base-content/60 text-sm font-medium">Total Permissions</label>
                                    <p class="mt-1 font-medium">{{ totalPermissions }} permissions</p>
                                </div>
                                <div>
                                    <label class="text-base-content/60 text-sm font-medium">Created At</label>
                                    <p class="mt-1 font-medium">{{ new Date(role.created_at).toLocaleString() }}</p>
                                </div>
                            </div>

                            <hr class="border-base-300" />

                            <!-- Permissions -->
                            <div>
                                <h3 class="text-lg font-semibold">Assigned Permissions</h3>
                                <p class="text-base-content/60 text-sm">
                                    Permissions currently assigned to this role
                                </p>

                                <!-- Empty State -->
                                <div
                                    v-if="permissionGroups.length === 0"
                                    class="mt-4 flex flex-col items-center justify-center py-12">
                                    <span class="iconify lucide--shield text-base-content/30 mb-4 size-16" />
                                    <p class="text-base-content/60">No permissions assigned to this role</p>
                                </div>

                                <!-- Permission Groups -->
                                <div v-else class="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
                                    <div
                                        v-for="group in permissionGroups"
                                        :key="group.module"
                                        class="border-base-300 rounded-lg border p-4">
                                        <h4 class="mb-3 font-semibold capitalize">{{ group.module }}</h4>
                                        <div class="space-y-2">
                                            <div
                                                v-for="permission in group.permissions"
                                                :key="permission.id"
                                                class="flex items-start gap-2">
                                                <span class="iconify lucide--check text-success size-4 mt-0.5 shrink-0" />
                                                <div class="flex-1 min-w-0">
                                                    <div class="text-sm font-medium">{{ permission.display_name }}</div>
                                                    <code class="text-base-content/50 text-xs">{{ permission.name }}</code>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr class="border-base-300" />

                            <!-- Actions -->
                            <div class="flex gap-3">
                                <NuxtLink href="/access-control/roles" class="btn btn-ghost">
                                    <span class="iconify lucide--arrow-left size-4" />
                                    Back to Roles
                                </NuxtLink>
                                <button class="btn btn-error btn-outline ml-auto" :disabled="role.is_system">
                                    <span class="iconify lucide--trash size-4" />
                                    Delete Role
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
