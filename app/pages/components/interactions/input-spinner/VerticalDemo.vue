<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from "vue";

import { InputSpinner } from "./input-spinner";

const inputRef = ref<HTMLInputElement | null>(null);
let spinner: InputSpinner | null = null;

onMounted(() => {
    if (inputRef.value) {
        spinner = new InputSpinner(inputRef.value);
    }
});

onBeforeUnmount(() => {
    spinner?.destroy();
});
</script>

<template>
    <div class="flex items-center justify-center">
        <div class="flex flex-col items-center justify-center gap-1 rounded-full px-0.5 py-1.5 shadow">
            <button
                class="btn btn-circle btn-ghost btn-sm"
                aria-label="Increment"
                data-spinner-control="vertical-spinner-demo">
                <span class="iconify lucide--chevron-up size-4" />
            </button>
            <input
                id="vertical-spinner-demo"
                ref="inputRef"
                value="0"
                aria-label="Input"
                type="number"
                class="input input-sm no-spinner input-ghost me-2.5 max-w-8 text-center text-sm focus:outline-0" />

            <button
                class="btn btn-circle btn-ghost btn-sm"
                data-spinner-control="vertical-spinner-demo"
                data-steps="-1"
                aria-label="Decrement">
                <span class="iconify lucide--chevron-down size-4" />
            </button>
        </div>
    </div>
</template>
