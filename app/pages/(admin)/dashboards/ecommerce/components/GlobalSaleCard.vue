<script setup lang="ts">
import GlobalSaleChart from "./GlobalSaleChart.vue";
</script>

<template>
    <div class="card bg-base-100 shadow">
        <div class="card-body gap-0 p-0">
            <div class="flex items-center gap-3 px-5 pt-5">
                <span class="iconify lucide--globe-2 size-4.5" />
                <span class="font-medium">Global Sales (%)</span>
                <button class="btn btn-ghost btn-outline border-base-300 btn-sm z-1 ms-auto">
                    <span class="iconify lucide--eye size-4" />
                    Overview
                </button>
            </div>
            <div class="me-5 -mt-5 mb-1">
                <GlobalSaleChart />
            </div>
        </div>
    </div>
</template>
