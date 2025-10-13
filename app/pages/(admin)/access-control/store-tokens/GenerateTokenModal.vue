<script setup lang="ts">
const emit = defineEmits<{
    close: [];
    success: [token: string];
}>();

const { generateToken } = useStoreTokens();
const { error: showError } = useToast();

const form = ref({
    name: "",
    revoke_existing: false,
});

const generating = ref(false);

const handleSubmit = async () => {
    if (!form.value.name.trim()) {
        showError("Please enter a token name");
        return;
    }

    try {
        generating.value = true;

        const response = (await generateToken({
            name: form.value.name,
            revoke_existing: form.value.revoke_existing,
        })) as any;

        const token = response.data.token;
        emit("success", token);
    } catch (err: any) {
        showError(err?.data?.message || "Failed to generate token");
    } finally {
        generating.value = false;
    }
};

</script>

<template>
    <dialog class="modal modal-open">
        <div class="modal-box">
            <h3 class="text-lg font-bold">Generate New Store API Token</h3>
            <p class="text-base-content/60 py-2 text-sm">Create a new API token for store frontend access</p>

            <form @submit.prevent="handleSubmit" class="space-y-4">
                <fieldset class="fieldset">
                    <legend class="fieldset-legend">Token Name <span class="text-error">*</span></legend>
                    <input
                        v-model="form.name"
                        type="text"
                        class="input input-bordered w-full"
                        placeholder="e.g., Store Frontend - Production"
                        :disabled="generating" />
                    <p class="text-base-content/60 mt-1 text-xs">A descriptive name to identify this token</p>
                </fieldset>

                <fieldset class="fieldset">
                    <label class="label cursor-pointer justify-start gap-3">
                        <input v-model="form.revoke_existing" type="checkbox" class="checkbox" :disabled="generating" />
                        <div>
                            <span class="label-text">Revoke existing tokens</span>
                            <p class="text-base-content/60 mt-1 text-xs">
                                All previously generated tokens will be invalidated
                            </p>
                        </div>
                    </label>
                </fieldset>

                <div v-if="form.revoke_existing" class="alert alert-warning">
                    <span class="iconify lucide--alert-triangle size-5" />
                    <div>
                        <p class="text-sm font-semibold">Warning!</p>
                        <p class="text-xs">
                            This will revoke all existing tokens. Any applications using those tokens will immediately lose access.
                        </p>
                    </div>
                </div>

                <div class="modal-action">
                    <button type="button" class="btn btn-ghost" :disabled="generating" @click="emit('close')">
                        Cancel
                    </button>
                    <button type="submit" class="btn btn-primary" :disabled="generating">
                        <span v-if="generating" class="loading loading-spinner loading-sm"></span>
                        <span v-else class="iconify lucide--key size-4" />
                        {{ generating ? "Generating..." : "Generate Token" }}
                    </button>
                </div>
            </form>
        </div>
        <div class="modal-backdrop" @click="emit('close')"></div>
    </dialog>
</template>
