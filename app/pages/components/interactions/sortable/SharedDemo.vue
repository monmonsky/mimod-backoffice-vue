<script lang="ts" setup>
import Sortable from "sortablejs";
import { onMounted, ref } from "vue";

const firstRef = ref<HTMLDivElement | null>(null);
const secondRef = ref<HTMLDivElement | null>(null);

onMounted(() => {
    if (firstRef.value && secondRef.value) {
        new Sortable(firstRef.value, {
            animation: 150,
            group: "shared",
            ghostClass: "ghost",
            dragClass: "drag",
        });
        new Sortable(secondRef.value, {
            animation: 150,
            group: "shared",
            ghostClass: "ghost",
            dragClass: "drag",
        });
    }
});

const items = Array.from({ length: 6 });
</script>

<template>
    <div class="grid grid-cols-2 gap-6">
        <div ref="firstRef" class="border-base-300 divide-base-300 rounded-box h-fit min-h-12 divide-y border">
            <div
                v-for="(_, index) in items"
                :key="'a' + index"
                class="bg-primary/2 [&.drag]:bg-base-100 [&.ghost]:bg-primary/5 border-base-300 group [&.drag]:rounded-box relative flex items-center gap-2 px-5 py-2.5 [&.drag]:border">
                <span>Group A - Item {{ index + 1 }}</span>
                <div class="bg-primary/80 absolute start-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-e-xl" />
            </div>
        </div>

        <div ref="secondRef" class="border-base-300 divide-base-300 rounded-box h-fit min-h-12 divide-y border">
            <div
                v-for="(_, index) in items"
                :key="'b' + index"
                class="bg-secondary/2 [&.drag]:bg-base-100 [&.ghost]:bg-secondary/5 border-base-300 group [&.drag]:rounded-box relative flex items-center gap-2 px-5 py-2.5 [&.drag]:border">
                <span>Group B - Item {{ index + 1 }}</span>
                <div class="bg-secondary/80 absolute start-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-e-xl" />
            </div>
        </div>
    </div>
</template>
