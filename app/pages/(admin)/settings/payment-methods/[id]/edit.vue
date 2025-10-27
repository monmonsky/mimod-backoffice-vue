<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";
import RichTextEditor from "~/components/RichTextEditor.vue";

definePageMeta({
    layout: "admin",
});

const route = useRoute();
const router = useRouter();
const paymentMethodId = parseInt(route.params.id as string);
const { getPaymentMethod, updatePaymentMethod } = usePaymentMethods();
const { success, error: showError } = useToast();

// Set page title
const { setPageTitleFromMenu } = useAdminMenu();
setPageTitleFromMenu();

// Fetch payment method
const { data: paymentMethodResponse, pending } = await useAsyncData(
    `payment-method-${paymentMethodId}`,
    async () => {
        return await getPaymentMethod(paymentMethodId);
    }
);

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

// Populate form when data is loaded
watch(
    paymentMethodResponse,
    (response) => {
        if (response) {
            const data = (response as any)?.data;
            if (data) {
                form.value = {
                    code: data.code || "",
                    name: data.name || "",
                    type: data.type || "bank_transfer",
                    provider: data.provider || "manual",
                    logo_url: data.logo_url || "",
                    description: data.description || "",
                    instructions: data.instructions || "",
                    fee_percentage: data.fee_percentage || 0,
                    fee_fixed: data.fee_fixed || 0,
                    min_amount: data.min_amount,
                    max_amount: data.max_amount,
                    expired_duration: data.expired_duration || 1440,
                    is_active: data.is_active !== undefined ? data.is_active : true,
                    sort_order: data.sort_order || 0,
                };
            }
        }
    },
    { immediate: true }
);

const saving = ref(false);

const handleSubmit = async () => {
    try {
        saving.value = true;
        await updatePaymentMethod(paymentMethodId, form.value);
        success("Payment method updated successfully");
        router.push("/settings/payment-methods");
    } catch (err: any) {
        showError(err?.data?.message || "Failed to update payment method");
    } finally {
        saving.value = false;
    }
};
</script>

<template>
    <div>
        <PageTitle
            :title="'Edit Payment Method'"
            :items="[
                { label: 'Settings' },
                { label: 'Payment Methods', path: '/settings/payment-methods' },
                { label: 'Edit', active: true },
            ]" />

        <!-- Loading State -->
        <div v-if="pending" class="flex items-center justify-center py-12">
            <span class="loading loading-spinner loading-lg"></span>
        </div>

        <!-- Form -->
        <form v-else class="mt-6" @submit.prevent="handleSubmit">
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
                                    readonly />
                                <p class="text-base-content/60 text-xs flex items-center gap-1">
                                    <span class="iconify lucide--info size-3" />
                                    Code cannot be changed after creation
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
                    <span v-else class="iconify lucide--save size-4" />
                    {{ saving ? 'Updating...' : 'Update Payment Method' }}
                </button>
            </div>
        </form>
    </div>
</template>
