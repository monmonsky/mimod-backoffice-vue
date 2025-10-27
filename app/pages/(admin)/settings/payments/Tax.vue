<script setup lang="ts">
import { getErrorMessage } from "~/utils/errorHandlers";

const { getSettings, updateSettings } = useSettings();
const { success, error: showError } = useToast();

const saving = ref(false);

const { data: settingsResponse, pending } = await getSettings("payment");

const settings = computed(() => (settingsResponse.value as any)?.data || {});

interface TaxRate {
    name: string;
    rate: number;
    country: string;
    state: string;
    is_active: boolean;
}

interface TaxClass {
    name: string;
    rate: number;
    description: string;
}

const form = ref({
    enable_tax: false,
    tax_included_in_price: false,
    default_tax_rate: 11,
    tax_rates: [] as TaxRate[],
    tax_classes: [] as TaxClass[],
});

watch(
    settings,
    (newSettings) => {
        if (newSettings && Object.keys(newSettings).length > 0) {
            const taxData = newSettings["payment.tax"]?.value;
            if (taxData) {
                form.value = {
                    enable_tax: taxData.enable_tax ?? false,
                    tax_included_in_price: taxData.tax_included_in_price ?? false,
                    default_tax_rate: taxData.default_tax_rate ?? 11,
                    tax_rates: taxData.tax_rates || [],
                    tax_classes: taxData.tax_classes || [],
                };
            }
        }
    },
    { immediate: true },
);

const addTaxRate = () => {
    form.value.tax_rates.push({
        name: "",
        rate: 0,
        country: "Indonesia",
        state: "All",
        is_active: true,
    });
};

const removeTaxRate = (index: number) => {
    form.value.tax_rates.splice(index, 1);
};

const addTaxClass = () => {
    form.value.tax_classes.push({
        name: "",
        rate: 0,
        description: "",
    });
};

const removeTaxClass = (index: number) => {
    form.value.tax_classes.splice(index, 1);
};

