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
    <div class="flex items-center justify-center gap-2">
        <button class="btn btn-square" data-spinner-control="multi-steps-spinner-demo" data-steps="-5">-5</button>
        <button
            class="btn btn-square"
            data-spinner-control="multi-steps-spinner-demo"
            data-steps="-1"
            aria-label="Decrement">
            <span class="iconify lucide--minus size-4" />
        </button>
        <input
            id="multi-steps-spinner-demo"
            ref="inputRef"
            value="0"
            aria-label="Input"
            type="number"
            class="input no-spinner input-bordered w-40" />
        <button class="btn btn-square" data-spinner-control="multi-steps-spinner-demo" aria-label="Increment">
            <span class="iconify lucide--plus size-4" />
        </button>
        <button class="btn btn-square" data-steps="5" data-spinner-control="multi-steps-spinner-demo">+5</button>
    </div>
</template>
