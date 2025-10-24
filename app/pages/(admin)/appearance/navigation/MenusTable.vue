<script setup lang="ts">
import CreateEditMenuModal from "./CreateEditMenuModal.vue";
import type { Menu } from "~/types/appearance/navigation";

const emit = defineEmits<{
    'update:statistics': [stats: any]
}>();

const { deleteMenu, reorderMenus } = useMenus();
const { success, error: showError } = useToast();
const config = useRuntimeConfig();
const authStore = useAuthStore();

// Filters
const selectedLocation = ref<'all' | 'header' | 'footer' | 'mobile'>('all');
const search = ref("");
const showInactive = ref(true); // Default true to show all menus initially

// Helper functions - Define first before using in computed
const getLinkTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
        static: "Static URL",
        category: "Category",
        product: "Product",
        external: "External",
    };
    return labels[type] || type;
};

const getLinkTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
        static: "lucide--link",
        category: "lucide--folder",
        product: "lucide--package",
        external: "lucide--external-link",
    };
    return icons[type] || "lucide--link";
};

const getLocationBadges = (menuLocations: any) => {
    if (!menuLocations) return [];

    // If it's a string that looks like JSON array, parse it
    if (typeof menuLocations === 'string') {
        try {
            const parsed = JSON.parse(menuLocations);
            if (Array.isArray(parsed)) {
                return parsed;
            }
            return menuLocations.split(',').map(l => l.trim());
        } catch (e) {
            // If not valid JSON, try comma-separated
            return menuLocations.split(',').map(l => l.trim());
        }
    }

    // If it's already an array
    if (Array.isArray(menuLocations)) {
        return menuLocations.map(ml => {
            // If array element is an object with location property
            if (typeof ml === 'object' && ml.location) {
                return ml.location;
            }
            // If array element is a string that looks like JSON, parse it
            if (typeof ml === 'string') {
                try {
                    const parsed = JSON.parse(ml);
                    if (Array.isArray(parsed)) {
                        return parsed[0]; // Take first element
                    }
                    return parsed;
                } catch (e) {
                    return ml;
                }
            }
            return ml;
        }).flat(); // Flatten in case of nested arrays
    }

    return [];
};

const getLocationIcon = (location: string) => {
    const icons: Record<string, string> = {
        header: "lucide--layout-dashboard",
        footer: "lucide--layout-grid",
        mobile: "lucide--smartphone",
    };
    return icons[location] || "lucide--menu";
};

const getLocationColor = (location: string) => {
    const colors: Record<string, string> = {
        header: "text-primary",
        footer: "text-secondary",
        mobile: "text-accent",
    };
    return colors[location] || "text-base-content";
};

const getMenuUrl = (menu: Menu) => {
    if (menu.link_type === 'static' || menu.link_type === 'external') {
        return menu.url || '-';
    }
    if (menu.link_type === 'category' && menu.category) {
        return `/category/${menu.category.slug}`;
    }
    if (menu.link_type === 'product' && menu.product) {
        return `/product/${menu.product.slug}`;
    }
    return '-';
};

// Fetch menus - Direct fetch to avoid circular dependency
const { data: menusResponse, pending, refresh, error: fetchError } = await useAsyncData(
    "menus",
    () =>
        $fetch("/appearance/navigation/menus", {
            baseURL: config.public.apiBase,
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
            params: {
                per_page: 1000, // Get all menus for grouping
            },
        })
);

const allMenus = computed(() => {
    const response = menusResponse.value as any;
    return response?.data?.data || [];
});

