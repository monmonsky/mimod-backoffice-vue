import type { PaginationParams } from "./usePagination";

export const useStoreTokens = () => {
    const config = useRuntimeConfig();
    const authStore = useAuthStore();
    const { buildPaginationParams } = usePagination();

    const getTokens = (params?: Partial<PaginationParams>) => {
        // Apply default pagination params (per_page: 20)
        const paginationParams = buildPaginationParams(params);

        return useAsyncData(
            "store-tokens",
            () =>
                $fetch("/access-control/store-tokens", {
                    baseURL: config.public.apiBase,
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                    },
                    params: paginationParams,
                }),
            {
                watch: params ? [() => params] : [],
            },
        );
    };

    const getTokenStats = () => {
        return useAsyncData("store-tokens-stats", () =>
            $fetch("/access-control/store-tokens/stats", {
                baseURL: config.public.apiBase,
                headers: {
                    Authorization: `Bearer ${authStore.token}`,
                },
            }),
        );
    };

    const getTokenDetails = (id: number) => {
        return useAsyncData(`store-token-${id}`, () =>
            $fetch(`/access-control/store-tokens/${id}`, {
                baseURL: config.public.apiBase,
                headers: {
                    Authorization: `Bearer ${authStore.token}`,
                },
            }),
        );
    };

    const generateToken = async (data: { name: string; revoke_existing: boolean }) => {
        return await $fetch("/access-control/store-tokens/generate", {
            method: "POST",
            baseURL: config.public.apiBase,
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
            body: data,
        });
    };

    const revokeToken = async (id: number) => {
        return await $fetch(`/access-control/store-tokens/${id}`, {
            method: "DELETE",
            baseURL: config.public.apiBase,
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
        });
    };

    return {
        getTokens,
        getTokenStats,
        getTokenDetails,
        generateToken,
        revokeToken,
    };
};
