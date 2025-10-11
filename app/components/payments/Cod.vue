<script setup lang="ts">
const { getSettings, updateSettings } = useSettings();
const { success, error: showError } = useToast();

const saving = ref(false);

const { data: settingsResponse, pending } = await getSettings("payment");

const settings = computed(() => (settingsResponse.value as any)?.data || {});

const form = ref({
    enabled: false,
    flat_fee: 0,
    max_order_amount: 0,
    available_areas: [] as string[],
});

const newArea = ref("");

watch(
    settings,
    (newSettings) => {
        if (newSettings && Object.keys(newSettings).length > 0) {
            const codData = newSettings["payment.cod"]?.value;
            if (codData) {
                form.value = {
                    enabled: codData.enabled ?? false,
                    flat_fee: codData.flat_fee ?? 0,
                    max_order_amount: codData.max_order_amount ?? 0,
                    available_areas: codData.available_areas || [],
                };
            }
        }
    },
    { immediate: true },
);

const addArea = () => {
    if (newArea.value.trim() && !form.value.available_areas.includes(newArea.value.trim())) {
        form.value.available_areas.push(newArea.value.trim());
        newArea.value = "";
    }
};

const removeArea = (index: number) => {
    form.value.available_areas.splice(index, 1);
};

const handleSubmit = async () => {
    try {
        saving.value = true;

        const payload = {
            cod: form.value,
        };

        await updateSettings("payment", payload);
        success("COD settings updated successfully!");
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
                <h3 class="text-lg font-semibold">Cash on Delivery (COD) Settings</h3>
                <p class="text-base-content/60 mt-1 text-sm">Configure COD payment method</p>
            </div>

            <!-- Enable COD -->
            <div class="space-y-4">
                <fieldset class="fieldset">
                    <label class="label cursor-pointer justify-start gap-3">
                        <input v-model="form.enabled" type="checkbox" class="toggle toggle-primary" :disabled="saving" />
                        <div>
                            <span class="label-text font-medium text-lg">Enable COD</span>
                            <p class="text-base-content/60 mt-1 text-sm">Allow customers to pay cash upon delivery</p>
                        </div>
                    </label>
                </fieldset>
            </div>

            <div v-if="form.enabled" class="space-y-6">
                <!-- COD Settings -->
                <div class="divider"></div>
                <div class="space-y-4">
                    <h4 class="font-medium">COD Configuration</h4>

                    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <fieldset class="fieldset">
                            <legend class="fieldset-legend">Flat Fee (Rp)</legend>
                            <input
                                v-model.number="form.flat_fee"
                                type="number"
                                min="0"
                                class="input input-bordered w-full"
                                placeholder="0"
                                :disabled="saving" />
                            <p class="text-base-content/60 mt-1 text-xs">Additional fee for COD service</p>
                        </fieldset>

                        <fieldset class="fieldset">
                            <legend class="fieldset-legend">Max Order Amount (Rp)</legend>
                            <input
                                v-model.number="form.max_order_amount"
                                type="number"
                                min="0"
                                class="input input-bordered w-full"
                                placeholder="0"
                                :disabled="saving" />
                            <p class="text-base-content/60 mt-1 text-xs">Maximum order value for COD (0 = unlimited)</p>
                        </fieldset>
                    </div>
                </div>

                <!-- Available Areas -->
                <div class="divider"></div>
                <div class="space-y-4">
                    <h4 class="font-medium">Available Areas</h4>
                    <p class="text-base-content/60 text-sm">Specify which areas are eligible for COD</p>

                    <div class="flex gap-2">
                        <input
                            v-model="newArea"
                            type="text"
                            class="input input-bordered flex-1"
                            placeholder="Enter city or area name"
                            :disabled="saving"
                            @keydown.enter.prevent="addArea" />
                        <button type="button" class="btn btn-primary gap-2" @click="addArea" :disabled="saving">
                            <span class="iconify lucide--plus size-4" />
                            Add
                        </button>
                    </div>

                    <div v-if="form.available_areas.length === 0" class="alert alert-info">
                        <span class="iconify lucide--info size-5" />
                        <span class="text-sm">No areas added. COD will be available for all areas.</span>
                    </div>

                    <div v-else class="flex flex-wrap gap-2">
                        <div
                            v-for="(area, index) in form.available_areas"
                            :key="index"
                            class="badge badge-lg gap-2 badge-outline">
                            {{ area }}
                            <button
                                type="button"
                                class="btn btn-ghost btn-xs btn-circle"
                                @click="removeArea(index)"
                                :disabled="saving">
                                <span class="iconify lucide--x size-3" />
                            </button>
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
