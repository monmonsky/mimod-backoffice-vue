<script lang="ts" setup>
import ActionDropdown from "./ActionDropdown.vue";
</script>

<template>
    <div class="card bg-base-100 shadow">
        <div class="flex items-center gap-3 px-4 py-2.5">
            <span class="iconify lucide--text size-4" />
            <p class="grow font-medium">Summarize Document</p>
            <p class="text-base-content/40 text-xs font-medium max-sm:hidden">2 minutes ago</p>
            <ActionDropdown />
        </div>
        <div class="border-base-300 border-t border-dashed px-4 py-2.5">
            <p class="text-base-content/60 text-sm">
                Explain contents of <span class="cursor-pointer underline">abc.doc</span>
            </p>
            <p class="mt-3 font-medium">Generating summary…</p>
            <div class="mt-2 flex flex-col gap-1.5">
                <div class="rounded-box skeleton h-3 w-[50%]" />
                <div class="rounded-box skeleton h-3 w-[75%]" />
            </div>
        </div>
        <div class="mt-auto flex items-end gap-2 px-4 pt-2 pb-4">
            <div class="tooltip" data-tip="In Process">
                <span class="iconify lucide--loader text-base-content/60 block size-4 animate-spin" />
            </div>
            <button class="btn btn-sm ms-auto gap-2 border-none">
                <span class="iconify lucide--pause size-4" />
                Pause
            </button>
            <button class="btn btn-sm btn-error gap-2 border-none">
                <span class="iconify lucide--x-square size-4" />
                Cancel
            </button>
        </div>
    </div>
</template>
