<script setup lang="ts">
export interface IOrderTableRow {
    id: number;
    itemsCount: number;
    customerName: string;
    totalAmount: number;
    paymentStatus: "paid" | "pending";
    orderStatus: string;
    orderDate: string;
}

defineProps<IOrderTableRow>();
</script>
<template>
    <tr class="hover:bg-base-200/40 cursor-pointer *:text-nowrap">
        <th class="px-6">
            <input
                :aria-label="`Select order ${id}`"
                class="checkbox checkbox-sm"
                data-slot="single-checkbox"
                type="checkbox" />
        </th>
        <td class="font-medium">#{{ id }}</td>
        <td>{{ itemsCount }} Items</td>
        <td>{{ customerName }}</td>
        <td class="text-sm font-medium">${{ totalAmount }}</td>
        <td>
            <div v-if="paymentStatus === 'paid'" aria-label="Badge" class="badge badge-soft badge-success">Paid</div>
            <div v-else aria-label="Badge" class="badge badge-soft badge-error">Pending</div>
        </td>
        <td class="text-sm">{{ orderStatus }}</td>
        <td class="text-sm">{{ orderDate }}</td>
        <td>
            <NuxtLink :aria-label="`View order ${id}`" :to="`/apps/ecommerce/orders/${id}`">
                <button :aria-label="`View order ${id}`" class="btn btn-square btn-ghost btn-sm">
                    <span class="iconify lucide--eye text-base-content/80 size-4" />
                </button>
            </NuxtLink>
        </td>
    </tr>
</template>
