<script setup lang="ts">
import { z } from "zod";

import { useFormValidation } from "./useFormValidation";

const schema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters long"),
    lastName: z.string().min(2, "Last name must be at least 2 characters long"),
    username: z.string().min(2, "Username must be at least 2 characters long"),
    email: z.email("Invalid email address"),
    phoneNumber: z.string().regex(/^[0-9]{10}$/, "Phone number must be 10 digits long"),
    dob: z.iso.date("Invalid date of birth"),
});

const { formData, errors, handleChange, handleSubmit, handleClear } = useFormValidation({
    schema,
    initialValues: {
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        phoneNumber: "",
        dob: new Date().toLocaleString(),
    },
});

const submitForm = (e: Event) => {
    handleSubmit(e, (data) => {
        console.info(data);
    });
};
</script>

<template>
    <form novalidate @submit.prevent="submitForm">
        <div class="grid grid-cols-1 gap-5 xl:grid-cols-2 2xl:grid-cols-3">
            <div class="flex flex-col gap-1">
                <div class="flex items-center justify-between gap-2">
                    <label class="label text-sm font-medium" for="firstName">First Name</label>
                    <p class="text-base-content/60 text-end text-xs">*</p>
                </div>
                <label for="firstName" class="input data-error:input-error w-full" :data-error="errors.firstName">
                    <span class="iconify lucide--user size-4.5" />
                    <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        :value="formData.firstName"
                        placeholder="Den"
                        @input="handleChange" />
                </label>
                <p
                    :data-error="errors.firstName"
                    class="text-error max-h-0 text-sm opacity-0 transition-all duration-300 data-error:max-h-8 data-error:opacity-100">
                    {{ errors.firstName }}
                </p>
            </div>

            <div class="flex flex-col gap-1">
                <div class="flex items-center justify-between gap-2">
                    <label class="label text-sm font-medium" for="lastName">Last Name</label>
                    <p class="text-base-content/60 text-end text-xs">*</p>
                </div>
                <label for="lastName" class="input data-error:input-error w-full" :data-error="errors.lastName">
                    <span class="iconify lucide--user size-4.5" />
                    <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        :value="formData.lastName"
                        placeholder="Navadiya"
                        @input="handleChange" />
                </label>
                <p
                    :data-error="errors.lastName"
                    class="text-error max-h-0 text-sm opacity-0 transition-all duration-300 data-error:max-h-8 data-error:opacity-100">
                    {{ errors.lastName }}
                </p>
            </div>

            <div class="flex flex-col gap-1">
                <div class="flex items-center justify-between gap-2">
                    <label class="label text-sm font-medium" for="username">Username</label>
                    <p class="text-base-content/60 text-end text-xs">*</p>
                </div>
                <label for="username" class="input data-error:input-error w-full" :data-error="errors.username">
                    <span class="iconify lucide--at-sign size-4.5" />
                    <input
                        id="username"
                        name="username"
                        type="text"
                        :value="formData.username"
                        placeholder="withden"
                        @input="handleChange" />
                </label>
                <p
                    :data-error="errors.username"
                    class="text-error max-h-0 text-sm opacity-0 transition-all duration-300 data-error:max-h-8 data-error:opacity-100">
                    {{ errors.username }}
                </p>
            </div>

            <div class="flex flex-col gap-1">
                <div class="flex items-center justify-between gap-2">
                    <label class="label text-sm font-medium" for="email">Email</label>
                    <p class="text-base-content/60 text-end text-xs">*</p>
                </div>
                <label for="email" class="input data-error:input-error w-full" :data-error="errors.email">
                    <span class="iconify lucide--mail size-4.5" />
                    <input
                        id="email"
                        name="email"
                        type="email"
                        :value="formData.email"
                        placeholder="abc@xyz.com"
                        @input="handleChange" />
                </label>
                <p
                    :data-error="errors.email"
                    class="text-error max-h-0 text-sm opacity-0 transition-all duration-300 data-error:max-h-8 data-error:opacity-100">
                    {{ errors.email }}
                </p>
            </div>

            <div class="flex flex-col gap-1">
                <div class="flex items-center justify-between gap-2">
                    <label class="label text-sm font-medium" for="phoneNumber">Phone Number</label>
                    <p class="text-base-content/60 text-end text-xs">*</p>
                </div>
                <label for="phoneNumber" class="input data-error:input-error w-full" :data-error="errors.phoneNumber">
                    <span class="iconify lucide--phone size-4.5" />
                    <input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        :value="formData.phoneNumber"
                        placeholder="+84 78965 12335"
                        @input="handleChange" />
                </label>
                <p
                    :data-error="errors.phoneNumber"
                    class="text-error max-h-0 text-sm opacity-0 transition-all duration-300 data-error:max-h-8 data-error:opacity-100">
                    {{ errors.phoneNumber }}
                </p>
            </div>

            <div class="flex flex-col gap-1">
                <div class="flex items-center justify-between gap-2">
                    <label class="label text-sm font-medium" for="dob">Date of Birth</label>
                    <p class="text-base-content/60 text-end text-xs">*</p>
                </div>
                <label for="dob" class="input data-error:input-error w-full" :data-error="errors.dob">
                    <span class="iconify lucide--calendar-1 size-4.5" />
                    <input
                        id="dob"
                        name="dob"
                        type="date"
                        :value="formData.dob"
                        placeholder="YYYY-MM-DD"
                        @input="handleChange" />
                </label>
                <p
                    :data-error="errors.dob"
                    class="text-error max-h-0 text-sm opacity-0 transition-all duration-300 data-error:max-h-8 data-error:opacity-100">
                    {{ errors.dob }}
                </p>
            </div>
        </div>

        <div class="mt-5 flex items-center justify-end gap-3">
            <button type="reset" class="btn btn-sm btn-outline border-base-300" @click="handleClear">Clear</button>
            <button type="submit" class="btn btn-sm btn-primary">Submit</button>
        </div>
    </form>
</template>
