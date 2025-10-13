<script setup lang="ts">
const { getSettings, updateSettings } = useSettings();
const { success, error: showError } = useToast();

const saving = ref(false);

const { data: settingsResponse, pending } = await getSettings("shipping");

const settings = computed(() => (settingsResponse.value as any)?.data || {});

interface Origin {
    name: string;
    address: string;
    city_id: number;
    city_name: string;
    province_id: number;
    province_name: string;
    postal_code: string;
    phone: string;
    is_active: boolean;
}

const form = ref({
    primary: {
        name: "",
        address: "",
        city_id: 0,
        city_name: "",
        province_id: 0,
        province_name: "",
        postal_code: "",
        phone: "",
        is_active: true,
    } as Origin,
    additional: [] as Origin[],
});

watch(
    settings,
    (newSettings) => {
        if (newSettings && Object.keys(newSettings).length > 0) {
            const originData = newSettings["shipping.origin"]?.value;
            if (originData) {
                form.value = {
                    primary: originData.primary || {
                        name: "",
                        address: "",
                        city_id: 0,
                        city_name: "",
                        province_id: 0,
                        province_name: "",
                        postal_code: "",
                        phone: "",
                        is_active: true,
                    },
                    additional: originData.additional || [],
                };
            }
        }
    },
    { immediate: true },
);

const addOrigin = () => {
    form.value.additional.push({
        name: "",
        address: "",
        city_id: 0,
        city_name: "",
        province_id: 0,
        province_name: "",
        postal_code: "",
        phone: "",
        is_active: true,
    });
};

const removeOrigin = (index: number) => {
    form.value.additional.splice(index, 1);
};

