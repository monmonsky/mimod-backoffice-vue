<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";
import { formatPrice } from "~/utils/formatters";

definePageMeta({
    layout: "admin",
});

const route = useRoute();
const router = useRouter();
const paymentMethodId = parseInt(route.params.id as string);
const { getMediaUrl } = useMediaUrl();

// Set page title
const { setPageTitleFromMenu } = useAdminMenu();
setPageTitleFromMenu();

// Fetch payment method detail
const { data: paymentMethodResponse, pending } = await useAsyncData(
    `payment-method-${paymentMethodId}`,
    () => {
        return $fetch(`/payment-methods/${paymentMethodId}`, {
            baseURL: useRuntimeConfig().public.apiBase,
            headers: {
                Authorization: `Bearer ${useAuthStore().token}`,
            },
        });
    }
);

const paymentMethod = computed(() => {
    const response = paymentMethodResponse.value as any;
    return response?.data || null;
});

// Helper functions
const getTypeLabel = (typeValue: string) => {
    const types: Record<string, string> = {
        bank_transfer: "Bank Transfer",
        virtual_account: "Virtual Account",
        e_wallet: "E-Wallet",
        qris: "QRIS",
        credit_card: "Credit Card",
        cod: "Cash on Delivery",
    };
    return types[typeValue] || typeValue;
};

const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''}${mins > 0 ? ` ${mins} min` : ''}`;
    }
    return `${mins} minutes`;
};
</script>

<template>
    <div>
        <PageTitle
            :title="paymentMethod?.name || 'Payment Method Details'"
            :items="[
                { label: 'Settings' },
                { label: 'Payment Methods', to: '/settings/payment-methods' },
                { label: 'Details', active: true },
            ]" />

        <!-- Loading State -->
        <div v-if="pending" class="flex items-center justify-center py-12">
            <span class="loading loading-spinner loading-lg"></span>
        </div>

        <!-- Content -->
        <div v-else-if="paymentMethod" class="mt-6 space-y-6">
            <!-- Header Card -->
            <div class="card bg-base-100 shadow">
                <div class="card-body">
                    <div class="flex items-start justify-between">
                        <div class="flex items-center gap-4">
                            <div v-if="paymentMethod.logo_url" class="avatar">
                                <div class="mask mask-squircle h-16 w-16">
                                    <img :src="getMediaUrl(paymentMethod.logo_url)" :alt="paymentMethod.name" />
                                </div>
                            </div>
                            <div v-else class="avatar placeholder">
                                <div class="bg-neutral text-neutral-content mask mask-squircle h-16 w-16">
                                    <span class="iconify lucide--credit-card size-8" />
                                </div>
                            </div>
                            <div>
                                <h2 class="text-2xl font-bold">{{ paymentMethod.name }}</h2>
                                <p class="text-base-content/60 text-sm">{{ paymentMethod.code }}</p>
                                <div class="mt-2">
                                    <span
                                        :class="[
                                            'badge badge-sm',
                                            paymentMethod.is_active ? 'badge-success' : 'badge-error',
                                        ]">
                                        {{ paymentMethod.is_active ? 'Active' : 'Inactive' }}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="flex gap-2">
                            <NuxtLink
                                :to="`/settings/payment-methods/${paymentMethod.id}/edit`"
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
                                <label class="text-base-content/60 text-sm">Payment Type</label>
                                <p class="font-medium">{{ getTypeLabel(paymentMethod.type) }}</p>
                            </div>
                            <div>
                                <label class="text-base-content/60 text-sm">Provider</label>
                                <p class="font-medium capitalize">{{ paymentMethod.provider }}</p>
                            </div>
                            <div>
                                <label class="text-base-content/60 text-sm">Sort Order</label>
                                <p class="font-medium">{{ paymentMethod.sort_order }}</p>
                            </div>
                            <div v-if="paymentMethod.description">
                                <label class="text-base-content/60 text-sm">Description</label>
                                <p class="text-sm">{{ paymentMethod.description }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Fee Configuration -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h3 class="card-title text-lg">Fee Configuration</h3>
                        <div class="divider my-2"></div>
                        <div class="space-y-4">
                            <div>
                                <label class="text-base-content/60 text-sm">Percentage Fee</label>
                                <p class="font-medium">{{ paymentMethod.fee_percentage }}%</p>
                            </div>
                            <div>
                                <label class="text-base-content/60 text-sm">Fixed Fee</label>
                                <p class="font-medium">{{ formatPrice(paymentMethod.fee_fixed) }}</p>
                            </div>
                            <div>
                                <label class="text-base-content/60 text-sm">Total Fee Example (Rp 100,000)</label>
                                <p class="font-medium text-primary">
                                    {{
                                        formatPrice(
                                            (100000 * paymentMethod.fee_percentage) / 100 + paymentMethod.fee_fixed
                                        )
                                    }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Amount Limits -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h3 class="card-title text-lg">Amount Limits</h3>
                        <div class="divider my-2"></div>
                        <div class="space-y-4">
                            <div>
                                <label class="text-base-content/60 text-sm">Minimum Amount</label>
                                <p class="font-medium">
                                    {{ paymentMethod.min_amount ? formatPrice(paymentMethod.min_amount) : 'No limit' }}
                                </p>
                            </div>
                            <div>
                                <label class="text-base-content/60 text-sm">Maximum Amount</label>
                                <p class="font-medium">
                                    {{ paymentMethod.max_amount ? formatPrice(paymentMethod.max_amount) : 'No limit' }}
                                </p>
                            </div>
                            <div>
                                <label class="text-base-content/60 text-sm">Expiration Duration</label>
                                <p class="font-medium">
                                    {{ paymentMethod.expired_duration ? formatDuration(paymentMethod.expired_duration) : 'Not set' }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Payment Instructions -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h3 class="card-title text-lg">Payment Instructions</h3>
                        <div class="divider my-2"></div>
                        <div v-if="paymentMethod.instructions" class="prose prose-sm max-w-none">
                            <div v-html="paymentMethod.instructions"></div>
                        </div>
                        <p v-else class="text-base-content/60 text-sm italic">No instructions provided</p>
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
                            <p class="text-sm">{{ new Date(paymentMethod.created_at).toLocaleString() }}</p>
                        </div>
                        <div>
                            <label class="text-base-content/60 text-sm">Last Updated</label>
                            <p class="text-sm">{{ new Date(paymentMethod.updated_at).toLocaleString() }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Error State -->
        <div v-else class="flex flex-col items-center justify-center py-12">
            <span class="iconify lucide--alert-circle text-error mb-4 size-16" />
            <p class="text-base-content/60">Payment method not found</p>
            <NuxtLink to="/settings/payment-methods" class="btn btn-primary btn-sm mt-4">
                Back to Payment Methods
            </NuxtLink>
        </div>
    </div>
</template>