const handleSubmit = async () => {
    try {
        saving.value = true;

        const payload = {
            tax: form.value,
        };

        await updateSettings("payment", payload);
        success("Tax settings updated successfully!");
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
                <h3 class="text-lg font-semibold">Tax Configuration</h3>
                <p class="text-base-content/60 mt-1 text-sm">Configure tax rates and classes</p>
            </div>

            <!-- Enable Tax -->
            <div class="space-y-4">
                <fieldset class="fieldset">
                    <label class="label cursor-pointer justify-start gap-3">
                        <input v-model="form.enable_tax" type="checkbox" class="toggle toggle-primary" :disabled="saving" />
                        <div>
                            <span class="label-text font-medium text-lg">Enable Tax</span>
                            <p class="text-base-content/60 mt-1 text-sm">Calculate and apply tax to orders</p>
                        </div>
                    </label>
                </fieldset>
            </div>

            <div v-if="form.enable_tax" class="space-y-6">
                <!-- General Tax Settings -->
                <div class="divider"></div>
                <div class="space-y-4">
                    <h4 class="font-medium">General Settings</h4>

                    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <fieldset class="fieldset">
                            <legend class="fieldset-legend">Default Tax Rate (%)</legend>
                            <input
                                v-model.number="form.default_tax_rate"
                                type="number"
                                min="0"
                                step="0.01"
                                class="input input-bordered w-full"
                                :disabled="saving" />
                        </fieldset>

                        <fieldset class="fieldset">
                            <label class="label cursor-pointer justify-start gap-3">
                                <input
                                    v-model="form.tax_included_in_price"
                                    type="checkbox"
                                    class="checkbox"
                                    :disabled="saving" />
                                <div>
                                    <span class="label-text">Tax Included in Price</span>
                                    <p class="text-base-content/60 mt-1 text-xs">Prices already include tax</p>
                                </div>
                            </label>
                        </fieldset>
                    </div>
                </div>

                <!-- Tax Rates -->
                <div class="divider"></div>
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <h4 class="font-medium">Tax Rates</h4>
                        <button type="button" class="btn btn-sm btn-outline gap-2" @click="addTaxRate" :disabled="saving">
                            <span class="iconify lucide--plus size-4" />
                            Add Rate
                        </button>
                    </div>

                    <div v-if="form.tax_rates.length === 0" class="alert alert-info">
                        <span class="iconify lucide--info size-5" />
                        <span class="text-sm">No tax rates configured. Default rate will be used.</span>
                    </div>

                    <div v-for="(rate, index) in form.tax_rates" :key="index" class="card border border-base-300">
                        <div class="card-body">
                            <div class="flex items-center justify-between">
                                <h5 class="font-medium">Rate {{ index + 1 }}</h5>
                                <button
                                    type="button"
                                    class="btn btn-ghost btn-sm btn-circle"
                                    @click="removeTaxRate(index)"
                                    :disabled="saving">
                                    <span class="iconify lucide--trash-2 size-4 text-error" />
                                </button>
                            </div>

                            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <fieldset class="fieldset">
                                    <legend class="fieldset-legend">Name <span class="text-error">*</span></legend>
                                    <input
                                        v-model="rate.name"
                                        type="text"
                                        class="input input-bordered w-full"
                                        placeholder="e.g., PPN"
                                        :disabled="saving" />
                                </fieldset>

                                <fieldset class="fieldset">
                                    <legend class="fieldset-legend">Rate (%) <span class="text-error">*</span></legend>
                                    <input
                                        v-model.number="rate.rate"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        class="input input-bordered w-full"
                                        :disabled="saving" />
                                </fieldset>

                                <fieldset class="fieldset">
                                    <legend class="fieldset-legend">Country</legend>
                                    <input
                                        v-model="rate.country"
                                        type="text"
                                        class="input input-bordered w-full"
                                        placeholder="Indonesia"
                                        :disabled="saving" />
                                </fieldset>

                                <fieldset class="fieldset">
                                    <legend class="fieldset-legend">State/Province</legend>
                                    <input
                                        v-model="rate.state"
                                        type="text"
                                        class="input input-bordered w-full"
                                        placeholder="All"
                                        :disabled="saving" />
                                </fieldset>

                                <fieldset class="fieldset md:col-span-2">
                                    <label class="label cursor-pointer justify-start gap-3">
                                        <input v-model="rate.is_active" type="checkbox" class="checkbox" :disabled="saving" />
                                        <span class="label-text">Active</span>
                                    </label>
                                </fieldset>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tax Classes -->
                <div class="divider"></div>
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <h4 class="font-medium">Tax Classes</h4>
                        <button type="button" class="btn btn-sm btn-outline gap-2" @click="addTaxClass" :disabled="saving">
                            <span class="iconify lucide--plus size-4" />
                            Add Class
                        </button>
                    </div>

                    <div v-if="form.tax_classes.length === 0" class="alert alert-info">
                        <span class="iconify lucide--info size-5" />
                        <span class="text-sm">No tax classes configured</span>
                    </div>

                    <div v-for="(taxClass, index) in form.tax_classes" :key="index" class="card border border-base-300">
                        <div class="card-body">
                            <div class="flex items-center justify-between">
                                <h5 class="font-medium">Class {{ index + 1 }}</h5>
                                <button
                                    type="button"
                                    class="btn btn-ghost btn-sm btn-circle"
                                    @click="removeTaxClass(index)"
                                    :disabled="saving">
                                    <span class="iconify lucide--trash-2 size-4 text-error" />
                                </button>
                            </div>

                            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <fieldset class="fieldset">
                                    <legend class="fieldset-legend">Class Name <span class="text-error">*</span></legend>
                                    <input
                                        v-model="taxClass.name"
                                        type="text"
                                        class="input input-bordered w-full"
                                        placeholder="e.g., Standard, Reduced"
                                        :disabled="saving" />
                                </fieldset>

                                <fieldset class="fieldset">
                                    <legend class="fieldset-legend">Rate (%) <span class="text-error">*</span></legend>
                                    <input
                                        v-model.number="taxClass.rate"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        class="input input-bordered w-full"
                                        :disabled="saving" />
                                </fieldset>

                                <fieldset class="fieldset md:col-span-2">
                                    <legend class="fieldset-legend">Description</legend>
                                    <textarea
                                        v-model="taxClass.description"
                                        class="textarea textarea-bordered w-full"
                                        rows="2"
                                        :disabled="saving"></textarea>
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
