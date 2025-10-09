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
            class="[&.drag]:bg-base-100 [&.ghost]:motion-preset-shake [&.ghost]:bg-base-200/40 border-base-300 group [&.drag]:rounded-box flex items-center gap-2 px-5 py-2.5 [&.drag]:border">
            <span
                data-handle
                class="iconify lucide--grip-vertical text-base-content/40 group-hover:text-base-content/80 size-4 cursor-grab transition-all" />
            <span>Item {{ index + 1 }}</span>
        </div>
    </div>
</template>
