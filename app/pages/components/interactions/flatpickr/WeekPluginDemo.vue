<script lang="ts" setup>
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import weekSelect from "flatpickr/dist/plugins/weekSelect/weekSelect";
import { onBeforeUnmount, onMounted, ref } from "vue";

type Instance = flatpickr.Instance;
type Plugin = flatpickr.Options.Plugin;

const inputRef = ref<HTMLInputElement | null>(null);
let picker: Instance | null = null;

onMounted(() => {
    if (inputRef.value) {
        picker = flatpickr(inputRef.value, {
            defaultDate: Date.now(),
            plugins: [weekSelect() as Plugin],
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
