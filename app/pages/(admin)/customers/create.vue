<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";

definePageMeta({
    layout: "admin",
});

const { createCustomer } = useCustomers();
const { success, error: showError } = useToast();

const form = ref({
    name: "",
    email: "",
    phone: "",
    password: "",
    date_of_birth: "",
    gender: "male" as "male" | "female" | "other",
    segment: "standard" as "premium" | "standard" | "basic",
    is_vip: false,
    status: "active" as "active" | "inactive" | "suspended",
    preferences: {
        newsletter: true,
        sms_notifications: true,
        email_notifications: false,
    },
    notes: "",
});

const loading = ref(false);

const handleSubmit = async () => {
    try {
        loading.value = true;

        // Prepare data
        const data = {
            ...form.value,
            preferences: JSON.stringify(form.value.preferences),
        };

        console.log("=== DEBUG CREATE CUSTOMER ===");
        console.log("Form Data:", JSON.stringify(data, null, 2));
        console.log("============================");

        await createCustomer(data);
        success("Customer created successfully!");

        await navigateTo("/customers");
    } catch (err: any) {
        console.error("=== ERROR CREATE CUSTOMER ===");
        console.error("Error:", err);
        console.error("============================");

        const errorMessage = err?.data?.message || "Failed to create customer";
        showError(errorMessage);
        loading.value = false;
    }
};
</script>

<template>
    <div>
        <PageTitle
            :title="'Create Customer'"
            :items="[{ label: 'Customers' }, { label: 'Create', active: true }]" />

        <!-- Form -->
        <form class="mt-6" @submit.prevent="handleSubmit">
            <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
                <!-- Basic Information -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <div class="card-title">Basic Information</div>
                        <div class="fieldset mt-2 grid grid-cols-1 gap-4 lg:grid-cols-2">
                            <div class="space-y-2 lg:col-span-2">
                                <label class="fieldset-label" for="name">
                                    Full Name <span class="text-error">*</span>
                                </label>
                                <input
                                    id="name"
                                    v-model="form.name"
                                    type="text"
                                    class="input w-full"
                                    placeholder="John Doe"
                                    required />
                            </div>
                            <div class="space-y-2">
                                <label class="fieldset-label" for="email">
                                    Email <span class="text-error">*</span>
                                </label>
                                <input
                                    id="email"
                                    v-model="form.email"
                                    type="email"
                                    class="input w-full"
                                    placeholder="john@example.com"
                                    required />
                            </div>
                            <div class="space-y-2">
                                <label class="fieldset-label" for="phone">Phone</label>
                                <input
                                    id="phone"
                                    v-model="form.phone"
                                    type="tel"
                                    class="input w-full"
                                    placeholder="08123456789" />
                            </div>
                            <div class="space-y-2">
                                <label class="fieldset-label" for="password">
                                    Password <span class="text-error">*</span>
                                </label>
                                <input
                                    id="password"
                                    v-model="form.password"
                                    type="password"
                                    class="input w-full"
                                    placeholder="••••••••"
                                    required />
                            </div>
                            <div class="space-y-2">
                                <label class="fieldset-label" for="date_of_birth">Date of Birth</label>
                                <input
                                    id="date_of_birth"
                                    v-model="form.date_of_birth"
                                    type="date"
                                    class="input w-full" />
                            </div>
                            <div class="space-y-2 lg:col-span-2">
                                <label class="fieldset-label" for="gender">
                                    Gender <span class="text-error">*</span>
                                </label>
                                <select id="gender" v-model="form.gender" class="select w-full" required>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Segment & Status -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <div class="card-title">Segment & Status</div>
                        <div class="fieldset mt-2 grid grid-cols-1 gap-4">
                            <div class="space-y-2">
                                <label class="fieldset-label" for="segment">
                                    Segment <span class="text-error">*</span>
                                </label>
                                <select id="segment" v-model="form.segment" class="select w-full" required>
                                    <option value="premium">Premium</option>
                                    <option value="standard">Standard</option>
                                    <option value="basic">Basic</option>
                                </select>
                            </div>
                            <div class="space-y-2">
                                <label class="fieldset-label" for="status">
                                    Status <span class="text-error">*</span>
                                </label>
                                <select id="status" v-model="form.status" class="select w-full" required>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="suspended">Suspended</option>
                                </select>
                            </div>
                            <div class="space-y-2">
                                <label class="label cursor-pointer justify-start gap-3">
                                    <input v-model="form.is_vip" type="checkbox" class="checkbox checkbox-warning" />
                                    <div>
                                        <span class="label-text font-medium">VIP Customer</span>
                                        <p class="text-base-content/60 text-xs">Mark as VIP for special benefits</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Preferences -->
                <div class="card bg-base-100 shadow md:col-span-2">
                    <div class="card-body">
                        <div class="card-title">Communication Preferences</div>
                        <div class="fieldset mt-2 grid grid-cols-1 gap-3 md:grid-cols-3">
                            <label class="label cursor-pointer justify-start gap-3">
                                <input v-model="form.preferences.newsletter" type="checkbox" class="checkbox" />
                                <span class="label-text">Newsletter Subscription</span>
                            </label>
                            <label class="label cursor-pointer justify-start gap-3">
                                <input v-model="form.preferences.sms_notifications" type="checkbox" class="checkbox" />
                                <span class="label-text">SMS Notifications</span>
                            </label>
                            <label class="label cursor-pointer justify-start gap-3">
                                <input v-model="form.preferences.email_notifications" type="checkbox" class="checkbox" />
                                <span class="label-text">Email Notifications</span>
                            </label>
                        </div>
                    </div>
                </div>

                <!-- Notes -->
                <div class="card bg-base-100 shadow md:col-span-2">
                    <div class="card-body gap-0">
                        <div class="card-title">Notes</div>
                        <p class="text-base-content/60 mb-4 text-sm">Internal notes about the customer (optional)</p>
                        <div class="fieldset">
                            <div class="space-y-2">
                                <textarea
                                    v-model="form.notes"
                                    class="textarea textarea-bordered w-full"
                                    placeholder="Add any internal notes here..."
                                    rows="4"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div class="mt-6 flex justify-end gap-3">
                <NuxtLink class="btn btn-sm btn-ghost" href="/customers">
                    <span class="iconify lucide--x size-4" />
                    Cancel
                </NuxtLink>
                <button type="submit" class="btn btn-sm btn-primary" :disabled="loading">
                    <span v-if="loading" class="loading loading-spinner loading-xs"></span>
                    <span v-else class="iconify lucide--plus size-4" />
                    {{ loading ? 'Creating...' : 'Create Customer' }}
                </button>
            </div>
        </form>
    </div>
</template>
