<script lang="ts" setup>
import { ref } from "vue";

const timeout = ref<ReturnType<typeof setTimeout> | null>(null);
const isCopied = ref(false);

const copy = async () => {
    isCopied.value = true;
    if (timeout.value) {
        clearTimeout(timeout.value);
    }
    await navigator.clipboard.writeText("npm i tailwindcss daisyui --save-dev");
    timeout.value = setTimeout(() => {
        isCopied.value = false;
    }, 3000);
};
</script>

<template>
    <div class="border-base-300 rounded-box flex max-w-lg grow items-center gap-2 border px-4 py-2">
        <span class="iconify lucide--terminal size-4.5 opacity-80" />
        <p class="grow">
            <span class="text-teal-500">npm</span>
            <span class="text-gray-500"> i</span>
            <span class="text-blue-500"> tailwindcss</span>
            <span class="text-blue-500"> daisyui</span>
            <span class="text-gray-500"> --save-dev</span>
        </p>
        <div
            class="group relative size-5 cursor-pointer transition-all active:scale-95"
            :data-copied="isCopied ? '' : undefined"
            @click="copy">
            <span
                class="iconify lucide--copy absolute inset-0 m-auto size-4.5 transition-all duration-300 group-data-copied:scale-0" />
            <span
                class="iconify lucide--check absolute inset-0 m-auto size-4.5 scale-0 transition-all duration-300 group-data-copied:scale-100" />
            <div
                class="bg-base-content/10 rounded-box absolute -inset-1.5 scale-80 opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100" />
            <div
                class="bg-primary text-primary-content rounded-box absolute -end-2 -bottom-6 scale-90 px-2 py-1 text-sm opacity-0 transition-all duration-300 group-data-copied:-bottom-8 group-data-copied:scale-100 group-data-copied:opacity-100">
                Copied
            </div>
        </div>
    </div>
</template>
