<script setup lang="ts">
import { getErrorMessage } from "~/utils/errorHandlers";

const { getSettings, updateSettings } = useSettings();
const { success, error: showError } = useToast();

const saving = ref(false);

const { data: settingsResponse, pending } = await getSettings("shipping");

const settings = computed(() => (settingsResponse.value as any)?.data || {});

const form = ref({
    free_shipping: {
        enabled: false,
        name: "Free Shipping",
        min_order_amount: 0,
    },
    flat_rate: {
        enabled: false,
        name: "Flat Rate Shipping",
        cost: 0,
        tax_status: "taxable",
    },
    local_pickup: {
        enabled: false,
        name: "Local Pickup",
        cost: 0,
        locations: [] as string[],
    },
});

const newLocation = ref("");

watch(
    settings,
    (newSettings) => {
        if (newSettings && Object.keys(newSettings).length > 0) {
            const methodsData = newSettings["shipping.methods"]?.value;
            if (methodsData) {
                form.value = {
                    free_shipping: {
                        enabled: methodsData.free_shipping?.enabled ?? false,
                        name: methodsData.free_shipping?.name ?? "Free Shipping",
                        min_order_amount: methodsData.free_shipping?.min_order_amount ?? 0,
                    },
                    flat_rate: {
                        enabled: methodsData.flat_rate?.enabled ?? false,
                        name: methodsData.flat_rate?.name ?? "Flat Rate Shipping",
                        cost: methodsData.flat_rate?.cost ?? 0,
                        tax_status: methodsData.flat_rate?.tax_status ?? "taxable",
                    },
                    local_pickup: {
                        enabled: methodsData.local_pickup?.enabled ?? false,
                        name: methodsData.local_pickup?.name ?? "Local Pickup",
                        cost: methodsData.local_pickup?.cost ?? 0,
                        locations: methodsData.local_pickup?.locations || [],
                    },
                };
            }
        }
    },
    { immediate: true },
);

const addLocation = () => {
    if (newLocation.value.trim() && !form.value.local_pickup.locations.includes(newLocation.value.trim())) {
        form.value.local_pickup.locations.push(newLocation.value.trim());
        newLocation.value = "";
    }
};

const removeLocation = (index: number) => {
    form.value.local_pickup.locations.splice(index, 1);
};

