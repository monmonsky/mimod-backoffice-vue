<script setup lang="ts">
interface IStatItem {
    title: string;
    amount: string;
    percent: number;
    icon: string;
    selected?: boolean;
}

defineProps<IStatItem>();
</script>
<template>
    <div
        :class="[
            'card bg-base-100 shadow',
            selected && 'from-primary shadow-primary/10 to-primary/85 text-primary-content bg-linear-to-tr shadow-md',
        ]">
        <div class="card-body gap-2 p-4 2xl:p-5">
            <div class="flex items-center gap-3">
                <div :class="['bg-base-200 rounded-box flex items-center p-1.5', selected && 'bg-primary-content/15']">
                    <span :class="`iconify size-4.5 ${icon}`" />
                </div>
                <p class="line-clamp-1 font-medium max-2xl:text-sm">{{ title }}</p>
            </div>
            <div class="mt-5 mb-0.5 flex items-center gap-2 text-sm 2xl:gap-3">
                <p class="text-lg leading-0 font-medium 2xl:text-2xl">{{ amount }}</p>
                <div
                    v-if="percent > 0"
                    :class="[
                        'badge badge-soft badge-success badge-sm gap-0.5 px-1.5',
                        selected && '!bg-primary-content/15 !text-primary-content !border-transparent',
                    ]">
                    <span class="iconify lucide--arrow-up size-3" />
                    {{ percent }}%
                </div>
                <div
                    v-else
                    :class="[
                        'badge badge-soft badge-error badge-sm gap-0.5 px-1.5',
                        selected && '!bg-primary-content/15 !text-primary-content !border-transparent',
                    ]">
                    <span class="iconify lucide--arrow-down size-3" />
                    {{ percent }}%
                </div>
            </div>
        </div>
    </div>
</template>
