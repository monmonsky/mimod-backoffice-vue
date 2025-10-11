<script setup lang="ts">
import EmailTestConnectionModal from "~/components/email/TestConnectionModal.vue";
const { getSettings, updateSettings } = useSettings();
const { success, error: showError } = useToast();

const saving = ref(false);

const { data: settingsResponse, pending } = await getSettings("email");

const settings = computed(() => (settingsResponse.value as any)?.data || {});

const form = ref({
    smtp: {
        host: "",
        port: 587,
        username: "",
        password: "",
        encryption: "tls",
        from_email: "",
        from_name: "",
    },
    notifications: {
        welcome_email: true,
        order_confirmation: true,
        order_shipped: true,
        order_delivered: true,
        password_reset: true,
        newsletter: false,
    },
});

watch(
    settings,
    (newSettings) => {
        if (newSettings && Object.keys(newSettings).length > 0) {
            form.value = {
                smtp: {
                    host: newSettings["email.smtp"]?.value?.host || "",
                    port: newSettings["email.smtp"]?.value?.port || 587,
                    username: newSettings["email.smtp"]?.value?.username || "",
                    password: newSettings["email.smtp"]?.value?.password || "",
                    encryption: newSettings["email.smtp"]?.value?.encryption || "tls",
                    from_email: newSettings["email.smtp"]?.value?.from_email || "",
                    from_name: newSettings["email.smtp"]?.value?.from_name || "",
                },
                notifications: {
                    welcome_email: newSettings["email.notifications"]?.value?.welcome_email || false,
                    order_confirmation: newSettings["email.notifications"]?.value?.order_confirmation || false,
                    order_shipped: newSettings["email.notifications"]?.value?.order_shipped || false,
                    order_delivered: newSettings["email.notifications"]?.value?.order_delivered || false,
                    password_reset: newSettings["email.notifications"]?.value?.password_reset || false,
                    newsletter: newSettings["email.notifications"]?.value?.newsletter || false,
                },
            };
        }
    },
    { immediate: true },
);

const showTestModal = ref(false);

