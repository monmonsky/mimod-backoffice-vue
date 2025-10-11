<script setup lang="ts">
const { getSettings, updateSettings } = useSettings();
const { success, error: showError } = useToast();

const saving = ref(false);

const { data: settingsResponse, pending } = await getSettings("store");

const settings = computed(() => (settingsResponse.value as any)?.data || {});

const form = ref({
    info: {
        name: "",
        tagline: "",
        description: "",
        logo: null as string | null,
        favicon: null as string | null,
    },
    contact: {
        email: "",
        phone: "",
        whatsapp: "",
    },
    address: {
        street: "",
        city: "",
        state: "",
        country: "",
        postal_code: "",
    },
    social: {
        facebook: "",
        instagram: "",
        twitter: "",
        youtube: "",
        tiktok: "",
    },
    operating_hours: {
        hours: "",
    },
});

watch(
    settings,
    (newSettings) => {
        if (newSettings && Object.keys(newSettings).length > 0) {
            form.value = {
                info: {
                    name: newSettings["store.info"]?.value?.name || "",
                    tagline: newSettings["store.info"]?.value?.tagline || "",
                    description: newSettings["store.info"]?.value?.description || "",
                    logo: newSettings["store.info"]?.value?.logo || null,
                    favicon: newSettings["store.info"]?.value?.favicon || null,
                },
                contact: {
                    email: newSettings["store.contact"]?.value?.email || "",
                    phone: newSettings["store.contact"]?.value?.phone || "",
                    whatsapp: newSettings["store.contact"]?.value?.whatsapp || "",
                },
                address: {
                    street: newSettings["store.address"]?.value?.street || "",
                    city: newSettings["store.address"]?.value?.city || "",
                    state: newSettings["store.address"]?.value?.state || "",
                    country: newSettings["store.address"]?.value?.country || "",
                    postal_code: newSettings["store.address"]?.value?.postal_code || "",
                },
                social: {
                    facebook: newSettings["store.social"]?.value?.facebook || "",
                    instagram: newSettings["store.social"]?.value?.instagram || "",
                    twitter: newSettings["store.social"]?.value?.twitter || "",
                    youtube: newSettings["store.social"]?.value?.youtube || "",
                    tiktok: newSettings["store.social"]?.value?.tiktok || "",
                },
                operating_hours: {
                    hours: newSettings["store.operating_hours"]?.value?.hours || "",
                },
            };
        }
    },
    { immediate: true },
);

const handleSubmit = async () => {
    try {
        saving.value = true;

        const payload = {
            info: form.value.info,
            contact: form.value.contact,
            address: form.value.address,
            social: form.value.social,
            operating_hours: form.value.operating_hours,
        };

        await updateSettings("store", payload);
        success("Store settings updated successfully!");
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
                <h3 class="text-lg font-semibold">Store Settings</h3>
                <p class="text-base-content/60 mt-1 text-sm">Configure your store information</p>
            </div>

            <!-- Store Information -->
            <div class="space-y-4">
                <h4 class="font-medium">Store Information</h4>
                <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Store Name <span class="text-error">*</span></legend>
                        <input v-model="form.info.name" type="text" class="input w-full" required :disabled="saving" />
                    </fieldset>

                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Tagline</legend>
                        <input v-model="form.info.tagline" type="text" class="input w-full" :disabled="saving" />
                    </fieldset>

                    <fieldset class="fieldset md:col-span-2">
                        <legend class="fieldset-legend">Description</legend>
                        <textarea
                            v-model="form.info.description"
                            class="textarea w-full"
                            rows="3"
                            :disabled="saving"></textarea>
                    </fieldset>
                </div>
            </div>

            <!-- Contact Information -->
            <div class="divider"></div>
            <div class="space-y-4">
                <h4 class="font-medium">Contact Information</h4>
                <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Email <span class="text-error">*</span></legend>
                        <input
                            v-model="form.contact.email"
                            type="email"
                            class="input w-full"
                            required
                            :disabled="saving" />
                    </fieldset>

                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Phone</legend>
                        <input v-model="form.contact.phone" type="tel" class="input w-full" :disabled="saving" />
                    </fieldset>

                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">WhatsApp</legend>
                        <input v-model="form.contact.whatsapp" type="tel" class="input w-full" :disabled="saving" />
                    </fieldset>
                </div>
            </div>

            <!-- Address -->
            <div class="divider"></div>
            <div class="space-y-4">
                <h4 class="font-medium">Address</h4>
                <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <fieldset class="fieldset md:col-span-2">
                        <legend class="fieldset-legend">Street Address</legend>
                        <textarea v-model="form.address.street" class="textarea w-full" rows="2" :disabled="saving"></textarea>
                    </fieldset>

                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">City</legend>
                        <input v-model="form.address.city" type="text" class="input w-full" :disabled="saving" />
                    </fieldset>

                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">State/Province</legend>
                        <input v-model="form.address.state" type="text" class="input w-full" :disabled="saving" />
                    </fieldset>

                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Country</legend>
                        <input v-model="form.address.country" type="text" class="input w-full" :disabled="saving" />
                    </fieldset>

                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Postal Code</legend>
                        <input v-model="form.address.postal_code" type="text" class="input w-full" :disabled="saving" />
                    </fieldset>
                </div>
            </div>

            <!-- Social Media -->
            <div class="divider"></div>
            <div class="space-y-4">
                <h4 class="font-medium">Social Media</h4>
                <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Facebook</legend>
                        <input v-model="form.social.facebook" type="url" class="input w-full" :disabled="saving" />
                    </fieldset>

                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Instagram</legend>
                        <input v-model="form.social.instagram" type="url" class="input w-full" :disabled="saving" />
                    </fieldset>

                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Twitter</legend>
                        <input v-model="form.social.twitter" type="url" class="input w-full" :disabled="saving" />
                    </fieldset>

                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">YouTube</legend>
                        <input v-model="form.social.youtube" type="url" class="input w-full" :disabled="saving" />
                    </fieldset>

                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">TikTok</legend>
                        <input v-model="form.social.tiktok" type="url" class="input w-full" :disabled="saving" />
                    </fieldset>
                </div>
            </div>

            <!-- Operating Hours -->
            <div class="divider"></div>
            <div class="space-y-4">
                <h4 class="font-medium">Operating Hours</h4>
                <fieldset class="fieldset">
                    <legend class="fieldset-legend">Hours</legend>
                    <textarea
                        v-model="form.operating_hours.hours"
                        class="textarea w-full"
                        rows="4"
                        placeholder="Monday - Friday: 09:00 - 18:00&#10;Saturday: 09:00 - 15:00&#10;Sunday: Closed"
                        :disabled="saving"></textarea>
                </fieldset>
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
