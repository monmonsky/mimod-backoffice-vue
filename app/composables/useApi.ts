import type { UseFetchOptions } from "nuxt/app";

export const useApi = <T>(url: string, options: UseFetchOptions<T> = {}) => {
    const authStore = useAuthStore();
    const config = useRuntimeConfig();

    const defaults: UseFetchOptions<T> = {
        baseURL: config.public.apiBase || "http://127.0.0.1:8000/api",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            ...(authStore.token ? { Authorization: `Bearer ${authStore.token}` } : {}),
        },
        onResponseError({ response }) {
            if (response.status === 401) {
                authStore.logout();
            }
        },
    };

    const params = Object.assign(defaults, options);

    return useFetch(url, params);
};
