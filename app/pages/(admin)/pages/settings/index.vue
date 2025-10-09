<script setup lang="ts">
import UserAvatar from "./UserAvatar.vue";

definePageMeta({
    layout: "admin",
});
</script>

<template>
    <div class="min-sm:container">
        <div class="bg-primary/10 rounded-box relative w-full overflow-hidden p-6">
            <div class="flex justify-between">
                <div>
                    <div class="flex items-center gap-1">
                        <p class="text-base-content/80 text-sm">Pages</p>
                        <span class="iconify lucide--chevron-right text-base-content/80 size-3.5" />
                        <p class="text-sm">Settings</p>
                    </div>
                    <p class="text-primary mt-4 text-xl font-medium">My Profile</p>
                    <p class="text-base-content/80">Configure your preferences and customize your account settings.</p>
                </div>
                <div class="flex flex-col items-end justify-between">
                    <button class="btn btn-sm btn-primary max-xl:btn-square">
                        <span class="iconify lucide--settings-2 size-4" />
                        <span class="max-xl:hidden">Advanced Setup</span>
                    </button>
                    <div class="text-base-content/60 flex items-center gap-2 max-xl:hidden">
                        <span class="iconify lucide--clock size-4" />
                        <p class="text-sm">Changed 6h ago</p>
                    </div>
                </div>
            </div>
            <span class="iconify lucide--settings text-primary/5 absolute start-1/2 -bottom-12 size-44 -rotate-25" />
        </div>

        <div class="card bg-base-100 card-border mt-6">
            <div class="card-body space-y-6 sm:space-y-20 sm:p-8">
                <div class="grid grid-cols-1 gap-5 xl:grid-cols-5">
                    <div class="xl:col-span-2">
                        <div class="flex items-center gap-2">
                            <span class="iconify lucide--id-card size-5" />
                            <p class="text-lg font-medium">User Profile</p>
                        </div>
                        <p class="text-base-content/60">Manage your account information and settings</p>
                    </div>
                    <div class="flex gap-5 max-lg:flex-col xl:col-span-3">
                        <UserAvatar />
                        <div class="fieldset grid grow grid-cols-1 gap-5 lg:grid-cols-2">
                            <div class="space-y-2">
                                <label class="fieldset-label" for="name">Full Name</label>
                                <label class="input w-full">
                                    <span class="iconify lucide--user text-base-content/60 size-4.5" />
                                    <input id="name" type="text" class="grow" placeholder="Name" />
                                </label>
                            </div>
                            <div class="space-y-2">
                                <label class="fieldset-label">User</label>
                                <label class="input w-full">
                                    <span class="label">nexus.com/</span>
                                    <input placeholder="username" type="text" />
                                </label>
                            </div>
                            <div class="space-y-2">
                                <label class="fieldset-label" for="email">Email</label>
                                <label class="input w-full">
                                    <span class="iconify lucide--mail text-base-content/60 size-4.5" />
                                    <input id="email" type="text" class="grow" placeholder="Email" />
                                </label>
                            </div>
                            <div class="space-y-2">
                                <label class="fieldset-label" for="mobile">Mobile</label>
                                <label class="input w-full">
                                    <span class="iconify lucide--phone text-base-content/60 size-4.5" />
                                    <input id="mobile" type="text" class="grow" placeholder="Mobile" />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 gap-5 xl:grid-cols-5">
                    <div class="xl:col-span-2">
                        <div class="flex items-center gap-2">
                            <span class="iconify lucide--bell size-5" />
                            <p class="text-lg font-medium">Notifications</p>
                        </div>
                        <p class="text-base-content/60">Manage your notification settings and preferences</p>
                    </div>
                    <div class="gap-5 xl:col-span-3">
                        <div class="fieldset grid grid-cols-1 gap-5 lg:grid-cols-3">
                            <div class="space-y-2">
                                <label class="fieldset-label" for="notification-channel">Channel</label>
                                <select id="notification-channel" class="select w-full">
                                    <option value="email">Email</option>
                                    <option value="in-app">In App</option>
                                    <option value="sms">SMS</option>
                                    <option value="none">None</option>
                                </select>
                            </div>
                            <div class="space-y-2">
                                <label class="fieldset-label" for="notification-new-order">Notify on new order</label>
                                <select id="notification-new-order" class="select w-full">
                                    <option value="all">All</option>
                                    <option value="important">Important</option>
                                    <option value="mention">only @mention</option>
                                    <option value="none">None</option>
                                </select>
                            </div>
                            <div class="space-y-2">
                                <label class="fieldset-label" for="notification-activity">Activity Updates</label>
                                <select id="notification-activity" class="select w-full">
                                    <option value="all-activity">All Activity</option>
                                    <option value="important-activity">Important Activity Only</option>
                                    <option value="mention">Only @mention</option>
                                    <option value="none">No Notifications</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 gap-5 xl:grid-cols-5">
                    <div class="xl:col-span-2">
                        <div class="flex items-center gap-2">
                            <span class="iconify lucide--calendar-cog size-5" />
                            <p class="text-lg font-medium">Time Preferences</p>
                        </div>
                        <p class="text-base-content/60">Set your timezone and time format</p>
                    </div>
                    <div class="gap-5 xl:col-span-3">
                        <div class="fieldset grid grid-cols-1 gap-5 lg:grid-cols-3">
                            <div class="space-y-2">
                                <label class="fieldset-label" for="timezone">Timezone</label>
                                <select id="timezone" class="select w-full">
                                    <option value="america-toronto">GMT-5:00 – Toronto (EST)</option>
                                    <option value="america-chicago">GMT-6:00 – Chicago (CST)</option>
                                    <option value="america-denver">GMT-7:00 – Calgary (MST)</option>
                                    <option value="america-losangeles">GMT-8:00 – Vancouver (PST)</option>
                                    <option value="asia-kolkata">GMT+5:30 – Mumbai (IST)</option>
                                </select>
                            </div>
                            <div class="space-y-2">
                                <label class="fieldset-label" for="datetime-format">Datetime Format</label>
                                <select id="datetime-format" class="select w-full">
                                    <option value="12-hour">12-hour (AM/PM)</option>
                                    <option value="24-hour">24-hour</option>
                                    <option value="dd-mm-yyyy">DD/MM/YYYY</option>
                                    <option value="mm-dd-yyyy">MM/DD/YYYY</option>
                                    <option value="yyyy-mm-dd">YYYY/MM/DD</option>
                                </select>
                            </div>
                            <div class="space-y-2">
                                <label class="fieldset-label" for="datetime-first-day">First day of week</label>
                                <select id="datetime-first-day" class="select w-full">
                                    <option value="sunday">Sunday</option>
                                    <option value="monday">Monday</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-6 flex justify-between gap-4 max-sm:flex-col-reverse">
            <div class="text-sm">
                <p>You might looking for:</p>
                <ul class="text-base-content/80 mt-2">
                    <li class="link link-hover">Manage users</li>
                    <li class="link link-hover">Security & roles</li>
                    <li class="link link-hover">Payment preference</li>
                </ul>
            </div>
            <div class="flex justify-end gap-3">
                <NuxtLink class="btn btn-sm btn-ghost" href="#">
                    <span class="iconify lucide--x size-4" />
                    Cancel
                </NuxtLink>
                <NuxtLink class="btn btn-sm btn-primary" href="#">
                    <span class="iconify lucide--arrow-up-from-line size-4" />
                    Update
                </NuxtLink>
            </div>
        </div>
    </div>
</template>
