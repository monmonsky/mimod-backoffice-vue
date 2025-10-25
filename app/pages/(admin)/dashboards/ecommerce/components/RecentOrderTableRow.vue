<script setup lang="ts">
import { getOrderStatusBadgeClass } from "~/utils/statusHelpers";

export type IRecentOrderTableRow = {
    image: string;
    name: string;
    price: number;
    date: string;
    status: "delivered" | "on_going" | "confirmed" | "canceled" | "waiting";
};

defineProps<IRecentOrderTableRow>();

// Map dashboard status to standard order status
const getStatusClass = (status: string) => {
    const mapping: Record<string, string> = {
        delivered: "completed",
        on_going: "processing",
        confirmed: "processing",
        canceled: "cancelled",
        waiting: "pending"
    };
    return getOrderStatusBadgeClass(mapping[status] || status);
};
</script>
<template>
    <tr>
        <th>
            <input aria-label="checked-order" type="checkbox" class="checkbox checkbox-sm" />
        </th>
        <td class="flex items-center space-x-3 truncate">
            <img alt="order image" class="mask mask-squircle bg-base-200 size-7.5" :src="image" />
            <p>{{ name }}</p>
        </td>
        <td class="font-medium">${{ price }}</td>
        <td class="text-xs">{{ date }}</td>
        <td>
            <div :class="['badge badge-sm badge-soft', getStatusClass(status)]">
                {{ status === 'on_going' ? 'On Going' : status.charAt(0).toUpperCase() + status.slice(1) }}
            </div>
        </td>
        <td>
            <div class="flex items-center gap-1">
                <button aria-label="Show product" class="btn btn-square btn-ghost btn-xs">
                    <span class="iconify lucide--eye text-base-content/60 size-4" />
                </button>
                <button
                    aria-label="Show product"
                    class="btn btn-square btn-error btn-outline btn-xs border-transparent">
                    <span class="iconify lucide--trash size-4" />
                </button>
            </div>
        </td>
    </tr>
</template>
