<script lang="ts" setup>
import PageTitle from "~/components/PageTitle.vue";
import { usersData } from "../data";

const route = useRoute();
const userId = Number(route.params.id);
const user = usersData.find((u) => u.id === userId);

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
                { label: 'View', active: true },
            ]"
            title="View User" />
        <div class="mt-6">
            <div class="card bg-base-100 shadow">
                <div class="card-body">
                    <div class="flex items-center justify-between">
                        <h2 class="card-title">User Information</h2>
                        <NuxtLink
                            :href="`/access-control/users/${userId}/edit`"
                            class="btn btn-primary btn-sm">
                            <span class="iconify lucide--pencil size-4" />
                            Edit User
                        </NuxtLink>
                    </div>
                    <div v-if="user" class="mt-6">
                        <div class="flex flex-col gap-6">
                            <!-- Avatar & Basic Info -->
                            <div class="flex items-center gap-4">
                                <img
                                    :src="user.image"
                                    alt="User avatar"
                                    class="mask mask-squircle size-24" />
                                <div>
                                    <h3 class="text-2xl font-semibold">{{ user.name }}</h3>
                                    <p class="text-base-content/60">{{ user.email }}</p>
                                </div>
                            </div>

                            <hr class="border-base-300" />

                            <!-- Details Grid -->
                            <div class="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label class="text-base-content/60 text-sm font-medium">Role</label>
                                    <p class="mt-1">
                                        <span class="badge badge-ghost">{{ user.role }}</span>
                                    </p>
                                </div>
                                <div>
                                    <label class="text-base-content/60 text-sm font-medium">Status</label>
                                    <p class="mt-1">
                                        <span
                                            :class="[
                                                'badge',
                                                user.status === 'active' ? 'badge-success' : 'badge-error',
                                            ]">
                                            {{ user.status }}
                                        </span>
                                    </p>
                                </div>
                                <div>
                                    <label class="text-base-content/60 text-sm font-medium">Last Login</label>
                                    <p class="mt-1 font-medium">{{ user.lastLogin }}</p>
                                </div>
                                <div>
                                    <label class="text-base-content/60 text-sm font-medium">User ID</label>
                                    <p class="mt-1 font-medium">#{{ user.id }}</p>
                                </div>
                            </div>

                            <hr class="border-base-300" />

                            <!-- Actions -->
                            <div class="flex gap-3">
                                <NuxtLink
                                    href="/access-control/users"
                                    class="btn btn-ghost">
                                    <span class="iconify lucide--arrow-left size-4" />
                                    Back to Users
                                </NuxtLink>
                                <button class="btn btn-error btn-outline ml-auto">
                                    <span class="iconify lucide--trash size-4" />
                                    Delete User
                                </button>
                            </div>
                        </div>
                    </div>
                    <div v-else class="py-8 text-center">
                        <p class="text-base-content/60">User not found</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
