<script lang="ts" setup>
import { useWizard } from "./use-wizard";

const steps = ["Personal Details", "Account Settings", "Permissions", "Review"];

const { currentStep, canNext, canPrevious, goNext, goPrevious, goTo, isLastStep } = useWizard(steps.length);
</script>

<template>
    <div>
        <div class="flex items-center gap-3 text-sm">
            <div v-for="(step, index) in steps" :key="index" class="flex items-center gap-3">
                <div
                    class="text-base-content/80 hover:text-base-content flex cursor-pointer items-center gap-2"
                    @click="goTo(index + 1)">
                    <div
                        :class="[
                            'flex size-6 items-center justify-center rounded-full font-medium',
                            index + 1 >= currentStep ? 'bg-base-200' : 'bg-primary text-primary-content',
                        ]">
                        <span class="iconify lucide--check" :class="index + 1 >= currentStep ? 'hidden' : ''" />
                        <span :class="index + 1 >= currentStep ? '' : 'hidden'">{{ index + 1 }}</span>
                    </div>
                    <span class="font-medium max-lg:hidden">{{ step }}</span>
                </div>
                <span v-if="index + 1 < steps.length" class="iconify lucide--chevron-right text-base-content/60" />
            </div>
        </div>

        <div class="bg-base-100 border-base-300 rounded-box mt-6 border p-5">
            <div v-if="currentStep === 1">
                <div class="bg-base-200 rounded-box flex w-fit items-center gap-2.5 px-3 py-1.5">
                    <span class="iconify lucide--user size-3.5" />
                    <span class="text-sm font-medium">Personal Details</span>
                </div>
                <div class="fieldset mt-4 grid grow grid-cols-1 gap-5 lg:grid-cols-2">
                    <div class="space-y-2">
                        <label class="fieldset-label" for="name">Full Name</label>
                        <label class="input w-full">
                            <span class="iconify lucide--user text-base-content/60 size-4.5" />
                            <input id="name" type="text" class="grow" placeholder="Name" value="Denish Navadiya" />
                        </label>
                    </div>
                    <div class="space-y-2">
                        <label class="fieldset-label">User</label>
                        <label class="input w-full">
                            <span class="label">nexus.com/</span>
                            <input type="text" placeholder="username" value="withden" />
                        </label>
                    </div>
                    <div class="space-y-2">
                        <label class="fieldset-label" for="email">Email</label>
                        <label class="input w-full">
                            <span class="iconify lucide--mail text-base-content/60 size-4.5" />
                            <input id="email" type="text" class="grow" placeholder="Email" value="test@gmail.com" />
                        </label>
                    </div>
                    <div class="space-y-2">
                        <label class="fieldset-label" for="mobile">Mobile</label>
                        <label class="input w-full">
                            <span class="iconify lucide--phone text-base-content/60 size-4.5" />
                            <input
                                id="mobile"
                                type="text"
                                class="grow"
                                placeholder="Mobile"
                                value="(+123) 9876543210" />
                        </label>
                    </div>
                </div>
            </div>

            <div v-if="currentStep === 2">
                <div class="bg-base-200 rounded-box flex w-fit items-center gap-2.5 px-3 py-1.5">
                    <span class="iconify lucide--settings-2 size-3.5" />
                    <span class="text-sm font-medium">Account Settings</span>
                </div>
                <div class="fieldset mt-4 grid grow grid-cols-1 gap-5 lg:grid-cols-2">
                    <div class="space-y-2">
                        <label class="fieldset-label" for="password">Password</label>
                        <label class="input w-full">
                            <span class="iconify lucide--lock text-base-content/60 size-4.5" />
                            <input id="password" type="password" class="grow" placeholder="••••••••" value="" />
                        </label>
                    </div>
                    <div class="space-y-2">
                        <label class="fieldset-label" for="confirm-password">Confirm Password</label>
                        <label class="input w-full">
                            <span class="iconify lucide--lock text-base-content/60 size-4.5" />
                            <input id="confirm-password" type="password" class="grow" placeholder="••••••••" value="" />
                        </label>
                    </div>
                    <div class="space-y-2">
                        <label class="fieldset-label" for="language">Language</label>
                        <select id="language" class="select w-full" aria-label="Language" value="english">
                            <option value="english">English</option>
                            <option value="spanish">Spanish</option>
                            <option value="german">German</option>
                            <option value="hindi">Hindi</option>
                        </select>
                    </div>
                    <div class="space-y-2">
                        <label class="fieldset-label" for="timezone">Timezone</label>
                        <select id="timezone" class="select w-full" aria-label="Timezone" value="IST">
                            <option value="UTC">UTC</option>
                            <option value="IST">IST</option>
                            <option value="PST">PST</option>
                            <option value="CET">CET</option>
                        </select>
                    </div>
                </div>
            </div>

            <div v-if="currentStep === 3">
                <div class="bg-base-200 rounded-box flex w-fit items-center gap-2.5 px-3 py-1.5">
                    <span class="iconify lucide--shield-check size-3.5" />
                    <span class="text-sm font-medium">Permissions</span>
                </div>
                <div class="fieldset mt-4 grid grid-cols-1 gap-5 lg:grid-cols-2">
                    <div class="space-y-2">
                        <label class="fieldset-label" for="user-role">Role</label>
                        <select id="user-role" class="select w-full" aria-label="User Role" value="viewer">
                            <option value="admin">Admin</option>
                            <option value="editor">Editor</option>
                            <option value="viewer">Viewer</option>
                        </select>
                    </div>
                    <div class="space-y-2">
                        <label class="fieldset-label" for="feature-access">Feature Access</label>
                        <select id="feature-access" class="select w-full" aria-label="Feature Access" value="limited">
                            <option value="full">Full Access</option>
                            <option value="limited">Limited Access</option>
                            <option value="custom">Custom</option>
                        </select>
                    </div>
                    <div class="space-y-2">
                        <label class="fieldset-label" for="api-access">API Access</label>
                        <select id="api-access" class="select w-full" aria-label="API Access" value="enabled">
                            <option value="enabled">Enabled</option>
                            <option value="disabled">Disabled</option>
                        </select>
                    </div>
                </div>
            </div>

            <div v-if="currentStep === 4" class="bg-base-100 rounded-box">
                <div class="bg-base-200 rounded-box flex w-fit items-center gap-2.5 px-3 py-1.5">
                    <span class="iconify lucide--check-circle-2 size-3.5" />
                    <span class="text-sm font-medium">Review Details</span>
                </div>
                <div class="mt-5 space-y-3.5 text-sm">
                    <div class="flex">
                        <span class="w-40 font-medium">Username:</span>
                        <span class="text-base-content/80">withden</span>
                    </div>
                    <div class="flex">
                        <span class="w-40 font-medium">Full Name:</span>
                        <span class="text-base-content/80">Denish Navadiya</span>
                    </div>
                    <div class="flex">
                        <span class="w-40 font-medium">Email:</span>
                        <span class="text-base-content/80">test@gmail.com</span>
                    </div>
                    <div class="flex">
                        <span class="w-40 font-medium">Account Settings:</span>
                        <span class="text-base-content/80">Normal</span>
                    </div>
                    <div class="flex">
                        <span class="w-40 font-medium">Permission:</span>
                        <span class="text-base-content/80">User-level</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-4 flex justify-between">
            <button v-if="canPrevious" class="btn gap-2" @click="goPrevious">
                <span class="iconify lucide--chevron-left size-4" />
                <span>Prev</span>
            </button>
            <button v-if="canNext" class="btn ms-auto gap-2" @click="goNext">
                <span>Next</span>
                <span class="iconify lucide--chevron-right size-4" />
            </button>
            <button v-if="isLastStep" class="btn btn-primary ms-auto gap-2">
                <span class="iconify lucide--flag size-4" />
                <span>Finish</span>
            </button>
        </div>
    </div>
</template>
