<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";
import type { CouponType } from "~/types/marketing/coupons";

definePageMeta({
    layout: "admin",
});

const { createCoupon } = useCoupons();
const { success, error: showError } = useToast();

const form = ref({
    code: "",
    name: "",
    description: "",
    type: "percentage" as CouponType,
    value: 0,
    max_discount: null as number | null,
    min_purchase: 0,
    usage_limit: null as number | null,
    usage_limit_per_customer: null as number | null,
    start_date: "",
    end_date: "",
    is_active: true,
});

const loading = ref(false);

// Auto-generate coupon code
const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    form.value.code = code;
};

// Set default dates
const setDefaultDates = () => {
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    form.value.start_date = today.toISOString().split('T')[0];
    form.value.end_date = nextMonth.toISOString().split('T')[0];
};

// Initialize dates on mount
onMounted(() => {
    setDefaultDates();
});

// Watch type changes
watch(() => form.value.type, (newType) => {
    // Reset max_discount when type changes
    if (newType !== "percentage") {
        form.value.max_discount = null;
    }
});

// Submit form
const handleSubmit = async () => {
    // Validation
    if (!form.value.code) {
        showError("Coupon code is required");
        return;
    }

    if (!form.value.name) {
        showError("Coupon name is required");
        return;
    }

    if (form.value.value <= 0 && form.value.type !== "free_shipping") {
        showError("Coupon value must be greater than 0");
        return;
    }

    if (!form.value.start_date || !form.value.end_date) {
        showError("Start and end dates are required");
        return;
    }

    try {
        loading.value = true;

        const payload = {
            code: form.value.code.toUpperCase(),
            name: form.value.name,
            description: form.value.description || undefined,
            type: form.value.type,
            value: form.value.value,
            max_discount: form.value.max_discount || undefined,
            min_purchase: form.value.min_purchase,
            usage_limit: form.value.usage_limit || undefined,
            usage_limit_per_customer: form.value.usage_limit_per_customer || undefined,
            start_date: form.value.start_date,
            end_date: form.value.end_date,
            is_active: form.value.is_active,
        };

        await createCoupon(payload);
        success("Coupon created successfully!");
        await navigateTo("/marketing/coupons");
    } catch (err: any) {
        showError(err?.data?.message || "Failed to create coupon");
        loading.value = false;
    }
};
</script>

