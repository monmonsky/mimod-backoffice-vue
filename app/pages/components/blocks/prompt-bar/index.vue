<script setup lang="ts">
import AbilityPromptBarDemo from "./AbilityPromptBarDemo.vue";
import ActionPromptBarDemo from "./ActionPromptBarDemo.vue";
import ManagerPromptBarDemo from "./ManagerPromptBarDemo.vue";
import MinimalPromptBarDemo from "./MinimalPromptBarDemo.vue";
import ModelPromptBarDemo from "./ModelPromptBarDemo.vue";
import QuickPromptBarDemo from "./QuickPromptBarDemo.vue";

definePageMeta({
    layout: "components",
});
</script>

<template>
    <div>
        <ComponentPageTitle
            label="Blocks"
            title="Prompt Bar"
            description="An intelligent bar to manage, edit, and reuse your favorite prompts effortlessly" />

        <p class="text-base-content/60 mt-6 font-medium lg:mt-12">Demos</p>

        <div class="mt-6 space-y-6">
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Minimal</div>
                <div class="flex w-full items-center justify-center p-6 xl:py-12">
                    <MinimalPromptBarDemo />
                </div>
            </div>
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Action</div>
                <div class="flex w-full items-center justify-center p-6 xl:py-12">
                    <ActionPromptBarDemo />
                </div>
            </div>
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Model</div>
                <div class="flex w-full items-center justify-center p-6 xl:py-12">
                    <ModelPromptBarDemo />
                </div>
            </div>
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Ability</div>
                <div class="flex w-full items-center justify-center p-6 xl:py-12">
                    <AbilityPromptBarDemo />
                </div>
            </div>

            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Manager</div>
                <div class="flex w-full items-center justify-center p-6 xl:py-12">
                    <ManagerPromptBarDemo />
                </div>
            </div>
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Quick</div>
                <div class="flex w-full items-center justify-center p-6 xl:py-12">
                    <QuickPromptBarDemo />
                </div>
            </div>
        </div>
    </div>
</template>
