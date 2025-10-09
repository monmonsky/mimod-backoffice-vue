<script setup lang="ts">
import ProgressWizardDemo from "./ProgressWizardDemo.vue";
import StepperWizardDemo from "./StepperWizardDemo.vue";
import TabWizardDemo from "./TabWizardDemo.vue";

definePageMeta({
    layout: "components",
});
</script>

<template>
    <div>
        <ComponentPageTitle
            label="Interactions"
            title="Wizard"
            description="Multi-step form wizards with tab, stepper, and progress layouts for guided user input" />
        <p class="text-base-content/60 mt-6 font-medium lg:mt-12">Demos</p>

        <div class="mt-6 space-y-6">
            <div class="bg-base-100 card card-border h-fit">
                <div class="bg-base-200/30 flex items-center gap-2.5 px-5 py-3 font-medium">
                    <span class="iconify lucide--list-ordered size-4.5" />
                    Stepper
                </div>
                <div class="p-5">
                    <StepperWizardDemo />
                </div>
            </div>
            <div class="bg-base-100 card card-border h-fit">
                <div class="bg-base-200/30 flex items-center gap-2.5 px-5 py-3 font-medium">
                    <span class="iconify lucide--bar-chart size-4.5" />
                    Progress
                </div>
                <div class="p-5">
                    <ProgressWizardDemo />
                </div>
            </div>
            <div class="bg-base-100 card card-border h-fit">
                <div class="bg-base-200/30 flex items-center gap-2.5 px-5 py-3 font-medium">
                    <span class="iconify lucide--layout-template size-4.5" />
                    Tab
                </div>
                <div class="p-5">
                    <TabWizardDemo />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
