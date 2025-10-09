<script lang="ts" setup>
export type ISellerTableRow = {
    id: number;
    image: string;
    name: string;
    date: string;
    shopName: string;
    email: string;
    mobileNumber: string;
    verified: boolean;
    earning: number;
    sales: number;
    gender: "male" | "female";
};

defineProps<ISellerTableRow>();

const openDeleteModal = () => {
    const modal = document.querySelector<HTMLDialogElement>("#apps-seller-delete");
    modal?.showModal();
};
</script>
<template>
    <tr class="hover:bg-base-200/40 cursor-pointer *:text-nowrap">
        <th>
            <input aria-label="Single check" class="checkbox checkbox-sm" type="checkbox" />
        </th>
        <td class="font-medium">{{ id }}</td>
        <td>
            <div class="flex items-center space-x-3 truncate">
                <img alt="Seller Image" class="mask mask-squircle bg-base-200 size-10" :src="image" />
                <div>
                    <p class="font-medium">{{ name }}</p>
                    <p class="text-base-content/60 text-xs capitalize">{{ gender }}</p>
                </div>
            </div>
        </td>
        <td class="font-medium">{{ shopName }}</td>
        <td>{{ email }}</td>
        <td>{{ mobileNumber }}</td>
        <td>{{ sales }}</td>
        <td class="text-sm font-medium">${{ earning }}</td>
        <td>
            <span v-if="verified" class="iconify lucide--badge-check text-success size-4.5" />
            <span v-else class="iconify lucide--badge-x text-error size-4.5" />
        </td>
        <td class="text-sm">{{ date }}</td>
        <td>
            <div class="inline-flex w-fit">
                <NuxtLink
                    aria-label="Edit seller link"
                    class="btn btn-square btn-ghost btn-sm"
                    :href="`/apps/ecommerce/sellers/${id}`">
                    <span class="iconify lucide--pencil text-base-content/80 size-4" />
                </NuxtLink>
                <button aria-label="Dummy show seller" class="btn btn-square btn-ghost btn-sm">
                    <span class="iconify lucide--eye text-base-content/80 size-4" />
                </button>
                <button
                    aria-label="Dummy delete seller"
                    class="btn btn-square btn-error btn-outline btn-sm border-transparent"
                    @click="openDeleteModal">
                    <span class="iconify lucide--trash size-4" />
                </button>
            </div>
        </td>
    </tr>
</template>
