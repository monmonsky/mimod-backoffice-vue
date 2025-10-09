<script setup lang="ts">
definePageMeta({
    layout: "components",
});

const textClasses = [
    "text-xs",
    "text-sm",
    "text-base",
    "text-lg",
    "text-xl",
    "text-2xl",
    "text-3xl",
    "text-4xl",
    "text-5xl",
    "text-6xl",
];

const fontWeights = [
    "font-thin",
    "font-extralight",
    "font-light",
    "font-normal",
    "font-medium",
    "font-semibold",
    "font-bold",
    "font-extrabold",
    "font-black",
];
</script>

<template>
    <div>
        <ComponentPageTitle
            label="Foundations"
            title="Text"
            description="A collection of text styles, gradients, and weights for polished typography design" />

        <p class="text-base-content/60 mt-6 font-medium lg:mt-12">Demos</p>

        <div class="mt-6 space-y-6">
            <div class="card card-border">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Sizes</div>
                <div class="flex flex-col gap-3 p-6">
                    <p v-for="(className, index) in textClasses" :key="index" :class="className">
                        The quick brown fox jumps...
                    </p>
                </div>
            </div>

            <div class="card card-border">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Weight</div>
                <div class="flex flex-col gap-3 p-6">
                    <p v-for="(weightClass, index) in fontWeights" :key="index" :class="weightClass">
                        The quick brown fox jumps...
                    </p>
                </div>
            </div>

            <div class="card card-border">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Gradient Text</div>
                <div class="w-full p-6 text-center">
                    <p
                        class="from-primary to-secondary inline-block bg-linear-to-r bg-clip-text text-2xl font-black text-transparent sm:text-3xl md:text-4xl">
                        Why everytime fox jumps...
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