const handleSubmit = async () => {
    try {
        saving.value = true;

        const payload = {
            methods: form.value,
        };

        await updateSettings("shipping", payload);
        success("Shipping methods updated successfully!");
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
                <h3 class="text-lg font-semibold">Alternative Shipping Methods</h3>
                <p class="text-base-content/60 mt-1 text-sm">Configure additional shipping options</p>
            </div>

            <!-- Free Shipping -->
            <div class="card border border-base-300">
                <div class="card-body">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <span class="iconify lucide--gift size-6 text-success" />
                            <div>
                                <h4 class="font-medium">Free Shipping</h4>
                                <p class="text-base-content/60 text-sm">Offer free shipping for orders above a threshold</p>
                            </div>
                        </div>
                        <input v-model="form.free_shipping.enabled" type="checkbox" class="toggle toggle-success" :disabled="saving" />
                    </div>

                    <div v-if="form.free_shipping.enabled" class="mt-4 space-y-4">
                        <div class="divider my-2"></div>
                        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <fieldset class="fieldset">
                                <legend class="fieldset-legend">Method Name</legend>
                                <input
                                    v-model="form.free_shipping.name"
                                    type="text"
                                    class="input input-bordered w-full"
                                    :disabled="saving" />
                            </fieldset>

                            <fieldset class="fieldset">
                                <legend class="fieldset-legend">Minimum Order Amount (Rp)</legend>
                                <input
                                    v-model.number="form.free_shipping.min_order_amount"
                                    type="number"
                                    min="0"
                                    class="input input-bordered w-full"
                                    placeholder="500000"
                                    :disabled="saving" />
                                <p class="text-base-content/60 mt-1 text-xs">Free shipping for orders above this amount</p>
                            </fieldset>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Flat Rate -->
            <div class="card border border-base-300">
                <div class="card-body">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <span class="iconify lucide--tag size-6 text-info" />
                            <div>
                                <h4 class="font-medium">Flat Rate Shipping</h4>
                                <p class="text-base-content/60 text-sm">Fixed shipping cost for all orders</p>
                            </div>
                        </div>
                        <input v-model="form.flat_rate.enabled" type="checkbox" class="toggle toggle-info" :disabled="saving" />
                    </div>

                    <div v-if="form.flat_rate.enabled" class="mt-4 space-y-4">
                        <div class="divider my-2"></div>
                        <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <fieldset class="fieldset">
                                <legend class="fieldset-legend">Method Name</legend>
                                <input v-model="form.flat_rate.name" type="text" class="input input-bordered w-full" :disabled="saving" />
                            </fieldset>

                            <fieldset class="fieldset">
                                <legend class="fieldset-legend">Shipping Cost (Rp)</legend>
                                <input
                                    v-model.number="form.flat_rate.cost"
                                    type="number"
                                    min="0"
                                    class="input input-bordered w-full"
                                    placeholder="10000"
                                    :disabled="saving" />
                            </fieldset>

                            <fieldset class="fieldset">
                                <legend class="fieldset-legend">Tax Status</legend>
                                <select v-model="form.flat_rate.tax_status" class="select select-bordered w-full" :disabled="saving">
                                    <option value="taxable">Taxable</option>
                                    <option value="none">None</option>
                                </select>
                            </fieldset>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Local Pickup -->
            <div class="card border border-base-300">
                <div class="card-body">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <span class="iconify lucide--map-pin size-6 text-warning" />
                            <div>
                                <h4 class="font-medium">Local Pickup</h4>
                                <p class="text-base-content/60 text-sm">Allow customers to pick up orders at your location</p>
                            </div>
                        </div>
                        <input v-model="form.local_pickup.enabled" type="checkbox" class="toggle toggle-warning" :disabled="saving" />
                    </div>

                    <div v-if="form.local_pickup.enabled" class="mt-4 space-y-4">
                        <div class="divider my-2"></div>
                        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <fieldset class="fieldset">
                                <legend class="fieldset-legend">Method Name</legend>
                                <input
                                    v-model="form.local_pickup.name"
                                    type="text"
                                    class="input input-bordered w-full"
                                    :disabled="saving" />
                            </fieldset>

                            <fieldset class="fieldset">
                                <legend class="fieldset-legend">Pickup Cost (Rp)</legend>
                                <input
                                    v-model.number="form.local_pickup.cost"
                                    type="number"
                                    min="0"
                                    class="input input-bordered w-full"
                                    placeholder="0"
                                    :disabled="saving" />
                                <p class="text-base-content/60 mt-1 text-xs">Usually 0 for free pickup</p>
                            </fieldset>
                        </div>

                        <div class="space-y-2">
                            <legend class="text-sm font-medium">Pickup Locations</legend>
                            <div class="flex gap-2">
                                <input
                                    v-model="newLocation"
                                    type="text"
                                    class="input input-bordered flex-1"
                                    placeholder="Jakarta Selatan - Jl. Raya No. 123"
                                    :disabled="saving"
                                    @keydown.enter.prevent="addLocation" />
                                <button type="button" class="btn btn-primary gap-2" @click="addLocation" :disabled="saving">
                                    <span class="iconify lucide--plus size-4" />
                                    Add
                                </button>
                            </div>

                            <div v-if="form.local_pickup.locations.length === 0" class="alert alert-info mt-2">
                                <span class="iconify lucide--info size-5" />
                                <span class="text-sm">No pickup locations added yet</span>
                            </div>

                            <div v-else class="mt-2 space-y-2">
                                <div
                                    v-for="(location, index) in form.local_pickup.locations"
                                    :key="index"
                                    class="flex items-center justify-between rounded-lg border border-base-300 bg-base-200 p-3">
                                    <span class="text-sm">{{ location }}</span>
                                    <button
                                        type="button"
                                        class="btn btn-ghost btn-sm btn-circle"
                                        @click="removeLocation(index)"
                                        :disabled="saving">
                                        <span class="iconify lucide--x size-4" />
                                    </button>
                                </div>
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
