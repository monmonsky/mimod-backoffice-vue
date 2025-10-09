<script setup lang="ts">
import type { FilePondOptions } from "filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";
import "filepond/dist/filepond.css";
import vueFilePond from "vue-filepond";

defineProps<FilePondOptions>();

const FilePond = vueFilePond(FilePondPluginImagePreview);
</script>

<template>
    <FilePond />
</template>
