<script lang="ts" setup>
import CustomerAcquisitionChart from "./CustomerAcquisitionChart.vue";
</script>

<template>
    <div class="card bg-base-100 shadow">
        <div class="card-body p-0">
            <div class="flex items-center justify-between px-5 pt-5">
                <span class="font-medium">Customer Acquisition</span>
                <div class="inline-flex items-center gap-2">
                    <div class="text-base-content/60 w-6 border border-dashed" />
                    <span class="text-base-content/80 text-xs">Prediction</span>
                </div>
            </div>
            <div class="mt-4 py-3">
                <div class="divide-base-300 grid grid-cols-2 gap-5 px-5 sm:grid-cols-3 sm:divide-x">
                    <div class="text-center">
                        <p>Advertise</p>
                        <p class="mt-0.5 text-xl font-medium">$148</p>
                        <div class="text-success mt-0.5 inline-flex items-center gap-1">
                            <span class="iconify lucide--arrow-up size-3" />
                            <p class="text-xs">4.78%</p>
                        </div>
                    </div>
                    <div class="hidden text-center sm:block">
                        <p>Customers</p>
                        <p class="mt-0.5 text-xl font-medium">427</p>
                        <div class="text-success mt-0.5 inline-flex items-center gap-1">
                            <span class="iconify lucide--arrow-up size-3" />
                            <p class="text-xs">3.15%</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="-mt-25 sm:mx-5">
                <CustomerAcquisitionChart />
            </div>
        </div>
    </div>
</template>
