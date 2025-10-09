<script setup lang="ts">
import GlobalTrendsCard from "./components/GlobalTrendsCard.vue";
import ModalOverview from "./components/ModalOverview.vue";
import ModalsCard from "./components/ModalsCard.vue";
import RecentTasksCard from "./components/RecentTasksCard.vue";
import ResourceUtilizationCard from "./components/ResourceUtilizationCard.vue";
import StatusCard from "./components/StatusCard.vue";
import TitleWidget from "./components/TitleWidget.vue";
import UsageStats from "./components/UsageStats.vue";

definePageMeta({
    layout: "admin",
});
</script>

<template>
    <div>
        <TitleWidget />
        <div class="mt-6">
            <UsageStats />
        </div>

        <div class="mt-6 grid grid-cols-12 gap-6">
            <div class="col-span-12 xl:col-span-6 2xl:col-span-7">
                <ModalOverview />
            </div>
            <div class="col-span-12 xl:col-span-6 2xl:col-span-5">
                <div class="space-y-6">
                    <StatusCard />
                    <ModalsCard />
                </div>
            </div>
        </div>

        <div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-12">
            <div class="2xl:col-span-3">
                <GlobalTrendsCard />
            </div>
            <div class="max-2xl:order-2 lg:col-span-2 2xl:col-span-5">
                <RecentTasksCard />
            </div>
            <div class="max-2xl:order-1 2xl:col-span-4">
                <ResourceUtilizationCard />
            </div>
        </div>
    </div>
</template>
