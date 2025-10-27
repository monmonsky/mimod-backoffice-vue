<script setup lang="ts">
import { getErrorMessage } from "~/utils/errorHandlers";
const { getSettings, updateSettings } = useSettings();
const { success, error: showError } = useToast();

const saving = ref(false);

const { data: settingsResponse, pending } = await getSettings("payment");

const settings = computed(() => (settingsResponse.value as any)?.data || {});

const form = ref({
    enabled: false,
    environment: "sandbox",
    sanitize: true,
    enable_3d_secure: true,
    merchant_id: "",
    client_key_sandbox: "",
    server_key_sandbox: "",
    client_key_production: "",
    server_key_production: "",
    snap_url_sandbox: "https://app.sandbox.midtrans.com/snap/snap.js",
    snap_url_production: "https://app.midtrans.com/snap/snap.js",
    transaction_timeout_hours: 24,
    max_installment_tenor: 12,
    enable_credit_card: true,
    enable_gopay: true,
    enable_shopeepay: true,
    enable_qris: true,
    enable_bca_va: true,
    enable_bni_va: true,
    enable_bri_va: true,
    enable_mandiri_va: true,
    enable_alfamart: true,
    enable_indomaret: true,
});

watch(
    settings,
    (newSettings) => {
        if (newSettings && Object.keys(newSettings).length > 0) {
            const midtransData = newSettings["payment.midtrans"]?.value;
            if (midtransData) {
                form.value = {
                    enabled: midtransData.enabled ?? false,
                    environment: midtransData.environment ?? "sandbox",
                    sanitize: midtransData.sanitize ?? true,
                    enable_3d_secure: midtransData.enable_3d_secure ?? true,
                    merchant_id: midtransData.merchant_id ?? "",
                    client_key_sandbox: midtransData.client_key_sandbox ?? "",
                    server_key_sandbox: midtransData.server_key_sandbox ?? "",
                    client_key_production: midtransData.client_key_production ?? "",
                    server_key_production: midtransData.server_key_production ?? "",
                    snap_url_sandbox: midtransData.snap_url_sandbox ?? "https://app.sandbox.midtrans.com/snap/snap.js",
                    snap_url_production: midtransData.snap_url_production ?? "https://app.midtrans.com/snap/snap.js",
                    transaction_timeout_hours: midtransData.transaction_timeout_hours ?? 24,
                    max_installment_tenor: midtransData.max_installment_tenor ?? 12,
                    enable_credit_card: midtransData.enable_credit_card ?? true,
                    enable_gopay: midtransData.enable_gopay ?? true,
                    enable_shopeepay: midtransData.enable_shopeepay ?? true,
                    enable_qris: midtransData.enable_qris ?? true,
                    enable_bca_va: midtransData.enable_bca_va ?? true,
                    enable_bni_va: midtransData.enable_bni_va ?? true,
                    enable_bri_va: midtransData.enable_bri_va ?? true,
                    enable_mandiri_va: midtransData.enable_mandiri_va ?? true,
                    enable_alfamart: midtransData.enable_alfamart ?? true,
                    enable_indomaret: midtransData.enable_indomaret ?? true,
                };
            }
        }
    },
    { immediate: true },
);

const handleSubmit = async () => {
    try {
        saving.value = true;

        const payload = {
            midtrans: form.value,
        };

        await updateSettings("payment", payload);
        success("Midtrans settings updated successfully!");
    } catch (err) {
        showError(getErrorMessage(err, "Failed to update settings"));
    } finally {
        saving.value = false;
    }
};
</script>

