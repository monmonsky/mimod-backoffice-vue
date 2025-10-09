<script setup lang="ts">
import RevenueStatisticChart from "./RevenueStatisticChart.vue";

const duration = ref<"day" | "month" | "year">("year");
</script>
<template>
    <div class="card bg-base-100 shadow">
        <div class="card-body px-0 pb-0">
            <div class="px-6">
                <div class="flex items-start justify-between">
                    <span class="font-medium">Revenue Statistics</span>
                    <div class="tabs tabs-box tabs-xs hidden sm:block">
                        <div class="tab px-3" :class="{ 'tab-active': duration === 'day' }" @click="duration = 'day'">
                            Day
                        </div>
                        <div
                            class="tab px-3"
                            :class="{ 'tab-active': duration === 'month' }"
                            @click="duration = 'month'">
                            Month
                        </div>
                        <div class="tab px-3" :class="{ 'tab-active': duration === 'year' }" @click="duration = 'year'">
                            Year
                        </div>
                    </div>
                </div>
                <div class="mt-3">
                    <div v-if="duration === 'day'">
                        <div class="flex items-center gap-3">
                            <span class="text-4xl font-semibold">$627</span>
                            <span class="text-success font-medium">+2.14%</span>
                        </div>
                        <span class="text-base-content/60 text-sm">Total income for today</span>
                    </div>
                    <div v-else-if="duration === 'month'">
                        <div class="flex items-center gap-3">
                            <span class="text-4xl font-semibold">$16,421</span>
                            <span class="text-success font-medium">+4.59%</span>
                        </div>
                        <span class="text-base-content/60 text-sm">Total income in this month</span>
                    </div>
                    <div v-else-if="duration === 'year'">
                        <div class="flex items-center gap-3">
                            <span class="text-4xl font-semibold">$184.78K</span>
                            <span class="text-success font-medium">+3.24%</span>
                        </div>
                        <span class="text-base-content/60 text-sm">Total income in this year</span>
                    </div>
                </div>
            </div>
            <div>
                <RevenueStatisticChart />
            </div>
        </div>
    </div>
</template>
