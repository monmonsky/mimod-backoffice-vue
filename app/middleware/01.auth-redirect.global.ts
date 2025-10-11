export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore();

    // Skip middleware for auth pages
    if (to.path.startsWith("/auth/")) {
        return;
    }

    // If trying to access index "/" without auth, redirect to login
    if (to.path === "/" && !authStore.isAuthenticated) {
        return navigateTo("/auth/login");
    }

    // If authenticated and trying to access "/", redirect to admin dashboard
    if (to.path === "/" && authStore.isAuthenticated) {
        return navigateTo("/catalogs/products");
    }

    // Protect all admin routes (any route not starting with /auth/)
    if (!to.path.startsWith("/auth/") && !authStore.isAuthenticated) {
        return navigateTo({
            path: "/auth/login",
            query: { redirect: to.fullPath },
        });
    }
});
