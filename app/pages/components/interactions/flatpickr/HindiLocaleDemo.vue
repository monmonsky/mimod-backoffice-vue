<script lang="ts" setup>
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { Hindi } from "flatpickr/dist/l10n/hi.js";
import { onBeforeUnmount, onMounted, ref } from "vue";

type Instance = flatpickr.Instance;

const inputRef = ref<HTMLInputElement | null>(null);
let picker: Instance | null = null;

onMounted(() => {
    if (inputRef.value) {
        picker = flatpickr(inputRef.value, {
            inline: true,
            locale: Hindi,
            altInput: true,
            altFormat: "F j, Y",
            dateFormat: "Y-m-d",
            defaultDate: Date.now(),
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
