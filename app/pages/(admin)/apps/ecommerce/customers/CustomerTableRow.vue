<script lang="ts" setup>
export type ICustomerTableRow = {
    id: number;
    image: string;
    name: string;
    date: string;
    email: string;
    mobileNumber: string;
    verified: boolean;
    spend: number;
    purchases: number;
    gender: "male" | "female";
};

defineProps<ICustomerTableRow>();

const openDeleteDialog = () => {
    const dialog = document.querySelector<HTMLDialogElement>("#apps-customer-delete");
    dialog?.showModal();
};
</script>

<template>
    <tr class="hover:bg-base-200/40 cursor-pointer *:text-nowrap">
        <th>
            <input aria-label="Single check" type="checkbox" class="checkbox checkbox-sm" />
        </th>
        <td class="font-medium">{{ id }}</td>
        <td>
            <div class="flex items-center space-x-3 truncate">
                <img alt="Product" class="mask mask-squircle bg-base-200 size-10" :src="image" />
                <div>
                    <p class="font-medium">{{ name }}</p>
                    <p class="text-base-content/80 text-xs capitalize">{{ gender }}</p>
                </div>
            </div>
        </td>
        <td>{{ email }}</td>
        <td>{{ mobileNumber }}</td>
        <td>{{ purchases }}</td>
        <td class="text-sm font-medium">${{ spend }}</td>
        <td>
            <span v-if="verified">
                <span class="iconify lucide--badge-check text-success size-4.5" />
            </span>
            <span v-else>
                <span class="iconify lucide--badge-x text-error size-4.5" />
            </span>
        </td>
        <td class="text-sm">{{ date }}</td>
        <td>
            <div class="inline-flex w-fit">
                <NuxtLink
                    aria-label="Edit customer link"
                    class="btn btn-square btn-ghost btn-sm"
                    :href="`/apps/ecommerce/customers/${id}`">
                    <span class="iconify lucide--pencil text-base-content/80 size-4" />
                </NuxtLink>
                <button aria-label="Dummy show customer" class="btn btn-square btn-ghost btn-sm">
                    <span class="iconify lucide--eye text-base-content/80 size-4" />
                </button>
                <button
                    aria-label="Dummy delete customer"
                    class="btn btn-square btn-error btn-outline btn-sm border-transparent"
                    @click="openDeleteDialog">
                    <span class="iconify lucide--trash size-4" />
                </button>
            </div>
        </td>
    </tr>
</template>
