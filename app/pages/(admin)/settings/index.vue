<script setup lang="ts">
import SettingsGeneral from "./SettingsGeneral.vue";
import SettingsStore from "./SettingsStore.vue";
import SettingsEmail from "./SettingsEmail.vue";
import SettingsSeo from "./SettingsSeo.vue";

definePageMeta({
    layout: "admin",
    middleware: "auth",
});

// Set page title from admin menu
const { setPageTitleFromMenu } = useAdminMenu();
setPageTitleFromMenu();

const route = useRoute();
const router = useRouter();

const activeTab = computed(() => {
    const tab = route.query.tab as string;
    return tab || "general";
});

const tabs = [
    { key: "general", label: "General", icon: "lucide--settings" },
    { key: "store", label: "Store", icon: "lucide--store" },
    { key: "email", label: "Email", icon: "lucide--mail" },
    { key: "seo", label: "SEO", icon: "lucide--search" },
];

const changeTab = (tab: string) => {
    router.push({ query: { tab } });
};
</script>

<template>
    <div class="space-y-6 p-6">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold">Settings</h1>
                <p class="text-base-content/60 mt-1 text-sm">Manage your application settings</p>
            </div>
        </div>

        <!-- Tabs -->
        <div class="card bg-base-100 shadow">
            <div class="border-b border-base-300">
                <div role="tablist" class="tabs tabs-bordered">
                    <button
                        v-for="tab in tabs"
                        :key="tab.key"
                        role="tab"
                        :class="['tab gap-2', activeTab === tab.key && 'tab-active']"
                        @click="changeTab(tab.key)">
                        <span :class="`iconify ${tab.icon} size-4`" />
                        {{ tab.label }}
                    </button>
                </div>
            </div>

            <!-- Tab Content -->
            <div class="card-body">
                <SettingsGeneral v-if="activeTab === 'general'" />
                <SettingsStore v-else-if="activeTab === 'store'" />
                <SettingsEmail v-else-if="activeTab === 'email'" />
                <SettingsSeo v-else-if="activeTab === 'seo'" />
            </div>
        </div>
    </div>
</template>
