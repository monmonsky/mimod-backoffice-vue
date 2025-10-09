<script setup lang="ts">
import { ref } from "vue";

type IStatItem = {
    title: string;
    amount: string;
    percent: number;
    icon: string;
    selected?: boolean;
};

const statItems: IStatItem[] = [
    {
        title: "Customers",
        amount: "4,235",
        percent: 8.04,
        icon: "lucide--users",
    },
    {
        title: "Revenue",
        amount: "$75,400",
        percent: 15.3,
        icon: "lucide--dollar-sign",
    },
    {
        title: "Closed Deals",
        amount: "574",
        percent: -2.4,
        icon: "lucide--handshake",
    },
    {
        title: "Satisfaction",
        amount: "93%",
        percent: 2.3,
        icon: "lucide--smile",
    },
];

const selected = ref<IStatItem>(statItems[1]);
</script>

<template>
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 2xl:grid-cols-4">
        <div
            v-for="(statItem, index) in statItems"
            :key="index"
            :class="[
                'card cursor-pointer bg-linear-to-tr shadow',
                statItem === selected
                    ? 'shadow-primary/10 to-primary/75 text-primary-content from-primary'
                    : 'to-base-100 from-base-100',
            ]"
            @click="selected = statItem">
            <div class="card-body gap-2 p-3 2xl:p-4">
                <div class="flex items-center gap-3">
                    <div
                        :class="[
                            'bg-base-200 rounded-box flex items-center p-1.5',
                            statItem === selected && 'bg-primary-content/15',
                        ]">
                        <span :class="`iconify size-4.5 ${statItem.icon}`" />
                    </div>
                    <p class="line-clamp-1 font-medium max-2xl:text-sm">
                        {{ statItem.title }}
                    </p>
                </div>

                <div class="mt-5 mb-0.5 flex items-center gap-2 text-sm 2xl:gap-3">
                    <p class="text-lg leading-0 font-medium 2xl:text-2xl">
                        {{ statItem.amount }}
                    </p>
                    <div
                        v-if="statItem.percent > 0"
                        :class="[
                            'badge badge-soft badge-success badge-sm gap-0.5 px-1.5',
                            statItem === selected && '!bg-primary-content/15 !text-primary-content !border-transparent',
                        ]">
                        <span class="iconify lucide--arrow-up size-3" />
                        {{ statItem.percent }}%
                    </div>
                    <div
                        v-else
                        :class="[
                            'badge badge-soft badge-error badge-sm gap-0.5 px-1.5',
                            statItem === selected && '!bg-primary-content/15 !text-primary-content !border-transparent',
                        ]">
                        <span class="iconify lucide--arrow-down size-3" />
                        {{ statItem.percent }}%
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
