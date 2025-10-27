<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";
import { getPaymentProviderBadgeClass } from "~/utils/badgeHelpers";

definePageMeta({
    layout: "admin",
});

const route = useRoute();
const router = useRouter();
const configId = parseInt(route.params.id as string);

// Set page title
const { setPageTitleFromMenu } = useAdminMenu();
setPageTitleFromMenu();

// Fetch payment config detail
const { data: configResponse, pending } = await useAsyncData(
    `payment-config-detail-${configId}`,
    () => {
        return $fetch(`/payment-method-configs/${configId}`, {
            baseURL: useRuntimeConfig().public.apiBase,
            headers: {
                Authorization: `Bearer ${useAuthStore().token}`,
            },
        });
    }
);

const config = computed(() => {
    const response = configResponse.value as any;
    return response?.data || null;
});

const configItems = computed(() => {
    if (!config.value?.configs) return [];
    return Object.entries(config.value.configs).map(([key, value]) => ({
        key,
        value: value as string,
    }));
});

// Use global badge helpers (imported from ~/utils/badgeHelpers)
</script>

<template>
    <div>
        <PageTitle
            :title="config?.name || 'Payment Config Details'"
            :items="[
                { label: 'Settings' },
                { label: 'Payment' },
                { label: 'Payment Configs', to: '/settings/payment-configs' },
                { label: 'Details', active: true },
            ]" />

        <!-- Loading State -->
        <div v-if="pending" class="flex items-center justify-center py-12">
            <span class="loading loading-spinner loading-lg"></span>
        </div>

        <!-- Content -->
        <div v-else-if="config" class="mt-6 space-y-6">
            <!-- Header Card -->
            <div class="card bg-base-100 shadow">
                <div class="card-body">
                    <div class="flex items-start justify-between">
                        <div>
                            <h2 class="text-2xl font-bold">{{ config.name }}</h2>
                            <div class="mt-2 flex items-center gap-2">
                                <span :class="['badge badge-sm badge-outline', getPaymentProviderBadgeClass(config.provider)]">
                                    {{ config.provider }}
                                </span>
                                <span v-if="config.method_count" class="badge badge-sm badge-info">
                                    {{ config.method_count }} method(s)
                                </span>
                            </div>
                            <p v-if="config.description" class="text-base-content/80 mt-3 text-sm">
                                {{ config.description }}
                            </p>
                        </div>
                        <div class="flex gap-2">
                            <NuxtLink
                                :to="`/settings/payment-configs/${config.id}/edit`"
                                class="btn btn-primary btn-sm">
                                <span class="iconify lucide--pencil size-4" />
                                Edit
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Configuration Items -->
            <div class="card bg-base-100 shadow">
                <div class="card-body">
                    <h3 class="card-title text-lg">Configuration Items</h3>
                    <div class="divider my-2"></div>

                    <div v-if="configItems.length > 0" class="space-y-4">
                        <div
                            v-for="item in configItems"
                            :key="item.key"
                            class="flex items-center justify-between border-b border-base-300 pb-3 last:border-0">
                            <div class="flex-1">
                                <label class="text-base-content/60 text-sm font-medium">{{ item.key }}</label>
                                <p class="font-mono text-sm mt-1">{{ item.value }}</p>
                            </div>
                        </div>
                    </div>
                    <p v-else class="text-base-content/60 text-sm italic">No configuration items</p>
                </div>
            </div>

            <!-- Payment Methods Using This Config -->
            <div v-if="config.methods && config.methods.length > 0" class="card bg-base-100 shadow">
                <div class="card-body">
                    <h3 class="card-title text-lg">Payment Methods</h3>
                    <div class="divider my-2"></div>

                    <div class="overflow-x-auto">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Code</th>
                                    <th>Name</th>
                                    <th>Status</th>
                                    <th class="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="method in config.methods" :key="method.id">
                                    <td class="font-mono text-sm">{{ method.code }}</td>
                                    <td>{{ method.name }}</td>
                                    <td>
                                        <span :class="['badge badge-sm', method.is_active ? 'badge-success' : 'badge-error']">
                                            {{ method.is_active ? 'Active' : 'Inactive' }}
                                        </span>
                                    </td>
                                    <td>
                                        <div class="flex justify-end">
                                            <NuxtLink
                                                :to="`/settings/payment-methods/${method.id}/show`"
                                                class="btn btn-ghost btn-xs">
                                                <span class="iconify lucide--eye size-4" />
                                            </NuxtLink>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Metadata -->
            <div class="card bg-base-100 shadow">
                <div class="card-body">
                    <h3 class="card-title text-lg">Metadata</h3>
                    <div class="divider my-2"></div>
                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label class="text-base-content/60 text-sm">Created At</label>
                            <p class="text-sm">{{ new Date(config.created_at).toLocaleString() }}</p>
                        </div>
                        <div>
                            <label class="text-base-content/60 text-sm">Last Updated</label>
                            <p class="text-sm">{{ new Date(config.updated_at).toLocaleString() }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Error State -->
        <div v-else class="flex flex-col items-center justify-center py-12">
            <span class="iconify lucide--alert-circle text-error mb-4 size-16" />
            <p class="text-base-content/60">Payment config not found</p>
            <NuxtLink to="/settings/payment-configs" class="btn btn-primary btn-sm mt-4">
                Back to Payment Configs
            </NuxtLink>
        </div>
    </div>
</template>
