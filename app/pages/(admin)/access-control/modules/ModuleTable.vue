<script setup lang="ts">
import Sortable from "sortablejs";
import type { ModuleGroup } from "~/types/access-control/modules";

const { updateModulesOrder } = useModules();
const { success, error: showError } = useToast();

const searchQuery = ref("");
const activeFilter = ref<boolean | "">("");
const visibleFilter = ref<boolean | "">("");

const filters = computed(() => ({
    search: searchQuery.value || undefined,
    is_active: activeFilter.value !== "" ? activeFilter.value : undefined,
    is_visible: visibleFilter.value !== "" ? visibleFilter.value : undefined,
}));

// Fetch grouped modules
const { data: modulesResponse, pending, error, refresh } = await useAsyncData(
    "modules-grouped",
    () => {
        const query = new URLSearchParams();
        if (filters.value.search) query.append("search", filters.value.search);
        if (filters.value.is_active !== undefined) query.append("is_active", filters.value.is_active.toString());
        if (filters.value.is_visible !== undefined) query.append("is_visible", filters.value.is_visible.toString());

        const queryString = query.toString();
        const url = `/access-control/modules/grouped${queryString ? `?${queryString}` : ""}`;

        return $fetch(url, {
            baseURL: useRuntimeConfig().public.apiBase,
            headers: {
                Authorization: `Bearer ${useAuthStore().token}`,
            },
        });
    },
    {
        watch: [filters],
    },
);

// Use reactive ref for drag & drop
const localModuleGroups = ref<ModuleGroup[]>([]);

// Sync with API data
watch(
    () => modulesResponse.value,
    (response) => {
        const data = response as any;
        if (Array.isArray(data)) {
            localModuleGroups.value = JSON.parse(JSON.stringify(data));
        } else if (data?.data && Array.isArray(data.data)) {
            localModuleGroups.value = JSON.parse(JSON.stringify(data.data));
        }
        // Reinitialize sortables after data sync
        nextTick(() => {
            initAllSortables();
        });
    },
    { immediate: true },
);

const totalModules = computed(() => {
    if (!localModuleGroups.value || localModuleGroups.value.length === 0) return 0;
    return localModuleGroups.value.reduce((total, group) => {
        if (!group || !group.modules) return total;
        return (
            total +
            group.modules.reduce((sum, module) => {
                return sum + 1 + (module?.children?.length || 0);
            }, 0)
        );
    }, 0);
});

const hasChanges = ref(false);
const saving = ref(false);

// Store Sortable instances to destroy them later
const sortableInstances: Sortable[] = [];

// Initialize Sortable for groups
const initGroupSortable = () => {
    nextTick(() => {
        const groupsContainer = document.querySelector("#groups-container");
        if (groupsContainer) {
            const instance = Sortable.create(groupsContainer as HTMLElement, {
                animation: 150,
                handle: ".group-drag-handle",
                ghostClass: "sortable-ghost",
                onEnd: (evt) => {
                    if (evt.oldIndex !== undefined && evt.newIndex !== undefined && evt.oldIndex !== evt.newIndex) {
                        // Update the array order
                        const movedGroup = localModuleGroups.value[evt.oldIndex];
                        if (movedGroup) {
                            localModuleGroups.value.splice(evt.oldIndex, 1);
                            localModuleGroups.value.splice(evt.newIndex, 0, movedGroup);
                        }
                    }
                    hasChanges.value = true;
                },
            });
            sortableInstances.push(instance);
        }
    });
};

