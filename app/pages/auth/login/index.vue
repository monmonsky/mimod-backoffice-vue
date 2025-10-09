<script setup lang="ts">
const showPassword = ref(false);

definePageMeta({
    layout: "auth",
});
</script>

<template>
    <div class="flex flex-col items-stretch p-6 md:p-8 lg:p-16">
        <div class="flex items-center justify-between">
            <NuxtLink href="/dashboards/ecommerce">
                <Logo />
            </NuxtLink>
            <ThemeToggle class="btn btn-circle btn-outline border-base-300" />
        </div>

        <h3 class="mt-8 text-center text-xl font-semibold md:mt-12 lg:mt-24">Login</h3>
        <h3 class="text-base-content/70 mt-2 text-center text-sm">
            Seamless Access, Secure Connection: Your Gateway to a Personalized Experience.
        </h3>

        <div class="mt-6 md:mt-10">
            <fieldset class="fieldset">
                <legend class="fieldset-legend">Email Address</legend>
                <label class="input w-full focus:outline-0">
                    <span class="iconify lucide--mail text-base-content/80 size-5" />
                    <input class="grow focus:outline-0" placeholder="Email Address" type="email" />
                </label>
            </fieldset>

            <fieldset class="fieldset">
                <legend class="fieldset-legend">Password</legend>
                <label class="input w-full focus:outline-0">
                    <span class="iconify lucide--key-round text-base-content/80 size-5" />
                    <input
                        class="grow focus:outline-0"
                        placeholder="Password"
                        :type="showPassword ? 'text' : 'password'" />
                    <button
                        aria-label="Password"
                        class="btn btn-xs btn-ghost btn-circle"
                        @click.prevent="showPassword = !showPassword">
                        <span v-if="showPassword" class="iconify lucide--eye-off size-4" />
                        <span v-else class="iconify lucide--eye size-4" />
                    </button>
                </label>
            </fieldset>

            <div class="text-end">
                <NuxtLink class="label-text text-base-content/80 text-xs" href="/auth/forgot-password">
                    Forgot Password?
                </NuxtLink>
            </div>

            <div class="mt-4 flex items-center gap-3 md:mt-6">
                <input
                    id="agreement"
                    aria-label="Checkbox example"
                    class="checkbox checkbox-sm checkbox-primary"
                    type="checkbox" />
                <label class="text-sm" for="agreement">
                    I agree with
                    <span class="text-primary ms-1 cursor-pointer hover:underline">terms and conditions</span>
                </label>
            </div>

            <NuxtLink class="btn btn-primary btn-wide mt-4 max-w-full gap-3 md:mt-6" href="/dashboards/ecommerce">
                <span class="iconify lucide--log-in size-4" />
                Login
            </NuxtLink>

            <button class="btn btn-ghost btn-wide border-base-300 mt-4 max-w-full gap-3">
                <img alt="" class="size-6" src="/images/brand-logo/google-mini.svg" />
                Login with Google
            </button>

            <p class="text-base-content/80 mt-4 text-center text-sm md:mt-6">
                Haven't account
                <NuxtLink class="text-primary ms-1 hover:underline" href="/auth/register"> Create One </NuxtLink>
            </p>
        </div>
    </div>
</template>
