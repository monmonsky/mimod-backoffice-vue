<script setup lang="ts">
export type IRecentOrderTableRow = {
    image: string;
    name: string;
    price: number;
    date: string;
    status: "delivered" | "on_going" | "confirmed" | "canceled" | "waiting";
};

defineProps<IRecentOrderTableRow>();
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
            <div v-if="status === 'delivered'" class="badge badge-success badge-sm badge-soft">Delivered</div>
            <div v-else-if="status === 'on_going'" class="badge badge-info badge-sm badge-soft">On Going</div>
            <div v-else-if="status === 'confirmed'" class="badge badge-primary badge-sm badge-soft">Confirmed</div>
            <div v-else-if="status === 'canceled'" class="badge badge-error badge-sm badge-soft">Canceled</div>
            <div v-else-if="status === 'waiting'" class="badge badge-secondary badge-sm badge-soft">Waiting</div>
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
