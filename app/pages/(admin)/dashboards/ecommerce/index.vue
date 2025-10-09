<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";

import CustomerAcquisitionCard from "./components/CustomerAcquisitionCard.vue";
import GlobalSaleCard from "./components/GlobalSaleCard.vue";
import QuickChatCard from "./components/QuickChatCard.vue";
import RecentOrderCard from "./components/RecentOrderCard.vue";
import RevenueStatisticCard from "./components/RevenueStatisticCard.vue";
import StatList from "./components/StatList.vue";

definePageMeta({
    layout: "admin",
});
</script>

<template>
    <div>
        <PageTitle title="Business Overview" :items="[{ label: 'Dashboards' }, { label: 'Ecommerce', active: true }]" />
        <div class="mt-6">
            <StatList />
            <div class="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-12">
                <div class="xl:col-span-7">
                    <RevenueStatisticCard />
                </div>
                <div class="xl:col-span-5">
                    <CustomerAcquisitionCard />
                </div>
            </div>
            <div class="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-5 2xl:grid-cols-12">
                <div class="xl:col-span-3 2xl:col-span-5">
                    <RecentOrderCard />
                </div>
                <div class="xl:col-span-2 2xl:col-span-3">
                    <QuickChatCard />
                </div>
                <div class="xl:col-span-3 2xl:col-span-4">
                    <GlobalSaleCard />
                </div>
            </div>
        </div>
    </div>
</template>
