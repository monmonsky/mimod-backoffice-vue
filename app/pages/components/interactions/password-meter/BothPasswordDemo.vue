<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from "vue";

import { PasswordMeter } from "./password-meter";

const passwordRef = ref<HTMLInputElement | null>(null);
let passwordMeter: PasswordMeter | null = null;

onMounted(() => {
    if (passwordRef.value) {
        passwordMeter = new PasswordMeter(passwordRef.value);
    }
});

onBeforeUnmount(() => {
    passwordMeter?.destroy();
});
</script>

<template>
    <div class="group max-w-md">
        <fieldset class="fieldset">
            <legend class="fieldset-legend">Password</legend>
            <input ref="passwordRef" class="input w-full" aria-label="Input" placeholder="Type here" type="text" />
        </fieldset>
        <div class="mt-2 flex gap-2">
            <div class="bg-base-200 h-1.5 grow overflow-hidden rounded-full">
                <div
                    class="bg-success h-full w-full origin-left scale-x-0 rounded-full transition-all duration-500 group-has-[[data-pass-p20]]:scale-x-100" />
            </div>
            <div class="bg-base-200 h-1.5 grow overflow-hidden rounded-full">
                <div
                    class="bg-success h-full w-full origin-left scale-x-0 rounded-full transition-all duration-500 group-has-[[data-pass-p40]]:scale-x-100" />
            </div>
            <div class="bg-base-200 h-1.5 grow overflow-hidden rounded-full">
                <div
                    class="bg-success h-full w-full origin-left scale-x-0 rounded-full transition-all duration-500 group-has-[[data-pass-p60]]:scale-x-100" />
            </div>
            <div class="bg-base-200 h-1.5 grow overflow-hidden rounded-full">
                <div
                    class="bg-success h-full w-full origin-left scale-x-0 rounded-full transition-all duration-500 group-has-[[data-pass-p80]]:scale-x-100" />
            </div>
            <div class="bg-base-200 h-1.5 grow overflow-hidden rounded-full">
                <div
                    class="bg-success h-full w-full origin-left scale-x-0 rounded-full transition-all duration-500 group-has-[[data-pass-p100]]:scale-x-100" />
            </div>
        </div>
        <div class="mt-2 space-y-1">
            <div
                class="text-base-content/60 group-has-[[data-pass-r1]]:text-success flex items-center gap-2 text-sm transition-all duration-300">
                <span class="iconify lucide--check size-3.5" />
                <span>At least 8 characters</span>
            </div>
            <div
                class="text-base-content/60 group-has-[[data-pass-r2][data-pass-r3]]:text-success flex items-center gap-2 text-sm transition-all duration-300">
                <span class="iconify lucide--check size-3.5" />
                <span>
                    Both <span class="group-has-[[data-pass-r3]]:text-success">uppercase</span> and
                    <span class="group-has-[[data-pass-r2]]:text-success">lowercase</span> letters
                </span>
            </div>
            <div
                class="text-base-content/60 group-has-[[data-pass-r4][data-pass-r5]]:text-success flex items-center gap-2 text-sm transition-all duration-300">
                <span class="iconify lucide--check size-3.5" />
                <span>
                    Includes a <span class="group-has-[[data-pass-r4]]:text-success">number</span> and a
                    <span class="group-has-[[data-pass-r5]]:text-success">symbol</span>
                </span>
            </div>
        </div>
    </div>
</template>
