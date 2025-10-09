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
        <label class="input max-w-56 px-2">
            <button
                class="btn btn-soft btn-circle btn-xs"
                data-spinner-control="inline-spinner-demo"
                data-steps="-1"
                aria-label="Decrement">
                <span class="iconify lucide--minus size-3.5" />
            </button>
            <input
                id="inline-spinner-demo"
                ref="inputRef"
                class="no-spinner m-0 grow text-center"
                aria-label="Input"
                value="1"
                placeholder="Quantity"
                type="number" />
            <button
                class="btn btn-soft btn-circle btn-xs"
                aria-label="Increment"
                data-spinner-control="inline-spinner-demo">
                <span class="iconify lucide--plus size-3.5" />
            </button>
        </label>
    </div>
</template>
