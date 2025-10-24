import { adminMenuItems } from "~/layouts/admin-menu";
import type { ISidebarMenuItem } from "~/components/admin-layout/SidebarMenuItem.vue";

/**
 * Composable to get admin menu information based on route path
 */
export const useAdminMenu = () => {
    /**
     * Find menu item by URL path (supports nested children)
     */
    const findMenuByPath = (path: string, items: ISidebarMenuItem[] = adminMenuItems): ISidebarMenuItem | null => {
        for (const item of items) {
            // Skip title items
            if (item.isTitle) continue;

            // Check if current item matches
            if (item.url && path.startsWith(item.url)) {
                return item;
            }

            // Check children recursively
            if (item.children) {
                const found = findMenuByPath(path, item.children);
                if (found) return found;
            }
        }
        return null;
    };

    /**
     * Get page title from admin menu based on current route
     */
    const getPageTitle = (path?: string): string => {
        const route = useRoute();
        const currentPath = path || route.path;

        const menuItem = findMenuByPath(currentPath);
        return menuItem?.label || "";
    };

    /**
     * Get menu item data by path
     */
    const getMenuByPath = (path?: string): ISidebarMenuItem | null => {
        const route = useRoute();
        const currentPath = path || route.path;

        return findMenuByPath(currentPath);
    };

    /**
     * Set page title from admin menu
     */
    const setPageTitleFromMenu = (customPath?: string) => {
        const title = getPageTitle(customPath);
        if (title) {
            useHead({
                title,
            });
        }
        return title;
    };

    return {
        findMenuByPath,
        getPageTitle,
        getMenuByPath,
        setPageTitleFromMenu,
        adminMenuItems,
    };
};
