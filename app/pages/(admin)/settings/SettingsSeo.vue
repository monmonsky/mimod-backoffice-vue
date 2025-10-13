<script setup lang="ts">
const { getSettings, updateSettings } = useSettings();
const { success, error: showError } = useToast();

const saving = ref(false);

const { data: settingsResponse, pending } = await getSettings("seo");

const settings = computed(() => (settingsResponse.value as any)?.data || {});

const form = ref({
    basic: {
        site_title: "",
        meta_description: "",
        meta_keywords: "",
        google_analytics_id: "",
        facebook_pixel_id: "",
        google_search_console: "",
    },
    opengraph: {
        og_title: "",
        og_description: "",
        og_type: "website",
        og_image: "",
    },
    twitter: {
        twitter_card: "summary_large_image",
        twitter_site: "",
        twitter_title: "",
        twitter_description: "",
        twitter_image: "",
    },
    schema: {
        organization_name: "",
        organization_url: "",
        organization_logo: "",
        contact_type: "Customer Service",
        contact_phone: "",
    },
    robots: {
        robots_txt: "",
    },
});

watch(
    settings,
    (newSettings) => {
        if (newSettings && Object.keys(newSettings).length > 0) {
            form.value = {
                basic: {
                    site_title: newSettings["seo.basic"]?.value?.site_title || "",
                    meta_description: newSettings["seo.basic"]?.value?.meta_description || "",
                    meta_keywords: newSettings["seo.basic"]?.value?.meta_keywords || "",
                    google_analytics_id: newSettings["seo.basic"]?.value?.google_analytics_id || "",
                    facebook_pixel_id: newSettings["seo.basic"]?.value?.facebook_pixel_id || "",
                    google_search_console: newSettings["seo.basic"]?.value?.google_search_console || "",
                },
                opengraph: {
                    og_title: newSettings["seo.opengraph"]?.value?.og_title || "",
                    og_description: newSettings["seo.opengraph"]?.value?.og_description || "",
                    og_type: newSettings["seo.opengraph"]?.value?.og_type || "website",
                    og_image: newSettings["seo.opengraph"]?.value?.og_image || "",
                },
                twitter: {
                    twitter_card: newSettings["seo.twitter"]?.value?.twitter_card || "summary_large_image",
                    twitter_site: newSettings["seo.twitter"]?.value?.twitter_site || "",
                    twitter_title: newSettings["seo.twitter"]?.value?.twitter_title || "",
                    twitter_description: newSettings["seo.twitter"]?.value?.twitter_description || "",
                    twitter_image: newSettings["seo.twitter"]?.value?.twitter_image || "",
                },
                schema: {
                    organization_name: newSettings["seo.schema"]?.value?.organization_name || "",
                    organization_url: newSettings["seo.schema"]?.value?.organization_url || "",
                    organization_logo: newSettings["seo.schema"]?.value?.organization_logo || "",
                    contact_type: newSettings["seo.schema"]?.value?.contact_type || "Customer Service",
                    contact_phone: newSettings["seo.schema"]?.value?.contact_phone || "",
                },
                robots: {
                    robots_txt: newSettings["seo.robots"]?.value?.robots_txt || "",
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
            basic: form.value.basic,
            opengraph: form.value.opengraph,
            twitter: form.value.twitter,
            schema: form.value.schema,
            robots: form.value.robots,
        };

        await updateSettings("seo", payload);
        success("SEO settings updated successfully!");
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
                <h3 class="text-lg font-semibold">SEO Settings</h3>
                <p class="text-base-content/60 mt-1 text-sm">Configure search engine optimization and tracking</p>
            </div>

            <!-- Basic SEO -->
            <div class="space-y-4">
                <h4 class="font-medium">Basic SEO</h4>
                <div class="grid grid-cols-1 gap-6">
                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Site Title <span class="text-error">*</span></legend>
                        <input v-model="form.basic.site_title" type="text" class="input w-full" required :disabled="saving" />
                    </fieldset>

                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Meta Description</legend>
                        <textarea
                            v-model="form.basic.meta_description"
                            class="textarea w-full"
                            rows="3"
                            :disabled="saving"></textarea>
                    </fieldset>

                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Meta Keywords</legend>
                        <input
                            v-model="form.basic.meta_keywords"
                            type="text"
                            class="input w-full"
                            placeholder="keyword1, keyword2, keyword3"
                            :disabled="saving" />
                    </fieldset>

                    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <fieldset class="fieldset">
                            <legend class="fieldset-legend">Google Analytics ID</legend>
                            <input
                                v-model="form.basic.google_analytics_id"
                                type="text"
                                class="input w-full"
                                placeholder="G-XXXXXXXXXX"
                                :disabled="saving" />
                        </fieldset>

                        <fieldset class="fieldset">
                            <legend class="fieldset-legend">Facebook Pixel ID</legend>
                            <input
                                v-model="form.basic.facebook_pixel_id"
                                type="text"
                                class="input w-full"
                                placeholder="XXXXXXXXXXXXXXX"
                                :disabled="saving" />
                        </fieldset>

                        <fieldset class="fieldset md:col-span-2">
                            <legend class="fieldset-legend">Google Search Console Verification</legend>
                            <input
                                v-model="form.basic.google_search_console"
                                type="text"
                                class="input w-full"
                                placeholder="verification code"
                                :disabled="saving" />
                        </fieldset>
                    </div>
                </div>
            </div>

            <!-- Open Graph -->
            <div class="divider"></div>
            <div class="space-y-4">
                <h4 class="font-medium">Open Graph (Social Sharing)</h4>
                <div class="grid grid-cols-1 gap-6">
                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">OG Title</legend>
                        <input v-model="form.opengraph.og_title" type="text" class="input w-full" :disabled="saving" />
                    </fieldset>

                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">OG Description</legend>
                        <textarea v-model="form.opengraph.og_description" class="textarea w-full" rows="2" :disabled="saving"></textarea>
                    </fieldset>

                    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <fieldset class="fieldset">
                            <legend class="fieldset-legend">OG Type</legend>
                            <select v-model="form.opengraph.og_type" class="select w-full" :disabled="saving">
                                <option value="website">Website</option>
                                <option value="article">Article</option>
                                <option value="product">Product</option>
                            </select>
                        </fieldset>

                        <fieldset class="fieldset">
                            <legend class="fieldset-legend">OG Image URL</legend>
                            <input v-model="form.opengraph.og_image" type="url" class="input w-full" :disabled="saving" />
                        </fieldset>
                    </div>
                </div>
            </div>

            <!-- Twitter Card -->
            <div class="divider"></div>
            <div class="space-y-4">
                <h4 class="font-medium">Twitter Card</h4>
                <div class="grid grid-cols-1 gap-6">
                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Twitter Card Type</legend>
                        <select v-model="form.twitter.twitter_card" class="select w-full" :disabled="saving">
                            <option value="summary">Summary</option>
                            <option value="summary_large_image">Summary Large Image</option>
                        </select>
                    </fieldset>

                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Twitter Site</legend>
                        <input
                            v-model="form.twitter.twitter_site"
                            type="text"
                            class="input w-full"
                            placeholder="@username"
                            :disabled="saving" />
                    </fieldset>

                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Twitter Title</legend>
                        <input v-model="form.twitter.twitter_title" type="text" class="input w-full" :disabled="saving" />
                    </fieldset>

                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Twitter Description</legend>
                        <textarea v-model="form.twitter.twitter_description" class="textarea w-full" rows="2" :disabled="saving"></textarea>
                    </fieldset>

                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Twitter Image URL</legend>
                        <input v-model="form.twitter.twitter_image" type="url" class="input w-full" :disabled="saving" />
                    </fieldset>
                </div>
            </div>

            <!-- Schema.org -->
            <div class="divider"></div>
            <div class="space-y-4">
                <h4 class="font-medium">Schema.org Structured Data</h4>
                <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Organization Name</legend>
                        <input v-model="form.schema.organization_name" type="text" class="input w-full" :disabled="saving" />
                    </fieldset>

                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Organization URL</legend>
                        <input v-model="form.schema.organization_url" type="url" class="input w-full" :disabled="saving" />
                    </fieldset>

                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Organization Logo URL</legend>
                        <input v-model="form.schema.organization_logo" type="url" class="input w-full" :disabled="saving" />
                    </fieldset>

                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Contact Type</legend>
                        <select v-model="form.schema.contact_type" class="select w-full" :disabled="saving">
                            <option value="Customer Service">Customer Service</option>
                            <option value="Technical Support">Technical Support</option>
                            <option value="Sales">Sales</option>
                        </select>
                    </fieldset>

                    <fieldset class="fieldset md:col-span-2">
                        <legend class="fieldset-legend">Contact Phone</legend>
                        <input v-model="form.schema.contact_phone" type="tel" class="input w-full" :disabled="saving" />
                    </fieldset>
                </div>
            </div>

            <!-- Robots.txt -->
            <div class="divider"></div>
            <div class="space-y-4">
                <h4 class="font-medium">Robots.txt</h4>
                <fieldset class="fieldset">
                    <legend class="fieldset-legend">Robots.txt Content</legend>
                    <textarea v-model="form.robots.robots_txt" class="textarea textarea-sm w-full font-mono" rows="10" :disabled="saving"></textarea>
                    <p class="text-base-content/60 mt-1 text-xs">Configure crawler access rules</p>
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
