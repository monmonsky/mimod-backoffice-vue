<script setup lang="ts">
import StorageActivity from "./StorageActivity.vue";
import StorageUploadProcess from "./StorageUploadProcess.vue";
</script>
<template>
    <div class="card bg-base-100 card-border">
        <div class="card-body gap-0">
            <div class="flex items-center justify-between">
                <p class="font-medium">Overview</p>
                <button class="btn btn-success btn-outline btn-sm border-transparent">Upgrade Now</button>
            </div>

            <div class="card card-border bg-primary/5 border-primary/10 mt-3">
                <div class="card-body p-4">
                    <div class="flex items-center gap-2.5">
                        <span class="iconify lucide--hard-drive text-primary size-4.5" />
                        <span class="text-primary font-medium">Local Storage</span>
                        <span class="text-primary ms-auto text-sm font-medium">64%</span>
                    </div>
                    <div class="mt-4 flex items-center justify-between gap-2 text-sm">
                        <span class="font-medium">162 GB</span>
                        <span class="text-base-content/80 text-xs">Used of 250 GB</span>
                    </div>
                    <progress class="progress progress-primary mt-1 h-1.5" max="250" :value="160" />
                </div>
            </div>

            <p class="mt-6 text-sm font-medium">In Process</p>
            <div class="mt-3">
                <StorageUploadProcess />
            </div>

            <p class="mt-6 text-sm font-medium">File Activity</p>
            <div class="mt-3 overflow-hidden">
                <StorageActivity />
            </div>
        </div>
    </div>
</template>
