<script setup lang="ts">
const { getSettings, updateSettings } = useSettings();
const { success, error: showError } = useToast();

const saving = ref(false);

const { data: settingsResponse, pending } = await getSettings("payment");

const settings = computed(() => (settingsResponse.value as any)?.data || {});

const form = ref({
    enabled: false,
    auto_verify: false,
    upload_proof_required: true,
    accounts: [
        {
            bank_name: "",
            account_holder: "",
            account_number: "",
        },
    ],
});

watch(
    settings,
    (newSettings) => {
        if (newSettings && Object.keys(newSettings).length > 0) {
            const bankTransferData = newSettings["payment.bank_transfer"]?.value;
            if (bankTransferData) {
                form.value = {
                    enabled: bankTransferData.enabled ?? false,
                    auto_verify: bankTransferData.auto_verify ?? false,
                    upload_proof_required: bankTransferData.upload_proof_required ?? true,
                    accounts: bankTransferData.accounts?.length
                        ? bankTransferData.accounts
                        : [
                              {
                                  bank_name: "",
                                  account_holder: "",
                                  account_number: "",
                              },
                          ],
                };
            }
        }
    },
    { immediate: true },
);

const addAccount = () => {
    form.value.accounts.push({
        bank_name: "",
        account_holder: "",
        account_number: "",
    });
};

const removeAccount = (index: number) => {
    if (form.value.accounts.length > 1) {
        form.value.accounts.splice(index, 1);
    }
};

const handleSubmit = async () => {
    try {
        saving.value = true;

        const payload = {
            bank_transfer: form.value,
        };

        await updateSettings("payment", payload);
        success("Bank Transfer settings updated successfully!");
    } catch (err: any) {
        showError(err?.data?.message || "Failed to update settings");
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
                <h3 class="text-lg font-semibold">Bank Transfer Settings</h3>
                <p class="text-base-content/60 mt-1 text-sm">Configure manual bank transfer payment method</p>
            </div>

            <!-- Enable Bank Transfer -->
            <div class="space-y-4">
                <fieldset class="fieldset">
                    <label class="label cursor-pointer justify-start gap-3">
                        <input v-model="form.enabled" type="checkbox" class="toggle toggle-primary" :disabled="saving" />
                        <div>
                            <span class="label-text font-medium text-lg">Enable Bank Transfer</span>
                            <p class="text-base-content/60 mt-1 text-sm">Allow customers to pay via bank transfer</p>
                        </div>
                    </label>
                </fieldset>
            </div>

            <div v-if="form.enabled" class="space-y-6">
                <!-- Settings -->
                <div class="divider"></div>
                <div class="space-y-4">
                    <h4 class="font-medium">Payment Settings</h4>
                    
                    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <fieldset class="fieldset">
                            <label class="label cursor-pointer justify-start gap-3">
                                <input v-model="form.upload_proof_required" type="checkbox" class="checkbox" :disabled="saving" />
                                <div>
                                    <span class="label-text">Require Upload Proof</span>
                                    <p class="text-base-content/60 mt-1 text-xs">Customer must upload payment proof</p>
                                </div>
                            </label>
                        </fieldset>

                        <fieldset class="fieldset">
                            <label class="label cursor-pointer justify-start gap-3">
                                <input v-model="form.auto_verify" type="checkbox" class="checkbox" :disabled="saving" />
                                <div>
                                    <span class="label-text">Auto Verify</span>
                                    <p class="text-base-content/60 mt-1 text-xs">Automatically verify payment</p>
                                </div>
                            </label>
                        </fieldset>
                    </div>
                </div>

                <!-- Bank Accounts -->
                <div class="divider"></div>
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <h4 class="font-medium">Bank Accounts</h4>
                        <button type="button" class="btn btn-sm btn-outline gap-2" @click="addAccount" :disabled="saving">
                            <span class="iconify lucide--plus size-4" />
                            Add Account
                        </button>
                    </div>

                    <div v-for="(account, index) in form.accounts" :key="index" class="card border border-base-300">
                        <div class="card-body">
                            <div class="flex items-center justify-between">
                                <h5 class="font-medium">Account {{ index + 1 }}</h5>
                                <button
                                    v-if="form.accounts.length > 1"
                                    type="button"
                                    class="btn btn-ghost btn-sm btn-circle"
                                    @click="removeAccount(index)"
                                    :disabled="saving">
                                    <span class="iconify lucide--trash-2 size-4 text-error" />
                                </button>
                            </div>

                            <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <fieldset class="fieldset">
                                    <legend class="fieldset-legend">Bank Name <span class="text-error">*</span></legend>
                                    <input
                                        v-model="account.bank_name"
                                        type="text"
                                        class="input input-bordered w-full"
                                        placeholder="e.g., BCA, Mandiri"
                                        :disabled="saving" />
                                </fieldset>

                                <fieldset class="fieldset">
                                    <legend class="fieldset-legend">Account Holder <span class="text-error">*</span></legend>
                                    <input
                                        v-model="account.account_holder"
                                        type="text"
                                        class="input input-bordered w-full"
                                        placeholder="e.g., PT Example"
                                        :disabled="saving" />
                                </fieldset>

                                <fieldset class="fieldset">
                                    <legend class="fieldset-legend">Account Number <span class="text-error">*</span></legend>
                                    <input
                                        v-model="account.account_number"
                                        type="text"
                                        class="input input-bordered w-full"
                                        placeholder="1234567890"
                                        :disabled="saving" />
                                </fieldset>
                            </div>
                        </div>
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
