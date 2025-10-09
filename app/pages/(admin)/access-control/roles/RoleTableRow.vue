<script lang="ts" setup>
export type IRoleTableRow = {
    id: number;
    roleName: string;
    displayName: string;
    description: string;
    priority: number;
    type: "system" | "custom";
    status: "active" | "inactive";
    totalUsers: number;
    createdAt: string;
};

defineProps<IRoleTableRow>();

const openDeleteDialog = () => {
    const dialog = document.querySelector<HTMLDialogElement>("#access-control-role-delete");
    dialog?.showModal();
};
</script>

<template>
    <tr class="hover:bg-base-200/40 cursor-pointer *:text-nowrap">
        <td>
            <span class="font-mono text-sm font-medium">{{ roleName }}</span>
        </td>
        <td>
            <span class="font-medium">{{ displayName }}</span>
        </td>
        <td>
            <span class="text-base-content/70 text-sm">{{ description }}</span>
        </td>
        <td>
            <span class="badge badge-ghost badge-sm">{{ priority }}</span>
        </td>
        <td>
            <span
                :class="[
                    'badge badge-sm',
                    type === 'system' ? 'badge-info' : 'badge-ghost',
                ]">
                {{ type }}
            </span>
        </td>
        <td>
            <span
                :class="[
                    'badge badge-sm',
                    status === 'active' ? 'badge-success' : 'badge-error',
                ]">
                {{ status }}
            </span>
        </td>
        <td>
            <div class="flex items-center gap-2">
                <span class="font-medium">{{ totalUsers }}</span>
            </div>
        </td>
        <td class="text-sm">{{ createdAt }}</td>
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
                    :disabled="type === 'system'"
                    @click="openDeleteDialog">
                    <span class="iconify lucide--trash size-4" />
                </button>
            </div>
        </td>
    </tr>
</template>
