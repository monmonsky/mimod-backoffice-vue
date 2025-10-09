<script setup lang="ts">
import { z } from "zod";

import { useFormValidation } from "./useFormValidation";

const schema = z.object({
    optionalText: z.string().optional(),
    minimumText: z.string().min(3, "Text must be at least 3 characters"),
    maximumText: z.string().max(5, "Text must be at max 5 characters"),
});

const { formData, errors, handleChange, handleSubmit } = useFormValidation({
    schema,
    initialValues: {
        optionalText: "",
        minimumText: "12",
        maximumText: "123456",
    },
});

const submitForm = (e: Event) => {
    handleSubmit(e, (data) => {
        console.info(data);
    });
};
</script>

<template>
    <form novalidate class="space-y-3" @submit.prevent="submitForm">
        <div class="flex flex-col items-stretch gap-1.5">
            <div class="flex items-center justify-between gap-2">
                <label for="optionalText" class="label text-sm font-medium">Optional Text</label>
                <p class="text-base-content/60 text-end text-xs">Can empty</p>
            </div>
            <input
                id="optionalText"
                v-model="formData.optionalText"
                name="optionalText"
                type="text"
                :data-error="errors.optionalText"
                class="input data-error:input-error w-full"
                placeholder="..."
                @input="handleChange" />
            <p
                :data-error="errors.optionalText"
                class="text-error max-h-0 text-sm opacity-0 transition-all duration-300 data-error:max-h-8 data-error:opacity-100">
                {{ errors.optionalText }}
            </p>
        </div>

        <div class="flex flex-col items-stretch gap-1.5">
            <div class="flex items-center justify-between gap-2">
                <label for="minimumText" class="label text-sm font-medium">Minimum Text</label>
                <p class="text-base-content/60 text-end text-xs">Min 3 chars</p>
            </div>
            <input
                id="minimumText"
                v-model="formData.minimumText"
                name="minimumText"
                type="text"
                :data-error="errors.minimumText"
                class="input data-error:input-error w-full"
                placeholder="A1B2C3"
                @input="handleChange" />
            <p
                :data-error="errors.minimumText"
                class="text-error max-h-0 text-sm opacity-0 transition-all duration-300 data-error:max-h-8 data-error:opacity-100">
                {{ errors.minimumText }}
            </p>
        </div>

        <div class="flex flex-col items-stretch gap-1.5">
            <div class="flex items-center justify-between gap-2">
                <label for="maximumText" class="label text-sm font-medium">Maximum Text</label>
                <p class="text-base-content/60 text-end text-xs">Max 5 chars</p>
            </div>
            <input
                id="maximumText"
                v-model="formData.maximumText"
                name="maximumText"
                type="text"
                :data-error="errors.maximumText"
                class="input data-error:input-error w-full"
                placeholder="A1B2"
                @input="handleChange" />
            <p
                :data-error="errors.maximumText"
                class="text-error max-h-0 text-sm opacity-0 transition-all duration-300 data-error:max-h-8 data-error:opacity-100">
                {{ errors.maximumText }}
            </p>
        </div>

        <div class="text-end">
            <button type="submit" class="btn btn-sm">Submit</button>
        </div>
    </form>
</template>
