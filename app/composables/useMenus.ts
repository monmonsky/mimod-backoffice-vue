import type {
    MenusListResponse,
    MenuDetailResponse,
    MenuCreateResponse,
    MenuUpdateResponse,
    MenuDeleteResponse,
    MenuReorderResponse,
    BulkCreateCategoriesResponse,
    BulkCreateBrandsResponse,
    MenuFormData,
    BulkCreateCategoriesData,
    BulkCreateBrandsData,
    ReorderMenusData,
} from "~/types/appearance/navigation";

export const useMenus = () => {
    const config = useRuntimeConfig();
    const authStore = useAuthStore();

    const getMenus = (params?: Record<string, any>, options?: { watch?: any[] }) => {
        return useAsyncData<MenusListResponse>(
            "menus",
            () =>
                $fetch("/appearance/navigation/menus", {
                    baseURL: config.public.apiBase,
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                    },
                    params,
                }),
            {
                watch: options?.watch || [],
            },
        );
    };

    const getMenusByLocation = (location: string) => {
        return useAsyncData<any>(`menus-${location}`, () =>
            $fetch(`/menus/location`, {
                baseURL: config.public.apiBase,
                params: { location },
            }),
        );
    };

    const getParentMenus = (params?: Record<string, any>) => {
        return useAsyncData<any>(
            "parent-menus",
            () =>
                $fetch("/appearance/navigation/menus/parents", {
                    baseURL: config.public.apiBase,
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                    },
                    params,
                }),
        );
    };

    const getMenu = (id: number) => {
        return useAsyncData<MenuDetailResponse>(`menu-${id}`, () =>
            $fetch(`/appearance/navigation/menus/${id}`, {
                baseURL: config.public.apiBase,
                headers: {
                    Authorization: `Bearer ${authStore.token}`,
                },
            }),
        );
    };

    const createMenu = async (data: Partial<MenuFormData>) => {
        return await $fetch<MenuCreateResponse>("/appearance/navigation/menus", {
            method: "POST",
            baseURL: config.public.apiBase,
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
            body: data,
        });
    };

    const updateMenu = async (id: number, data: Partial<MenuFormData>) => {
        return await $fetch<MenuUpdateResponse>(`/appearance/navigation/menus/${id}`, {
            method: "PUT",
            baseURL: config.public.apiBase,
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
            body: data,
        });
    };

    const deleteMenu = async (id: number) => {
        return await $fetch<MenuDeleteResponse>(`/appearance/navigation/menus/${id}`, {
            method: "DELETE",
            baseURL: config.public.apiBase,
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
        });
    };

    const reorderMenus = async (data: ReorderMenusData) => {
        return await $fetch<MenuReorderResponse>("/appearance/navigation/menus/reorder", {
            method: "POST",
            baseURL: config.public.apiBase,
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
            body: data,
        });
    };

    const bulkCreateCategories = async (data: BulkCreateCategoriesData) => {
        return await $fetch<BulkCreateCategoriesResponse>("/appearance/navigation/menus/bulk-create-categories", {
            method: "POST",
            baseURL: config.public.apiBase,
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
            body: data,
        });
    };

    const bulkCreateBrands = async (data: BulkCreateBrandsData) => {
        return await $fetch<BulkCreateBrandsResponse>("/appearance/navigation/menus/bulk-create-brands", {
            method: "POST",
            baseURL: config.public.apiBase,
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
            body: data,
        });
    };

    return {
        getMenus,
        getMenusByLocation,
        getParentMenus,
        getMenu,
        createMenu,
        updateMenu,
        deleteMenu,
        reorderMenus,
        bulkCreateCategories,
        bulkCreateBrands,
    };
};
