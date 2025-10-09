<script lang="ts" setup>
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { onBeforeUnmount, onMounted, ref } from "vue";

type Instance = flatpickr.Instance;

const wrapperRef = ref<HTMLInputElement | null>(null);
let picker: Instance | null = null;

onMounted(() => {
    if (wrapperRef.value) {
        picker = flatpickr(wrapperRef.value, {
            defaultDate: Date.now(),
            wrap: true,
        });
    }
});

onBeforeUnmount(() => {
    picker?.destroy();
});
</script>

<template>
    <div ref="wrapperRef" class="join">
        <input class="input join-item max-w-48" aria-label="Choose Date" data-input />
        <button class="btn btn-outline border-base-300 btn-square join-item" data-toggle aria-label="Toggle calendar">
            <span class="iconify lucide--calendar size-4" />
        </button>
        <button
            class="btn btn-outline border-base-300 btn-square join-item btn-error"
            data-clear
            aria-label="Clear date">
            <span class="iconify lucide--x size-4" />
        </button>
    </div>
</template>
