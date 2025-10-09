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
        });
    }
});

const items = Array.from({ length: 11 });
</script>

<template>
    <div ref="wrapperRef" class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 xl:gap-5">
        <div v-for="(_, index) in items" :key="index" class="group">
            <div
                class="relative aspect-square cursor-grab transition-all duration-500 group-[.ghost]:opacity-60 group-[.ghost]:grayscale-100">
                <img
                    :src="`/images/apps/ecommerce/products/${index + 1}.jpg`"
                    alt="Product"
                    class="h-full w-full rounded-md object-cover" />
                <span
                    class="iconify lucide--grip-vertical absolute end-2 top-2 z-1 size-4 cursor-grab text-black/40 transition-all group-hover:text-black/80" />
            </div>
        </div>
    </div>
</template>
