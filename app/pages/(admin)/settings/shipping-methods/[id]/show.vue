<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";
import { formatPrice } from "~/utils/formatters";

definePageMeta({
    layout: "admin",
});

const route = useRoute();
const router = useRouter();
const shippingMethodId = parseInt(route.params.id as string);
const { getMediaUrl } = useMediaUrl();

// Set page title
const { setPageTitleFromMenu } = useAdminMenu();
setPageTitleFromMenu();

// Fetch shipping method detail
const { data: shippingMethodResponse, pending } = await useAsyncData(
    `shipping-method-${shippingMethodId}`,
    () => {
        return $fetch(`/shipping-methods/${shippingMethodId}`, {
            baseURL: useRuntimeConfig().public.apiBase,
            headers: {
                Authorization: `Bearer ${useAuthStore().token}`,
            },
        });
    }
);

const shippingMethod = computed(() => {
    const response = shippingMethodResponse.value as any;
    return response?.data || null;
});

// Helper functions
const getTypeLabel = (typeValue: string) => {
    const types: Record<string, string> = {
        manual: "Manual",
        custom: "Custom",
        rajaongkir: "RajaOngkir",
    };
    return types[typeValue] || typeValue;
};
</script>

<template>
    <div>
        <PageTitle
            :title="shippingMethod?.name || 'Shipping Method Details'"
            :items="[
                { label: 'Settings' },
                { label: 'Shipping Methods', to: '/settings/shipping-methods' },
                { label: 'Details', active: true },
            ]" />

        <!-- Loading State -->
        <div v-if="pending" class="flex items-center justify-center py-12">
            <span class="loading loading-spinner loading-lg"></span>
        </div>

        <!-- Content -->
        <div v-else-if="shippingMethod" class="mt-6 space-y-6">
            <!-- Header Card -->
            <div class="card bg-base-100 shadow">
                <div class="card-body">
                    <div class="flex items-start justify-between">
                        <div class="flex items-center gap-4">
                            <div v-if="shippingMethod.logo_url" class="avatar">
                                <div class="mask mask-squircle h-16 w-16">
                                    <img :src="getMediaUrl(shippingMethod.logo_url)" :alt="shippingMethod.name" />
                                </div>
                            </div>
                            <div v-else class="avatar placeholder">
                                <div class="bg-neutral text-neutral-content mask mask-squircle h-16 w-16">
                                    <span class="iconify lucide--truck size-8" />
                                </div>
                            </div>
                            <div>
                                <h2 class="text-2xl font-bold">{{ shippingMethod.name }}</h2>
                                <p class="text-base-content/60 text-sm">{{ shippingMethod.code }}</p>
                                <div class="mt-2">
                                    <span
                                        :class="[
                                            'badge badge-sm',
                                            shippingMethod.is_active ? 'badge-success' : 'badge-error',
                                        ]">
                                        {{ shippingMethod.is_active ? 'Active' : 'Inactive' }}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="flex gap-2">
                            <NuxtLink
                                :to="`/settings/shipping-methods/${shippingMethod.id}/edit`"
                                class="btn btn-primary btn-sm">
                                <span class="iconify lucide--pencil size-4" />
                                Edit
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <!-- Basic Information -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h3 class="card-title text-lg">Basic Information</h3>
                        <div class="divider my-2"></div>
                        <div class="space-y-4">
                            <div>
                                <label class="text-base-content/60 text-sm font-medium">Type</label>
                                <p class="text-base font-semibold mt-1">{{ getTypeLabel(shippingMethod.type) }}</p>
                            </div>
                            <div>
                                <label class="text-base-content/60 text-sm font-medium">Provider</label>
                                <p class="text-base font-semibold mt-1 capitalize">{{ shippingMethod.provider }}</p>
                            </div>
                            <div v-if="shippingMethod.description">
                                <label class="text-base-content/60 text-sm font-medium">Description</label>
                                <p class="text-base mt-1">{{ shippingMethod.description }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Cost & Delivery -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h3 class="card-title text-lg">Cost & Delivery</h3>
                        <div class="divider my-2"></div>
                        <div class="space-y-4">
                            <div>
                                <label class="text-base-content/60 text-sm font-medium">Base Cost</label>
                                <p class="text-base font-semibold mt-1">{{ formatPrice(shippingMethod.base_cost || 0) }}</p>
                            </div>
                            <div v-if="shippingMethod.cost_per_kg > 0">
                                <label class="text-base-content/60 text-sm font-medium">Cost per KG</label>
                                <p class="text-base font-semibold mt-1">{{ formatPrice(shippingMethod.cost_per_kg) }}</p>
                            </div>
                            <div>
                                <label class="text-base-content/60 text-sm font-medium">Estimated Delivery</label>
                                <p class="text-base font-semibold mt-1">{{ shippingMethod.estimated_delivery || '-' }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Weight Limits -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h3 class="card-title text-lg">Weight Limits</h3>
                        <div class="divider my-2"></div>
                        <div class="space-y-4">
                            <div>
                                <label class="text-base-content/60 text-sm font-medium">Minimum Weight</label>
                                <p class="text-base font-semibold mt-1">
                                    {{ shippingMethod.min_weight ? `${shippingMethod.min_weight} kg` : 'No limit' }}
                                </p>
                            </div>
                            <div>
                                <label class="text-base-content/60 text-sm font-medium">Maximum Weight</label>
                                <p class="text-base font-semibold mt-1">
                                    {{ shippingMethod.max_weight ? `${shippingMethod.max_weight} kg` : 'No limit' }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Other Settings -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h3 class="card-title text-lg">Other Settings</h3>
                        <div class="divider my-2"></div>
                        <div class="space-y-4">
                            <div>
                                <label class="text-base-content/60 text-sm font-medium">Sort Order</label>
                                <p class="text-base font-semibold mt-1">{{ shippingMethod.sort_order || 0 }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Shipping Instructions -->
            <div v-if="shippingMethod.instructions" class="card bg-base-100 shadow">
                <div class="card-body">
                    <h3 class="card-title text-lg">Shipping Instructions</h3>
                    <div class="divider my-2"></div>
                    <div class="prose max-w-none" v-html="shippingMethod.instructions"></div>
                </div>
            </div>

            <!-- Metadata -->
            <div class="card bg-base-100 shadow">
                <div class="card-body">
                    <h3 class="card-title text-lg">Metadata</h3>
                    <div class="divider my-2"></div>
                    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label class="text-base-content/60 text-sm font-medium">Created At</label>
                            <p class="text-base mt-1">{{ new Date(shippingMethod.created_at).toLocaleString() }}</p>
                        </div>
                        <div>
                            <label class="text-base-content/60 text-sm font-medium">Updated At</label>
                            <p class="text-base mt-1">{{ new Date(shippingMethod.updated_at).toLocaleString() }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Not Found -->
        <div v-else class="flex flex-col items-center justify-center py-12">
            <span class="iconify lucide--alert-circle text-base-content/30 mb-4 size-16" />
            <p class="text-base-content/60 mb-4">Shipping method not found</p>
            <NuxtLink to="/settings/shipping-methods" class="btn btn-primary btn-sm">
                <span class="iconify lucide--arrow-left size-4" />
                Back to List
            </NuxtLink>
        </div>
    </div>
</template>
