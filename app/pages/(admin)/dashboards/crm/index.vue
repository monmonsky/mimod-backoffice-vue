<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";

import CustomerDealsCard from "./components/CustomerDealsCard.vue";
import GoalStatusCard from "./components/GoalStatusCard.vue";
import PremiumCard from "./components/PremiumCard.vue";
import QuickIntegrationCard from "./components/QuickIntegrationCard.vue";
import SalesMetricCard from "./components/SalesMetricCard.vue";
import SocialAcquisitionCard from "./components/SocialAcquisitionCard.vue";
import StatList from "./components/StatList.vue";

definePageMeta({
    layout: "admin",
});
</script>
<template>
    <div>
        <PageTitle title="CRM Overview" :items="[{ label: 'Dashboards' }, { label: 'CRM', active: true }]" />
        <div class="mt-6">
            <div class="grid grid-cols-12 gap-5">
                <div class="col-span-12 md:col-span-4 xl:col-span-2">
                    <StatList />
                </div>
                <div class="col-span-12 md:col-span-8 xl:col-span-7">
                    <SalesMetricCard />
                </div>
                <div class="col-span-12 xl:col-span-3">
                    <div class="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-1">
                        <div class="col-span-1">
                            <PremiumCard />
                        </div>
                        <div class="col-span-1">
                            <GoalStatusCard />
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2 2xl:grid-cols-3">
                <div class="col-span-1">
                    <SocialAcquisitionCard />
                </div>
                <div class="col-span-1">
                    <CustomerDealsCard />
                </div>
                <div class="col-span-1">
                    <QuickIntegrationCard />
                </div>
            </div>
        </div>
    </div>
</template>
