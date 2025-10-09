<script setup lang="ts">
import SalesMetricChart from "./SalesMetricChart.vue";
</script>

<template>
    <div class="card bg-base-100 shadow">
        <div class="card-body px-0 pb-0">
            <div class="px-6">
                <div class="flex items-center justify-between">
                    <span class="text-lg font-medium">Sale Metrics</span>
                    <span class="text-base-content/60 text-xs">2024 vs. 2025</span>
                </div>
                <div class="mt-5 grid h-full grid-cols-2 justify-between gap-6 2xl:grid-cols-3">
                    <div class="flex flex-col items-center">
                        <div class="flex items-center gap-2">
                            <span class="status status-success" />
                            <span class="text-base-content/80 text-sm">Realtime Sales</span>
                        </div>
                        <span class="mt-2 text-2xl font-semibold">541</span>
                        <span class="text-base-content/60 text-xs">494 last hour</span>
                    </div>

                    <div class="flex flex-col items-center">
                        <div class="flex items-center gap-2">
                            <span class="status status-secondary" />
                            <span class="text-base-content/80 text-sm">Revenue</span>
                        </div>
                        <span class="mt-2 text-2xl font-semibold">$51,474</span>
                        <span class="text-base-content/60 text-xs">$49,162 last month</span>
                    </div>

                    <div class="hidden flex-col items-center 2xl:flex">
                        <div class="flex items-center gap-2">
                            <span class="status status-error" />
                            <span class="text-base-content/80 text-sm">Customer Retention</span>
                        </div>
                        <span class="mt-2 text-2xl font-semibold">3.14%</span>
                        <span class="text-base-content/60 text-xs">2.16% last week</span>
                    </div>
                </div>
            </div>
            <div class="mt-3.5 overflow-hidden rounded-xl ps-5">
                <SalesMetricChart />
            </div>
        </div>
    </div>
</template>
