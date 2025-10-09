<script setup lang="ts">
import { z } from "zod";

import { useFormValidation } from "./useFormValidation";

const schema = z.object({
    requiredToggle: z.boolean().refine((val) => val, {
        message: "Accept terms to continue",
    }),
});

const { formData, errors, handleChange, handleSubmit } = useFormValidation({
    schema,
    initialValues: {
        requiredToggle: false,
    },
});

const submitForm = (e: Event) => {
    handleSubmit(e, (data) => {
        console.info(data);
    });
};
</script>

<template>
    <form class="space-y-3" novalidate @submit.prevent="submitForm">
        <div class="space-y-1.5">
            <div class="flex items-center gap-2">
                <input
                    id="requiredToggle"
                    name="requiredToggle"
                    type="checkbox"
                    :checked="formData.requiredToggle"
                    :data-error="errors.requiredToggle"
                    class="toggle toggle-sm"
                    @change="handleChange" />
                <label for="requiredToggle">I accept the terms and conditions</label>
            </div>
            <p
                :data-error="errors.requiredToggle"
                class="text-error max-h-0 text-sm opacity-0 transition-all duration-300 data-error:max-h-8 data-error:opacity-100">
                {{ errors.requiredToggle }}
            </p>
        </div>
        <div class="text-end">
            <button type="submit" class="btn btn-sm">Submit</button>
        </div>
    </form>
</template>