const handleSubmit = async () => {
    try {
        saving.value = true;

        const payload = {
            origin: form.value,
        };

        await updateSettings("shipping", payload);
        success("Shipping origin settings updated successfully!");
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
                <h3 class="text-lg font-semibold">Shipping Origin Configuration</h3>
                <p class="text-base-content/60 mt-1 text-sm">Configure warehouse/store addresses for shipping calculation</p>
            </div>

            <!-- Primary Origin -->
            <div class="space-y-4">
                <div class="flex items-center gap-2">
                    <span class="iconify lucide--map-pin size-5 text-primary" />
                    <h4 class="font-medium">Primary Origin</h4>
                </div>

                <div class="card border border-primary/20 bg-primary/5">
                    <div class="card-body">
                        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <fieldset class="fieldset">
                                <legend class="fieldset-legend">Warehouse Name <span class="text-error">*</span></legend>
                                <input
                                    v-model="form.primary.name"
                                    type="text"
                                    class="input input-bordered w-full"
                                    placeholder="Main Warehouse"
                                    :disabled="saving" />
                            </fieldset>

                            <fieldset class="fieldset">
                                <legend class="fieldset-legend">Phone</legend>
                                <input
                                    v-model="form.primary.phone"
                                    type="tel"
                                    class="input input-bordered w-full"
                                    placeholder="+62 21 1234 5678"
                                    :disabled="saving" />
                            </fieldset>

                            <fieldset class="fieldset md:col-span-2">
                                <legend class="fieldset-legend">Address <span class="text-error">*</span></legend>
                                <textarea
                                    v-model="form.primary.address"
                                    class="textarea textarea-bordered w-full"
                                    rows="2"
                                    placeholder="Jl. Raya No. 123"
                                    :disabled="saving"></textarea>
                            </fieldset>

                            <fieldset class="fieldset">
                                <legend class="fieldset-legend">Province Name</legend>
                                <input
                                    v-model="form.primary.province_name"
                                    type="text"
                                    class="input input-bordered w-full"
                                    placeholder="DKI Jakarta"
                                    :disabled="saving" />
                            </fieldset>

                            <fieldset class="fieldset">
                                <legend class="fieldset-legend">Province ID (RajaOngkir)</legend>
                                <input
                                    v-model.number="form.primary.province_id"
                                    type="number"
                                    class="input input-bordered w-full"
                                    placeholder="6"
                                    :disabled="saving" />
                            </fieldset>

                            <fieldset class="fieldset">
                                <legend class="fieldset-legend">City Name</legend>
                                <input
                                    v-model="form.primary.city_name"
                                    type="text"
                                    class="input input-bordered w-full"
                                    placeholder="Jakarta Selatan"
                                    :disabled="saving" />
                            </fieldset>

                            <fieldset class="fieldset">
                                <legend class="fieldset-legend">City ID (RajaOngkir) <span class="text-error">*</span></legend>
                                <input
                                    v-model.number="form.primary.city_id"
                                    type="number"
                                    class="input input-bordered w-full"
                                    placeholder="152"
                                    :disabled="saving" />
                            </fieldset>

                            <fieldset class="fieldset">
                                <legend class="fieldset-legend">Postal Code</legend>
                                <input
                                    v-model="form.primary.postal_code"
                                    type="text"
                                    class="input input-bordered w-full"
                                    placeholder="12345"
                                    :disabled="saving" />
                            </fieldset>

                            <fieldset class="fieldset">
                                <label class="label cursor-pointer justify-start gap-3">
                                    <input v-model="form.primary.is_active" type="checkbox" class="checkbox" :disabled="saving" />
                                    <span class="label-text">Active</span>
                                </label>
                            </fieldset>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Additional Origins -->
            <div class="divider"></div>
            <div class="space-y-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <span class="iconify lucide--warehouse size-5" />
                        <h4 class="font-medium">Additional Warehouses</h4>
                    </div>
                    <button type="button" class="btn btn-sm btn-outline gap-2" @click="addOrigin" :disabled="saving">
                        <span class="iconify lucide--plus size-4" />
                        Add Warehouse
                    </button>
                </div>

                <div v-if="form.additional.length === 0" class="alert alert-info">
                    <span class="iconify lucide--info size-5" />
                    <span class="text-sm">No additional warehouses configured. Orders will ship from primary origin.</span>
                </div>

                <div v-for="(origin, index) in form.additional" :key="index" class="card border border-base-300">
                    <div class="card-body">
                        <div class="flex items-center justify-between">
                            <h5 class="font-medium">Warehouse {{ index + 1 }}</h5>
                            <button
                                type="button"
                                class="btn btn-ghost btn-sm btn-circle"
                                @click="removeOrigin(index)"
                                :disabled="saving">
                                <span class="iconify lucide--trash-2 size-4 text-error" />
                            </button>
                        </div>

                        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <fieldset class="fieldset">
                                <legend class="fieldset-legend">Warehouse Name <span class="text-error">*</span></legend>
                                <input
                                    v-model="origin.name"
                                    type="text"
                                    class="input input-bordered w-full"
                                    placeholder="Secondary Warehouse"
                                    :disabled="saving" />
                            </fieldset>

                            <fieldset class="fieldset">
                                <legend class="fieldset-legend">Phone</legend>
                                <input
                                    v-model="origin.phone"
                                    type="tel"
                                    class="input input-bordered w-full"
                                    placeholder="+62 21 1234 5678"
                                    :disabled="saving" />
                            </fieldset>

                            <fieldset class="fieldset md:col-span-2">
                                <legend class="fieldset-legend">Address <span class="text-error">*</span></legend>
                                <textarea
                                    v-model="origin.address"
                                    class="textarea textarea-bordered w-full"
                                    rows="2"
                                    :disabled="saving"></textarea>
                            </fieldset>

                            <fieldset class="fieldset">
                                <legend class="fieldset-legend">Province Name</legend>
                                <input
                                    v-model="origin.province_name"
                                    type="text"
                                    class="input input-bordered w-full"
                                    :disabled="saving" />
                            </fieldset>

                            <fieldset class="fieldset">
                                <legend class="fieldset-legend">Province ID</legend>
                                <input v-model.number="origin.province_id" type="number" class="input input-bordered w-full" :disabled="saving" />
                            </fieldset>

                            <fieldset class="fieldset">
                                <legend class="fieldset-legend">City Name</legend>
                                <input v-model="origin.city_name" type="text" class="input input-bordered w-full" :disabled="saving" />
                            </fieldset>

                            <fieldset class="fieldset">
                                <legend class="fieldset-legend">City ID <span class="text-error">*</span></legend>
                                <input v-model.number="origin.city_id" type="number" class="input input-bordered w-full" :disabled="saving" />
                            </fieldset>

                            <fieldset class="fieldset">
                                <legend class="fieldset-legend">Postal Code</legend>
                                <input v-model="origin.postal_code" type="text" class="input input-bordered w-full" :disabled="saving" />
                            </fieldset>

                            <fieldset class="fieldset">
                                <label class="label cursor-pointer justify-start gap-3">
                                    <input v-model="origin.is_active" type="checkbox" class="checkbox" :disabled="saving" />
                                    <span class="label-text">Active</span>
                                </label>
                            </fieldset>
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