// Group menus by location
const groupedMenus = computed(() => {
    let filtered = allMenus.value;

    // Filter by search
    if (search.value) {
        filtered = filtered.filter((menu: Menu) =>
            menu.title.toLowerCase().includes(search.value.toLowerCase())
        );
    }

    // Filter by active status
    if (!showInactive.value) {
        const beforeFilter = filtered.length;
        filtered = filtered.filter((menu: Menu) => menu.is_active);
    }

    const groups: Record<string, Menu[]> = {
        header: [],
        footer: [],
        mobile: [],
    };

    filtered.forEach((menu: Menu) => {
        const locations = getLocationBadges(menu.menu_locations);
        locations.forEach((loc: string) => {
            if (groups[loc]) {
                groups[loc].push(menu);
            }
        });
    });

    // Sort by order
    Object.keys(groups).forEach((key) => {
        if (groups[key]) {
            groups[key].sort((a, b) => a.order - b.order);
        }
    });

    return groups;
});

const displayedGroups = computed(() => {
    if (selectedLocation.value === 'all') {
        return groupedMenus.value;
    }
    return {
        [selectedLocation.value]: groupedMenus.value[selectedLocation.value] || [],
    };
});

const statistics = computed(() => {
    const menus = allMenus.value;

    return {
        total_menus: menus.length,
        active_menus: menus.filter((m: Menu) => m.is_active).length,
        inactive_menus: menus.filter((m: Menu) => !m.is_active).length,
        header_menus: groupedMenus.value.header?.length || 0,
        footer_menus: groupedMenus.value.footer?.length || 0,
        mobile_menus: groupedMenus.value.mobile?.length || 0,
        parent_menus: menus.filter((m: Menu) => !m.parent_id).length,
        child_menus: menus.filter((m: Menu) => m.parent_id).length,
    };
});

// Emit statistics to parent component
watch(statistics, (newStats) => {
    emit('update:statistics', newStats);
}, { immediate: true });

// Modals
const showCreateModal = ref(false);
const showEditModal = ref(false);
const selectedMenu = ref<Menu | null>(null);

const openCreateModal = () => {
    selectedMenu.value = null;
    showCreateModal.value = true;
};

const openEditModal = (menu: Menu) => {
    selectedMenu.value = menu;
    showEditModal.value = true;
};

const handleMenuSaved = () => {
    refresh();
    showCreateModal.value = false;
    showEditModal.value = false;
};

// Delete menu
const confirmDelete = ref(false);
const menuToDelete = ref<number | null>(null);

const openDeleteModal = (id: number) => {
    menuToDelete.value = id;
    confirmDelete.value = true;
};

const handleDelete = async () => {
    if (!menuToDelete.value) return;

    try {
        await deleteMenu(menuToDelete.value);
        success("Menu deleted successfully!");
        confirmDelete.value = false;
        menuToDelete.value = null;
        refresh();
    } catch (err: any) {
        showError(err?.data?.message || "Failed to delete menu");
    }
};

// Drag and Drop for reordering
const draggedItem = ref<Menu | null>(null);
const draggedOverItem = ref<Menu | null>(null);
const draggedLocation = ref<string | null>(null);

const onDragStart = (menu: Menu, location: string, event: DragEvent) => {
    draggedItem.value = menu;
    draggedLocation.value = location;
    if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/html', '');
    }
};

const onDragOver = (event: DragEvent, menu: Menu) => {
    event.preventDefault();
    if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move';
    }
    draggedOverItem.value = menu;
};

const onDragLeave = () => {
    draggedOverItem.value = null;
};

