export default defineNuxtPlugin((nuxtApp) => {
    const authStore = useAuthStore();
    const router = useRouter();

    // Global error handler for fetch requests
    const handleFetchError = (error: any) => {
        // Only handle in client-side
        if (!import.meta.client) return;

        const statusCode = error?.response?.status || error?.statusCode || error?.status;
        const responseData = error?.data || error?.response?._data || error?.data;
        const errorType = responseData?.error;

        // Skip if not authenticated
        if (!authStore.isAuthenticated) {
            return;
        }

        // Skip if already on auth pages
        if (router.currentRoute.value.path.startsWith('/auth/')) {
            return;
        }

        // Handle specific auth errors (401 with TOKEN_INVALID/EXPIRED or just 401 Unauthorized)
        if (statusCode === 401) {
            // Check if it's a token error or generic unauthorized
            if (errorType === 'TOKEN_INVALID' || errorType === 'TOKEN_EXPIRED' || responseData?.message?.includes('Unauthorized')) {
                console.log('Session expired or invalid token detected:', {
                    statusCode,
                    error: errorType,
                    message: responseData?.message,
                });

                // Logout user and redirect to login
                authStore.logout();
            }
        }
    };

    // Intercept $fetch errors
    const originalFetch = $fetch;
    globalThis.$fetch = async (...args: any[]) => {
        try {
            return await originalFetch(...args);
        } catch (error: any) {
            handleFetchError(error);
            throw error;
        }
    };

    // Intercept Vue/Nuxt errors (catches errors from useAsyncData, useFetch, etc.)
    nuxtApp.hook('vue:error', (error: any) => {
        handleFetchError(error);
    });

    // Intercept app errors
    if (import.meta.client) {
        nuxtApp.hook('app:error', (error: any) => {
            handleFetchError(error);
        });
    }
});