<template>
    <div>
        <PageTitle
            :title="'Create Coupon'"
            :items="[{ label: 'Marketing' }, { label: 'Coupons', path: '/marketing/coupons' }, { label: 'Create', active: true }]" />

        <div class="mt-6">
            <form @submit.prevent="handleSubmit">
                <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <!-- Basic Information -->
                    <div class="card bg-base-100 shadow">
                        <div class="card-body">
                            <div class="card-title">Basic Information</div>
                            <fieldset class="fieldset mt-2 grid grid-cols-1 gap-4">
                                <div class="space-y-2">
                                    <label class="fieldset-label" for="code">
                                        Coupon Code <span class="text-error">*</span>
                                    </label>
                                    <div class="flex gap-2">
                                        <input
                                            id="code"
                                            v-model="form.code"
                                            type="text"
                                            class="input w-full uppercase"
                                            placeholder="DISC50"
                                            required />
                                        <button type="button" @click="generateCode" class="btn btn-primary btn-sm">
                                            <span class="iconify lucide--refresh-cw size-4" />
                                            Generate
                                        </button>
                                    </div>
                                    <p class="text-base-content/60 text-xs">Use uppercase letters and numbers only</p>
                                </div>
                                <div class="space-y-2">
                                    <label class="fieldset-label" for="name">
                                        Coupon Name <span class="text-error">*</span>
                                    </label>
                                    <input
                                        id="name"
                                        v-model="form.name"
                                        type="text"
                                        class="input w-full"
                                        placeholder="Summer Sale 50%"
                                        required />
                                </div>
                                <div class="space-y-2">
                                    <label class="fieldset-label" for="description">Description</label>
                                    <textarea
                                        id="description"
                                        v-model="form.description"
                                        placeholder="Brief description about this coupon"
                                        class="textarea w-full"
                                        rows="3"></textarea>
                                </div>
                            </fieldset>
                        </div>
                    </div>

                    <!-- Discount Settings -->
                    <div class="card bg-base-100 shadow">
                        <div class="card-body">
                            <div class="card-title">Discount Settings</div>
                            <fieldset class="fieldset mt-2 grid grid-cols-1 gap-4">
                                <div class="space-y-2">
                                    <label class="fieldset-label" for="type">
                                        Discount Type <span class="text-error">*</span>
                                    </label>
                                    <select id="type" v-model="form.type" class="select w-full">
                                        <option value="percentage">Percentage Discount (%)</option>
                                        <option value="fixed">Fixed Amount (Rp)</option>
                                        <option value="free_shipping">Free Shipping</option>
                                    </select>
                                </div>

                                <div v-if="form.type !== 'free_shipping'" class="space-y-2">
                                    <label class="fieldset-label" for="value">
                                        {{ form.type === 'percentage' ? 'Discount Percentage' : 'Discount Amount' }}
                                        <span class="text-error">*</span>
                                    </label>
                                    <label class="input w-full">
                                        <input
                                            id="value"
                                            v-model.number="form.value"
                                            class="grow"
                                            type="number"
                                            min="0"
                                            :max="form.type === 'percentage' ? 100 : undefined"
                                            step="any"
                                            required />
                                        <span class="text-base-content/60">{{ form.type === 'percentage' ? '%' : 'Rp' }}</span>
                                    </label>
                                </div>

                                <div v-if="form.type === 'percentage'" class="space-y-2">
                                    <label class="fieldset-label" for="max_discount">Max Discount Amount</label>
                                    <label class="input w-full">
                                        <input
                                            id="max_discount"
                                            v-model.number="form.max_discount"
                                            class="grow"
                                            type="number"
                                            min="0"
                                            step="any"
                                            placeholder="Optional" />
                                        <span class="text-base-content/60">Rp</span>
                                    </label>
                                    <p class="text-base-content/60 text-xs">Leave empty for no limit</p>
                                </div>

                                <div class="space-y-2">
                                    <label class="fieldset-label" for="min_purchase">Minimum Purchase</label>
                                    <label class="input w-full">
                                        <input
                                            id="min_purchase"
                                            v-model.number="form.min_purchase"
                                            class="grow"
                                            type="number"
                                            min="0"
                                            step="any" />
                                        <span class="text-base-content/60">Rp</span>
                                    </label>
                                    <p class="text-base-content/60 text-xs">Set 0 for no minimum</p>
                                </div>
                            </fieldset>
                        </div>
                    </div>

                    <!-- Usage Limits -->
                    <div class="card bg-base-100 shadow">
                        <div class="card-body">
                            <div class="card-title">Usage Limits</div>
                            <fieldset class="fieldset mt-2 grid grid-cols-1 gap-4">
                                <div class="space-y-2">
                                    <label class="fieldset-label" for="usage_limit">Total Usage Limit</label>
                                    <input
                                        id="usage_limit"
                                        v-model.number="form.usage_limit"
                                        type="number"
                                        min="0"
                                        class="input w-full"
                                        placeholder="Leave empty for unlimited" />
                                    <p class="text-base-content/60 text-xs">Maximum times this coupon can be used by all customers</p>
                                </div>
                                <div class="space-y-2">
                                    <label class="fieldset-label" for="usage_limit_per_customer">Usage Limit Per Customer</label>
                                    <input
                                        id="usage_limit_per_customer"
                                        v-model.number="form.usage_limit_per_customer"
                                        type="number"
                                        min="0"
                                        class="input w-full"
                                        placeholder="Leave empty for unlimited" />
                                    <p class="text-base-content/60 text-xs">Maximum times one customer can use this coupon</p>
                                </div>
                            </fieldset>
                        </div>
                    </div>

                    <!-- Valid Period -->
                    <div class="card bg-base-100 shadow">
                        <div class="card-body">
                            <div class="card-title">Valid Period</div>
                            <fieldset class="fieldset mt-2 grid grid-cols-1 gap-4">
                                <div class="space-y-2">
                                    <label class="fieldset-label" for="start_date">
                                        Start Date <span class="text-error">*</span>
                                    </label>
                                    <input
                                        id="start_date"
                                        v-model="form.start_date"
                                        type="date"
                                        class="input w-full"
                                        required />
                                </div>
                                <div class="space-y-2">
                                    <label class="fieldset-label" for="end_date">
                                        End Date <span class="text-error">*</span>
                                    </label>
                                    <input
                                        id="end_date"
                                        v-model="form.end_date"
                                        type="date"
                                        class="input w-full"
                                        required />
                                </div>
                            </fieldset>
                        </div>
                    </div>

                    <!-- Status -->
                    <div class="card bg-base-100 shadow md:col-span-2">
                        <div class="card-body">
                            <div class="card-title">Status</div>
                            <fieldset class="fieldset mt-2">
                                <label class="label cursor-pointer gap-3 justify-start" for="is_active">
                                    <input
                                        id="is_active"
                                        v-model="form.is_active"
                                        class="toggle toggle-success"
                                        type="checkbox" />
                                    <div class="flex flex-col">
                                        <span class="label-text font-medium">Active Coupon</span>
                                        <span class="text-base-content/60 text-xs">
                                            {{ form.is_active ? 'This coupon is active and can be used' : 'This coupon is inactive' }}
                                        </span>
                                    </div>
                                </label>
                            </fieldset>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="mt-6 flex justify-end gap-3">
                    <NuxtLink class="btn btn-sm btn-ghost" href="/marketing/coupons">
                        <span class="iconify lucide--x size-4" />
                        Cancel
                    </NuxtLink>
                    <button type="submit" class="btn btn-sm btn-primary" :disabled="loading">
                        <span v-if="loading" class="loading loading-spinner loading-sm"></span>
                        <span v-else class="iconify lucide--check size-4" />
                        {{ loading ? "Creating..." : "Create Coupon" }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
