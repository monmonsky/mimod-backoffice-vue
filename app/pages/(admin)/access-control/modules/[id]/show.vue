<script lang="ts" setup>
import PageTitle from "~/components/PageTitle.vue";
import { getActiveBadgeClass, getVisibleBadgeClass } from "~/utils/statusHelpers";

definePageMeta({
    layout: "admin",
});

const route = useRoute();
const moduleId = Number(route.params.id);

const { getModule } = useModules();

// Fetch module details
const { data: moduleResponse, pending, error } = getModule(moduleId);
const module = computed(() => moduleResponse.value?.data);
</script>

<template>
    <div>
        <PageTitle
            :items="[
                { label: 'Access Control' },
                { label: 'Modules', path: '/access-control/modules' },
                { label: 'View', active: true },
            ]"
            title="View Module" />

        <!-- Loading State -->
        <div v-if="pending" class="mt-6 flex items-center justify-center py-12">
            <span class="loading loading-spinner loading-lg"></span>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="mt-6">
            <div class="alert alert-error">
                <span class="iconify lucide--alert-circle size-5" />
                <span>Failed to load module. Please try again.</span>
            </div>
        </div>

        <!-- Content -->
        <div v-else-if="module" class="mt-6">
            <div class="card bg-base-100 shadow">
                <div class="card-body">
                    <div class="flex items-center justify-between">
                        <h2 class="card-title">Module Information</h2>
                        <NuxtLink :href="`/access-control/modules/${moduleId}/edit`" class="btn btn-primary btn-sm">
                            <span class="iconify lucide--pencil size-4" />
                            Edit Module
                        </NuxtLink>
                    </div>
                    <div class="mt-6">
                        <div class="flex flex-col gap-6">
                            <!-- Basic Info -->
                            <div>
                                <div class="flex items-center gap-3">
                                    <span v-if="module.icon" class="iconify size-8" :class="module.icon" />
                                    <div>
                                        <h3 class="text-2xl font-semibold">{{ module.display_name }}</h3>
                                        <p class="text-base-content/60 font-mono text-sm">{{ module.name }}</p>
                                    </div>
                                </div>
                            </div>

                            <hr class="border-base-300" />

                            <!-- Details Grid -->
                            <div class="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label class="text-base-content/60 text-sm font-medium">Description</label>
                                    <p class="mt-1 font-medium">{{ module.description || "-" }}</p>
                                </div>
                                <div>
                                    <label class="text-base-content/60 text-sm font-medium">Route</label>
                                    <p class="mt-1 font-mono text-sm">{{ module.route }}</p>
                                </div>
                                <div>
                                    <label class="text-base-content/60 text-sm font-medium">Component</label>
                                    <p class="mt-1">{{ module.component }}</p>
                                </div>
                                <div>
                                    <label class="text-base-content/60 text-sm font-medium">Permission Name</label>
                                    <p class="mt-1 font-mono text-sm">{{ module.permission_name }}</p>
                                </div>
                                <div>
                                    <label class="text-base-content/60 text-sm font-medium">Group Name</label>
                                    <p class="mt-1">{{ module.group_name || "-" }}</p>
                                </div>
                                <div>
                                    <label class="text-base-content/60 text-sm font-medium">Sort Order</label>
                                    <p class="mt-1">
                                        <span class="badge badge-ghost">{{ module.sort_order }}</span>
                                    </p>
                                </div>
                                <div>
                                    <label class="text-base-content/60 text-sm font-medium">Active Status</label>
                                    <p class="mt-1">
                                        <span class="badge" :class="getActiveBadgeClass(module.is_active)">
                                            {{ module.is_active ? "Active" : "Inactive" }}
                                        </span>
                                    </p>
                                </div>
                                <div>
                                    <label class="text-base-content/60 text-sm font-medium">Visibility</label>
                                    <p class="mt-1">
                                        <span class="badge" :class="getVisibleBadgeClass(module.is_visible)">
                                            {{ module.is_visible ? "Visible" : "Hidden" }}
                                        </span>
                                    </p>
                                </div>
                                <div>
                                    <label class="text-base-content/60 text-sm font-medium">Parent Module</label>
                                    <p class="mt-1">{{ module.parent_id || "-" }}</p>
                                </div>
                                <div>
                                    <label class="text-base-content/60 text-sm font-medium">Created At</label>
                                    <p class="mt-1 font-medium">{{ new Date(module.created_at).toLocaleString() }}</p>
                                </div>
                            </div>

                            <!-- Children Modules -->
                            <div v-if="module.children && module.children.length > 0">
                                <hr class="border-base-300" />
                                <h3 class="text-lg font-semibold">Child Modules</h3>
                                <p class="text-base-content/60 text-sm">Modules under this parent module</p>
                                <div class="mt-4 grid gap-3">
                                    <div
                                        v-for="child in module.children"
                                        :key="child.id"
                                        class="border-base-300 flex items-center justify-between rounded-lg border p-3">
                                        <div class="flex items-center gap-3">
                                            <span v-if="child.icon" class="iconify size-5" :class="child.icon" />
                                            <div>
                                                <div class="font-medium">{{ child.display_name }}</div>
                                                <div class="text-base-content/60 text-xs">{{ child.route }}</div>
                                            </div>
                                        </div>
                                        <NuxtLink
                                            :href="`/access-control/modules/${child.id}/show`"
                                            class="btn btn-ghost btn-sm btn-square">
                                            <span class="iconify lucide--external-link size-4" />
                                        </NuxtLink>
                                    </div>
                                </div>
                            </div>

                            <hr class="border-base-300" />

                            <!-- Actions -->
                            <div class="flex gap-3">
                                <NuxtLink href="/access-control/modules" class="btn btn-ghost">
                                    <span class="iconify lucide--arrow-left size-4" />
                                    Back to Modules
                                </NuxtLink>
                                <button class="btn btn-error btn-outline ml-auto">
                                    <span class="iconify lucide--trash size-4" />
                                    Delete Module
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
                    <p class="text-base-content/60">Module not found</p>
                </div>
            </div>
        </div>
    </div>
</template>
