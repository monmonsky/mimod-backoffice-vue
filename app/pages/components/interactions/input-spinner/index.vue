<script setup lang="ts">
import ChipDemo from "./ChipDemo.vue";
import DisabledDemo from "./DisabledDemo.vue";
import FractionalDemo from "./FractionalDemo.vue";
import InActionDemo from "./InActionDemo.vue";
import InlineDemo from "./InlineDemo.vue";
import JoinDemo from "./JoinDemo.vue";
import MinMaxDemo from "./MinMaxDemo.vue";
import MultiStepsDemo from "./MultiStepsDemo.vue";
import ReadonlyDemo from "./ReadonlyDemo.vue";
import SimpleDemo from "./SimpleDemo.vue";
import VerticalDemo from "./VerticalDemo.vue";

definePageMeta({
    layout: "components",
});
</script>

<template>
    <div>
        <ComponentPageTitle
            label="Interactions"
            title="Input Spinner"
            description="Versatile number input spinner with steps, limits, styles, and vertical or inline controls" />

        <p class="text-base-content/60 mt-6 font-medium lg:mt-12">In Action</p>
        <div class="mt-4 lg:mt-6">
            <InActionDemo />
        </div>
        <p class="text-base-content/60 mt-8 font-medium">Demos</p>
        <div class="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 px-5 py-3">
                    <p class="font-medium">Simple</p>
                    <p class="text-base-content/80 text-sm">Basic number spinner with plus and minus</p>
                </div>
                <div class="p-6">
                    <SimpleDemo />
                </div>
            </div>

            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 px-5 py-3">
                    <p class="font-medium">Disabled</p>
                    <p class="text-base-content/80 text-sm">Spinner input with controls turned off</p>
                </div>
                <div class="p-6">
                    <DisabledDemo />
                </div>
            </div>

            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 px-5 py-3">
                    <p class="font-medium">Readonly</p>
                    <p class="text-base-content/80 text-sm">Shows value without allowing changes</p>
                </div>
                <div class="p-6">
                    <ReadonlyDemo />
                </div>
            </div>

            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 px-5 py-3">
                    <p class="font-medium">Inline</p>
                    <p class="text-base-content/80 text-sm">Spinner fits neatly within text or inputs</p>
                </div>
                <div class="p-6">
                    <InlineDemo />
                </div>
            </div>

            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 px-5 py-3">
                    <p class="font-medium">Multi Steps</p>
                    <p class="text-base-content/80 text-sm">Increments or decrements in custom steps</p>
                </div>
                <div class="p-6">
                    <MultiStepsDemo />
                </div>
            </div>

            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 px-5 py-3">
                    <p class="font-medium">Join</p>
                    <p class="text-base-content/80 text-sm">Spinner combined with other form elements</p>
                </div>
                <div class="p-6">
                    <JoinDemo />
                </div>
            </div>

            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 px-5 py-3">
                    <p class="font-medium">Min Max</p>
                    <p class="text-base-content/80 text-sm">Restricts value within min and max range</p>
                </div>
                <div class="p-6">
                    <MinMaxDemo />
                </div>
            </div>

            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 px-5 py-3">
                    <p class="font-medium">Fractional</p>
                    <p class="text-base-content/80 text-sm">Supports decimal values like 0.1 or 0.25</p>
                </div>
                <div class="p-6">
                    <FractionalDemo />
                </div>
            </div>

            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 px-5 py-3">
                    <p class="font-medium">Chip</p>
                    <p class="text-base-content/80 text-sm">Spinner styled like a compact chip</p>
                </div>
                <div class="p-6">
                    <ChipDemo />
                </div>
            </div>

            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 px-5 py-3">
                    <p class="font-medium">Vertical</p>
                    <p class="text-base-content/80 text-sm">Up and down buttons stacked vertically</p>
                </div>
                <div class="p-6">
                    <VerticalDemo />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
