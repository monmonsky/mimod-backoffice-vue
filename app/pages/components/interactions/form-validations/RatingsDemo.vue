<script setup lang="ts">
import { z } from "zod";

import { useFormValidation } from "./useFormValidation";

const schema = z.object({
    requiredRating: z.preprocess(
        (e) => (e === undefined ? undefined : parseInt(e as string)),
        z.number().min(1, "Please select a rating"),
    ),
});

const { formData, errors, updateFormData, handleSubmit } = useFormValidation({
    schema,
    initialValues: {
        requiredRating: 0,
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
                <label class="label text-sm font-medium" for="requiredRating">
                    Ratings ({{ formData.requiredRating }})
                </label>
                <p class="text-base-content/60 text-end text-xs">Select a rating</p>
            </div>
            <div class="rating">
                <input
                    v-for="(star, i) in 5"
                    :key="i"
                    type="radio"
                    name="requiredRating"
                    :checked="formData.requiredRating === i + 1"
                    class="mask mask-star-2 bg-orange-400"
                    aria-label="Star"
                    @change="() => updateFormData('requiredRating', i + 1)" />
            </div>
            <p
                :data-error="errors.requiredRating"
                class="text-error max-h-0 text-sm opacity-0 transition-all duration-300 data-error:max-h-8 data-error:opacity-100">
                {{ errors.requiredRating }}
            </p>
        </div>
        <div class="text-end">
            <button type="submit" class="btn btn-sm">Submit</button>
        </div>
    </form>
</template>
