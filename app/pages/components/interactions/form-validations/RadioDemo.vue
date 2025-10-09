<script setup lang="ts">
import { z } from "zod";

import { useFormValidation } from "./useFormValidation";

const schema = z.object({
    requiredRadio: z.enum(["male", "female", "other"], { message: "Select gender" }),
});

const { formData, errors, handleChange, handleSubmit } = useFormValidation({
    schema,
    initialValues: {
        requiredRadio: "" as unknown as "male" | "female" | "other",
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
                <label class="label text-sm font-medium" for="requiredRadio"> Gender </label>
                <p class="text-base-content/60 text-end text-xs">*</p>
            </div>
            <div class="flex gap-2">
                <label v-for="g in ['male', 'female', 'other']" :key="g" class="label cursor-pointer gap-2">
                    <input
                        type="radio"
                        name="requiredRadio"
                        :value="g"
                        :checked="formData.requiredRadio === g"
                        class="radio radio-sm"
                        @change="handleChange" />
                    <span class="capitalize">{{ g }}</span>
                </label>
            </div>
            <p
                :data-error="errors.requiredRadio"
                class="text-error max-h-0 text-sm opacity-0 transition-all duration-300 data-error:max-h-8 data-error:opacity-100">
                {{ errors.requiredRadio }}
            </p>
        </div>
        <div class="text-end">
            <button type="submit" class="btn btn-sm">Submit</button>
        </div>
    </form>
</template>
