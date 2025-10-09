import type { ModulesResponse, ModuleResponse } from "~/types/access-control/modules";

export const useModules = () => {
    const getModules = () => {
        return useApi<ModulesResponse>("/access-control/modules", {
            key: "modules",
        });
    };

    const getModule = (moduleId: number) => {
        return useApi<ModuleResponse>(`/access-control/modules/${moduleId}`, {
            key: `module-${moduleId}`,
        });
    };

    const updateModule = async (moduleId: number, data: any) => {
        const config = useRuntimeConfig();
        const authStore = useAuthStore();

        return $fetch<ModuleResponse>(`/access-control/modules/${moduleId}`, {
            baseURL: config.public.apiBase,
            method: "PUT",
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
            body: data,
        });
    };

    const updateModulesOrder = async (orderData: any[]) => {
        const config = useRuntimeConfig();
        const authStore = useAuthStore();

        return $fetch(`/access-control/modules/reorder`, {
            baseURL: config.public.apiBase,
            method: "POST",
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
            body: {
                modules: orderData,
            },
        });
    };

    return {
        getModules,
        getModule,
        updateModule,
        updateModulesOrder,
    };
};
