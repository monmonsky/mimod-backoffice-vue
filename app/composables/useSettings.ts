export const useSettings = () => {
    const config = useRuntimeConfig();
    const authStore = useAuthStore();

    const getSettings = (key: string) => {
        return useAsyncData(`settings-${key}`, () =>
            $fetch(`/settings/${key}`, {
                baseURL: config.public.apiBase,
                headers: {
                    Authorization: `Bearer ${authStore.token}`,
                },
            }),
        );
    };

    const updateSettings = async (key: string, data: Record<string, any>) => {
        return await $fetch(`/settings/${key}`, {
            method: "PUT",
            baseURL: config.public.apiBase,
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
            body: data,
        });
    };

    return {
        getSettings,
        updateSettings,
    };
};
