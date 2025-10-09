import type { RolesResponse, RoleResponse, RolePermissionsResponse, RoleFormData } from "~/types/access-control/roles";

export const useRoles = () => {
    const getRoles = () => {
        return useApi<RolesResponse>("/access-control/roles", {
            key: "roles",
        });
    };

    const getRole = (roleId: number) => {
        return useApi<RoleResponse>(`/access-control/roles/${roleId}`, {
            key: `role-${roleId}`,
        });
    };

    const getRolePermissions = (roleId: number) => {
        return useApi<RolePermissionsResponse>(`/access-control/roles/${roleId}/permissions/grouped`, {
            key: `role-permissions-${roleId}`,
        });
    };

    const updateRole = async (roleId: number, data: Partial<RoleFormData>) => {
        const config = useRuntimeConfig();
        const authStore = useAuthStore();

        return $fetch<RoleResponse>(`/access-control/roles/${roleId}`, {
            baseURL: config.public.apiBase,
            method: "PUT",
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
            body: data,
        });
    };

    const updateRolePermissions = async (roleId: number, permissionIds: number[]) => {
        const config = useRuntimeConfig();
        const authStore = useAuthStore();

        return $fetch(`/access-control/roles/${roleId}/permissions/sync`, {
            baseURL: config.public.apiBase,
            method: "POST",
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
            body: {
                permission_ids: permissionIds,
            },
        });
    };

    return {
        getRoles,
        getRole,
        getRolePermissions,
        updateRole,
        updateRolePermissions,
    };
};
