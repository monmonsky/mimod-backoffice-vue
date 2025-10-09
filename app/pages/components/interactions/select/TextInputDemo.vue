<script lang="ts" setup>
import "choices.js/public/assets/styles/choices.min.css";
import { onMounted, ref } from "vue";

const inputRef = ref<HTMLInputElement | null>(null);

onMounted(async () => {
    if (inputRef.value) {
        const Choices = (await import("choices.js")).default;
        new Choices(inputRef.value);
    }
});
</script>

<template>
    <input ref="inputRef" type="text" value="denish@mail.com" placeholder="Enter something" />
</template>
