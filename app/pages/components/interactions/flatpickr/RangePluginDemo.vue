<script lang="ts" setup>
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import rangePlugin from "flatpickr/dist/plugins/rangePlugin";
import { onBeforeUnmount, onMounted, ref } from "vue";

type Instance = flatpickr.Instance;

const input1Ref = ref<HTMLInputElement | null>(null);
const input2Ref = ref<HTMLInputElement | null>(null);
let picker: Instance | null = null;

onMounted(() => {
    if (input1Ref.value && input2Ref.value) {
        picker = flatpickr(input1Ref.value, {
            plugins: [
                rangePlugin({
                    input: input2Ref.value,
                }),
            ],
        });
    }
});

onBeforeUnmount(() => {
    picker?.destroy();
});
</script>

<template>
    <div class="join">
        <input ref="input1Ref" class="input join-item max-w-32" aria-label="Choose Date" />
        <div
            class="border-base-300 join-item bg-base-200 text-base-content/80 flex items-center border px-3 font-medium">
            to
        </div>
        <input ref="input2Ref" class="input join-item max-w-32" aria-label="Choose Date" />
    </div>
</template>
