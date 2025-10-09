import type { RolesResponse } from "~/types/access-control/roles";

export const useRoles = () => {
    const getRoles = () => {
        return useApi<RolesResponse>("/access-control/roles", {
            key: "roles",
        });
    };

    return {
        getRoles,
    };
};