const onDrop = async (event: DragEvent, targetMenu: Menu, location: string) => {
    event.preventDefault();

    if (!draggedItem.value || !draggedLocation.value) return;
    if (draggedItem.value.id === targetMenu.id) {
        draggedItem.value = null;
        draggedOverItem.value = null;
        draggedLocation.value = null;
        return;
    }

    // Only allow reorder in same location
    if (draggedLocation.value !== location) {
        showError("Cannot move menu to different location");
        draggedItem.value = null;
        draggedOverItem.value = null;
        draggedLocation.value = null;
        return;
    }

    try {
        // Get all menus in the same location and parent level
        const menusInLocation = groupedMenus.value[location] || [];

        // Determine if we're working with parent or child menus
        const draggedParentId = draggedItem.value.parent_id;
        const targetParentId = targetMenu.parent_id;

        const isParentLevel = !draggedParentId && !targetParentId;
        const isSameParent = draggedParentId === targetParentId;

        // Both must be at same level
        const bothAreParents = !draggedParentId && !targetParentId;
        const bothAreChildrenOfSameParent = draggedParentId && targetParentId && draggedParentId === targetParentId;

        if (!bothAreParents && !bothAreChildrenOfSameParent) {
            if (!draggedParentId && targetParentId) {
                showError("Cannot move parent menu into child level");
            } else if (draggedParentId && !targetParentId) {
                showError("Cannot move child menu to parent level");
            } else {
                showError("Can only reorder menus within the same parent");
            }
            return;
        }

        // Get menus at the same level
        const draggedMenuParentId = draggedItem.value.parent_id;
        const sameLevelMenus = menusInLocation.filter((m: Menu) => {
            if (isParentLevel) {
                // Root level - no parent
                return !m.parent_id;
            } else {
                // Child level - same parent as dragged item
                return m.parent_id === draggedMenuParentId;
            }
        }).sort((a: Menu, b: Menu) => a.order - b.order);

        const draggedIndex = sameLevelMenus.findIndex((m: Menu) => m.id === draggedItem.value!.id);
        const targetIndex = sameLevelMenus.findIndex((m: Menu) => m.id === targetMenu.id);

        if (draggedIndex === -1 || targetIndex === -1) {
            throw new Error("Menu not found in list");
        }

        // Reorder the array
        const reordered = [...sameLevelMenus];
        const [removed] = reordered.splice(draggedIndex, 1);
        reordered.splice(targetIndex, 0, removed);

        // Create orders array with new positions
        const orders = reordered.map((menu, index) => ({
            id: menu.id,
            order: index + 1
        }));

        const response = await reorderMenus({ orders });

        success("Menu order updated successfully!");
        await refresh();
    } catch (err: any) {
        console.error('❌ API Error:');
        console.error('Error Object:', err);
        console.error('Error Data:', err?.data);
        console.error('Error Message:', err?.data?.message || err?.message);
        showError(err?.data?.message || "Failed to reorder menus");
    } finally {
        draggedItem.value = null;
        draggedOverItem.value = null;
        draggedLocation.value = null;
    }
};

const onDragEnd = () => {
    draggedItem.value = null;
    draggedOverItem.value = null;
    draggedLocation.value = null;
};

// findChildren helper for template
const findChildren = (parentId: number, location: string) => {
    return allMenus.value.filter((menu: Menu) => {
        const menuLocations = getLocationBadges(menu.menu_locations);
        return menu.parent_id === parentId && menuLocations.includes(location);
    }).sort((a: Menu, b: Menu) => a.order - b.order);
};
</script>

