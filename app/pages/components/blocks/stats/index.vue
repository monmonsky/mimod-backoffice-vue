<script setup lang="ts">
import CRMStatsDemo from "./CRMStatsDemo.vue";
import ChartsStatsDemo from "./ChartsStatsDemo.vue";
import EcommerceStatsDemo from "./EcommerceStatsDemo.vue";
import FileStatsDemo from "./FileStatsDemo.vue";
import GenAIStatsDemo from "./GenAIStatsDemo.vue";
import IconCornerStatsDemo from "./IconCornerStatsDemo.vue";
import InteractiveStatsDemo from "./InteractiveStatsDemo.vue";
import MergedStatsDemo from "./MergedStatsDemo.vue";
import MinimalStatsDemo from "./MinimalStatsDemo.vue";
import SelectableStatsDemo from "./SelectableStatsDemo.vue";

definePageMeta({
    layout: "components",
});
</script>

<template>
    <div>
        <ComponentPageTitle
            label="Blocks"
            title="Dashboard Stats"
            description="Dashboard stats with support for icons, actions, editable fields, filters, and flexible layouts" />

        <p class="text-base-content/60 mt-6 font-medium lg:mt-12">Demos</p>

        <div class="mt-6 space-y-6">
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Minimal</div>
                <div class="p-6">
                    <MinimalStatsDemo />
                </div>
            </div>
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Charts</div>
                <div class="p-6">
                    <ChartsStatsDemo />
                </div>
            </div>
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Icon Corner</div>
                <div class="p-6">
                    <IconCornerStatsDemo />
                </div>
            </div>
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Interactive</div>
                <div class="p-6">
                    <InteractiveStatsDemo />
                </div>
            </div>
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Selectable</div>
                <div class="p-6">
                    <SelectableStatsDemo />
                </div>
            </div>
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Merged</div>
                <div class="p-6">
                    <MergedStatsDemo />
                </div>
            </div>
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">File</div>
                <div class="p-6">
                    <FileStatsDemo />
                </div>
            </div>
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Ecommerce</div>
                <div class="p-6">
                    <EcommerceStatsDemo />
                </div>
            </div>
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">CRM</div>
                <div class="p-6">
                    <CRMStatsDemo />
                </div>
            </div>
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Gen AI</div>
                <div class="p-6">
                    <GenAIStatsDemo />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
