<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";
import RichTextEditor from "~/components/RichTextEditor.vue";

definePageMeta({
    layout: "admin",
});

const router = useRouter();
const { createPaymentMethod } = usePaymentMethods();
const { success, error: showError } = useToast();

// Set page title
const { setPageTitleFromMenu } = useAdminMenu();
setPageTitleFromMenu();

// Form state
const form = ref({
    code: "",
    name: "",
    type: "bank_transfer",
    provider: "manual",
    logo_url: "",
    description: "",
    instructions: "",
    fee_percentage: 0,
    fee_fixed: 0,
    min_amount: null as number | null,
    max_amount: null as number | null,
    expired_duration: 1440,
    is_active: true,
    sort_order: 0,
});

// Auto-generate code from name (slug format)
watch(() => form.value.name, (newName) => {
    if (newName) {
        // Convert to lowercase, replace spaces with underscores, remove special chars
        form.value.code = newName
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '_')
            .replace(/[^a-z0-9_]/g, '');
    }
});

const saving = ref(false);

const handleSubmit = async () => {
    try {
        saving.value = true;
        await createPaymentMethod(form.value);
        success("Payment method created successfully");
        router.push("/settings/payment-methods");
    } catch (err: any) {
        showError(err?.data?.message || "Failed to create payment method");
    } finally {
        saving.value = false;
    }
};
</script>

