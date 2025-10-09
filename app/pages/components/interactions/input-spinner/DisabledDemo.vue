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
    <div class="flex items-center justify-center gap-3">
        <button
            class="btn btn-square"
            data-spinner-control="disabled-spinner-demo"
            data-steps="-1"
            aria-label="Decrement"
            disabled>
            <span class="iconify lucide--minus size-4" />
        </button>
        <input
            id="disabled-spinner-demo"
            ref="inputRef"
            type="number"
            class="input no-spinner input-bordered w-40"
            value="0"
            aria-label="Input" />
        <button class="btn btn-square" data-spinner-control="disabled-spinner-demo" aria-label="Increment" disabled>
            <span class="iconify lucide--plus size-4" />
        </button>
    </div>
</template>
