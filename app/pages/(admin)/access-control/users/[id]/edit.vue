<script lang="ts" setup>
import PageTitle from "~/components/PageTitle.vue";
import FileUploader from "~/components/forms/FileUploader.vue";
import { usersData } from "../data";

const route = useRoute();
const userId = Number(route.params.id);
const user = usersData.find((u) => u.id === userId);
const showPassword = ref(false);

definePageMeta({
    layout: "admin",
});
</script>

<template>
    <div>
        <PageTitle
            :items="[
                { label: 'Access Control' },
                { label: 'Users', path: '/access-control/users' },
                { label: 'Edit', active: true },
            ]"
            title="Edit User" />
        <div v-if="user" class="mt-6">
            <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
                <!-- Basic Information -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <div class="card-title">Basic Information</div>
                        <div class="fieldset mt-2 grid grid-cols-1 gap-4 lg:grid-cols-2">
                            <div class="space-y-2">
                                <label class="fieldset-label" for="name">Full Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    class="input w-full"
                                    placeholder="Full Name"
                                    :value="user.name" />
                            </div>
                            <div class="space-y-2">
                                <label class="fieldset-label" for="email">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    class="input w-full"
                                    placeholder="Email Address"
                                    :value="user.email" />
                            </div>
                            <div class="space-y-2">
                                <label class="fieldset-label" for="role">Role</label>
                                <select id="role" class="select w-full">
                                    <option :selected="user.role === 'Super Admin'">Super Admin</option>
                                    <option :selected="user.role === 'Admin'">Admin</option>
                                    <option :selected="user.role === 'Manager'">Manager</option>
                                    <option :selected="user.role === 'Staff'">Staff</option>
                                </select>
                            </div>
                            <div class="space-y-2">
                                <label class="fieldset-label" for="status">Status</label>
                                <select id="status" class="select w-full">
                                    <option :selected="user.status === 'active'">Active</option>
                                    <option :selected="user.status === 'inactive'">Inactive</option>
                                </select>
                            </div>
                            <div class="col-span-2 space-y-2">
                                <label class="fieldset-label">Last Login</label>
                                <p class="text-base-content/60 text-sm">{{ user.lastLogin }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Upload Image -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <div class="card-title">Profile Photo</div>
                        <div class="mt-2">
                            <div class="mb-4 flex items-center gap-4">
                                <img
                                    :src="user.image"
                                    alt="User avatar"
                                    class="mask mask-squircle size-20" />
                                <div>
                                    <p class="text-base-content/60 text-sm">Current Photo</p>
                                </div>
                            </div>
                            <FileUploader
                                label-idle="<div>Drag and Drop your image or <span style='text-decoration: underline'>Browse</span></div>" />
                        </div>
                    </div>
                </div>

                <!-- Change Password -->
                <div class="card bg-base-100 shadow md:col-span-2">
                    <div class="card-body gap-0">
                        <div class="card-title">Change Password</div>
                        <p class="text-base-content/60 mb-4 text-sm">Leave blank if you don't want to change the password</p>
                        <div class="fieldset grid grid-cols-1 gap-5 gap-y-3 lg:grid-cols-2">
                            <div class="space-y-2">
                                <label class="fieldset-label" for="new-password">New Password</label>
                                <label class="input w-full focus:outline-0">
                                    <span class="iconify lucide--key-round text-base-content/60 size-4" />
                                    <input
                                        id="new-password"
                                        class="grow focus:outline-0"
                                        placeholder="New Password"
                                        :type="showPassword ? 'text' : 'password'" />
                                    <button
                                        aria-label="Toggle password"
                                        type="button"
                                        class="btn btn-xs btn-ghost btn-circle text-base-content/60"
                                        @click="showPassword = !showPassword">
                                        <span v-if="showPassword" class="iconify lucide--eye-off size-4" />
                                        <span v-else class="iconify lucide--eye size-4" />
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
                                        aria-label="Toggle password"
                                        type="button"
                                        class="btn btn-xs btn-ghost btn-circle text-base-content/60"
                                        @click="showPassword = !showPassword">
                                        <span v-if="showPassword" class="iconify lucide--eye-off size-4" />
                                        <span v-else class="iconify lucide--eye size-4" />
                                    </button>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div class="mt-6 flex justify-end gap-3">
                <NuxtLink class="btn btn-sm btn-ghost" href="/access-control/users">
                    <span class="iconify lucide--x size-4" />
                    Cancel
                </NuxtLink>
                <button type="submit" class="btn btn-sm btn-primary">
                    <span class="iconify lucide--arrow-up-from-line size-4" />
                    Update
                </button>
            </div>
        </div>
        <div v-else class="mt-6">
            <div class="card bg-base-100 shadow">
                <div class="card-body py-8 text-center">
                    <p class="text-base-content/60">User not found</p>
                </div>
            </div>
        </div>
    </div>
</template>
