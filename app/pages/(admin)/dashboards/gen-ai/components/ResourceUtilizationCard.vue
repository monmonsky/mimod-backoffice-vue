<script setup lang="ts">
import ResourceUtilizationChart from "./ResourceUtilizationChart.vue";
</script>

<template>
    <div aria-label="Card" class="card bg-base-100 shadow">
        <div class="card-body p-0">
            <div class="flex items-center gap-3 px-5 pt-5">
                <span class="iconify lucide--cpu size-4.5" />
                <span class="font-medium">Resource Utilization</span>
                <button class="btn btn-outline border-base-300 max-sm:btn-square btn-sm ms-auto">
                    <span class="iconify lucide--bar-chart size-3.5" />
                    <span class="max-sm:hidden">View Report</span>
                </button>
            </div>
        </div>
        <ResourceUtilizationChart />
    </div>
</template>
