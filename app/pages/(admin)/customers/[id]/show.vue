<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";
import CustomerOrderHistory from "./CustomerOrderHistory.vue";
import { getStatusBadgeClass, getCustomerSegmentBadgeClass } from "~/utils/statusHelpers";

definePageMeta({
    layout: "admin",
});

const route = useRoute();
const customerId = parseInt(route.params.id as string);

const { getCustomer } = useCustomers();
const { data: customerResponse, pending } = getCustomer(customerId);

const customer = computed(() => {
    const response = customerResponse.value as any;
    // Try different response structures
    return response?.data?.customer || response?.data || null;
});

// Parse preferences JSON
const preferences = computed(() => {
    try {
        return JSON.parse(customer.value?.preferences || "{}");
    } catch {
        return {};
    }
});
</script>

<template>
    <div>
        <PageTitle
            :title="customer?.name || 'Customer Detail'"
            :items="[{ label: 'Customers' }, { label: 'Detail', active: true }]">
            <template #actions>
                <NuxtLink :href="`/customers/${customerId}/edit`" class="btn btn-primary btn-sm">
                    <span class="iconify lucide--pencil size-4" />
                    Edit
                </NuxtLink>
            </template>
        </PageTitle>

        <div v-if="pending" class="mt-6 flex items-center justify-center py-12">
            <span class="loading loading-spinner loading-lg"></span>
        </div>

        <div v-else-if="customer" class="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
            <!-- Left Column - Customer Info -->
            <div class="lg:col-span-2 space-y-5">
                <!-- Basic Information -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h3 class="card-title">Basic Information</h3>
                        <div class="grid gap-4 md:grid-cols-2">
                            <div>
                                <label class="text-base-content/60 text-sm">Customer Code</label>
                                <p class="font-mono font-medium">{{ customer.customer_code }}</p>
                            </div>
                            <div>
                                <label class="text-base-content/60 text-sm">Full Name</label>
                                <p class="font-medium">{{ customer.name }}</p>
                            </div>
                            <div>
                                <label class="text-base-content/60 text-sm">Email</label>
                                <p>{{ customer.email }}</p>
                            </div>
                            <div>
                                <label class="text-base-content/60 text-sm">Phone</label>
                                <p>{{ customer.phone || "-" }}</p>
                            </div>
                            <div>
                                <label class="text-base-content/60 text-sm">Date of Birth</label>
                                <p>{{ customer.date_of_birth ? formatDate(customer.date_of_birth, 'long') : "-" }}</p>
                            </div>
                            <div>
                                <label class="text-base-content/60 text-sm">Gender</label>
                                <p class="capitalize">{{ customer.gender }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Customer Segment & Status -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h3 class="card-title">Customer Segment</h3>
                        <div class="grid gap-4 md:grid-cols-2">
                            <div>
                                <label class="text-base-content/60 text-sm">Segment</label>
                                <div class="mt-1">
                                    <span :class="getCustomerSegmentBadgeClass(customer.segment)">
                                        {{ capitalize(customer.segment) }}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label class="text-base-content/60 text-sm">VIP Status</label>
                                <div class="mt-1">
                                    <span v-if="customer.is_vip" class="badge badge-warning">
                                        <span class="iconify lucide--crown size-3" />
                                        VIP Customer
                                    </span>
                                    <span v-else class="text-base-content/60">Regular Customer</span>
                                </div>
                            </div>
                            <div>
                                <label class="text-base-content/60 text-sm">Loyalty Points</label>
                                <p class="font-medium text-primary">{{ formatNumber(customer.loyalty_points) }} pts</p>
                            </div>
                            <div>
                                <label class="text-base-content/60 text-sm">Account Status</label>
                                <div class="mt-1">
                                    <span :class="getStatusBadgeClass(customer.status)">
                                        {{ capitalize(customer.status) }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Preferences -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h3 class="card-title">Preferences</h3>
                        <div class="space-y-2">
                            <div class="flex items-center justify-between">
                                <span>Newsletter</span>
                                <span class="badge" :class="preferences.newsletter ? 'badge-success' : 'badge-ghost'">
                                    {{ preferences.newsletter ? 'Subscribed' : 'Not Subscribed' }}
                                </span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span>SMS Notifications</span>
                                <span class="badge" :class="preferences.sms_notifications ? 'badge-success' : 'badge-ghost'">
                                    {{ preferences.sms_notifications ? 'Enabled' : 'Disabled' }}
                                </span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span>Email Notifications</span>
                                <span class="badge" :class="preferences.email_notifications ? 'badge-success' : 'badge-ghost'">
                                    {{ preferences.email_notifications ? 'Enabled' : 'Disabled' }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Notes -->
                <div v-if="customer.notes" class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h3 class="card-title">Notes</h3>
                        <p class="text-base-content/80">{{ customer.notes }}</p>
                    </div>
                </div>
            </div>

            <!-- Right Column - Statistics -->
            <div class="space-y-5">
                <!-- Order Statistics -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h3 class="card-title">Order Statistics</h3>
                        <div class="space-y-4">
                            <div>
                                <label class="text-base-content/60 text-sm">Total Orders</label>
                                <p class="text-2xl font-bold">{{ customer.total_orders }}</p>
                            </div>
                            <div>
                                <label class="text-base-content/60 text-sm">Total Spent</label>
                                <p class="text-2xl font-bold text-success">{{ formatPrice(customer.total_spent) }}</p>
                            </div>
                            <div>
                                <label class="text-base-content/60 text-sm">Average Order Value</label>
                                <p class="text-xl font-bold">{{ formatPrice(customer.average_order_value) }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Activity -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h3 class="card-title">Activity</h3>
                        <div class="space-y-3">
                            <div>
                                <label class="text-base-content/60 text-sm">Last Order</label>
                                <p class="text-sm">
                                    {{ customer.last_order_at ? formatDate(customer.last_order_at, 'datetime') : 'Never' }}
                                </p>
                            </div>
                            <div>
                                <label class="text-base-content/60 text-sm">Last Login</label>
                                <p class="text-sm">
                                    {{ customer.last_login_at ? formatDate(customer.last_login_at, 'datetime') : 'Never' }}
                                </p>
                            </div>
                            <div>
                                <label class="text-base-content/60 text-sm">Email Verified</label>
                                <p class="text-sm">
                                    {{ customer.email_verified_at ? formatDate(customer.email_verified_at, 'datetime') : 'Not Verified' }}
                                </p>
                            </div>
                            <div>
                                <label class="text-base-content/60 text-sm">Member Since</label>
                                <p class="text-sm">{{ formatDate(customer.created_at, 'long') }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Order History Component -->
        <div v-if="customer" class="mt-6">
            <CustomerOrderHistory :customer-id="customerId" />
        </div>
    </div>
</template>
