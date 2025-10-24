<script setup lang="ts">
const { success, error: showError } = useToast();
const authStore = useAuthStore();
const router = useRouter();

const showPassword = ref(false);
const loading = ref(false);

const form = ref({
    email: "",
    password: "",
    rememberMe: false,
});

definePageMeta({
    layout: "auth",
    middleware: "guest",
});

// Redirect if already logged in
onMounted(() => {
    if (authStore.isAuthenticated) {
        router.push("/");
    }
});

const handleLogin = async () => {
    // Validation
    if (!form.value.email || !form.value.password) {
        showError("Please fill in all required fields");
        return;
    }

    try {
        loading.value = true;

        const response = await $fetch("/auth/login", {
            method: "POST",
            baseURL: useRuntimeConfig().public.apiBase,
            body: {
                email: form.value.email,
                password: form.value.password,
                device_name: "Web Browser",
            },
        });

        const data = response as any;

        if (data.status && data.data.token) {
            // Store token and user
            // Backend should return expires_in (in seconds), if not default to 24 hours
            const expiresIn = data.data.expires_in || data.data.token_expires_in;
            authStore.setToken(data.data.token, expiresIn);
            authStore.setUser(data.data.user);

            success("Login successful!");

            // Redirect to dashboard
            await router.push("/dashboards");
        } else {
            showError(data.message || "Login failed");
        }
    } catch (err: any) {
        const errorMessage = err?.data?.message || err?.message || "Login failed. Please check your credentials.";
        showError(errorMessage);
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="flex flex-col items-stretch p-6 md:p-8 lg:p-16">
        <div class="flex items-center justify-between">
            <NuxtLink href="/">
                <Logo />
            </NuxtLink>
            <ThemeToggle class="btn btn-circle btn-outline border-base-300" />
        </div>

        <h3 class="mt-8 text-center text-xl font-semibold md:mt-12 lg:mt-24">Login</h3>
        <h3 class="text-base-content/70 mt-2 text-center text-sm">
            Seamless Access, Secure Connection: Your Gateway to a Personalized Experience.
        </h3>

        <form @submit.prevent="handleLogin" class="mt-6 md:mt-10">
            <fieldset class="fieldset">
                <legend class="fieldset-legend">Email Address</legend>
                <label class="input w-full focus:outline-0">
                    <span class="iconify lucide--mail text-base-content/80 size-5" />
                    <input
                        v-model="form.email"
                        class="grow focus:outline-0"
                        placeholder="Email Address"
                        type="email"
                        required
                        :disabled="loading" />
                </label>
            </fieldset>

            <fieldset class="fieldset">
                <legend class="fieldset-legend">Password</legend>
                <label class="input w-full focus:outline-0">
                    <span class="iconify lucide--key-round text-base-content/80 size-5" />
                    <input
                        v-model="form.password"
                        class="grow focus:outline-0"
                        placeholder="Password"
                        :type="showPassword ? 'text' : 'password'"
                        required
                        :disabled="loading" />
                    <button
                        type="button"
                        aria-label="Toggle password visibility"
                        class="btn btn-xs btn-ghost btn-circle"
                        @click.prevent="showPassword = !showPassword">
                        <span v-if="showPassword" class="iconify lucide--eye-off size-4" />
                        <span v-else class="iconify lucide--eye size-4" />
                    </button>
                </label>
            </fieldset>

            <button
                type="submit"
                class="btn btn-primary btn-wide mt-4 max-w-full gap-3 md:mt-6"
                :disabled="loading">
                <span v-if="loading" class="loading loading-spinner loading-sm"></span>
                <span v-else class="iconify lucide--log-in size-4" />
                {{ loading ? "Logging in..." : "Login" }}
            </button>

        </form>
    </div>
</template>
