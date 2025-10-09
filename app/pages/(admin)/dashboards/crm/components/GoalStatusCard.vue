<script setup lang="ts">
import GoalStatusChart from "./GoalStatusChart.vue";
</script>

<template>
    <div class="card bg-base-100 shadow">
        <div class="card-body pb-3">
            <div>
                <p class="font-medium">Goal Status <span class="text-success text-sm">(Nearly Finished)</span></p>
                <p class="mt-1 text-sm">You&apos;re completed 80% of yearly goal</p>
                <div class="mt-1">
                    <GoalStatusChart />
                </div>
                <div class="mt-3 flex justify-between">
                    <p class="text-sm font-medium">Budget Spent</p>
                    <div>
                        <span class="text-sm font-medium">$22500</span>
                        <span class="text-base-content/60 ms-1 text-xs">/$30000</span>
                    </div>
                </div>
                <progress class="progress progress-primary h-1.5" value="{0.75}" />
            </div>
        </div>
        <hr class="border-base-300 mt-1" />
        <div class="flex justify-between gap-3 p-2.5 px-3">
            <button class="btn btn-primary btn-soft btn-sm">
                <span class="iconify lucide--pencil size-3.5" />
                Change Goal
            </button>
            <div class="inline-flex items-center gap-1">
                <div class="tooltip" data-tip="Download Report">
                    <button class="btn btn-sm btn-ghost btn-square" aria-label="download">
                        <span class="iconify lucide--arrow-down-to-line size-4" />
                    </button>
                </div>
                <div class="tooltip" data-tip="Refresh Data">
                    <button class="btn btn-sm btn-ghost btn-square" aria-label="refresh">
                        <span class="iconify lucide--refresh-ccw size-4" />
                    </button>
                </div>
                <div class="tooltip" data-tip="Support">
                    <button class="btn btn-sm btn-ghost btn-square" aria-label="help">
                        <span class="iconify lucide--circle-help size-4" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
