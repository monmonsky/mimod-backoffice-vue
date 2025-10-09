<script lang="ts" setup>
export type IUserTableRow = {
    id: number;
    name: string;
    email: string;
    image: string;
    role: string;
    status: "active" | "inactive";
    lastLogin: string;
};

defineProps<IUserTableRow>();

const openDeleteDialog = () => {
    const dialog = document.querySelector<HTMLDialogElement>("#access-control-user-delete");
    dialog?.showModal();
};
</script>

<template>
    <tr class="hover:bg-base-200/40 cursor-pointer *:text-nowrap">
        <td>
            <div class="flex items-center space-x-3 truncate">
                <img alt="User avatar" class="mask mask-squircle bg-base-200 size-10" :src="image" />
                <div>
                    <p class="font-medium">{{ name }}</p>
                </div>
            </div>
        </td>
        <td>{{ email }}</td>
        <td>
            <span class="badge badge-ghost badge-sm">{{ role }}</span>
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
        <td class="text-sm">{{ lastLogin }}</td>
        <td>
            <div class="inline-flex w-fit">
                <NuxtLink
                    aria-label="View user"
                    class="btn btn-square btn-ghost btn-sm"
                    :href="`/access-control/users/${id}/show`">
                    <span class="iconify lucide--eye text-base-content/80 size-4" />
                </NuxtLink>
                <NuxtLink
                    aria-label="Edit user link"
                    class="btn btn-square btn-ghost btn-sm"
                    :href="`/access-control/users/${id}/edit`">
                    <span class="iconify lucide--pencil text-base-content/80 size-4" />
                </NuxtLink>
                <button
                    aria-label="Delete user"
                    class="btn btn-square btn-error btn-outline btn-sm border-transparent"
                    @click="openDeleteDialog">
                    <span class="iconify lucide--trash size-4" />
                </button>
            </div>
        </td>
    </tr>
</template>