// Initialize Sortable for modules within each group
const initModuleSortable = (groupIndex: number) => {
    nextTick(() => {
        const modulesContainer = document.querySelector(`#modules-container-${groupIndex}`);
        if (modulesContainer) {
            const instance = Sortable.create(modulesContainer as HTMLElement, {
                animation: 150,
                handle: ".module-drag-handle",
                ghostClass: "sortable-ghost",
                group: "modules",
                onEnd: (evt) => {
                    const fromGroupIndex = parseInt(evt.from.getAttribute("data-group-index") || "0");
                    const toGroupIndex = parseInt(evt.to.getAttribute("data-group-index") || "0");

                    if (evt.oldIndex !== undefined && evt.newIndex !== undefined) {
                        if (fromGroupIndex !== toGroupIndex) {
                            // Module moved to different group
                            const fromGroup = localModuleGroups.value[fromGroupIndex];
                            const toGroup = localModuleGroups.value[toGroupIndex];

                            if (fromGroup && toGroup) {
                                const movedModule = fromGroup.modules[evt.oldIndex];
                                if (movedModule) {
                                    fromGroup.modules.splice(evt.oldIndex, 1);
                                    toGroup.modules.splice(evt.newIndex, 0, movedModule);
                                }
                            }
                        } else if (evt.oldIndex !== evt.newIndex) {
                            // Module reordered within same group
                            const group = localModuleGroups.value[fromGroupIndex];
                            if (group) {
                                const movedModule = group.modules[evt.oldIndex];
                                if (movedModule) {
                                    group.modules.splice(evt.oldIndex, 1);
                                    group.modules.splice(evt.newIndex, 0, movedModule);
                                }
                            }
                        }
                    }

                    hasChanges.value = true;
                },
            });
            sortableInstances.push(instance);
        }
    });
};

// Initialize Sortable for children
const initChildrenSortable = (groupIndex: number, moduleIndex: number) => {
    nextTick(() => {
        const childrenContainer = document.querySelector(`#children-container-${groupIndex}-${moduleIndex}`);
        if (childrenContainer) {
            const instance = Sortable.create(childrenContainer as HTMLElement, {
                animation: 150,
                handle: ".child-drag-handle",
                ghostClass: "sortable-ghost",
                onEnd: (evt) => {
                    if (evt.oldIndex !== undefined && evt.newIndex !== undefined && evt.oldIndex !== evt.newIndex) {
                        const module = localModuleGroups.value[groupIndex]?.modules[moduleIndex];
                        if (module?.children) {
                            const movedChild = module.children[evt.oldIndex];
                            if (movedChild) {
                                module.children.splice(evt.oldIndex, 1);
                                module.children.splice(evt.newIndex, 0, movedChild);
                            }
                        }
                    }
                    hasChanges.value = true;
                },
            });
            sortableInstances.push(instance);
        }
    });
};

// Destroy all Sortable instances
const destroyAllSortables = () => {
    sortableInstances.forEach((instance) => {
        instance.destroy();
    });
    sortableInstances.length = 0;
};

// Initialize all Sortable instances
const initAllSortables = () => {
    destroyAllSortables();
    initGroupSortable();
    localModuleGroups.value.forEach((group, index) => {
        initModuleSortable(index);
        group.modules.forEach((module, modIndex) => {
            if (module.children && module.children.length > 0) {
                initChildrenSortable(index, modIndex);
            }
        });
    });
};


// Build order data for API
const buildOrderData = () => {
    const orderData: any[] = [];

    localModuleGroups.value.forEach((group, groupIndex) => {
        group.modules.forEach((module, moduleIndex) => {
            orderData.push({
                id: module.id,
                group_name: group.group_name,
                sort_order: (groupIndex + 1) * 1000 + (moduleIndex + 1) * 10,
            });

            // Add children
            if (module.children && module.children.length > 0) {
                module.children.forEach((child, childIndex) => {
                    orderData.push({
                        id: child.id,
                        group_name: null, // children don't have group
                        parent_id: module.id,
                        sort_order: (groupIndex + 1) * 1000 + (moduleIndex + 1) * 10 + (childIndex + 1),
                    });
                });
            }
        });
    });

    return orderData;
};

const saveOrder = async () => {
    try {
        saving.value = true;
        const orderData = buildOrderData();
        await updateModulesOrder(orderData);
        success("Module order updated successfully!");
        hasChanges.value = false;
        await refresh();
    } catch (err: any) {
        console.error("Failed to update order:", err);
        const errorMessage = err?.data?.message || "Failed to update module order";
        showError(errorMessage);
    } finally {
        saving.value = false;
    }
};

