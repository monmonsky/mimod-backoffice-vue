<script lang="ts" setup>
import Sortable, { MultiDrag } from "sortablejs";
import { onMounted, ref } from "vue";

const wrapperRef = ref<HTMLDivElement | null>(null);

onMounted(() => {
    Sortable.mount(new MultiDrag());

    if (wrapperRef.value) {
        new Sortable(wrapperRef.value, {
            multiDrag: true,
            animation: 150,
            ghostClass: "ghost",
            dragClass: "drag",
            selectedClass: "selected",
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
            class="[&.drag]:bg-base-100 [&.selected]:bg-base-200/60 [&.ghost]:bg-base-200/40 border-base-300 [&.drag]:rounded-box px-5 py-2.5 [&.drag]:border">
            Item {{ index + 1 }}
        </div>
    </div>
</template>
