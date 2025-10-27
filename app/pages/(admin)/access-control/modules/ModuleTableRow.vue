<script lang="ts" setup>
import type { Module } from "~/types/access-control/modules";
import { getActiveBadgeClass, getVisibleBadgeClass } from "~/utils/statusHelpers";

defineProps<Module>();

// Permission checks
const { canUpdate, canDelete, canShow } = usePermissionCheck();
</script>

<template>
    <tr class="hover:bg-base-200/40 cursor-pointer *:text-nowrap">
        <td>
            <div class="flex items-center gap-2">
                <span v-if="icon" class="iconify size-4" :class="icon" />
                <span class="font-medium">{{ display_name }}</span>
            </div>
        </td>
        <td>
            <span class="font-mono text-sm">{{ name }}</span>
        </td>
        <td>
            <span class="text-base-content/70 text-sm">{{ route }}</span>
        </td>
        <td>
            <span class="text-base-content/70 text-sm">{{ component }}</span>
        </td>
        <td>
            <span class="badge badge-ghost badge-sm">{{ sort_order }}</span>
        </td>
        <td>
            <span :class="['badge badge-sm', getActiveBadgeClass(is_active)]">
                {{ is_active ? "Active" : "Inactive" }}
            </span>
        </td>
        <td>
            <span :class="['badge badge-sm', getVisibleBadgeClass(is_visible)]">
                {{ is_visible ? "Visible" : "Hidden" }}
            </span>
        </td>
        <td>
            <div class="inline-flex w-fit">
                <NuxtLink
                    v-if="canShow('modules')"
                    aria-label="View module"
                    class="btn btn-square btn-ghost btn-sm"
                    :href="`/access-control/modules/${id}/show`">
                    <span class="iconify lucide--eye text-base-content/80 size-4" />
                </NuxtLink>
                <NuxtLink
                    v-if="canUpdate('modules')"
                    aria-label="Edit module link"
                    class="btn btn-square btn-ghost btn-sm"
                    :href="`/access-control/modules/${id}/edit`">
                    <span class="iconify lucide--pencil text-base-content/80 size-4" />
                </NuxtLink>
                <button
                    v-if="canDelete('modules')"
                    aria-label="Delete module"
                    class="btn btn-square btn-error btn-outline btn-sm border-transparent">
                    <span class="iconify lucide--trash size-4" />
                </button>
            </div>
        </td>
    </tr>
</template>
