<script setup lang="ts">
import DumbbellColumnChart from "./DumbbellColumnChart.vue";
import NegativeValuesColumnChart from "./NegativeValuesColumnChart.vue";
import RangeColumnChart from "./RangeColumnChart.vue";
import StackedColumnChart from "./StackedColumnChart.vue";

definePageMeta({
    layout: "components",
});
</script>

<template>
    <div>
        <ComponentPageTitle
            label="Apexcharts"
            title="Column Charts"
            description="A versatile set of column charts for comparing values, ranges, and trends visually" />
        <div class="bg-base-200/40 rounded-box mt-6 px-5 py-4 lg:mt-12">
            <p class="text-base-content/60 font-medium">Usage guidelines</p>
            <p class="mt-1">
                <span class="me-1">- Plugin Documentation:</span>
                <NuxtLink
                    href="https://apexcharts.com/javascript-chart-demos/column-charts/"
                    target="_blank"
                    class="text-primary">
                    Apexcharts
                </NuxtLink>
            </p>
        </div>
        <p class="text-base-content/60 mt-6 font-medium">Demos</p>

        <div class="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Stacked Column</div>
                <div class="px-5 pt-5 pb-2">
                    <StackedColumnChart />
                </div>
            </div>
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Dumbbell Column</div>
                <div class="px-5 pt-5 pb-2">
                    <DumbbellColumnChart />
                </div>
            </div>
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Range Column</div>
                <div class="px-5 pt-5 pb-2">
                    <RangeColumnChart />
                </div>
            </div>
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Negative Values Column</div>
                <div class="px-5 pt-5 pb-2">
                    <NegativeValuesColumnChart />
                </div>
            </div>
        </div>
    </div>
</template>
