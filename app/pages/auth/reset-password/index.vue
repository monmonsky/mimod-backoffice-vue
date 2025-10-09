<script setup lang="ts">
import ThemeToggle from "~/components/ThemeToggle.vue";

const showPassword = ref(false);

definePageMeta({
    layout: "auth",
});
</script>

<template>
    <div class="flex flex-col items-stretch p-8 lg:p-16">
        <div class="flex items-center justify-between">
            <NuxtLink to="/dashboards/ecommerce">
                <Logo />
            </NuxtLink>
            <ThemeToggle class="btn btn-circle btn-outline border-base-300" />
        </div>

        <h3 class="mt-8 text-center text-xl font-semibold md:mt-12 lg:mt-24">Reset Password</h3>
        <h3 class="text-base-content/70 mt-2 text-center text-sm">
            Seamless Access, Secure Connection: Your Gateway to a Personalized Experience.
        </h3>

        <div class="mt-6 md:mt-10">
            <fieldset class="fieldset">
                <legend class="fieldset-legend">Password</legend>
                <label class="input w-full focus:outline-0">
                    <span class="iconify lucide--key-round text-base-content/80 size-5" />
                    <input
                        class="grow focus:outline-0"
                        placeholder="Password"
                        :type="showPassword ? 'text' : 'password'" />
                    <button
                        class="btn btn-xs btn-ghost btn-circle"
                        aria-label="Toggle Password"
                        @click.prevent="showPassword = !showPassword">
                        <span v-if="showPassword" class="iconify lucide--eye-off size-4" />
                        <span v-else class="iconify lucide--eye size-4" />
                    </button>
                </label>
            </fieldset>

            <fieldset class="fieldset">
                <legend class="fieldset-legend">Confirm Password</legend>
                <label class="input w-full focus:outline-0">
                    <span class="iconify lucide--key-round text-base-content/80 size-5" />
                    <input
                        class="grow focus:outline-0"
                        placeholder="Confirm Password"
                        :type="showPassword ? 'text' : 'password'" />
                    <button
                        class="btn btn-xs btn-ghost btn-circle"
                        aria-label="Toggle Confirm Password"
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
                    aria-label="Checkbox"
                    type="checkbox" />
                <label for="agreement" class="text-sm">
                    I agree with
                    <span class="text-primary ms-1 cursor-pointer hover:underline">terms and conditions</span>
                </label>
            </div>

            <NuxtLink href="/dashboards/ecommerce" class="btn btn-primary btn-wide mt-4 max-w-full gap-3 md:mt-6">
                <span class="iconify lucide--check size-4" />
                Change Password
            </NuxtLink>

            <p class="mt-4 text-center text-sm md:mt-6">
                Go to
                <NuxtLink class="text-primary ms-1.5 hover:underline" href="/auth/login"> Login </NuxtLink>
            </p>
        </div>
    </div>
</template>
