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
    <div class="rounded-box relative h-64 max-w-88 overflow-hidden">
        <img src="/images/apps/ecommerce/products/1.jpg" class="size-full object-cover" alt="Images" />
        <div
            class="rounded-box absolute inset-x-2 bottom-2 border border-white/20 bg-white/40 p-4 text-black backdrop-blur">
            <div class="flex items-end justify-between">
                <div>
                    <p class="leading-none font-medium">White Sneakers</p>
                    <p class="mt-2 text-lg/none font-semibold"><sup class="opacity-60">$</sup>69</p>
                </div>
                <div
                    class="flex items-center gap-1 rounded-full border border-white/25 bg-white/30 px-2 py-1 inset-shadow-xs inset-shadow-white/20">
                    <button
                        class="btn btn-circle btn-xs border-0 bg-white/60 hover:bg-white/80"
                        data-spinner-control="in-action-spinner-demo"
                        data-steps="-1"
                        aria-label="Decrement">
                        <span class="iconify lucide--minus size-4 text-black/80" />
                    </button>
                    <input
                        id="in-action-spinner-demo"
                        ref="inputRef"
                        value="1"
                        min="0"
                        max="10"
                        aria-label="Input"
                        type="number"
                        class="input input-sm input-ghost no-spinner max-w-8 px-0 pe-2.5 text-center text-sm !text-black focus:bg-transparent focus:outline-0" />
                    <button
                        aria-label="Increment"
                        class="btn btn-circle btn-xs hover:bg-whit23e/80 border-0 bg-white/60"
                        data-spinner-control="in-action-spinner-demo">
                        <span class="iconify lucide--plus size-4 text-black/80" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
