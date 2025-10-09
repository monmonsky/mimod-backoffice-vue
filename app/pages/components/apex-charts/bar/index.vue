<script setup lang="ts">
import GroupedBarChart from "./GroupedBarChart.vue";
import MarkerWithBarChart from "./MarkerWithBarChart.vue";
import NegativeValueBarChart from "./NegativeValueBarChart.vue";
import StackedBarChart from "./StackedBarChart.vue";

definePageMeta({
    layout: "components",
});
</script>

<template>
    <div>
        <ComponentPageTitle
            label="Apexcharts"
            title="Bar Charts"
            description="A collection of bar charts for comparing data, groups, and positive or negative values" />
        <div class="bg-base-200/40 rounded-box mt-6 px-5 py-4 lg:mt-12">
            <p class="text-base-content/60 font-medium">Usage guidelines</p>
            <p class="mt-1">
                <span class="me-1">- Plugin Documentation:</span>
                <NuxtLink
                    href="https://apexcharts.com/javascript-chart-demos/bar-charts/"
                    target="_blank"
                    class="text-primary">
                    Apexcharts
                </NuxtLink>
            </p>
        </div>
        <p class="text-base-content/60 mt-6 font-medium">Demos</p>

        <div class="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Bar With Markers</div>
                <div class="px-3 pt-5 pb-2">
                    <MarkerWithBarChart />
                </div>
            </div>
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Grouped Bar</div>
                <div class="px-3 pt-5 pb-2">
                    <GroupedBarChart />
                </div>
            </div>
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Stacked Bar</div>
                <div class="px-3 pt-5 pb-2">
                    <StackedBarChart />
                </div>
            </div>
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Negative Value</div>
                <div class="px-3 pt-5 pb-2">
                    <NegativeValueBarChart />
                </div>
            </div>
        </div>
    </div>
</template>
