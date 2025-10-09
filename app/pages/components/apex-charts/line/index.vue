<script setup lang="ts">
import AnnotationLineChart from "./AnnotationLineChart.vue";
import LabelLineChart from "./LabelLineChart.vue";
import StepLineChart from "./StepLineChart.vue";
import SyncingLineChart from "./SyncingLineChart.vue";

definePageMeta({
    layout: "components",
});
</script>

<template>
    <div>
        <ComponentPageTitle
            label="Apexcharts"
            title="Line Charts"
            description="A set of interactive line charts for visualizing trends, comparisons, and annotations" />
        <div class="bg-base-200/40 rounded-box mt-6 px-5 py-4 lg:mt-12">
            <p class="text-base-content/60 font-medium">Usage guidelines</p>
            <p class="mt-1">
                <span class="me-1">- Plugin Documentation:</span>
                <NuxtLink
                    href="https://apexcharts.com/javascript-chart-demos/line-charts/"
                    target="_blank"
                    class="text-primary">
                    Apexcharts
                </NuxtLink>
            </p>
        </div>
        <p class="text-base-content/60 mt-6 font-medium">Demos</p>

        <div class="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Label Line</div>
                <div class="px-5 pt-5 pb-2">
                    <LabelLineChart />
                </div>
            </div>
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Step Line</div>
                <div class="px-5 pt-5 pb-2">
                    <StepLineChart />
                </div>
            </div>
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Syncing Line</div>
                <div class="px-5 pt-5 pb-2">
                    <SyncingLineChart />
                </div>
            </div>
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Annotation Line</div>
                <div class="px-5 pt-5 pb-2">
                    <AnnotationLineChart />
                </div>
            </div>
        </div>
    </div>
</template>
