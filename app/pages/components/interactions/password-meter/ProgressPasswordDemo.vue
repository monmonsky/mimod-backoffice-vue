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
    </div>
</template>
