<script setup lang="ts">
import { z } from "zod";

import { useFormValidation } from "./useFormValidation";

const schema = z.object({
    betweenNumber: z.number().min(20, "You must be at least 20").max(80, "You must be at maximum 80"),
});

const { formData, errors, handleChange, handleSubmit } = useFormValidation({
    schema,
    initialValues: {
        betweenNumber: 15,
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
                <label class="label text-sm font-medium" for="betweenNumber">
                    Age ({{ formData.betweenNumber }})
                </label>
                <p class="text-base-content/60 text-end text-xs">Between 5 to 95</p>
            </div>
            <input
                id="betweenNumber"
                type="range"
                min="0"
                max="100"
                name="betweenNumber"
                :value="formData.betweenNumber"
                :data-error="errors.betweenNumber"
                class="range data-error:range-error range-primary range-xs w-full transition-all duration-300"
                @input="handleChange" />
            <p
                :data-error="errors.betweenNumber"
                class="text-error max-h-0 text-sm opacity-0 transition-all duration-300 data-error:max-h-8 data-error:opacity-100">
                {{ errors.betweenNumber }}
            </p>
        </div>
        <div class="text-end">
            <button type="submit" class="btn btn-sm">Submit</button>
        </div>
    </form>
</template>
