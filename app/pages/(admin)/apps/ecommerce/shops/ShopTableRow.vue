<script setup lang="ts">
export type IShopTableRow = {
    id: number;
    name: string;
    date: string;
    sellerId: number;
    sellerName: string;
    email: string;
    mobileNumber: string;
    verified: boolean;
    ratings: number;
    ratingsCount: number;
    orders: number;
    earning: number;
};

defineProps<IShopTableRow>();

const showDeleteDialog = () => {
    const dialog = document.querySelector<HTMLDialogElement>("#apps-shop-delete");
    dialog?.showModal();
};
</script>
<template>
    <tr class="hover:bg-base-200/40 cursor-pointer *:text-nowrap">
        <th>
            <input aria-label="Single check" type="checkbox" data-slot="single-checkbox" class="checkbox checkbox-sm" />
        </th>
        <td class="font-medium">{{ id }}</td>
        <td class="font-medium">{{ name }}</td>
        <td>{{ sellerName }}</td>
        <td>{{ email }}</td>
        <td>{{ mobileNumber }}</td>
        <td>{{ orders }}</td>
        <td>
            <div class="flex items-center gap-1">
                <span
                    class="iconify lucide--star text-success size-4"
                    :class="{
                        'text-success': ratings > 4,
                        'text-warning': ratings > 3 && ratings <= 4,
                        'text-error': ratings <= 3,
                    }" />
                {{ ratings }}
                <span class="text-base-content/80 text-xs">({{ ratingsCount }})</span>
            </div>
        </td>
        <td>
            <div class="text-sm font-medium">${{ earning }}</div>
        </td>
        <td>
            <span v-if="verified" class="iconify lucide--badge-check text-success size-4.5" />
            <span v-else class="iconify lucide--badge-x text-error size-4.5" />
        </td>
        <td class="text-sm">{{ date }}</td>
        <td>
            <div class="inline-flex w-fit">
                <NuxtLink
                    aria-label="Edit customer link"
                    class="btn btn-square btn-ghost btn-sm"
                    :href="`/apps/ecommerce/shops/${id}`">
                    <span class="iconify lucide--pencil text-base-content/80 size-4" />
                </NuxtLink>
                <button aria-label="Dummy show shop" class="btn btn-square btn-ghost btn-sm">
                    <span class="iconify lucide--eye text-base-content/80 size-4" />
                </button>
                <button
                    aria-label="Dummy delete shop"
                    class="btn btn-square btn-error btn-outline btn-sm border-transparent"
                    @click="showDeleteDialog">
                    <span class="iconify lucide--trash size-4" />
                </button>
            </div>
        </td>
    </tr>
</template>
