<script setup lang="ts">
import { z } from "zod";

import { useFormValidation } from "./useFormValidation";

const schema = z.object({
    requiredCheckbox: z.boolean().refine((val) => val, {
        message: "Accept terms to continue",
    }),
});

const { formData, errors, handleChange, handleSubmit } = useFormValidation({
    schema,
    initialValues: {
        requiredCheckbox: false,
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
                    id="requiredCheckbox"
                    name="requiredCheckbox"
                    type="checkbox"
                    :checked="formData.requiredCheckbox"
                    :data-error="errors.requiredCheckbox"
                    class="checkbox checkbox-sm data-error:checkbox-error"
                    @change="handleChange" />
                <label for="requiredCheckbox">I accept the terms and conditions</label>
            </div>
            <p
                :data-error="errors.requiredCheckbox"
                class="text-error max-h-0 text-sm opacity-0 transition-all duration-300 data-error:max-h-8 data-error:opacity-100">
                {{ errors.requiredCheckbox }}
            </p>
        </div>
        <div class="text-end">
            <button type="submit" class="btn btn-sm">Submit</button>
        </div>
    </form>
</template>
