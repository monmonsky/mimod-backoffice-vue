<script setup lang="ts">
const { getSettings, updateSettings } = useSettings();
const { success, error: showError } = useToast();

const saving = ref(false);

const { data: settingsResponse, pending } = await getSettings("shipping");

const settings = computed(() => (settingsResponse.value as any)?.data || {});

const form = ref({
    enabled: false,
    api_key: "",
    account_type: "starter",
    base_url: "https://api.rajaongkir.com/starter",
    cache_enabled: true,
    cache_duration: 24,
    enable_insurance: true,
    insurance_rate: 0.002,
    round_up_cost: true,
    price_markup_type: "percentage",
    price_markup_value: 0,
    couriers: {
        jne: { name: "JNE", enabled: true },
        jnt: { name: "J&T Express", enabled: true },
        pos: { name: "POS Indonesia", enabled: true },
        tiki: { name: "TIKI", enabled: true },
        sicepat: { name: "SiCepat", enabled: true },
        anteraja: { name: "AnterAja", enabled: true },
    },
});

watch(
    settings,
    (newSettings) => {
        if (newSettings && Object.keys(newSettings).length > 0) {
            const rajaongkirData = newSettings["shipping.rajaongkir"]?.value;
            if (rajaongkirData) {
                form.value = {
                    enabled: rajaongkirData.enabled ?? false,
                    api_key: rajaongkirData.api_key ?? "",
                    account_type: rajaongkirData.account_type ?? "starter",
                    base_url: rajaongkirData.base_url ?? "https://api.rajaongkir.com/starter",
                    cache_enabled: rajaongkirData.cache_enabled ?? true,
                    cache_duration: rajaongkirData.cache_duration ?? 24,
                    enable_insurance: rajaongkirData.enable_insurance ?? true,
                    insurance_rate: rajaongkirData.insurance_rate ?? 0.002,
                    round_up_cost: rajaongkirData.round_up_cost ?? true,
                    price_markup_type: rajaongkirData.price_markup_type ?? "percentage",
                    price_markup_value: rajaongkirData.price_markup_value ?? 0,
                    couriers: rajaongkirData.couriers ?? {
                        jne: { name: "JNE", enabled: true },
                        jnt: { name: "J&T Express", enabled: true },
                        pos: { name: "POS Indonesia", enabled: true },
                        tiki: { name: "TIKI", enabled: true },
                        sicepat: { name: "SiCepat", enabled: true },
                        anteraja: { name: "AnterAja", enabled: true },
                    },
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
            rajaongkir: form.value,
        };

        await updateSettings("shipping", payload);
        success("RajaOngkir settings updated successfully!");
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
                <h3 class="text-lg font-semibold">RajaOngkir API Configuration</h3>
                <p class="text-base-content/60 mt-1 text-sm">Configure RajaOngkir shipping rate API</p>
            </div>

            <!-- Enable RajaOngkir -->
            <div class="space-y-4">
                <fieldset class="fieldset">
                    <label class="label cursor-pointer justify-start gap-3">
                        <input v-model="form.enabled" type="checkbox" class="toggle toggle-primary" :disabled="saving" />
                        <div>
                            <span class="label-text font-medium text-lg">Enable RajaOngkir</span>
                            <p class="text-base-content/60 mt-1 text-sm">Use RajaOngkir for shipping cost calculation</p>
                        </div>
                    </label>
                </fieldset>
            </div>

            <div v-if="form.enabled" class="space-y-6">
                <!-- API Configuration -->
                <div class="divider"></div>
                <div class="space-y-4">
                    <h4 class="font-medium">API Settings</h4>

                    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <fieldset class="fieldset">
                            <legend class="fieldset-legend">API Key <span class="text-error">*</span></legend>
                            <input
                                v-model="form.api_key"
                                type="text"
                                class="input input-bordered w-full font-mono"
                                placeholder="your-api-key"
                                :disabled="saving" />
                        </fieldset>

                        <fieldset class="fieldset">
                            <legend class="fieldset-legend">Account Type</legend>
                            <select v-model="form.account_type" class="select select-bordered w-full" :disabled="saving">
                                <option value="starter">Starter</option>
                                <option value="basic">Basic</option>
                                <option value="pro">Pro</option>
                            </select>
                        </fieldset>

                        <fieldset class="fieldset md:col-span-2">
                            <legend class="fieldset-legend">Base URL</legend>
                            <input
                                v-model="form.base_url"
                                type="url"
                                class="input input-bordered w-full font-mono text-sm"
                                :disabled="saving" />
                        </fieldset>
                    </div>
                </div>

                <!-- Cache Settings -->
                <div class="divider"></div>
                <div class="space-y-4">
                    <h4 class="font-medium">Cache Settings</h4>

                    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <fieldset class="fieldset">
                            <label class="label cursor-pointer justify-start gap-3">
                                <input v-model="form.cache_enabled" type="checkbox" class="checkbox" :disabled="saving" />
                                <div>
                                    <span class="label-text">Enable Cache</span>
                                    <p class="text-base-content/60 mt-1 text-xs">Cache shipping rates to reduce API calls</p>
                                </div>
                            </label>
                        </fieldset>

                        <fieldset v-if="form.cache_enabled" class="fieldset">
                            <legend class="fieldset-legend">Cache Duration (hours)</legend>
                            <input
                                v-model.number="form.cache_duration"
                                type="number"
                                min="1"
                                class="input input-bordered w-full"
                                :disabled="saving" />
                        </fieldset>
                    </div>
                </div>

                <!-- Insurance & Pricing -->
                <div class="divider"></div>
                <div class="space-y-4">
                    <h4 class="font-medium">Insurance & Pricing</h4>

                    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <fieldset class="fieldset">
                            <label class="label cursor-pointer justify-start gap-3">
                                <input v-model="form.enable_insurance" type="checkbox" class="checkbox" :disabled="saving" />
                                <div>
                                    <span class="label-text">Enable Insurance</span>
                                    <p class="text-base-content/60 mt-1 text-xs">Add shipping insurance to orders</p>
                                </div>
                            </label>
                        </fieldset>

                        <fieldset v-if="form.enable_insurance" class="fieldset">
                            <legend class="fieldset-legend">Insurance Rate</legend>
                            <input
                                v-model.number="form.insurance_rate"
                                type="number"
                                step="0.001"
                                min="0"
                                class="input input-bordered w-full"
                                :disabled="saving" />
                            <p class="text-base-content/60 mt-1 text-xs">Rate as decimal (e.g., 0.002 = 0.2%)</p>
                        </fieldset>

                        <fieldset class="fieldset">
                            <label class="label cursor-pointer justify-start gap-3">
                                <input v-model="form.round_up_cost" type="checkbox" class="checkbox" :disabled="saving" />
                                <div>
                                    <span class="label-text">Round Up Cost</span>
                                    <p class="text-base-content/60 mt-1 text-xs">Round shipping cost to nearest thousand</p>
                                </div>
                            </label>
                        </fieldset>
                    </div>

                    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <fieldset class="fieldset">
                            <legend class="fieldset-legend">Price Markup Type</legend>
                            <select v-model="form.price_markup_type" class="select select-bordered w-full" :disabled="saving">
                                <option value="percentage">Percentage</option>
                                <option value="fixed">Fixed Amount</option>
                            </select>
                        </fieldset>

                        <fieldset class="fieldset">
                            <legend class="fieldset-legend">Price Markup Value</legend>
                            <input
                                v-model.number="form.price_markup_value"
                                type="number"
                                min="0"
                                step="0.01"
                                class="input input-bordered w-full"
                                :disabled="saving" />
                            <p class="text-base-content/60 mt-1 text-xs">
                                {{ form.price_markup_type === "percentage" ? "Percentage (%)" : "Amount (Rp)" }}
                            </p>
                        </fieldset>
                    </div>
                </div>

                <!-- Available Couriers -->
                <div class="divider"></div>
                <div class="space-y-4">
                    <h4 class="font-medium">Available Couriers</h4>
                    <p class="text-base-content/60 text-sm">Select which couriers to enable for shipping</p>

                    <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <fieldset v-for="(courier, key) in form.couriers" :key="key" class="fieldset">
                            <label class="label cursor-pointer justify-start gap-3">
                                <input v-model="courier.enabled" type="checkbox" class="checkbox" :disabled="saving" />
                                <span class="label-text">{{ courier.name }}</span>
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
