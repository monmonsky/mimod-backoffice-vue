<script setup lang="ts">
// Dashboard Top Products Component
const selectedPeriod = ref<"week" | "month" | "year" | "all">("month");
const { getTopProducts } = useDashboard();

const { data: response, pending } = await getTopProducts(selectedPeriod.value, 10);

const topProducts = computed(() => {
    const products = (response.value as any)?.data?.products;
    return Array.isArray(products) ? products : [];
});

const formatCurrency = (value: number | string) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(Number(value));
};

const formatNumber = (value: number) => {
    return new Intl.NumberFormat("id-ID").format(value);
};

const changePeriod = async (period: "week" | "month" | "year" | "all") => {
    selectedPeriod.value = period;
    const { data } = await getTopProducts(period, 10);
    response.value = data.value;
};

// Calculate max quantity for progress bar scaling
const maxQuantity = computed(() => {
    if (!Array.isArray(topProducts.value) || topProducts.value.length === 0) return 0;
    return Math.max(...topProducts.value.map((p: any) => p.total_sold || 0));
});

// Calculate progress bar width
const getProgressWidth = (quantity: number) => {
    if (maxQuantity.value === 0) return 0;
    return (quantity / maxQuantity.value) * 100;
};
</script>

<template>
    <div class="space-y-4">
        <!-- Period Selector -->
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
                <span class="iconify lucide--crown text-warning size-5" />
                <span class="text-sm font-medium">Best Sellers</span>
            </div>
            <div role="tablist" class="tabs tabs-boxed tabs-sm">
                <button
                    role="tab"
                    :class="['tab', selectedPeriod === 'week' ? 'tab-active' : '']"
                    @click="changePeriod('week')">
                    Week
                </button>
                <button
                    role="tab"
                    :class="['tab', selectedPeriod === 'month' ? 'tab-active' : '']"
                    @click="changePeriod('month')">
                    Month
                </button>
                <button
                    role="tab"
                    :class="['tab', selectedPeriod === 'year' ? 'tab-active' : '']"
                    @click="changePeriod('year')">
                    Year
                </button>
                <button
                    role="tab"
                    :class="['tab', selectedPeriod === 'all' ? 'tab-active' : '']"
                    @click="changePeriod('all')">
                    All
                </button>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="pending" class="flex items-center justify-center py-12">
            <span class="loading loading-spinner loading-md"></span>
        </div>

        <!-- Empty State -->
        <div v-else-if="!topProducts || topProducts.length === 0" class="flex flex-col items-center justify-center py-12">
            <span class="iconify lucide--package-open size-16 mb-3 text-base-content/40" />
            <p class="text-sm font-medium">No product sales yet</p>
            <p class="text-xs text-base-content/60 mt-1">Top selling products will appear here</p>
        </div>

        <!-- Products List -->
        <div v-else class="space-y-3">
            <div
                v-for="(product, index) in topProducts"
                :key="product.id"
                class="flex items-center gap-3 p-3 bg-base-200/30 rounded-lg hover:bg-base-200/50 transition-colors">
                <!-- Rank -->
                <div class="flex items-center justify-center size-8 shrink-0">
                    <div
                        v-if="index < 3"
                        class="flex items-center justify-center size-8 rounded-full font-bold text-sm"
                        :class="{
                            'bg-warning/20 text-warning': index === 0,
                            'bg-base-300 text-base-content': index === 1,
                            'bg-accent/20 text-accent': index === 2,
                        }">
                        {{ index + 1 }}
                    </div>
                    <span v-else class="text-sm text-base-content/60 font-medium">{{ index + 1 }}</span>
                </div>

                <!-- Product Image -->
                <div class="avatar size-12 shrink-0">
                    <div class="rounded-lg overflow-hidden">
                        <img
                            v-if="product.image"
                            :src="product.image"
                            :alt="product.name"
                            class="object-cover w-full h-full" />
                        <div
                            v-else
                            class="bg-secondary/10 flex size-full items-center justify-center">
                            <span class="iconify lucide--package text-secondary size-5" />
                        </div>
                    </div>
                </div>

                <!-- Product Info -->
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium truncate">{{ product.name }}</p>
                    <div class="flex items-center gap-3 mt-1">
                        <!-- Progress Bar -->
                        <div class="flex-1 bg-base-300 rounded-full h-1.5 overflow-hidden">
                            <div
                                class="bg-primary h-full rounded-full transition-all"
                                :style="{ width: `${getProgressWidth(product.total_sold)}%` }"></div>
                        </div>
                    </div>
                </div>

                <!-- Stats -->
                <div class="text-right shrink-0">
                    <p class="text-sm font-bold">{{ formatNumber(product.total_sold) }}</p>
                    <p class="text-xs text-base-content/60">{{ product.total_sold === 1 ? 'sale' : 'sales' }}</p>
                </div>

                <!-- Revenue -->
                <div class="text-right shrink-0 min-w-24">
                    <p class="text-sm font-semibold text-success">{{ formatCurrency(product.total_revenue) }}</p>
                </div>
            </div>
        </div>
    </div>
</template>
