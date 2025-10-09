<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";

definePageMeta({
    layout: "admin",
});

const route = useRoute();
const activityId = route.params.id as string;

const { data: activityResponse, pending, error } = await useAsyncData(
    `user-activity-${activityId}`,
    () => {
        return $fetch(`/access-control/user-activities/${activityId}`, {
            baseURL: useRuntimeConfig().public.apiBase,
            headers: {
                Authorization: `Bearer ${useAuthStore().token}`,
            },
        });
    },
);

const activity = computed(() => {
    const response = activityResponse.value as any;
    return response?.data || null;
});

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    }).format(date);
};

const getActionBadgeClass = (action: string) => {
    const actionLower = action?.toLowerCase();
    if (actionLower?.includes("create") || actionLower?.includes("add")) return "badge-success";
    if (actionLower?.includes("update") || actionLower?.includes("edit")) return "badge-info";
    if (actionLower?.includes("delete") || actionLower?.includes("remove")) return "badge-error";
    if (actionLower?.includes("login")) return "badge-primary";
    if (actionLower?.includes("logout")) return "badge-warning";
    return "badge-ghost";
};

const formatProperties = (properties: any) => {
    if (!properties) return null;
    if (typeof properties === "string") {
        try {
            return JSON.parse(properties);
        } catch {
            return properties;
        }
    }
    return properties;
};
</script>
<template>
    <div>
        <PageTitle
            :title="'User Activity Detail'"
            :items="[{ label: 'Access Control' }, { label: 'User Activity', url: '/access-control/user-activity' }, { label: 'Detail', active: true }]" />

        <div class="mt-6">
            <!-- Loading State -->
            <div v-if="pending" class="flex items-center justify-center py-12">
                <span class="loading loading-spinner loading-lg"></span>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="alert alert-error">
                <span class="iconify lucide--alert-circle size-5" />
                <span>Failed to load activity detail. Please try again.</span>
            </div>

            <!-- Content -->
            <div v-else-if="activity" class="grid gap-6">
                <!-- User Info Card -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h2 class="card-title">User Information</h2>
                        <div class="grid gap-4 sm:grid-cols-2">
                            <div class="flex items-center gap-4">
                                <div class="avatar placeholder">
                                    <div class="bg-primary text-primary-content w-16 rounded-full">
                                        <span class="text-2xl">{{ activity.user_name?.charAt(0) || "U" }}</span>
                                    </div>
                                </div>
                                <div>
                                    <div class="text-lg font-semibold">{{ activity.user_name || "Unknown" }}</div>
                                    <div class="text-base-content/60">{{ activity.user_email || "-" }}</div>
                                </div>
                            </div>
                            <div v-if="activity.user_role_priority" class="flex items-center gap-2">
                                <span class="text-base-content/60">Role Priority:</span>
                                <span class="badge badge-primary">{{ activity.user_role_priority }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Activity Detail Card -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h2 class="card-title">Activity Details</h2>
                        <div class="grid gap-4">
                            <div class="flex flex-col gap-1">
                                <span class="text-base-content/60 text-sm">Action</span>
                                <span class="badge w-fit" :class="getActionBadgeClass(activity.action)">
                                    {{ activity.action }}
                                </span>
                            </div>

                            <div class="flex flex-col gap-1">
                                <span class="text-base-content/60 text-sm">Description</span>
                                <span class="font-medium">{{ activity.description || "-" }}</span>
                            </div>

                            <div class="grid gap-4 sm:grid-cols-2">
                                <div class="flex flex-col gap-1">
                                    <span class="text-base-content/60 text-sm">Subject Type</span>
                                    <span class="font-medium">{{ activity.subject_type || "-" }}</span>
                                </div>

                                <div class="flex flex-col gap-1">
                                    <span class="text-base-content/60 text-sm">Subject ID</span>
                                    <span class="font-medium">{{ activity.subject_id || "-" }}</span>
                                </div>
                            </div>

                            <div class="grid gap-4 sm:grid-cols-2">
                                <div class="flex flex-col gap-1">
                                    <span class="text-base-content/60 text-sm">IP Address</span>
                                    <code class="text-sm">{{ activity.ip_address || "-" }}</code>
                                </div>

                                <div class="flex flex-col gap-1">
                                    <span class="text-base-content/60 text-sm">Date & Time</span>
                                    <span class="font-medium">{{ formatDate(activity.created_at) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- User Agent Card -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h2 class="card-title">User Agent</h2>
                        <div class="bg-base-200 rounded-lg p-4">
                            <code class="text-sm">{{ activity.user_agent || "-" }}</code>
                        </div>
                    </div>
                </div>

                <!-- Properties Card -->
                <div v-if="formatProperties(activity.properties)" class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h2 class="card-title">Properties</h2>
                        <div class="bg-base-200 rounded-lg p-4">
                            <pre class="text-sm">{{ JSON.stringify(formatProperties(activity.properties), null, 2) }}</pre>
                        </div>
                    </div>
                </div>

                <!-- Back Button -->
                <div class="flex justify-end">
                    <NuxtLink to="/access-control/user-activity" class="btn btn-ghost">
                        <span class="iconify lucide--arrow-left size-4" />
                        Back to List
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>
