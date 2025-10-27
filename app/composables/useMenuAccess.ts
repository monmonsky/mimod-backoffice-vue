import type { ISidebarMenuItem } from "~/components/admin-layout/SidebarMenuItem.vue";
import { adminMenuItems } from "~/layouts/admin-menu";

export const useMenuAccess = () => {
    const authStore = useAuthStore();

    /**
     * Get user's accessible module routes from role
     */
    const userModuleRoutes = computed(() => {
        const modules = authStore.user?.role?.modules || [];
        return modules
            .filter((m) => m.is_visible && m.is_active)
            .map((m) => m.route)
            .filter((route): route is string => route !== null);
    });

    /**
     * Get user's accessible module names from role
     */
    const userModuleNames = computed(() => {
        const modules = authStore.user?.role?.modules || [];
        return modules
            .filter((m) => m.is_visible && m.is_active)
            .map((m) => m.name);
    });

    /**
     * Check if user has access to a specific route
     */
    const hasRouteAccess = (route: string): boolean => {
        // Super admin has access to everything
        if (authStore.user?.role?.name === "super_admin") {
            return true;
        }

        return userModuleRoutes.value.includes(route);
    };

    /**
     * Check if user has access to a module by name
     */
    const hasModuleAccess = (moduleName: string): boolean => {
        // Super admin has access to everything
        if (authStore.user?.role?.name === "super_admin") {
            return true;
        }

        return userModuleNames.value.includes(moduleName);
    };

    /**
     * Filter menu items based on user's accessible modules
     */
    const filterMenuByAccess = (menuItems: ISidebarMenuItem[]): ISidebarMenuItem[] => {
        // Super admin sees all menu items
        if (authStore.user?.role?.name === "super_admin") {
            return menuItems;
        }

        return menuItems
            .map((item) => {
                // Keep title sections
                if (item.isTitle) {
                    return item;
                }

                // Filter children first if exists
                if (item.children && item.children.length > 0) {
                    const filteredChildren = item.children.filter((child) => {
                        if (child.url) {
                            return hasRouteAccess(child.url);
                        }
                        return false;
                    });

                    // If parent has children but all filtered out, remove parent
                    if (filteredChildren.length === 0) {
                        return null;
                    }

                    // Return parent with filtered children
                    return {
                        ...item,
                        children: filteredChildren,
                    };
                }

                // Check if single menu item has access
                if (item.url) {
                    return hasRouteAccess(item.url) ? item : null;
                }

                // Keep items without URL (like dividers)
                return item;
            })
            .filter((item): item is ISidebarMenuItem => item !== null);
    };

    /**
     * Get filtered menu items for current user
     */
    const accessibleMenuItems = computed(() => {
        return filterMenuByAccess(adminMenuItems);
    });

    /**
     * Remove empty title sections (titles with no menu items after them)
     */
    const cleanupEmptyTitles = (menuItems: ISidebarMenuItem[]): ISidebarMenuItem[] => {
        const result: ISidebarMenuItem[] = [];

        for (let i = 0; i < menuItems.length; i++) {
            const current = menuItems[i];

            // If it's a title, check if next item exists and is not a title
            if (current.isTitle) {
                const next = menuItems[i + 1];
                if (next && !next.isTitle) {
                    result.push(current);
                }
            } else {
                result.push(current);
            }
        }

        return result;
    };

    /**
     * Get final accessible menu with cleanup
     */
    const finalAccessibleMenu = computed(() => {
        return cleanupEmptyTitles(accessibleMenuItems.value);
    });

    return {
        userModuleRoutes,
        userModuleNames,
        hasRouteAccess,
        hasModuleAccess,
        filterMenuByAccess,
        accessibleMenuItems,
        finalAccessibleMenu,
    };
};
