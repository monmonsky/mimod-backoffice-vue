<script setup lang="ts">
import SocialAcquisitionChart from "./SocialAcquisitionChart.vue";
</script>

<template>
    <div class="card bg-base-100 shadow">
        <div class="card-body px-0 pb-0">
            <div class="flex items-center gap-2 px-5">
                <span class="iconify lucide--megaphone text-base-content/80 size-4.5" />
                <span class="grow font-medium">Social Acquisition</span>
                <div class="hidden items-center gap-1 sm:inline-flex">
                    <span class="me-1 text-sm">0</span>
                    <div class="bg-primary/20 rounded-box size-2.5" />
                    <div class="bg-primary/40 rounded-box size-2.5" />
                    <div class="bg-primary/60 rounded-box size-2.5" />
                    <div class="bg-primary/80 rounded-box size-2.5" />
                    <div class="bg-primary rounded-box size-2.5" />
                    <span class="ms-1 text-sm">100</span>
                </div>
            </div>
            <div class="mt-2">
                <SocialAcquisitionChart />
            </div>
        </div>
    </div>
</template>