const handleSubmit = async () => {
    try {
        saving.value = true;

        const payload = {
            smtp: form.value.smtp,
            notifications: form.value.notifications,
        };

        await updateSettings("email", payload);
        success("Email settings updated successfully!");
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
                <h3 class="text-lg font-semibold">Email Settings</h3>
                <p class="text-base-content/60 mt-1 text-sm">Configure email delivery and notifications</p>
            </div>

            <!-- SMTP Configuration -->
            <div class="space-y-4">
                <h4 class="font-medium">SMTP Configuration</h4>
                <div class="alert alert-info">
                    <span class="iconify lucide--info size-5" />
                    <span class="text-sm">Configure SMTP server settings for sending emails</span>
                </div>

                <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">SMTP Host <span class="text-error">*</span></legend>
                        <input
                            v-model="form.smtp.host"
                            type="text"
                            class="input w-full"
                            placeholder="smtp.example.com"
                            required
                            :disabled="saving" />
                    </fieldset>

                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">SMTP Port <span class="text-error">*</span></legend>
                        <input
                            v-model.number="form.smtp.port"
                            type="number"
                            class="input w-full"
                            placeholder="587"
                            required
                            :disabled="saving" />
                    </fieldset>

                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Encryption</legend>
                        <select v-model="form.smtp.encryption" class="select w-full" :disabled="saving">
                            <option value="tls">TLS</option>
                            <option value="ssl">SSL</option>
                            <option value="none">None</option>
                        </select>
                    </fieldset>

                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Username</legend>
                        <input v-model="form.smtp.username" type="text" class="input w-full" :disabled="saving" />
                    </fieldset>

                    <fieldset class="fieldset md:col-span-2">
                        <legend class="fieldset-legend">Password</legend>
                        <input
                            v-model="form.smtp.password"
                            type="password"
                            class="input w-full"
                            placeholder="••••••••"
                            :disabled="saving" />
                        <p class="text-base-content/60 mt-1 text-xs">Leave empty to keep current password</p>
                    </fieldset>

                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">From Email <span class="text-error">*</span></legend>
                        <input
                            v-model="form.smtp.from_email"
                            type="email"
                            class="input w-full"
                            placeholder="noreply@example.com"
                            required
                            :disabled="saving" />
                    </fieldset>

                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">From Name <span class="text-error">*</span></legend>
                        <input
                            v-model="form.smtp.from_name"
                            type="text"
                            class="input w-full"
                            placeholder="My Store"
                            required
                            :disabled="saving" />
                    </fieldset>
                </div>
            </div>

            <!-- Email Notifications -->
            <div class="divider"></div>
            <div class="space-y-4">
                <h4 class="font-medium">Email Notifications</h4>
                <p class="text-base-content/60 text-sm">Enable or disable automatic email notifications</p>

                <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <fieldset class="fieldset">
                        <label class="label cursor-pointer justify-start gap-3">
                            <input
                                v-model="form.notifications.welcome_email"
                                type="checkbox"
                                class="checkbox"
                                :disabled="saving" />
                            <div>
                                <span class="label-text">Welcome Email</span>
                                <p class="text-base-content/60 mt-0.5 text-xs">Send welcome email to new users</p>
                            </div>
                        </label>
                    </fieldset>

                    <fieldset class="fieldset">
                        <label class="label cursor-pointer justify-start gap-3">
                            <input
                                v-model="form.notifications.order_confirmation"
                                type="checkbox"
                                class="checkbox"
                                :disabled="saving" />
                            <div>
                                <span class="label-text">Order Confirmation</span>
                                <p class="text-base-content/60 mt-0.5 text-xs">Notify on order placement</p>
                            </div>
                        </label>
                    </fieldset>

                    <fieldset class="fieldset">
                        <label class="label cursor-pointer justify-start gap-3">
                            <input
                                v-model="form.notifications.order_shipped"
                                type="checkbox"
                                class="checkbox"
                                :disabled="saving" />
                            <div>
                                <span class="label-text">Order Shipped</span>
                                <p class="text-base-content/60 mt-0.5 text-xs">Notify when order is shipped</p>
                            </div>
                        </label>
                    </fieldset>

                    <fieldset class="fieldset">
                        <label class="label cursor-pointer justify-start gap-3">
                            <input
                                v-model="form.notifications.order_delivered"
                                type="checkbox"
                                class="checkbox"
                                :disabled="saving" />
                            <div>
                                <span class="label-text">Order Delivered</span>
                                <p class="text-base-content/60 mt-0.5 text-xs">Notify when order is delivered</p>
                            </div>
                        </label>
                    </fieldset>

                    <fieldset class="fieldset">
                        <label class="label cursor-pointer justify-start gap-3">
                            <input
                                v-model="form.notifications.password_reset"
                                type="checkbox"
                                class="checkbox"
                                :disabled="saving" />
                            <div>
                                <span class="label-text">Password Reset</span>
                                <p class="text-base-content/60 mt-0.5 text-xs">Send password reset emails</p>
                            </div>
                        </label>
                    </fieldset>

                    <fieldset class="fieldset">
                        <label class="label cursor-pointer justify-start gap-3">
                            <input
                                v-model="form.notifications.newsletter"
                                type="checkbox"
                                class="checkbox"
                                :disabled="saving" />
                            <div>
                                <span class="label-text">Newsletter</span>
                                <p class="text-base-content/60 mt-0.5 text-xs">Send marketing newsletters</p>
                            </div>
                        </label>
                    </fieldset>
                </div>
            </div>

            <div class="flex justify-between">
                <button type="button" class="btn btn-outline gap-2" @click="showTestModal = true" :disabled="saving">
                    <span class="iconify lucide--mail-check size-4" />
                    Test Connection
                </button>
                <div class="flex gap-3">
                    <button type="button" class="btn btn-ghost" :disabled="saving">Cancel</button>
                    <button type="submit" class="btn btn-primary" :disabled="saving">
                        <span v-if="saving" class="loading loading-spinner loading-sm"></span>
                        <span v-else class="iconify lucide--save size-4" />
                        {{ saving ? "Saving..." : "Save Changes" }}
                    </button>
                </div>
            </div>
        </form>

        <!-- Test Connection Modal -->
        <EmailTestConnectionModal
            v-if="showTestModal"
            :smtp-config="form.smtp"
            @close="showTestModal = false" />
    </div>
</template>
