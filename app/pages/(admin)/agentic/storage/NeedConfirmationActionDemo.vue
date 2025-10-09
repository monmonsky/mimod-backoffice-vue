<script lang="ts" setup>
import ActionDropdown from "./ActionDropdown.vue";
</script>

<template>
    <div class="card bg-base-100 shadow">
        <div class="flex items-center gap-3 px-4 py-2.5">
            <span class="iconify lucide--shield-ellipsis size-4" />
            <p class="grow font-medium">Scan for Sensitive Data</p>
            <p class="text-base-content/40 text-xs font-medium max-sm:hidden">Awaiting</p>
            <ActionDropdown />
        </div>
        <div class="border-base-300 border-t border-dashed px-4 py-2.5">
            <p class="text-base-content/60 text-sm">Scan selected files for sensitive or confidential data</p>
            <p class="mt-3 font-medium">Waiting for your confirmation</p>
            <p class="text-base-content/80 mt-2 text-sm">Permission required to access private folders</p>
        </div>
        <div class="mt-auto flex items-end gap-2 px-4 pt-2 pb-4">
            <div class="tooltip" data-tip="Awaiting Approval">
                <span class="iconify lucide--circle-question-mark text-base-content/60 block size-4" />
            </div>
            <button class="btn btn-sm ms-auto gap-2 border-none">
                <span class="iconify lucide--x size-4" />
                Deny
            </button>
            <button class="btn btn-sm btn-primary gap-2 border-none">
                <span class="iconify lucide--check size-4" />
                Allow
            </button>
        </div>
    </div>
</template>
