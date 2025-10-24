<script setup lang="ts">
import PaymentsMidtrans from "./Midtrans.vue";
import PaymentsBankTransfer from "./BankTransfer.vue";
import PaymentsCod from "./Cod.vue";
import PaymentsTax from "./Tax.vue";

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
    return tab || "midtrans";
});

const tabs = [
    { key: "midtrans", label: "Midtrans", icon: "lucide--credit-card" },
    { key: "bank-transfer", label: "Bank Transfer", icon: "lucide--building-2" },
    { key: "cod", label: "COD", icon: "lucide--banknote" },
    { key: "tax", label: "Tax", icon: "lucide--receipt" },
];

const changeTab = (tab: string) => {
    router.push({ query: { tab } });
};
</script>

<template>
    <div class="space-y-6 p-6">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold">Payment Settings</h1>
                <p class="text-base-content/60 mt-1 text-sm">Configure payment gateways and methods</p>
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
                <PaymentsMidtrans v-if="activeTab === 'midtrans'" />
                <PaymentsBankTransfer v-else-if="activeTab === 'bank-transfer'" />
                <PaymentsCod v-else-if="activeTab === 'cod'" />
                <PaymentsTax v-else-if="activeTab === 'tax'" />
            </div>
        </div>
    </div>
</template>
