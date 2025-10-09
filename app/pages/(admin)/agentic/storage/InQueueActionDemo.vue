<script lang="ts" setup>
import ActionDropdown from "./ActionDropdown.vue";
</script>

<template>
    <div class="card bg-base-100 shadow">
        <div class="flex items-center gap-3 px-4 py-2.5">
            <span class="iconify lucide--brush-cleaning size-4" />
            <p class="grow font-medium">Auto-Clean Storage</p>
            <p class="text-base-content/40 text-xs font-medium max-sm:hidden">Now</p>
            <ActionDropdown />
        </div>
        <div class="border-base-300 border-t border-dashed px-4 py-2.5">
            <p class="text-base-content/60 text-sm">Scan storage for duplicates and suggest deletions</p>
            <p class="mt-3 font-medium">In Queue</p>
            <p class="text-base-content/80 mt-2 text-sm">
                This task will start after the document summary finishes, or you can start it now.
            </p>
        </div>
        <div class="mt-auto flex items-end gap-2 px-4 pt-2 pb-4">
            <div class="tooltip" data-tip="Queued">
                <span class="iconify lucide--list-start text-base-content/60 block size-4" />
            </div>
            <button class="btn btn-sm btn-soft btn-primary ms-auto gap-2 border-none">
                <span class="iconify lucide--play size-4" />
                Run Now
            </button>
        </div>
    </div>
</template>
