<script lang="ts" setup>
import ActionDropdown from "./ActionDropdown.vue";
</script>

<template>
    <div class="card bg-base-100 shadow">
        <div class="flex items-center gap-3 px-4 py-2.5">
            <span class="iconify lucide--upload-cloud size-4" />
            <p class="grow font-medium">File Uploaded</p>
            <p class="text-base-content/40 text-xs font-medium max-sm:hidden">3 hours ago</p>
            <ActionDropdown />
        </div>
        <div class="border-base-300 border-t border-dashed px-4 py-2.5">
            <p class="text-base-content/60 text-sm">Uploaded "Invoice.pdf" to Reports</p>
            <p class="mt-3 font-medium">Uploading done</p>
            <div class="border-base-200 rounded-box mt-2 flex items-start gap-3 border p-3">
                <span class="iconify lucide--file-up size-6 text-yellow-600" />
                <div class="grow">
                    <p class="leading-none font-medium">Invoice.pdf</p>
                    <div class="text-base-content/60 mt-1 flex items-center gap-1 text-xs/none">
                        <p>My Drive</p>
                        <span class="iconify lucide--chevron-right size-3" />
                        <p>Reports</p>
                    </div>
                </div>
                <p class="text-base-content/40 text-sm font-medium">3.2 MB</p>
            </div>
        </div>
        <div class="mt-auto flex items-end justify-end gap-2 px-4 pt-2 pb-4">
            <div
                class="bg-success/10 tooltip text-success flex items-center rounded-full p-0.5"
                data-tip="Upload successful">
                <span class="iconify lucide--check size-3.5" />
            </div>
            <button class="btn btn-sm btn-soft ms-auto gap-2">
                <span class="iconify lucide--file-pen size-4" />
                Rename File
            </button>
        </div>
    </div>
</template>
