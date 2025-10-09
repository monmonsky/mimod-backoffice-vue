<script setup lang="ts">
import { z } from "zod";

import { useFormValidation } from "./useFormValidation";

const schema = z.object({
    requiredEmail: z.email("Invalid email address"),
    optionalEmail: z.preprocess((val) => (val === "" ? undefined : val), z.email("Invalid email address").optional()),
});

const { formData, errors, handleChange, handleSubmit } = useFormValidation({
    schema,
    initialValues: {
        optionalEmail: "",
        requiredEmail: "",
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
            <div class="flex items-center justify-between gap-2">
                <label class="label text-sm font-medium" for="optionalEmail"> Optional Email </label>
                <p class="text-base-content/60 text-end text-xs">Can empty</p>
            </div>
            <input
                id="optionalEmail"
                name="optionalEmail"
                type="email"
                :value="formData.optionalEmail"
                :data-error="errors.optionalEmail"
                class="input data-error:input-error w-full"
                placeholder="abc@mail.com"
                @input="handleChange" />
            <p
                :data-error="errors.optionalEmail"
                class="text-error max-h-0 text-sm opacity-0 transition-all duration-300 data-error:max-h-8 data-error:opacity-100">
                {{ errors.optionalEmail }}
            </p>
        </div>

        <div class="space-y-1.5">
            <div class="flex items-center justify-between gap-2">
                <label class="label text-sm font-medium" for="requiredEmail"> Email Address </label>
                <p class="text-base-content/60 text-end text-xs">*</p>
            </div>
            <input
                id="requiredEmail"
                name="requiredEmail"
                type="email"
                :value="formData.requiredEmail"
                :data-error="errors.requiredEmail"
                class="input data-error:input-error w-full"
                placeholder="abc@mail.com"
                @input="handleChange" />
            <p
                :data-error="errors.requiredEmail"
                class="text-error max-h-0 text-sm opacity-0 transition-all duration-300 data-error:max-h-8 data-error:opacity-100">
                {{ errors.requiredEmail }}
            </p>
        </div>

        <div class="text-end">
            <button type="submit" class="btn btn-sm">Submit</button>
        </div>
    </form>
</template>
