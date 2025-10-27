/**
 * Permission Check Composable
 *
 * Provides functions to check user permissions for CRUD operations
 * and custom actions based on logged-in user's permissions.
 */
export const usePermissionCheck = () => {
    const authStore = useAuthStore();

    /**
     * Check if user has a specific permission
     * @param permissionName - Full permission name (e.g., "products.create")
     */
    const hasPermission = (permissionName: string): boolean => {
        // Super admin has all permissions
        if (authStore.user?.role?.name === "super_admin") {
            return true;
        }

        return authStore.userPermissionNames.includes(permissionName);
    };

    /**
     * Check if user has any of the specified permissions
     * @param permissionNames - Array of permission names
     */
    const hasAnyPermission = (permissionNames: string[]): boolean => {
        // Super admin has all permissions
        if (authStore.user?.role?.name === "super_admin") {
            return true;
        }

        return permissionNames.some(name => hasPermission(name));
    };

    /**
     * Check if user has all of the specified permissions
     * @param permissionNames - Array of permission names
     */
    const hasAllPermissions = (permissionNames: string[]): boolean => {
        // Super admin has all permissions
        if (authStore.user?.role?.name === "super_admin") {
            return true;
        }

        return permissionNames.every(name => hasPermission(name));
    };

    /**
     * Check if user can view a specific module
     * @param moduleName - Module name (e.g., "products", "orders")
     */
    const canView = (moduleName: string): boolean => {
        return hasPermission(`${moduleName}.view`);
    };

    /**
     * Check if user can show detail in a specific module
     * @param moduleName - Module name (e.g., "products", "orders")
     */
    const canShow = (moduleName: string): boolean => {
        return hasPermission(`${moduleName}.show`);
    };

    /**
     * Check if user can create in a specific module
     * @param moduleName - Module name (e.g., "products", "orders")
     */
    const canCreate = (moduleName: string): boolean => {
        return hasPermission(`${moduleName}.create`);
    };

    /**
     * Check if user can update in a specific module
     * @param moduleName - Module name (e.g., "products", "orders")
     */
    const canUpdate = (moduleName: string): boolean => {
        return hasPermission(`${moduleName}.update`);
    };

    /**
     * Check if user can delete in a specific module
     * @param moduleName - Module name (e.g., "products", "orders")
     */
    const canDelete = (moduleName: string): boolean => {
        return hasPermission(`${moduleName}.delete`);
    };

    /**
     * Check if user can perform a custom action on a module
     * @param moduleName - Module name (e.g., "products", "orders")
     * @param action - Action name (e.g., "export", "import", "publish")
     */
    const canDoAction = (moduleName: string, action: string): boolean => {
        return hasPermission(`${moduleName}.${action}`);
    };

    /**
     * Get all permissions for a specific module
     * @param moduleName - Module name (e.g., "products")
     */
    const getModulePermissions = (moduleName: string) => {
        return authStore.userPermissions.filter(p => p.module === moduleName && p.is_active);
    };

    /**
     * Check if user has full CRUD access to a module
     * @param moduleName - Module name
     */
    const hasFullAccess = (moduleName: string): boolean => {
        return (
            canView(moduleName) &&
            canCreate(moduleName) &&
            canUpdate(moduleName) &&
            canDelete(moduleName)
        );
    };

    /**
     * Check if user has at least view access to a module
     * @param moduleName - Module name
     */
    const hasAnyAccess = (moduleName: string): boolean => {
        return hasAnyPermission([
            `${moduleName}.view`,
            `${moduleName}.show`,
            `${moduleName}.create`,
            `${moduleName}.update`,
            `${moduleName}.delete`
        ]);
    };

    /**
     * Get user's CRUD permissions summary for a module
     * @param moduleName - Module name
     */
    const getModuleAccess = (moduleName: string) => {
        return {
            canView: canView(moduleName),
            canShow: canShow(moduleName),
            canCreate: canCreate(moduleName),
            canUpdate: canUpdate(moduleName),
            canDelete: canDelete(moduleName),
        };
    };

    return {
        // Core permission checks
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,

        // CRUD shortcuts
        canView,
        canShow,
        canCreate,
        canUpdate,
        canDelete,
        canDoAction,

        // Helper functions
        getModulePermissions,
        getModuleAccess,
        hasFullAccess,
        hasAnyAccess,

        // Direct access to permissions
        userPermissions: authStore.userPermissions,
        userPermissionNames: authStore.userPermissionNames,
    };
};
