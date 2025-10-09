<script lang="ts" setup>
import Sortable from "sortablejs";

const wrapperRef = ref<HTMLDivElement | null>(null);

onMounted(() => {
    if (wrapperRef.value) {
        new Sortable(wrapperRef.value, {
            animation: 150,
            ghostClass: "ghost",
            dragClass: "drag",
        });
    }
});

const items = Array.from({ length: 6 });
</script>

<template>
    <div ref="wrapperRef" class="border-base-300 divide-base-300 rounded-box divide-y border">
        <div
            v-for="(_, index) in items"
            :key="index"
            class="[&.drag]:bg-base-100 [&.ghost]:bg-base-200/40 border-base-300 [&.drag]:rounded-box px-5 py-2.5 [&.drag]:border">
            Item {{ index + 1 }}
        </div>
    </div>
</template>
