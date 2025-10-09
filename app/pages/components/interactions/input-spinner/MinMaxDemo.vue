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
    <div class="join flex items-start justify-center">
        <button
            class="btn border-base-300 btn-outline join-item btn-square"
            data-spinner-control="min-max-spinner-demo"
            data-steps="-1"
            aria-label="Decrement">
            <span class="iconify lucide--minus size-4" />
        </button>
        <label class="input join-item input-bordered max-w-48">
            <input
                id="min-max-spinner-demo"
                ref="inputRef"
                value="15"
                min="0"
                max="100"
                aria-label="Input"
                class="no-spinner"
                type="number" />
            <span class="iconify lucide--percent text-base-content/80 size-4" />
        </label>
        <button
            aria-label="Increment"
            class="btn border-base-300 btn-outline join-item btn-square"
            data-spinner-control="min-max-spinner-demo">
            <span class="iconify lucide--plus size-4" />
        </button>
    </div>
</template>
