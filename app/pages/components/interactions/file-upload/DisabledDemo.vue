<script lang="ts" setup>
import * as FilePond from "filepond";
import "filepond/dist/filepond.min.css";
import { onMounted, ref } from "vue";

const inputRef = ref<HTMLInputElement | null>(null);

onMounted(() => {
    if (import.meta.client && inputRef.value) {
        FilePond.create(inputRef.value, {
            credits: false,
            disabled: true,
            server: {
                process: (_, __, ___, load) => {
                    load({ message: "done" });
                },
            },
        });
    }
});
</script>

<template>
    <input ref="inputRef" type="file" />
</template>
