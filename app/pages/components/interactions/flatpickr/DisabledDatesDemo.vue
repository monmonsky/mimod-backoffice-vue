<script lang="ts" setup>
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { onBeforeUnmount, onMounted, ref } from "vue";

type Instance = flatpickr.Instance;

const inputRef = ref<HTMLInputElement | null>(null);
let picker: Instance | null = null;

onMounted(() => {
    if (inputRef.value) {
        picker = flatpickr(inputRef.value, {
            defaultDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            inline: true,
            disable: [
                new Date(Date.now() - 24 * 60 * 60 * 1000),
                Date.now(),
                new Date(Date.now() + 24 * 60 * 60 * 1000),
            ],
        });
    }
});

onBeforeUnmount(() => {
    picker?.destroy();
});
</script>

<template>
    <input ref="inputRef" class="input max-w-56" aria-label="Choose Date" />
</template>
