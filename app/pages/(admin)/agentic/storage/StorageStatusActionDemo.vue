<script lang="ts" setup>
import ActionDropdown from "./ActionDropdown.vue";
</script>

<template>
    <div class="card bg-base-100 shadow">
        <div class="flex items-center gap-3 px-4 py-2.5">
            <span class="iconify lucide--hard-drive size-4" />
            <p class="grow font-medium">Storage Status</p>
            <p class="text-base-content/40 text-xs font-medium max-sm:hidden">Just checked</p>
            <ActionDropdown />
        </div>
        <div class="border-base-300 border-t border-dashed px-4 py-2.5">
            <p class="text-base-content/60 text-sm">How much space is left?</p>
            <p class="mt-3 font-medium">Your drive is almost full</p>
            <div class="border-base-200 rounded-box mt-2 border p-3">
                <div class="flex items-center justify-between">
                    <p class="text-sm font-medium">My Drive</p>
                    <span class="text-base-content/80 text-xs">92%</span>
                </div>
                <progress max="250" value="230" class="progress progress-error mt-1.5 h-1.5 align-super" />
                <div class="-mt-1.5 flex items-center justify-between">
                    <span class="text-sm font-medium">230 GB</span>
                    <span class="text-base-content/80 text-xs">250 GB</span>
                </div>
            </div>
        </div>
        <div class="mt-auto flex items-end justify-end gap-2 px-4 pt-2 pb-4">
            <div
                class="bg-success/10 tooltip text-success flex items-center rounded-full p-0.5"
                data-tip="Storage checked">
                <span class="iconify lucide--check size-3.5" />
            </div>
            <button
                class="btn btn-sm from-primary to-secondary text-primary-content ms-auto gap-2 border-none bg-linear-to-br">
                <span class="iconify lucide--wand-2 size-4" />
                Upgrade Plan
            </button>
        </div>
    </div>
</template>