<template>
    <div class="space-y-6">
        <!-- Quick Actions Bar -->
        <div class="card bg-base-100 shadow">
            <div class="card-body p-4">
                <div class="flex items-center justify-between gap-4 flex-wrap">
                    <div class="flex items-center gap-3">
                        <label class="input input-sm input-bordered flex items-center gap-2">
                            <span class="iconify lucide--search size-4 text-base-content/60" />
                            <input
                                v-model="search"
                                type="search"
                                placeholder="Search menus..."
                                class="w-48"
                                aria-label="Search menus" />
                        </label>
                    </div>
                    <div class="flex items-center gap-2">
                        <button @click="openCreateModal" class="btn btn-sm btn-primary">
                            <span class="iconify lucide--plus size-4" />
                            <span class="hidden sm:inline">Add Menu</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Location Tabs -->
        <div class="tabs tabs-boxed bg-base-100 shadow p-1">
            <button
                @click="selectedLocation = 'all'"
                :class="['tab gap-2', selectedLocation === 'all' && 'tab-active']">
                <span class="iconify lucide--menu size-4" />
                All Locations
            </button>
            <button
                @click="selectedLocation = 'header'"
                :class="['tab gap-2', selectedLocation === 'header' && 'tab-active']">
                <span class="iconify lucide--layout-dashboard size-4" />
                Header
            </button>
            <button
                @click="selectedLocation = 'footer'"
                :class="['tab gap-2', selectedLocation === 'footer' && 'tab-active']">
                <span class="iconify lucide--layout-grid size-4" />
                Footer
            </button>
            <button
                @click="selectedLocation = 'mobile'"
                :class="['tab gap-2', selectedLocation === 'mobile' && 'tab-active']">
                <span class="iconify lucide--smartphone size-4" />
                Mobile
            </button>
        </div>

        <!-- Loading -->
        <div v-if="pending" class="flex items-center justify-center py-12">
            <span class="loading loading-spinner loading-lg"></span>
        </div>

        <!-- Error -->
        <div v-else-if="fetchError" class="card bg-base-100 shadow">
            <div class="card-body flex flex-col items-center justify-center py-12 px-4">
                <span class="iconify lucide--alert-circle size-12 text-error mb-4" />
                <p class="text-lg font-semibold mb-2">Failed to load menus</p>
                <p class="text-sm text-base-content/60 mb-4">{{ fetchError.message || 'An error occurred' }}</p>
                <button @click="() => refresh()" class="btn btn-primary btn-sm">
                    <span class="iconify lucide--refresh-cw size-4" />
                    Retry
                </button>
            </div>
        </div>

        <!-- Menu Groups -->
        <div v-else class="space-y-4">
            <div v-for="(menus, location) in displayedGroups" :key="location" class="card bg-base-100 shadow">
                <!-- Location Header -->
                <div class="card-body p-4">
                    <div class="flex items-center gap-3 mb-4">
                        <div :class="['rounded-lg p-2', location === 'header' ? 'bg-primary/10' : location === 'footer' ? 'bg-secondary/10' : 'bg-accent/10']">
                            <span :class="['iconify size-5', getLocationIcon(location), getLocationColor(location)]" />
                        </div>
                        <div>
                            <h3 class="font-semibold capitalize">{{ location }} Menu</h3>
                            <p class="text-xs text-base-content/60">{{ menus.length }} items</p>
                        </div>
                    </div>

                    <!-- Empty State -->
                    <div v-if="menus.length === 0" class="text-center py-8">
                        <span class="iconify lucide--inbox size-12 text-base-content/20 mb-3" />
                        <p class="text-sm text-base-content/60">No menus in this location</p>
                        <button @click="openCreateModal" class="btn btn-sm btn-ghost mt-2">
                            <span class="iconify lucide--plus size-4" />
                            Add First Menu
                        </button>
                    </div>

                    <!-- Menu Items -->
                    <div v-else class="space-y-2">
                        <template v-for="menu in menus.filter((m: Menu) => !m.parent_id)" :key="menu.id">
                            <!-- Parent Menu -->
                            <div
                                draggable="true"
                                @dragstart="(e) => onDragStart(menu, location, e)"
                                @dragover="(e) => onDragOver(e, menu)"
                                @dragleave="onDragLeave"
                                @drop="(e) => onDrop(e, menu, location)"
                                @dragend="onDragEnd"
                                :class="[
                                    'group hover:bg-base-200/50 rounded-lg p-3 transition-all border border-base-300 cursor-move',
                                    draggedOverItem?.id === menu.id && 'border-primary border-2 bg-primary/5',
                                    draggedItem?.id === menu.id && 'opacity-50'
                                ]">
                                <div class="flex items-center justify-between gap-4">
                                    <div class="flex items-center gap-3 flex-1 min-w-0">
                                        <!-- Drag Handle -->
                                        <span class="iconify lucide--grip-vertical size-4 text-base-content/30" />

                                        <!-- Menu Info -->
                                        <div class="flex-1 min-w-0">
                                            <div class="flex items-center gap-2 mb-1">
                                                <span :class="['iconify size-4', getLinkTypeIcon(menu.link_type), 'text-base-content/60']" />
                                                <span class="font-medium truncate">{{ menu.title }}</span>
                                                <span v-if="!menu.is_active" class="badge badge-xs badge-ghost">Inactive</span>
                                                <span v-if="!menu.is_clickable" class="badge badge-xs badge-outline" title="Not clickable">
                                                    <span class="iconify lucide--mouse-pointer-click size-3" />
                                                </span>
                                            </div>
                                            <div class="flex items-center gap-2 text-xs text-base-content/60">
                                                <span class="badge badge-xs badge-outline">{{ getLinkTypeLabel(menu.link_type) }}</span>
                                                <span class="truncate">{{ getMenuUrl(menu) }}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Actions -->
                                    <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button @click="openEditModal(menu)" class="btn btn-ghost btn-xs">
                                            <span class="iconify lucide--pencil size-3.5" />
                                        </button>
                                        <button @click="openDeleteModal(menu.id)" class="btn btn-ghost btn-xs text-error">
                                            <span class="iconify lucide--trash-2 size-3.5" />
                                        </button>
                                    </div>
                                </div>

                                <!-- Child Menus -->
                                <div v-if="findChildren(menu.id, location).length > 0" class="mt-2 ml-8 space-y-2">
                                    <div
                                        v-for="child in findChildren(menu.id, location)"
                                        :key="child.id"
                                        draggable="true"
                                        @dragstart.stop="(e) => onDragStart(child, location, e)"
                                        @dragover.stop="(e) => onDragOver(e, child)"
                                        @dragleave.stop="onDragLeave"
                                        @drop.stop="(e) => onDrop(e, child, location)"
                                        @dragend.stop="onDragEnd"
                                        :class="[
                                            'group/child hover:bg-base-200/50 rounded-lg p-2 transition-all border-l-2 border-base-300 pl-3 cursor-move',
                                            draggedOverItem?.id === child.id && 'border-l-primary border-l-4 bg-primary/5',
                                            draggedItem?.id === child.id && 'opacity-50'
                                        ]">
                                        <div class="flex items-center justify-between gap-4">
                                            <div class="flex items-center gap-2 flex-1 min-w-0">
                                                <span class="iconify lucide--corner-down-right size-3 text-base-content/40" />
                                                <span class="iconify lucide--grip-vertical size-3 text-base-content/30" />
                                                <span :class="['iconify size-3.5', getLinkTypeIcon(child.link_type), 'text-base-content/60']" />
                                                <span class="text-sm truncate">{{ child.title }}</span>
                                                <span v-if="!child.is_active" class="badge badge-xs badge-ghost">Inactive</span>
                                            </div>
                                            <div class="flex items-center gap-1 opacity-0 group-hover/child:opacity-100 transition-opacity">
                                                <button @click="openEditModal(child)" class="btn btn-ghost btn-xs">
                                                    <span class="iconify lucide--pencil size-3" />
                                                </button>
                                                <button @click="openDeleteModal(child.id)" class="btn btn-ghost btn-xs text-error">
                                                    <span class="iconify lucide--trash-2 size-3" />
                                                </button>
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

        <!-- Create Modal -->
        <CreateEditMenuModal
            v-if="showCreateModal"
            :menu="null"
            @close="showCreateModal = false"
            @saved="handleMenuSaved" />

        <!-- Edit Modal -->
        <CreateEditMenuModal
            v-if="showEditModal && selectedMenu"
            :menu="selectedMenu"
            @close="showEditModal = false"
            @saved="handleMenuSaved" />

        <!-- Delete Confirmation Modal -->
        <dialog :open="confirmDelete" class="modal">
            <div class="modal-box">
                <h3 class="text-lg font-bold">Delete Menu</h3>
                <p class="py-4">Are you sure you want to delete this menu? This action cannot be undone.</p>
                <div class="modal-action">
                    <button class="btn btn-ghost" @click="confirmDelete = false">Cancel</button>
                    <button class="btn btn-error" @click="handleDelete">Delete</button>
                </div>
            </div>
            <form method="dialog" class="modal-backdrop">
                <button @click="confirmDelete = false">close</button>
            </form>
        </dialog>
    </div>
</template>
