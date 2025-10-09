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
            filter: ".no-sort",
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
            :class="`[&.drag]:bg-base-100 [&.ghost]:bg-base-200/40 border-base-300 [&.drag]:rounded-box px-5 py-2.5 [&.drag]:border ${
                index % 2 === 1 ? 'no-sort bg-base-200' : ''
            }`">
            Item {{ index + 1 }}<span v-if="index % 2 === 1"> (can't be sorted)</span>
        </div>
    </div>
</template>
