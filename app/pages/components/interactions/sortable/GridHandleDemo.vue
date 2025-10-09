<script lang="ts" setup>
import Sortable from "sortablejs";
import { onMounted, ref } from "vue";

const wrapperRef = ref<HTMLDivElement | null>(null);

onMounted(() => {
    if (wrapperRef.value) {
        new Sortable(wrapperRef.value, {
            animation: 150,
            ghostClass: "ghost",
            dragClass: "drag",
            handle: "[data-handle]",
        });
    }
});

const items = Array.from({ length: 14 });
</script>

<template>
    <div ref="wrapperRef" class="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8 xl:gap-5">
        <div
            v-for="(_, index) in items"
            :key="index"
            class="bg-base-100 group [&.ghost]:bg-base-200/40 border-base-300 rounded-box relative flex aspect-square cursor-grab items-center justify-center border px-5 py-2.5">
            Item {{ index + 1 }}
            <span
                data-handle
                class="iconify lucide--grip-vertical text-base-content/40 group-hover:text-base-content/80 absolute end-2 top-2 z-1 size-4 cursor-grab transition-all" />
        </div>
    </div>
</template>
