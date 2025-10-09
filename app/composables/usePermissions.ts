import type { PermissionsResponse } from "~/types/access-control/permissions";
import type { GroupedPermissionsResponse } from "~/types/access-control/roles";

export const usePermissions = () => {
    const getPermissions = () => {
        return useApi<PermissionsResponse>("/access-control/permissions", {
            key: "permissions",
        });
    };

    const getGroupedPermissions = () => {
        return useApi<GroupedPermissionsResponse>("/access-control/permissions/grouped", {
            key: "permissions-grouped",
        });
    };

    return {
        getPermissions,
        getGroupedPermissions,
    };
};
