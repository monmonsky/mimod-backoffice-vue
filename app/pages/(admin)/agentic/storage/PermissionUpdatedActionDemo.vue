<script lang="ts" setup>
import ActionDropdown from "./ActionDropdown.vue";
</script>

<template>
    <div class="card bg-base-100 shadow">
        <div class="flex items-center gap-3 px-4 py-2.5">
            <span class="iconify lucide--shield-user size-4" />
            <p class="grow font-medium">Permissions Updated</p>
            <p class="text-base-content/40 text-xs font-medium max-sm:hidden">3 weeks ago</p>
            <ActionDropdown />
        </div>
        <div class="border-base-300 border-t border-dashed px-4 py-2.5">
            <p class="text-base-content/60 line-clamp-1 text-sm">Grant edit access for “ABC.pdf” to Marketing Team</p>
            <p class="mt-3 font-medium">Shared securely with individuals</p>
            <div class="mt-2 space-y-1">
                <div class="flex items-center gap-3">
                    <div class="avatar bg-base-200 size-7 overflow-hidden rounded-full px-1 pt-1">
                        <img src="/images/avatars/1.png" alt="Avatar" />
                    </div>
                    <p class="grow font-medium">Anthony S. Amaya</p>
                    <span class="text-base-content/60 text-sm">Can Edit</span>
                </div>
                <div class="flex items-center gap-3">
                    <div class="avatar bg-base-200 size-7 overflow-hidden rounded-full px-1 pt-1">
                        <img src="/images/avatars/2.png" alt="Avatar" />
                    </div>
                    <p class="grow font-medium">Crystal R. Taylor</p>
                    <span class="text-base-content/60 text-sm">Can View</span>
                </div>
            </div>
        </div>
        <div class="mt-auto flex items-end justify-end gap-2 px-4 pt-2 pb-4">
            <div
                class="bg-success/10 tooltip text-success flex items-center rounded-full p-0.5"
                data-tip="Permissions updated">
                <span class="iconify lucide--check size-3.5" />
            </div>
            <button class="btn btn-sm btn-soft btn-error ms-auto gap-2">
                <span class="iconify lucide--undo-2 size-4" />
                Revoke Access
            </button>
        </div>
    </div>
</template>
