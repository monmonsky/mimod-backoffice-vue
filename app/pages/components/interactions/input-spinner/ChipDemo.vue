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
        <div class="flex items-center gap-1 rounded-full p-1.5 shadow">
            <button
                class="btn btn-circle btn-ghost btn-sm"
                data-spinner-control="chip-spinner-demo"
                data-steps="-1"
                aria-label="Decrement">
                <span class="iconify lucide--minus size-4" />
            </button>
            <input
                id="chip-spinner-demo"
                ref="inputRef"
                value="0"
                aria-label="Input"
                type="number"
                class="input input-sm input-ghost no-spinner me-2.5 max-w-10 text-center text-sm focus:outline-0" />
            <button
                class="btn btn-circle btn-ghost btn-sm"
                aria-label="Increment"
                data-spinner-control="chip-spinner-demo">
                <span class="iconify lucide--plus size-4" />
            </button>
        </div>
    </div>
</template>
