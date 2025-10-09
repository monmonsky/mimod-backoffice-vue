<script setup lang="ts">
import BothPasswordDemo from "./BothPasswordDemo.vue";
import ProgressPasswordDemo from "./ProgressPasswordDemo.vue";
import RulesPasswordDemo from "./RulesPasswordDemo.vue";

definePageMeta({
    layout: "components",
});
</script>

<template>
    <div>
        <ComponentPageTitle
            label="Interactions"
            title="Password Meter"
            description="Interactive password strength meter with live rules check and visual progress feedback" />
        <p class="text-base-content/60 mt-6 font-medium lg:mt-12">Test your password</p>
        <div class="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div class="bg-base-100 card card-border h-fit">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Rules & Progress</div>
                <div class="p-6">
                    <BothPasswordDemo />
                </div>
            </div>
        </div>
        <p class="text-base-content/60 mt-6 font-medium">Demos</p>

        <div class="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div class="bg-base-100 card card-border h-fit">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Rules</div>
                <div class="p-5">
                    <RulesPasswordDemo />
                </div>
            </div>
            <div class="bg-base-100 card card-border h-fit">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Progress</div>
                <div class="p-6">
                    <ProgressPasswordDemo />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
