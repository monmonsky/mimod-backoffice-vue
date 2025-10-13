<script setup lang="ts">
interface SmtpConfig {
    host: string;
    port: number;
    username: string;
    password: string;
    encryption: string;
    from_email: string;
    from_name: string;
}

const props = defineProps<{
    smtpConfig: SmtpConfig;
}>();

const emit = defineEmits<{
    close: [];
}>();

const { success, error: showError } = useToast();
const config = useRuntimeConfig();
const authStore = useAuthStore();

const form = ref({
    test_email: "",
    use_custom_config: false,
});

const testing = ref(false);
const testResult = ref<any>(null);

const handleTest = async () => {
    if (!form.value.test_email) {
        showError("Please enter test email address");
        return;
    }

    try {
        testing.value = true;
        testResult.value = null;

        const payload: any = {
            test_email: form.value.test_email,
        };

        if (form.value.use_custom_config) {
            payload.use_custom_config = true;
            payload.smtp_host = props.smtpConfig.host;
            payload.smtp_port = props.smtpConfig.port;
            payload.smtp_username = props.smtpConfig.username;
            payload.smtp_password = props.smtpConfig.password;
            payload.smtp_encryption = props.smtpConfig.encryption;
            payload.from_address = props.smtpConfig.from_email;
            payload.from_name = props.smtpConfig.from_name;
        }

        const response = (await $fetch("/email/test-connection", {
            method: "POST",
            baseURL: config.public.apiBase,
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
            body: payload,
        })) as any;

        testResult.value = response.data;
        success("Email sent successfully! Please check your inbox.");
    } catch (err: any) {
        showError(err?.data?.message || "Failed to send test email");
        testResult.value = null;
    } finally {
        testing.value = false;
    }
};

</script>

<template>
    <dialog class="modal modal-open">
        <div class="modal-box max-w-2xl">
            <h3 class="flex items-center gap-2 text-lg font-bold">
                <span class="iconify lucide--mail-check size-5 text-primary" />
                Test Email Connection
            </h3>
            <p class="text-base-content/60 mt-2 text-sm">Send a test email to verify your SMTP configuration</p>

            <form @submit.prevent="handleTest" class="mt-6 space-y-4">
                <fieldset class="fieldset">
                    <legend class="fieldset-legend">Test Email Address <span class="text-error">*</span></legend>
                    <input
                        v-model="form.test_email"
                        type="email"
                        class="input input-bordered w-full"
                        placeholder="recipient@example.com"
                        :disabled="testing" />
                    <p class="text-base-content/60 mt-1 text-xs">Enter the email address to receive the test email</p>
                </fieldset>

                <fieldset class="fieldset">
                    <label class="label cursor-pointer justify-start gap-3">
                        <input v-model="form.use_custom_config" type="checkbox" class="checkbox" :disabled="testing" />
                        <div>
                            <span class="label-text font-medium">Use current form configuration</span>
                            <p class="text-base-content/60 mt-1 text-xs">
                                Test with the SMTP settings shown in the form above (not saved settings)
                            </p>
                        </div>
                    </label>
                </fieldset>

                <div v-if="!form.use_custom_config" class="alert alert-info">
                    <span class="iconify lucide--info size-5" />
                    <div>
                        <p class="text-sm font-semibold">Testing with saved configuration</p>
                        <p class="text-xs">Using SMTP settings from your .env or database</p>
                    </div>
                </div>

                <div v-if="testResult" class="alert alert-success">
                    <span class="iconify lucide--check-circle size-5" />
                    <div>
                        <p class="text-sm font-semibold">{{ testResult.message }}</p>
                        <div class="mt-2 space-y-1 text-xs">
                            <p><strong>Duration:</strong> {{ testResult.duration_ms?.toFixed(2) }}ms</p>
                            <p><strong>Host:</strong> {{ testResult.config_used?.host }}:{{ testResult.config_used?.port }}</p>
                            <p><strong>Encryption:</strong> {{ testResult.config_used?.encryption?.toUpperCase() }}</p>
                            <p><strong>From:</strong> {{ testResult.config_used?.from_name }} &lt;{{ testResult.config_used?.from_address }}&gt;</p>
                        </div>
                    </div>
                </div>

                <div class="modal-action">
                    <button type="button" class="btn btn-ghost" :disabled="testing" @click="emit('close')">Close</button>
                    <button type="submit" class="btn btn-primary" :disabled="testing">
                        <span v-if="testing" class="loading loading-spinner loading-sm"></span>
                        <span v-else class="iconify lucide--send size-4" />
                        {{ testing ? "Sending..." : "Send Test Email" }}
                    </button>
                </div>
            </form>
        </div>
        <div class="modal-backdrop" @click="emit('close')"></div>
    </dialog>
</template>
