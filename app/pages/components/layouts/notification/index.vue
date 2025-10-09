<script setup lang="ts">
import BasicNotificationDemo from "./BasicNotificationDemo.vue";
import DrawerNotificationDemo from "./DrawerNotificationDemo.vue";
import TabNotificationDemo from "./TabNotificationDemo.vue";

definePageMeta({
    layout: "components",
});
</script>

<template>
    <div>
        <ComponentPageTitle
            label="Layouts"
            title="Notification"
            description="Simple, clean notifications with tabs, drawers, and basic styles to suit any modern interface" />
        <p class="text-base-content/60 mt-6 font-medium lg:mt-12">Demos</p>

        <div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div class="card bg-base-100 card-border">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Basic</div>
                <div class="flex items-center justify-center p-6">
                    <BasicNotificationDemo />
                </div>
            </div>
            <div class="card bg-base-100 card-border">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Tab</div>
                <div class="flex items-center justify-center p-6">
                    <TabNotificationDemo />
                </div>
            </div>
            <div class="card bg-base-100 card-border">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Drawer</div>
                <div class="flex items-center justify-center p-6">
                    <DrawerNotificationDemo />
                </div>
            </div>
        </div>
    </div>
</template>