<template>
    <div>
        <PageTitle
            :title="'Create Payment Method'"
            :items="[
                { label: 'Settings' },
                { label: 'Payment Methods', path: '/settings/payment-methods' },
                { label: 'Create', active: true },
            ]" />

        <!-- Form -->
        <form class="mt-6" @submit.prevent="handleSubmit">
            <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
                <!-- Basic Information -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <div class="card-title">Basic Information</div>
                        <div class="fieldset mt-2 grid grid-cols-1 gap-4">
                            <div class="space-y-2">
                                <label class="fieldset-label" for="name">
                                    Name <span class="text-error">*</span>
                                </label>
                                <input
                                    id="name"
                                    v-model="form.name"
                                    type="text"
                                    class="input w-full"
                                    placeholder="e.g., Bank Transfer BCA"
                                    required />
                            </div>

                            <div class="space-y-2">
                                <label class="fieldset-label" for="code">Code</label>
                                <input
                                    id="code"
                                    v-model="form.code"
                                    type="text"
                                    class="input w-full bg-base-200"
                                    placeholder="Auto-generated from name"
                                    readonly />
                                <p class="text-base-content/60 text-xs flex items-center gap-1">
                                    <span class="iconify lucide--info size-3" />
                                    Auto-generated from payment method name
                                </p>
                            </div>

                            <div class="space-y-2">
                                <label class="fieldset-label" for="type">
                                    Type <span class="text-error">*</span>
                                </label>
                                <select id="type" v-model="form.type" class="select w-full" required>
                                    <option value="bank_transfer">Bank Transfer</option>
                                    <option value="virtual_account">Virtual Account</option>
                                    <option value="e_wallet">E-Wallet</option>
                                    <option value="qris">QRIS</option>
                                    <option value="credit_card">Credit Card</option>
                                    <option value="cod">Cash on Delivery</option>
                                </select>
                            </div>

                            <div class="space-y-2">
                                <label class="fieldset-label" for="provider">
                                    Provider <span class="text-error">*</span>
                                </label>
                                <select id="provider" v-model="form.provider" class="select w-full" required>
                                    <option value="manual">Manual</option>
                                    <option value="midtrans">Midtrans</option>
                                    <option value="xendit">Xendit</option>
                                </select>
                            </div>

                            <div class="space-y-2">
                                <label class="fieldset-label" for="logo_url">Logo URL</label>
                                <input
                                    id="logo_url"
                                    v-model="form.logo_url"
                                    type="text"
                                    class="input w-full"
                                    placeholder="https://example.com/logo.png" />
                            </div>

                            <div class="space-y-2">
                                <label class="fieldset-label" for="description">Description</label>
                                <textarea
                                    id="description"
                                    v-model="form.description"
                                    class="textarea textarea-bordered w-full"
                                    rows="3"
                                    placeholder="Brief description of this payment method"></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Fee & Limits -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <div class="card-title">Fee & Limits</div>
                        <div class="fieldset mt-2 grid grid-cols-1 gap-4">
                            <div class="space-y-2">
                                <label class="fieldset-label" for="fee_percentage">Percentage Fee (%)</label>
                                <input
                                    id="fee_percentage"
                                    v-model.number="form.fee_percentage"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="100"
                                    class="input w-full" />
                            </div>

                            <div class="space-y-2">
                                <label class="fieldset-label" for="fee_fixed">Fixed Fee (Rp)</label>
                                <input
                                    id="fee_fixed"
                                    v-model.number="form.fee_fixed"
                                    type="number"
                                    min="0"
                                    class="input w-full" />
                            </div>

                            <div class="space-y-2">
                                <label class="fieldset-label" for="min_amount">Minimum Amount (Rp)</label>
                                <input
                                    id="min_amount"
                                    v-model.number="form.min_amount"
                                    type="number"
                                    min="0"
                                    class="input w-full"
                                    placeholder="No minimum" />
                            </div>

                            <div class="space-y-2">
                                <label class="fieldset-label" for="max_amount">Maximum Amount (Rp)</label>
                                <input
                                    id="max_amount"
                                    v-model.number="form.max_amount"
                                    type="number"
                                    min="0"
                                    class="input w-full"
                                    placeholder="No maximum" />
                            </div>

                            <div class="space-y-2">
                                <label class="fieldset-label" for="expired_duration">Expiration Duration (minutes)</label>
                                <input
                                    id="expired_duration"
                                    v-model.number="form.expired_duration"
                                    type="number"
                                    min="1"
                                    class="input w-full" />
                                <p class="text-base-content/60 text-xs">Default: 1440 (24 hours)</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Payment Instructions -->
                <div class="card bg-base-100 shadow md:col-span-2">
                    <div class="card-body gap-0">
                        <div class="card-title">Payment Instructions</div>
                        <p class="text-base-content/60 mb-4 text-sm">Step-by-step instructions for customers</p>
                        <div class="fieldset">
                            <div class="space-y-2">
                                <label class="fieldset-label" for="instructions">Instructions</label>
                                <RichTextEditor
                                    v-model="form.instructions"
                                    placeholder="Enter step-by-step payment instructions for customers..." />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Other Settings -->
                <div class="card bg-base-100 shadow md:col-span-2">
                    <div class="card-body gap-0">
                        <div class="card-title">Other Settings</div>
                        <div class="fieldset mt-4 grid grid-cols-1 gap-5 lg:grid-cols-2">
                            <div class="space-y-2">
                                <label class="fieldset-label" for="sort_order">Sort Order</label>
                                <input
                                    id="sort_order"
                                    v-model.number="form.sort_order"
                                    type="number"
                                    min="0"
                                    class="input w-full" />
                                <p class="text-base-content/60 text-xs">Lower numbers appear first</p>
                            </div>

                            <div class="space-y-2">
                                <label class="fieldset-label">Status</label>
                                <label class="label cursor-pointer justify-start gap-4">
                                    <input v-model="form.is_active" type="checkbox" class="toggle toggle-primary" />
                                    <span class="label-text">Active</span>
                                </label>
                                <p class="text-base-content/60 text-xs">Enable this payment method for customers</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div class="mt-6 flex justify-end gap-3">
                <NuxtLink class="btn btn-sm btn-ghost" to="/settings/payment-methods">
                    <span class="iconify lucide--x size-4" />
                    Cancel
                </NuxtLink>
                <button type="submit" class="btn btn-sm btn-primary" :disabled="saving">
                    <span v-if="saving" class="loading loading-spinner loading-xs"></span>
                    <span v-else class="iconify lucide--plus size-4" />
                    {{ saving ? 'Creating...' : 'Create Payment Method' }}
                </button>
            </div>
        </form>
    </div>
</template>
