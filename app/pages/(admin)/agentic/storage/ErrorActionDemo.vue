<script lang="ts" setup>
import ActionDropdown from "./ActionDropdown.vue";
</script>

<template>
    <div class="card bg-base-100 shadow">
        <div class="flex items-center gap-3 px-4 py-2.5">
            <span class="iconify lucide--folder-pen size-4" />
            <p class="grow font-medium">Auto Rename Files</p>
            <p class="text-base-content/40 text-xs font-medium max-sm:hidden">6 hours ago</p>
            <ActionDropdown />
        </div>
        <div class="border-base-300 border-t border-dashed px-4 py-2.5">
            <p class="text-base-content/60 text-sm">Suggest cleaner file names based on content</p>
            <p class="mt-3 font-medium">Name Conflict Detected</p>
            <p class="text-base-content/80 mt-2 text-sm">
                Duplicate file names detected in the folder. Please resolve to continue.
            </p>
        </div>
        <div class="mt-auto flex items-end gap-2 px-4 pt-2 pb-4">
            <div class="tooltip text-error tooltip-error" data-tip="Conflict Detected">
                <span class="iconify lucide--triangle-alert block size-3.5" />
            </div>
            <button class="btn btn-sm ms-auto gap-2 border-none">
                <span class="iconify lucide--list-todo size-4" />
                See Duplicates
            </button>
        </div>
    </div>
</template>
