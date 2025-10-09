<script lang="ts" setup>
import ActionDropdown from "./ActionDropdown.vue";
</script>

<template>
    <div class="card bg-base-100 shadow">
        <div class="flex items-center gap-3 px-4 py-2.5">
            <span class="iconify lucide--share-2 size-4" />
            <p class="grow font-medium">File Shared</p>
            <p class="text-base-content/40 text-xs font-medium max-sm:hidden">14 minutes ago</p>
            <ActionDropdown />
        </div>
        <div class="border-base-300 border-t border-dashed px-4 py-2.5">
            <p class="text-base-content/60 text-sm">Shared "ProjectPlan.docx" with Design Team</p>
            <p class="mt-3 font-medium">File shared securely with</p>
            <div class="avatar-group mt-2 -space-x-3.5 *:border-2 *:transition-all hover:space-x-0.5 hover:*:shadow-sm">
                <div class="avatar bg-base-200 size-10 overflow-hidden rounded-full px-1 pt-1">
                    <img src="/images/avatars/1.png" alt="Avatar" />
                </div>
                <div class="avatar bg-base-200 size-10 overflow-hidden rounded-full px-1 pt-1">
                    <img src="/images/avatars/2.png" alt="Avatar" />
                </div>
                <div class="avatar bg-base-200 size-10 overflow-hidden rounded-full px-1 pt-1">
                    <img src="/images/avatars/3.png" alt="Avatar" />
                </div>
                <div class="avatar bg-base-200 size-10 overflow-hidden rounded-full px-1 pt-1">
                    <img src="/images/avatars/4.png" alt="Avatar" />
                </div>
                <div
                    class="avatar bg-base-200 flex size-10 items-center justify-center overflow-hidden rounded-full text-sm font-medium">
                    +4
                </div>
            </div>
        </div>
        <div class="mt-auto flex items-end justify-end gap-2 px-4 pt-2 pb-4">
            <div
                class="bg-success/10 tooltip text-success flex items-center rounded-full p-0.5"
                data-tip="Shared successfully">
                <span class="iconify lucide--check size-3.5" />
            </div>
            <button class="btn btn-sm btn-soft ms-auto gap-2">
                <span class="iconify lucide--copy size-4" />
                Copy Share Link
            </button>
        </div>
    </div>
</template>
