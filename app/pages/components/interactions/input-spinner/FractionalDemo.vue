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
    <div class="join flex items-center justify-center">
        <button
            class="btn border-base-300 btn-outline join-item btn-square"
            data-spinner-control="fractional-spinner-demo"
            aria-label="Decrement"
            data-steps="-0.1">
            <span class="iconify lucide--minus size-4" />
        </button>
        <label class="input join-item input-bordered max-w-48">
            <span class="iconify lucide--dollar-sign text-base-content/80 size-4" />
            <input
                id="fractional-spinner-demo"
                ref="inputRef"
                step="0.1"
                value="9.9"
                min="0"
                max="100"
                aria-label="Input"
                class="no-spinner"
                type="number" />
        </label>
        <button
            class="btn border-base-300 btn-outline join-item btn-square"
            data-steps="0.1"
            aria-label="Increment"
            data-spinner-control="fractional-spinner-demo">
            <span class="iconify lucide--plus size-4" />
        </button>
    </div>
</template>
