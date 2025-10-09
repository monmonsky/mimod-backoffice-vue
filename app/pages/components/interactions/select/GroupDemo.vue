<script lang="ts" setup>
import "choices.js/public/assets/styles/choices.min.css";
import { onMounted, ref } from "vue";

const selectRef = ref<HTMLSelectElement | null>(null);

onMounted(async () => {
    if (selectRef.value) {
        const Choices = (await import("choices.js")).default;
        new Choices(selectRef.value);
    }
});
</script>

<template>
    <select ref="selectRef">
        <option value="">Select an option</option>

        <optgroup label="Fruits">
            <option value="apple">Apple</option>
            <option value="banana">Banana</option>
            <option disabled value="orange">Orange</option>
        </optgroup>

        <optgroup label="Vegetables">
            <option value="carrot">Carrot</option>
            <option value="broccoli">Broccoli</option>
            <option value="spinach">Spinach</option>
        </optgroup>

        <optgroup label="Others">
            <option value="bread">Bread</option>
            <option value="milk">Milk</option>
        </optgroup>
    </select>
</template>
