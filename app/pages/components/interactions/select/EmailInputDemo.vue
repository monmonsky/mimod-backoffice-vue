<script lang="ts" setup>
import "choices.js/public/assets/styles/choices.min.css";
import { onMounted, ref } from "vue";

const inputRef = ref<HTMLInputElement | null>(null);

onMounted(async () => {
    if (inputRef.value) {
        const Choices = (await import("choices.js")).default;
        new Choices(inputRef.value, {
            allowHTML: true,
            editItems: true,
            removeItemButton: true,
            addItemFilter: (value) => {
                if (!value) return false;

                const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return new RegExp(regex.source, "i").test(value);
            },
        });
    }
});
</script>

<template>
    <input ref="inputRef" type="text" value="denish@mail.com" placeholder="Enter something" />
</template>