const cancelChanges = () => {
    hasChanges.value = false;
    refresh();
};
</script>
<template>
    <div>
        <div class="card bg-base-100 shadow">
            <div class="card-body p-0">
                <div class="flex items-center justify-between px-5 pt-5">
                    <div class="inline-flex items-center gap-3">
                        <label class="input input-sm">
                            <span class="iconify lucide--search text-base-content/80 size-3.5" />
                            <input
                                v-model="searchQuery"
                                type="search"
                                class="w-24 sm:w-48"
                                placeholder="Search modules"
                                aria-label="Search modules" />
                        </label>
                        <div class="hidden sm:block">
                            <select v-model="activeFilter" class="select select-sm w-40" aria-label="Active Status">
                                <option value="">All Active</option>
                                <option :value="true">Active</option>
                                <option :value="false">Inactive</option>
                            </select>
                        </div>
                        <div class="hidden sm:block">
                            <select v-model="visibleFilter" class="select select-sm w-40" aria-label="Visible Status">
                                <option value="">All Visible</option>
                                <option :value="true">Visible</option>
                                <option :value="false">Hidden</option>
                            </select>
                        </div>
                    </div>
                    <div class="inline-flex items-center gap-3">
                        <NuxtLink
                            to="/access-control/modules/create"
                            aria-label="Create module link"
                            class="btn btn-primary btn-sm max-sm:btn-square">
                            <span class="iconify lucide--plus size-4" />
                            <span class="hidden sm:inline">New Module</span>
                        </NuxtLink>
                    </div>
                </div>

                <!-- Save Order Banner -->
                <div v-if="hasChanges" class="mx-5 mt-4">
                    <div class="alert alert-warning">
                        <span class="iconify lucide--alert-circle size-5" />
                        <span>You have unsaved changes to module order</span>
                        <div class="flex gap-2">
                            <button class="btn btn-sm btn-ghost" @click="cancelChanges" :disabled="saving">Cancel</button>
                            <button class="btn btn-sm btn-success" @click="saveOrder" :disabled="saving">
                                <span v-if="!saving" class="iconify lucide--save size-4" />
                                <span v-else class="loading loading-spinner loading-sm"></span>
                                {{ saving ? "Saving..." : "Save Order" }}
                            </button>
                        </div>
                    </div>
                </div>

                <div class="mt-4 overflow-auto">
                    <!-- Loading State -->
                    <div v-if="pending" class="flex items-center justify-center py-12">
                        <span class="loading loading-spinner loading-lg"></span>
                    </div>

                    <!-- Error State -->
                    <div v-else-if="error" class="alert alert-error m-4">
                        <span class="iconify lucide--alert-circle size-5" />
                        <span>Failed to load modules. Please try again.</span>
                    </div>

                    <!-- Empty State -->
                    <div v-else-if="!localModuleGroups || localModuleGroups.length === 0" class="flex flex-col items-center justify-center py-12">
                        <span class="iconify lucide--layers text-base-content/30 mb-4 size-16" />
                        <p class="text-base-content/60">No modules found</p>
                    </div>

                    <!-- Grouped Modules with Drag & Drop -->
                    <div v-else id="groups-container" class="space-y-6 p-5">
                        <div v-for="(group, groupIndex) in localModuleGroups" :key="group.group_name" class="space-y-3">
                            <!-- Group Header -->
                            <div class="flex items-center gap-2 pb-2 border-b border-base-300">
                                <span class="group-drag-handle iconify lucide--grip-vertical text-base-content/40 size-5 cursor-move hover:text-base-content" />
                                <h3 class="text-lg font-semibold capitalize">{{ group.group_name }}</h3>
                                <span class="badge badge-ghost badge-sm">{{ group.modules?.length || 0 }}</span>
                            </div>

                            <!-- Modules in Group -->
                            <div :id="`modules-container-${groupIndex}`" :data-group-index="groupIndex" class="space-y-2">
                                <template v-for="(module, moduleIndex) in group.modules" :key="module.id">
                                    <!-- Parent Module -->
                                    <div class="card bg-base-200/50">
                                        <div class="card-body p-4">
                                            <div class="flex items-center justify-between">
                                                <div class="flex items-center gap-3">
                                                    <span class="module-drag-handle iconify lucide--grip-vertical text-base-content/40 size-5 cursor-move hover:text-base-content shrink-0" />
                                                    <span v-if="module.icon" class="iconify size-5" :class="module.icon" />
                                                    <div>
                                                        <div class="font-semibold">{{ module.display_name }}</div>
                                                        <div class="text-base-content/60 flex items-center gap-2 text-xs">
                                                            <span class="font-mono">{{ module.name }}</span>
                                                            <span v-if="module.route" class="text-base-content/40">•</span>
                                                            <span v-if="module.route">{{ module.route }}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="flex items-center gap-2">
                                                    <span class="badge badge-sm" :class="module.is_active ? 'badge-success' : 'badge-error'">
                                                        {{ module.is_active ? "Active" : "Inactive" }}
                                                    </span>
                                                    <span class="badge badge-sm" :class="module.is_visible ? 'badge-info' : 'badge-ghost'">
                                                        {{ module.is_visible ? "Visible" : "Hidden" }}
                                                    </span>
                                                    <div class="inline-flex">
                                                        <NuxtLink
                                                            :href="`/access-control/modules/${module.id}/show`"
                                                            class="btn btn-ghost btn-sm btn-square">
                                                            <span class="iconify lucide--eye size-4" />
                                                        </NuxtLink>
                                                        <NuxtLink
                                                            :href="`/access-control/modules/${module.id}/edit`"
                                                            class="btn btn-ghost btn-sm btn-square">
                                                            <span class="iconify lucide--pencil size-4" />
                                                        </NuxtLink>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Children Modules -->
                                            <div
                                                v-if="module.children && module.children.length > 0"
                                                :id="`children-container-${groupIndex}-${moduleIndex}`"
                                                class="mt-3 ml-8 space-y-2">
                                                <div
                                                    v-for="(child, childIndex) in module.children"
                                                    :key="child.id"
                                                    class="flex items-center justify-between rounded-lg bg-base-100 p-3">
                                                    <div class="flex items-center gap-2">
                                                        <span class="child-drag-handle iconify lucide--grip-vertical text-base-content/40 size-4 cursor-move hover:text-base-content shrink-0" />
                                                        <span class="iconify lucide--corner-down-right text-base-content/40 size-4" />
                                                        <div>
                                                            <div class="text-sm font-medium">{{ child.display_name }}</div>
                                                            <div class="text-base-content/60 flex items-center gap-2 text-xs">
                                                                <span class="font-mono">{{ child.name }}</span>
                                                                <span v-if="child.route" class="text-base-content/40">•</span>
                                                                <span v-if="child.route">{{ child.route }}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="flex items-center gap-2">
                                                        <span class="badge badge-xs" :class="child.is_active ? 'badge-success' : 'badge-error'">
                                                            {{ child.is_active ? "Active" : "Inactive" }}
                                                        </span>
                                                        <span class="badge badge-xs" :class="child.is_visible ? 'badge-info' : 'badge-ghost'">
                                                            {{ child.is_visible ? "Visible" : "Hidden" }}
                                                        </span>
                                                        <div class="inline-flex">
                                                            <NuxtLink
                                                                :href="`/access-control/modules/${child.id}/show`"
                                                                class="btn btn-ghost btn-xs btn-square">
                                                                <span class="iconify lucide--eye size-3.5" />
                                                            </NuxtLink>
                                                            <NuxtLink
                                                                :href="`/access-control/modules/${child.id}/edit`"
                                                                class="btn btn-ghost btn-xs btn-square">
                                                                <span class="iconify lucide--pencil size-3.5" />
                                                            </NuxtLink>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div v-if="localModuleGroups.length > 0" class="border-t border-base-300 p-5">
                    <div class="text-base-content/60 text-sm">
                        Total: <span class="text-base-content font-medium">{{ totalModules }}</span> modules
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.sortable-ghost {
    opacity: 0.4;
    background: oklch(var(--p) / 0.1);
}
</style>
