<script lang="ts" setup>
import type { IUserTableRow } from "~/types/access-control/users";

const props = defineProps<IUserTableRow>();
const emit = defineEmits<{
    refresh: [];
}>();

const { deleteUser } = useUsers();
const { success, error } = useToast();
const deletingUser = ref(false);

const openDeleteDialog = () => {
    const dialog = document.querySelector<HTMLDialogElement>(`#delete-user-${props.id}`);
    dialog?.showModal();
};

const handleDelete = async () => {
    try {
        deletingUser.value = true;
        await deleteUser(props.id);
        success("User deleted successfully!");
        emit("refresh");
        const dialog = document.querySelector<HTMLDialogElement>(`#delete-user-${props.id}`);
        dialog?.close();
    } catch (err: any) {
        console.error("Failed to delete user:", err);
        const errorMessage = err?.data?.message || "Failed to delete user";
        error(errorMessage);
    } finally {
        deletingUser.value = false;
    }
};
</script>

<template>
    <tr class="hover:bg-base-200/40 cursor-pointer *:text-nowrap">
        <td>
            <div class="flex items-center space-x-3 truncate">
                <img
                    v-if="image"
                    alt="User avatar"
                    class="mask mask-squircle bg-base-200 size-10"
                    :src="image" />
                <div
                    v-else
                    class="mask mask-squircle bg-primary/20 text-primary flex size-10 items-center justify-center text-sm font-semibold">
                    {{ name.charAt(0).toUpperCase() }}
                </div>
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
                    status === 'active' ? 'badge-success' : status === 'suspended' ? 'badge-warning' : 'badge-error',
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

    <!-- Delete Confirmation Dialog -->
    <dialog :id="`delete-user-${id}`" class="modal">
        <div class="modal-box">
            <div class="flex items-center justify-between text-lg font-medium">
                Confirm Delete
                <form method="dialog">
                    <button class="btn btn-sm btn-ghost btn-circle" aria-label="Close modal">
                        <span class="iconify lucide--x size-4" />
                    </button>
                </form>
            </div>
            <p class="py-4">
                Are you sure you want to delete <strong>{{ name }}</strong>? This action cannot be undone.
            </p>
            <div class="modal-action">
                <form method="dialog">
                    <button class="btn btn-ghost btn-sm">Cancel</button>
                </form>
                <button class="btn btn-sm btn-error" :disabled="deletingUser" @click="handleDelete">
                    <span v-if="deletingUser" class="loading loading-spinner loading-xs"></span>
                    <span v-else>Yes, delete</span>
                </button>
            </div>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>
</template>
