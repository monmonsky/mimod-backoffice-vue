export default defineNuxtPlugin(() => {
    const authStore = useAuthStore();

    // Periodic session check (every 5 minutes)
    // Use nextTick to ensure auth store is fully initialized
    nextTick(() => {
        if (authStore.isAuthenticated) {
            const checkInterval = setInterval(async () => {
                // Check if token expired
                if (authStore.isTokenExpired) {
                    clearInterval(checkInterval);
                    await authStore.logout();
                    return;
                }

                // Check if token still exists in store
                if (!authStore.token || !authStore.isAuthenticated) {
                    clearInterval(checkInterval);
                    await authStore.logout();
                }
            }, 5 * 60 * 1000); // Check every 5 minutes

            // Clear interval on page unload
            window.addEventListener('beforeunload', () => {
                clearInterval(checkInterval);
            });
        }
    });
});
