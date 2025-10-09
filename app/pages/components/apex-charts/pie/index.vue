<script setup lang="ts">
import GradientDonutChart from "./GradientDonutChart.vue";
import MonochromePieChart from "./MonochromePieChart.vue";
import PatternDonutChart from "./PatternDonutChart.vue";
import SimplePieChart from "./SimplePieChart.vue";

definePageMeta({
    layout: "components",
});
</script>

<template>
    <div>
        <ComponentPageTitle
            label="Apexcharts"
            title="Pie Charts"
            description="A variety of pie and donut charts for visualizing proportions and data distribution" />
        <div class="bg-base-200/40 rounded-box mt-6 px-5 py-4 lg:mt-12">
            <p class="text-base-content/60 font-medium">Usage guidelines</p>
            <p class="mt-1">
                <span class="me-1">- Plugin Documentation:</span>
                <NuxtLink
                    href="https://apexcharts.com/javascript-chart-demos/pie-charts/"
                    target="_blank"
                    class="text-primary">
                    Apexcharts
                </NuxtLink>
            </p>
        </div>
        <p class="text-base-content/60 mt-6 font-medium">Demos</p>

        <div class="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Simple Pie</div>
                <div class="px-5 pt-5 pb-2">
                    <SimplePieChart />
                </div>
            </div>
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Monochrome Pie</div>
                <div class="px-5 pt-5 pb-2">
                    <MonochromePieChart />
                </div>
            </div>
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Gradient Donut</div>
                <div class="px-5 pt-5 pb-2">
                    <GradientDonutChart />
                </div>
            </div>
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Pattern Donut</div>
                <div class="px-5 pt-5 pb-2">
                    <PatternDonutChart />
                </div>
            </div>
        </div>
    </div>
</template>
