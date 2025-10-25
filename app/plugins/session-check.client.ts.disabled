export default defineNuxtPlugin(() => {
    const authStore = useAuthStore();
    const router = useRouter();

    // Check session validity on route change
    router.beforeEach((to, from, next) => {
        // Skip check for auth pages
        if (to.path.startsWith('/auth/')) {
            next();
            return;
        }

        // If route requires auth but user is not authenticated
        if (to.meta.middleware === 'auth' && !authStore.isAuthenticated) {
            console.log('Session check: User not authenticated, redirecting to login');
            next('/auth/login');
            return;
        }

        next();
    });

    // Periodic session check (every 5 minutes)
    if (authStore.isAuthenticated) {
        const checkInterval = setInterval(async () => {
            // If token exists, try to validate it with a lightweight API call
            if (authStore.token) {
                try {
                    // You can add a lightweight /api/auth/check endpoint or use any protected endpoint
                    // For now, we'll just check if token still exists in store
                    if (!authStore.isAuthenticated) {
                        console.log('Session check: Session expired, logging out');
                        clearInterval(checkInterval);
                        await authStore.logout();
                    }
                } catch (error) {
                    console.error('Session check error:', error);
                }
            } else {
                console.log('Session check: No token found, logging out');
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
