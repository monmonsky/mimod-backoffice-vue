<script setup lang="ts">
import FileUploader from "~/components/forms/FileUploader.vue";

let showPassword = false;

const togglePasswordVisibility = () => {
    showPassword = !showPassword;
};
</script>
<template>
    <div>
        <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div class="card bg-base-100 shadow">
                <div class="card-body">
                    <div class="card-title">Basic Information</div>
                    <div class="fieldset mt-2 grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <div class="space-y-2">
                            <label class="fieldset-label" for="name"> Name </label>
                            <input id="name" type="text" class="input w-full" placeholder="Name" />
                        </div>
                        <div class="space-y-2">
                            <label class="fieldset-label">Email</label>
                            <input id="email" type="email" class="input w-full" placeholder="Email" />
                        </div>
                        <div class="space-y-2">
                            <label class="fieldset-label">Mobile</label>
                            <input type="tel" class="input w-full" placeholder="(098) 765 4321" />
                        </div>
                        <div class="space-y-2">
                            <label class="fieldset-label" for="DOB"> DOB </label>
                            <input id="DOB" type="date" class="input w-full" aria-label="DOB" />
                        </div>
                        <div class="flex items-center gap-3">
                            <input id="verified" class="toggle toggle-sm" type="checkbox" />
                            <label class="label" for="verified"> Verified </label>
                        </div>
                        <div class="flex items-center gap-3">
                            <input
                                id="apps-seller-gender-male"
                                class="radio radio-sm"
                                type="radio"
                                value="male"
                                name="apps-seller-gender" />
                            <label class="fieldset-label" for="apps-seller-gender-male"> Male </label>
                            <input
                                id="apps-seller-gender-female"
                                class="radio radio-sm"
                                value="female"
                                type="radio"
                                name="apps-seller-gender" />
                            <label class="fieldset-label" for="apps-seller-gender-female"> Female </label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card bg-base-100 shadow">
                <div class="card-body">
                    <div class="card-title">Address</div>
                    <div class="fieldset mt-2 grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <div class="space-y-2">
                            <label class="fieldset-label" for="street-address"> Street Address </label>
                            <input id="street-address" type="text" class="input w-full" placeholder="Street Address" />
                        </div>
                        <div class="space-y-2">
                            <label class="fieldset-label" for="city"> City </label>
                            <input id="city" type="text" class="input w-full" placeholder="City" />
                        </div>
                        <div class="space-y-2">
                            <label class="fieldset-label" for="state"> State </label>
                            <input id="state" type="text" class="input w-full" placeholder="State" />
                        </div>
                        <div class="space-y-2">
                            <label class="fieldset-label" for="postal-code"> Postal Code </label>
                            <input id="postal-code" type="text" class="input w-full" placeholder="564-879" />
                        </div>
                        <div class="flex items-center gap-3">
                            <input id="set-as-permanent" class="checkbox checkbox-sm" type="checkbox" />
                            <label class="label" for="set-as-permanent"> Set as permanent </label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card bg-base-100 shadow">
                <div class="card-body">
                    <div class="card-title">Upload Image</div>
                    <div class="mt-4">
                        <FileUploader
                            label-idle='<div>Drag and Drop your files or <span style="text-decoration: underline">Browse</span></div>' />
                    </div>
                </div>
            </div>
            <div class="bg-base-100 card shadow">
                <div class="card-body gap-0">
                    <div class="card-title">Create Password</div>
                    <div class="fieldset mt-2 grid grid-cols-1 gap-5 gap-y-3 lg:grid-cols-2">
                        <div class="space-y-2">
                            <label class="fieldset-label" for="password">Password</label>
                            <label class="input w-full focus:outline-0">
                                <span class="iconify lucide--key-round text-base-content/60 size-4" />
                                <input
                                    id="password"
                                    class="grow focus:outline-0"
                                    placeholder="Password"
                                    :type="showPassword ? 'text' : 'password'" />
                                <button
                                    aria-label="Password"
                                    class="btn btn-xs btn-ghost btn-circle text-base-content/60"
                                    @click="togglePasswordVisibility">
                                    <span v-if="showPassword">
                                        <span class="iconify lucide--eye-off size-4" />
                                    </span>
                                    <span v-else>
                                        <span class="iconify lucide--eye size-4" />
                                    </span>
                                </button>
                            </label>
                        </div>
                        <div class="space-y-2">
                            <label class="fieldset-label" for="confirm-password">Confirm Password</label>
                            <label class="input w-full focus:outline-0">
                                <span class="iconify lucide--key-round text-base-content/60 size-4" />
                                <input
                                    id="confirm-password"
                                    class="grow focus:outline-0"
                                    placeholder="Confirm Password"
                                    :type="showPassword ? 'text' : 'password'" />
                                <button
                                    aria-label="Confirm Password"
                                    class="btn btn-xs btn-ghost btn-circle"
                                    @click="togglePasswordVisibility">
                                    <span v-if="showPassword">
                                        <span class="iconify lucide--eye-off size-4" />
                                    </span>
                                    <span v-else>
                                        <span class="iconify lucide--eye size-4" />
                                    </span>
                                </button>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-6 flex justify-end gap-3">
            <NuxtLink class="btn btn-sm btn-ghost" href="/apps/ecommerce/customers">
                <span class="iconify lucide--x size-4" />
                Cancel
            </NuxtLink>
            <NuxtLink class="btn btn-sm btn-primary" href="/apps/ecommerce/customers">
                <span class="iconify lucide--check size-4" />
                Save
            </NuxtLink>
        </div>
    </div>
</template>
