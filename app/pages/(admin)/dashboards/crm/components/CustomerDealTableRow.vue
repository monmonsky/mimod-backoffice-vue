<script setup lang="ts">
export type ICustomerDealTableRow = {
    image: string;
    name: string;
    date: string;
    status: "completed" | "canceled" | "pending";
    value: string;
};

defineProps<ICustomerDealTableRow>();
</script>
<template>
    <tr>
        <td class="flex items-center space-x-3 truncate">
            <img alt="Order" class="mask mask-squircle bg-base-200 size-7" :src="image" />
            <p>{{ name }}</p>
        </td>
        <td class="font-medium">${{ value }}</td>
        <td>
            <div v-if="status === 'completed'" class="badge badge-success badge-sm badge-soft">Completed</div>
            <div v-else-if="status === 'canceled'" class="badge badge-error badge-sm badge-soft">Canceled</div>
            <div v-else-if="status === 'pending'" class="badge badge-secondary badge-sm badge-soft">Pending</div>
        </td>
        <td class="text-base-content/80 text-sm">{{ date }}</td>
        <td>
            <button aria-label="Show product" class="btn btn-square btn-ghost btn-xs">
                <span class="iconify lucide--eye text-base-content/80 size-4" />
            </button>
        </td>
    </tr>
</template>
