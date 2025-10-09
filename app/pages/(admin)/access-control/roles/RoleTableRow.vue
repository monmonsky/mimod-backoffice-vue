<script lang="ts" setup>
import type { Role } from "~/types/access-control/roles";

defineProps<Role>();

const openDeleteDialog = () => {
    const dialog = document.querySelector<HTMLDialogElement>("#access-control-role-delete");
    dialog?.showModal();
};
</script>

<template>
    <tr class="hover:bg-base-200/40 cursor-pointer *:text-nowrap">
        <td>
            <span class="font-mono text-sm font-medium">{{ name }}</span>
        </td>
        <td>
            <span class="font-medium">{{ display_name }}</span>
        </td>
        <td>
            <span class="text-base-content/70 text-sm">{{ description || "-" }}</span>
        </td>
        <td>
            <span class="badge badge-ghost badge-sm">{{ priority }}</span>
        </td>
        <td>
            <span :class="['badge badge-sm', is_system ? 'badge-info' : 'badge-ghost']">
                {{ is_system ? "System" : "Custom" }}
            </span>
        </td>
        <td>
            <span :class="['badge badge-sm', is_active ? 'badge-success' : 'badge-error']">
                {{ is_active ? "Active" : "Inactive" }}
            </span>
        </td>
        <td class="text-sm">{{ new Date(created_at).toLocaleDateString() }}</td>
        <td>
            <div class="inline-flex w-fit">
                <NuxtLink
                    aria-label="View role"
                    class="btn btn-square btn-ghost btn-sm"
                    :href="`/access-control/roles/${id}/show`">
                    <span class="iconify lucide--eye text-base-content/80 size-4" />
                </NuxtLink>
                <NuxtLink
                    aria-label="Edit role link"
                    class="btn btn-square btn-ghost btn-sm"
                    :href="`/access-control/roles/${id}/edit`">
                    <span class="iconify lucide--pencil text-base-content/80 size-4" />
                </NuxtLink>
                <button
                    aria-label="Delete role"
                    class="btn btn-square btn-error btn-outline btn-sm border-transparent"
                    :disabled="is_system"
                    @click="openDeleteDialog">
                    <span class="iconify lucide--trash size-4" />
                </button>
            </div>
        </td>
    </tr>
</template>
