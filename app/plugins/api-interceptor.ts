export default defineNuxtPlugin(() => {
    const authStore = useAuthStore();
    const router = useRouter();

    // Global error handler for fetch requests
    const handleFetchError = (error: any) => {
        // Only handle in client-side
        if (!import.meta.client) return;

        const statusCode = error?.response?.status || error?.statusCode || error?.status;
        const responseData = error?.data || error?.response?._data;
        const errorType = responseData?.error;

        // Skip if not authenticated
        if (!authStore.isAuthenticated) {
            return;
        }

        // Skip if already on auth pages
        if (router.currentRoute.value.path.startsWith('/auth/')) {
            return;
        }

        // Only handle specific auth errors (401 with TOKEN_INVALID/EXPIRED)
        if (statusCode === 401 && (errorType === 'TOKEN_INVALID' || errorType === 'TOKEN_EXPIRED')) {
            console.log('Token authentication error detected:', {
                statusCode,
                error: errorType,
                message: responseData?.message,
            });

            // Logout user and redirect to login
            authStore.logout();
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
});
