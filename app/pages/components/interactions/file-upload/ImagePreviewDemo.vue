<script lang="ts" setup>
import * as FilePond from "filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";
import "filepond/dist/filepond.css";
import { onMounted, ref } from "vue";

FilePond.registerPlugin(FilePondPluginImagePreview);

const inputRef = ref<HTMLInputElement | null>(null);

onMounted(() => {
    if (import.meta.client && inputRef.value) {
        FilePond.create(inputRef.value, {
            credits: false,
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
