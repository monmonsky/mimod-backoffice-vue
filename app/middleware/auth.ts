export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore();

    // Check authentication validity (includes token expiry check)
    const isValid = authStore.checkAuth();

    // If not authenticated or token expired, redirect to login
    if (!isValid) {
        return navigateTo({
            path: "/auth/login",
            query: { redirect: to.fullPath },
        });
    }
});
