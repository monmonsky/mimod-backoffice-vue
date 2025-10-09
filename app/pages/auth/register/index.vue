<script setup lang="ts">
import ThemeToggle from "~/components/ThemeToggle.vue";

const showPassword = ref(false);

definePageMeta({
    layout: "auth",
});
</script>

<template>
    <div class="flex flex-col items-stretch p-6 md:p-8 lg:p-16">
        <div class="flex items-center justify-between">
            <NuxtLink to="/dashboards/ecommerce">
                <Logo />
            </NuxtLink>
            <ThemeToggle class="btn btn-circle btn-outline border-base-300" />
        </div>

        <h3 class="mt-8 text-center text-xl font-semibold md:mt-12 lg:mt-24">Register</h3>
        <h3 class="text-base-content/70 mt-2 text-center text-sm">
            Seamless Access, Secure Connection: Your Gateway to a Personalized Experience.
        </h3>

        <div class="mt-6 md:mt-10">
            <div class="grid grid-cols-1 gap-x-4 xl:grid-cols-2">
                <fieldset class="fieldset">
                    <legend class="fieldset-legend">First Name</legend>
                    <label class="input w-full focus:outline-0">
                        <span class="iconify lucide--user text-base-content/80 size-5" />
                        <input class="grow focus:outline-0" placeholder="First Name" type="text" />
                    </label>
                </fieldset>
                <fieldset class="fieldset">
                    <legend class="fieldset-legend">Last Name</legend>
                    <label class="input w-full focus:outline-0">
                        <span class="iconify lucide--user text-base-content/80 size-5" />
                        <input class="grow focus:outline-0" placeholder="Last Name" type="text" />
                    </label>
                </fieldset>
            </div>

            <fieldset class="fieldset">
                <legend class="fieldset-legend">Username</legend>
                <label class="input w-full focus:outline-0">
                    <span class="iconify lucide--user-square text-base-content/80 size-5" />
                    <input class="grow focus:outline-0" placeholder="Username" type="text" />
                </label>
            </fieldset>

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
                        :type="showPassword ? 'text' : 'password'"
                        placeholder="Password" />
                    <button
                        class="btn btn-xs btn-ghost btn-circle"
                        aria-label="Password"
                        @click.prevent="showPassword = !showPassword">
                        <span v-if="showPassword" class="iconify lucide--eye-off size-4" />
                        <span v-else class="iconify lucide--eye size-4" />
                    </button>
                </label>
            </fieldset>

            <div class="mt-4 flex items-center gap-3 md:mt-6">
                <input
                    id="agreement"
                    class="checkbox checkbox-sm checkbox-primary"
                    aria-label="Checkbox example"
                    type="checkbox" />
                <label for="agreement" class="text-sm">
                    I agree with
                    <span class="text-primary ms-1 cursor-pointer hover:underline">terms and conditions</span>
                </label>
            </div>

            <NuxtLink href="/dashboards/ecommerce" class="btn btn-primary btn-wide mt-4 max-w-full gap-3 md:mt-6">
                <span class="iconify lucide--user-plus size-4" />
                Register
            </NuxtLink>

            <button class="btn btn-ghost btn-wide border-base-300 mt-4 max-w-full gap-3">
                <img src="/images/brand-logo/google-mini.svg" class="size-6" alt="" />
                Register with Google
            </button>

            <p class="text-base-content/80 mt-4 text-center text-sm md:mt-6">
                I have already to
                <NuxtLink class="text-primary ms-1 hover:underline" href="/auth/login">Login</NuxtLink>
            </p>
        </div>
    </div>
</template>