<template>
    <div>
        <div v-if="pending" class="flex items-center justify-center py-12">
            <span class="loading loading-spinner loading-lg"></span>
        </div>

        <form v-else @submit.prevent="handleSubmit" class="space-y-6">
            <div>
                <h3 class="text-lg font-semibold">Midtrans Payment Gateway</h3>
                <p class="text-base-content/60 mt-1 text-sm">Configure Midtrans payment integration</p>
            </div>

            <!-- Enable Midtrans -->
            <div class="space-y-4">
                <fieldset class="fieldset">
                    <label class="label cursor-pointer justify-start gap-3">
                        <input v-model="form.enabled" type="checkbox" class="toggle toggle-primary" :disabled="saving" />
                        <div>
                            <span class="label-text font-medium text-lg">Enable Midtrans</span>
                            <p class="text-base-content/60 mt-1 text-sm">Activate Midtrans payment gateway for your store</p>
                        </div>
                    </label>
                </fieldset>
            </div>

            <div v-if="form.enabled" class="space-y-6">
                <!-- Environment -->
                <div class="divider"></div>
                <div class="space-y-4">
                    <h4 class="font-medium">Environment</h4>
                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Mode</legend>
                        <select v-model="form.environment" class="select select-bordered w-full max-w-xs" :disabled="saving">
                            <option value="sandbox">Sandbox (Testing)</option>
                            <option value="production">Production (Live)</option>
                        </select>
                        <p class="text-base-content/60 mt-1 text-xs">
                            Use sandbox for testing, production for live transactions
                        </p>
                    </fieldset>
                </div>

                <!-- Credentials -->
                <div class="divider"></div>
                <div class="space-y-4">
                    <h4 class="font-medium">API Credentials</h4>
                    
                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Merchant ID</legend>
                        <input v-model="form.merchant_id" type="text" class="input input-bordered w-full" :disabled="saving" />
                    </fieldset>

                    <!-- Sandbox Keys -->
                    <div class="alert alert-info">
                        <span class="iconify lucide--info size-5" />
                        <span class="text-sm">Sandbox Credentials (Testing)</span>
                    </div>

                    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <fieldset class="fieldset">
                            <legend class="fieldset-legend">Sandbox Client Key</legend>
                            <input
                                v-model="form.client_key_sandbox"
                                type="text"
                                class="input input-bordered w-full"
                                :disabled="saving" />
                        </fieldset>

                        <fieldset class="fieldset">
                            <legend class="fieldset-legend">Sandbox Server Key</legend>
                            <input
                                v-model="form.server_key_sandbox"
                                type="password"
                                class="input input-bordered w-full"
                                :disabled="saving" />
                        </fieldset>
                    </div>

                    <!-- Production Keys -->
                    <div class="alert alert-warning">
                        <span class="iconify lucide--alert-triangle size-5" />
                        <span class="text-sm">Production Credentials (Live)</span>
                    </div>

                    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <fieldset class="fieldset">
                            <legend class="fieldset-legend">Production Client Key</legend>
                            <input
                                v-model="form.client_key_production"
                                type="text"
                                class="input input-bordered w-full"
                                :disabled="saving" />
                        </fieldset>

                        <fieldset class="fieldset">
                            <legend class="fieldset-legend">Production Server Key</legend>
                            <input
                                v-model="form.server_key_production"
                                type="password"
                                class="input input-bordered w-full"
                                :disabled="saving" />
                        </fieldset>
                    </div>
                </div>

                <!-- General Settings -->
                <div class="divider"></div>
                <div class="space-y-4">
                    <h4 class="font-medium">General Settings</h4>
                    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <fieldset class="fieldset">
                            <legend class="fieldset-legend">Transaction Timeout (hours)</legend>
                            <input
                                v-model.number="form.transaction_timeout_hours"
                                type="number"
                                min="1"
                                class="input input-bordered w-full"
                                :disabled="saving" />
                        </fieldset>

                        <fieldset class="fieldset">
                            <legend class="fieldset-legend">Max Installment Tenor</legend>
                            <input
                                v-model.number="form.max_installment_tenor"
                                type="number"
                                min="0"
                                class="input input-bordered w-full"
                                :disabled="saving" />
                        </fieldset>
                    </div>

                    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <fieldset class="fieldset">
                            <label class="label cursor-pointer justify-start gap-3">
                                <input v-model="form.sanitize" type="checkbox" class="checkbox" :disabled="saving" />
                                <span class="label-text">Enable Sanitization</span>
                            </label>
                        </fieldset>

                        <fieldset class="fieldset">
                            <label class="label cursor-pointer justify-start gap-3">
                                <input v-model="form.enable_3d_secure" type="checkbox" class="checkbox" :disabled="saving" />
                                <span class="label-text">Enable 3D Secure</span>
                            </label>
                        </fieldset>
                    </div>
                </div>

                <!-- Payment Methods -->
                <div class="divider"></div>
                <div class="space-y-4">
                    <h4 class="font-medium">Payment Methods</h4>
                    <p class="text-base-content/60 text-sm">Select which payment methods to enable</p>

                    <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <!-- Cards & E-Wallets -->
                        <fieldset class="fieldset">
                            <label class="label cursor-pointer justify-start gap-3">
                                <input v-model="form.enable_credit_card" type="checkbox" class="checkbox" :disabled="saving" />
                                <span class="label-text">Credit Card</span>
                            </label>
                        </fieldset>

                        <fieldset class="fieldset">
                            <label class="label cursor-pointer justify-start gap-3">
                                <input v-model="form.enable_gopay" type="checkbox" class="checkbox" :disabled="saving" />
                                <span class="label-text">GoPay</span>
                            </label>
                        </fieldset>

                        <fieldset class="fieldset">
                            <label class="label cursor-pointer justify-start gap-3">
                                <input v-model="form.enable_shopeepay" type="checkbox" class="checkbox" :disabled="saving" />
                                <span class="label-text">ShopeePay</span>
                            </label>
                        </fieldset>

                        <fieldset class="fieldset">
                            <label class="label cursor-pointer justify-start gap-3">
                                <input v-model="form.enable_qris" type="checkbox" class="checkbox" :disabled="saving" />
                                <span class="label-text">QRIS</span>
                            </label>
                        </fieldset>

                        <!-- Virtual Accounts -->
                        <fieldset class="fieldset">
                            <label class="label cursor-pointer justify-start gap-3">
                                <input v-model="form.enable_bca_va" type="checkbox" class="checkbox" :disabled="saving" />
                                <span class="label-text">BCA Virtual Account</span>
                            </label>
                        </fieldset>

                        <fieldset class="fieldset">
                            <label class="label cursor-pointer justify-start gap-3">
                                <input v-model="form.enable_bni_va" type="checkbox" class="checkbox" :disabled="saving" />
                                <span class="label-text">BNI Virtual Account</span>
                            </label>
                        </fieldset>

                        <fieldset class="fieldset">
                            <label class="label cursor-pointer justify-start gap-3">
                                <input v-model="form.enable_bri_va" type="checkbox" class="checkbox" :disabled="saving" />
                                <span class="label-text">BRI Virtual Account</span>
                            </label>
                        </fieldset>

                        <fieldset class="fieldset">
                            <label class="label cursor-pointer justify-start gap-3">
                                <input v-model="form.enable_mandiri_va" type="checkbox" class="checkbox" :disabled="saving" />
                                <span class="label-text">Mandiri Virtual Account</span>
                            </label>
                        </fieldset>

                        <!-- Convenience Stores -->
                        <fieldset class="fieldset">
                            <label class="label cursor-pointer justify-start gap-3">
                                <input v-model="form.enable_alfamart" type="checkbox" class="checkbox" :disabled="saving" />
                                <span class="label-text">Alfamart</span>
                            </label>
                        </fieldset>

                        <fieldset class="fieldset">
                            <label class="label cursor-pointer justify-start gap-3">
                                <input v-model="form.enable_indomaret" type="checkbox" class="checkbox" :disabled="saving" />
                                <span class="label-text">Indomaret</span>
                            </label>
                        </fieldset>
                    </div>
                </div>
            </div>

            <div class="flex justify-end gap-3">
                <button type="button" class="btn btn-ghost" :disabled="saving">Cancel</button>
                <button type="submit" class="btn btn-primary" :disabled="saving">
                    <span v-if="saving" class="loading loading-spinner loading-sm"></span>
                    <span v-else class="iconify lucide--save size-4" />
                    {{ saving ? "Saving..." : "Save Changes" }}
                </button>
            </div>
        </form>
    </div>
</template>
