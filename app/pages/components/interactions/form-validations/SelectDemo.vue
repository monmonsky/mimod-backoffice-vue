<script setup lang="ts">
import { z } from "zod";

import { useFormValidation } from "./useFormValidation";

const schema = z.object({
    requiredSelect: z.string().min(1, "Select a country"),
});

const { formData, errors, handleChange, handleSubmit } = useFormValidation({
    schema,
    initialValues: {
        requiredSelect: "",
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
                <label class="label text-sm font-medium" for="requiredSelect"> Select </label>
                <p class="text-base-content/60 text-end text-xs">*</p>
            </div>
            <select
                id="requiredSelect"
                name="requiredSelect"
                :value="formData.requiredSelect"
                :data-error="errors.requiredSelect"
                class="select data-error:select-error w-full"
                @change="handleChange">
                <option value="">Select Country</option>
                <option value="india">India</option>
                <option value="usa">USA</option>
                <option value="germany">Germany</option>
            </select>
            <p
                :data-error="errors.requiredSelect"
                class="text-error max-h-0 text-sm opacity-0 transition-all duration-300 data-error:max-h-8 data-error:opacity-100">
                {{ errors.requiredSelect }}
            </p>
        </div>
        <div class="text-end">
            <button type="submit" class="btn btn-sm">Submit</button>
        </div>
    </form>
</template>
