<script setup lang="ts">
import AnimatedDemo from "./AnimatedDemo.vue";
import FilterDemo from "./FilterDemo.vue";
import GridDemo from "./GridDemo.vue";
import GridHandleDemo from "./GridHandleDemo.vue";
import HandleDemo from "./HandleDemo.vue";
import InActionDemo from "./InActionDemo.vue";
import MultiDragDemo from "./MultiDragDemo.vue";
import SharedDemo from "./SharedDemo.vue";
import SimpleDemo from "./SimpleDemo.vue";
import SwapDemo from "./SwapDemo.vue";

definePageMeta({
    layout: "components",
});
</script>
<template>
    <div>
        <ComponentPageTitle
            label="Interactions"
            title="Sortable"
            description="Drag and drop sorting with handles, filters, grids, animations, and multi-drag support" />
        <div class="bg-base-200/40 rounded-box mt-6 px-5 py-4 lg:mt-12">
            <p class="text-base-content/60 font-medium">Usage guidelines</p>
            <p class="mt-1">
                <span class="me-1">- Plugin Documentation:</span>
                <NuxtLink href="https://sortablejs.github.io/Sortable/" target="_blank" class="text-primary">
                    SortableJS
                </NuxtLink>
            </p>
        </div>
        <p class="text-base-content/60 mt-6 font-medium">In Action</p>
        <div class="mt-4 lg:mt-6">
            <InActionDemo />
        </div>
        <p class="text-base-content/60 mt-8 font-medium">Demos</p>
        <div class="mt-6 grid gap-6 lg:grid-cols-2">
            <div class="bg-base-100 card card-border h-fit">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Simple</div>
                <div class="p-5">
                    <SimpleDemo />
                </div>
            </div>
            <div class="bg-base-100 card card-border h-fit">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Handle</div>
                <div class="p-5">
                    <HandleDemo />
                </div>
            </div>
            <div class="bg-base-100 card card-border col-span-1 h-fit lg:col-span-2">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Shared</div>
                <div class="p-5">
                    <SharedDemo />
                </div>
            </div>
            <div class="bg-base-100 card card-border h-fit">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Filter</div>
                <div class="p-5">
                    <FilterDemo />
                </div>
            </div>
            <div class="bg-base-100 card card-border h-fit">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Animated (Bouncy)</div>
                <div class="p-5">
                    <AnimatedDemo />
                </div>
            </div>
            <div class="bg-base-100 card card-border h-fit">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Plugin: Multi Drag</div>
                <div class="p-5">
                    <MultiDragDemo />
                </div>
            </div>
            <div class="bg-base-100 card card-border h-fit">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Plugin: Swap</div>
                <div class="p-5">
                    <SwapDemo />
                </div>
            </div>
            <div class="bg-base-100 card card-border col-span-1 h-fit lg:col-span-2">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Grid</div>
                <div class="p-5">
                    <GridDemo />
                </div>
            </div>
            <div class="bg-base-100 card card-border col-span-1 h-fit lg:col-span-2">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Grid Handle</div>
                <div class="p-5">
                    <GridHandleDemo />
                </div>
            </div>
        </div>
    </div>
</template>
