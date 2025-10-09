<script setup lang="ts">
import { z } from "zod";

import { useFormValidation } from "./useFormValidation";

const schema = z.object({
    optionalNumber: z.preprocess((val) => (val === "" ? undefined : val), z.number().optional()),
    minimumNumber: z.number().min(18, "You must be at least 18"),
    maximumNumber: z.number().max(99, "You must be at maximum 99"),
});

const { formData, errors, handleChange, handleSubmit } = useFormValidation({
    schema,
    initialValues: {
        optionalNumber: "" as unknown as number,
        minimumNumber: 17,
        maximumNumber: 100,
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
        <div class="space-y-1.5">
            <div class="flex items-center justify-between gap-2">
                <label class="label text-sm font-medium" for="optionalNumber"> Optional Number </label>
                <p class="text-base-content/60 text-end text-xs">Can empty</p>
            </div>
            <input
                id="optionalNumber"
                name="optionalNumber"
                type="number"
                :value="formData.optionalNumber"
                :data-error="errors.optionalNumber"
                class="input data-error:input-error w-full"
                placeholder="..."
                @input="handleChange" />
            <p
                :data-error="errors.optionalNumber"
                class="text-error max-h-0 text-sm opacity-0 transition-all duration-300 data-error:max-h-8 data-error:opacity-100">
                {{ errors.optionalNumber }}
            </p>
        </div>

        <div class="space-y-1.5">
            <div class="flex items-center justify-between gap-2">
                <label class="label text-sm font-medium" for="minimumNumber"> Minimum Number </label>
                <p class="text-base-content/60 text-end text-xs">Minimum 18</p>
            </div>
            <input
                id="minimumNumber"
                name="minimumNumber"
                type="number"
                :value="formData.minimumNumber"
                :data-error="errors.minimumNumber"
                class="input data-error:input-error w-full"
                placeholder="Required Text"
                @input="handleChange" />
            <p
                :data-error="errors.minimumNumber"
                class="text-error max-h-0 text-sm opacity-0 transition-all duration-300 data-error:max-h-8 data-error:opacity-100">
                {{ errors.minimumNumber }}
            </p>
        </div>

        <div class="space-y-1.5">
            <div class="flex items-center justify-between gap-2">
                <label class="label text-sm font-medium" for="maximumNumber"> Maximum Number </label>
                <p class="text-base-content/60 text-end text-xs">Maximum 99</p>
            </div>
            <input
                id="maximumNumber"
                name="maximumNumber"
                type="number"
                :value="formData.maximumNumber"
                :data-error="errors.maximumNumber"
                class="input data-error:input-error w-full"
                placeholder="Required Text"
                @input="handleChange" />
            <p
                :data-error="errors.maximumNumber"
                class="text-error max-h-0 text-sm opacity-0 transition-all duration-300 data-error:max-h-8 data-error:opacity-100">
                {{ errors.maximumNumber }}
            </p>
        </div>

        <div class="text-end">
            <button type="submit" class="btn btn-sm">Submit</button>
        </div>
    </form>
</template>
