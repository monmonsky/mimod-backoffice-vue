<script setup lang="ts">
import AccountListMenuDemo from "./AccountListMenuDemo.vue";
import DrawerMenuDemo from "./DrawerMenuDemo.vue";
import MinimalMenuDemo from "./MinimalMenuDemo.vue";
import NestedMenuDemo from "./NestedMenuDemo.vue";
import ProfileOverlayMenuDemo from "./ProfileOverlayMenuDemo.vue";
import ReferralMenuDemo from "./ReferralMenuDemo.vue";
import SplitMenuDemo from "./SplitMenuDemo.vue";
import SwitchAccountMenuDemo from "./SwitchAccountMenuDemo.vue";
import UsageStatsMenuDemo from "./UsageStatsMenuDemo.vue";

definePageMeta({
    layout: "components",
});
</script>

<template>
    <div>
        <ComponentPageTitle
            label="Layouts"
            title="Profile Menu"
            description="Clean profile menus with support for account switching, nested items, overlays, stats, and actions" />

        <p class="text-base-content/60 mt-6 font-medium lg:mt-12">Demos</p>

        <div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:pb-16">
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Minimal</div>
                <div class="flex items-center justify-center p-6">
                    <MinimalMenuDemo />
                </div>
            </div>
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Switch Account</div>
                <div class="flex items-center justify-center p-6">
                    <SwitchAccountMenuDemo />
                </div>
            </div>
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Profile Overlay</div>
                <div class="flex items-center justify-center p-6">
                    <ProfileOverlayMenuDemo />
                </div>
            </div>
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Referral</div>
                <div class="flex items-center justify-center p-6">
                    <ReferralMenuDemo />
                </div>
            </div>
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Account List</div>
                <div class="flex items-center justify-center p-6">
                    <AccountListMenuDemo />
                </div>
            </div>

            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Nested</div>
                <div class="flex items-center justify-center p-6">
                    <NestedMenuDemo />
                </div>
            </div>
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Split</div>
                <div class="flex items-center justify-center p-6">
                    <SplitMenuDemo />
                </div>
            </div>
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Usage Stats</div>
                <div class="flex items-center justify-center p-6">
                    <UsageStatsMenuDemo />
                </div>
            </div>
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Drawer</div>
                <div class="flex items-center justify-center p-6">
                    <DrawerMenuDemo />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
