<script setup lang="ts">
import ShippingsRajaongkir from "./Rajaongkir.vue";
import ShippingsOrigin from "./Origin.vue";
import ShippingsMethods from "./Methods.vue";

definePageMeta({
    layout: "admin",
    middleware: "auth",
});

const route = useRoute();
const router = useRouter();

const activeTab = computed(() => {
    const tab = route.query.tab as string;
    return tab || "rajaongkir";
});

const tabs = [
    { key: "rajaongkir", label: "RajaOngkir", icon: "lucide--truck" },
    { key: "origin", label: "Shipping Origin", icon: "lucide--warehouse" },
    { key: "methods", label: "Other Methods", icon: "lucide--package" },
];

const changeTab = (tab: string) => {
    router.push({ query: { tab } });
};
</script>

<template>
    <div class="space-y-6 p-6">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold">Shipping Settings</h1>
                <p class="text-base-content/60 mt-1 text-sm">Configure shipping methods and origins</p>
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
                <ShippingsRajaongkir v-if="activeTab === 'rajaongkir'" />
                <ShippingsOrigin v-else-if="activeTab === 'origin'" />
                <ShippingsMethods v-else-if="activeTab === 'methods'" />
            </div>
        </div>
    </div>
</template>
