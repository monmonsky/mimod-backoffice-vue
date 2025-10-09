<script setup lang="ts">
export interface IOrderItemsTableRow {
    id: number;
    image: string;
    name: string;
    category: string;
    sku: string;
    price: number;
    quantity: number;
    totalAmount: number;
}

defineProps<IOrderItemsTableRow>();
</script>
<template>
    <tr>
        <th class="font-medium">{{ id }}</th>
        <td>
            <div class="flex items-center space-x-3 truncate">
                <img :src="image" alt="Product" class="rounded-box size-10" />
                <div>
                    <p class="font-medium">{{ name }}</p>
                    <p class="text-base-content/60 text-xs">#{{ sku }}</p>
                </div>
            </div>
        </td>
        <td>{{ category }}</td>
        <td>\${{ price }}</td>
        <td>{{ quantity }}x</td>
        <td class="font-medium">\${{ totalAmount }}</td>
    </tr>
</template>
