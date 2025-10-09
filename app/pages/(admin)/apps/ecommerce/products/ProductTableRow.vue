<script setup lang="ts">
export type IProductTableRow = {
    id: number;
    image: string;
    name: string;
    sku: string;
    category: string;
    price: number;
    ratings: number;
    ratingsCount: number;
    stock: number;
    createdAt: string;
    orders: number;
};

defineProps<IProductTableRow>();

const showDeleteModal = () => {
    const modal = document.querySelector<HTMLDialogElement>("#apps-product-delete");
    if (modal) modal.showModal();
};
</script>
<template>
    <tr class="hover:bg-base-200/40 cursor-pointer *:text-nowrap">
        <th>
            <input aria-label="Single check" type="checkbox" class="checkbox checkbox-sm" />
        </th>
        <td>{{ id }}</td>
        <td>
            <div class="flex items-center space-x-3 truncate">
                <img alt="Product" class="rounded-box size-10" :src="image" />
                <div>
                    <p class="font-medium">{{ name }}</p>
                    <p class="text-base-content/60 text-xs">#{{ sku }}</p>
                </div>
            </div>
        </td>
        <td>{{ category }}</td>
        <td class="text-sm font-medium">${{ price }}</td>
        <td>
            <div class="flex items-center gap-2">
                <span
                    :class="[
                        'iconify lucide--star text-success size-4',
                        ratings > 4 ? 'text-success' : ratings > 3 ? 'text-warning' : 'text-error',
                    ]" />
                {{ ratings }}
                <span class="text-base-content/60 text-xs">({{ ratingsCount }})</span>
            </div>
        </td>
        <td>{{ orders }}</td>
        <td>
            <span v-if="stock > 10" class="text-success">Available</span>
            <span v-else-if="stock > 0" class="text-warning">Low</span>
            <span v-else class="text-error">Out of stock</span>
        </td>
        <td class="text-sm">{{ createdAt }}</td>
        <td>
            <div class="inline-flex">
                <NuxtLink
                    :href="`/apps/ecommerce/products/${id}`"
                    aria-label="Edit product link"
                    class="btn btn-square btn-ghost btn-sm">
                    <span class="iconify lucide--pencil text-base-content/80 size-4" />
                </NuxtLink>
                <button aria-label="Dummy show product" class="btn btn-square btn-ghost btn-sm">
                    <span class="iconify lucide--eye text-base-content/80 size-4" />
                </button>
                <button
                    aria-label="Dummy delete product"
                    class="btn btn-square btn-error btn-outline btn-sm border-transparent"
                    @click="showDeleteModal">
                    <span class="iconify lucide--trash size-4" />
                </button>
            </div>
        </td>
    </tr>
</template>
