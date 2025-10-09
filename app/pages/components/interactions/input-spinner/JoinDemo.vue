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
            class="btn border-base-300 btn-outline btn-square join-item"
            data-spinner-control="join-spinner-demo"
            data-steps="-5">
            -5
        </button>
        <button
            class="btn border-base-300 btn-outline join-item btn-square"
            data-spinner-control="join-spinner-demo"
            data-steps="-1"
            aria-label="Decrement">
            <span class="iconify lucide--minus size-4" />
        </button>
        <input
            id="join-spinner-demo"
            ref="inputRef"
            value="0"
            aria-label="Input"
            type="number"
            class="input no-spinner input-bordered join-item w-40" />
        <button
            aria-label="Increment"
            class="btn border-base-300 btn-outline join-item btn-square"
            data-spinner-control="join-spinner-demo">
            <span class="iconify lucide--plus size-4" />
        </button>
        <button
            class="btn border-base-300 btn-outline join-item btn-square"
            data-steps="5"
            data-spinner-control="join-spinner-demo">
            +5
        </button>
    </div>
</template>
