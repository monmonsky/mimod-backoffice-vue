<script lang="ts" setup>
import PageTitle from "~/components/PageTitle.vue";
import FileUploader from "~/components/forms/FileUploader.vue";

const router = useRouter();
const { createUser } = useUsers();
const { getRoles } = useRoles();
const { success, error } = useToast();

// Fetch roles for dropdown
const { data: rolesResponse } = getRoles();
const roles = computed(() => rolesResponse.value?.data?.data || []);

const showPassword = ref(false);
const saving = ref(false);

// Form data
const formData = ref({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
    role_id: 1,
    status: "active" as "active" | "suspended" | "deleted",
});

const handleSubmit = async () => {
    try {
        saving.value = true;

        await createUser({
            name: formData.value.name,
            email: formData.value.email,
            phone: formData.value.phone || undefined,
            password: formData.value.password,
            role_id: formData.value.role_id,
            status: formData.value.status,
        });

        success("User created successfully!");
        router.push("/access-control/users");
    } catch (err: any) {
        console.error("Failed to create user:", err);
        const errorMessage = err?.data?.message || "Failed to create user";
        error(errorMessage);
    } finally {
        saving.value = false;
    }
};

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
                { label: 'Create', active: true },
            ]"
            title="Create New User" />

        <!-- Form -->
        <form class="mt-6" @submit.prevent="handleSubmit">
            <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
                <!-- Basic Information -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <div class="card-title">Basic Information</div>
                        <div class="fieldset mt-2 grid grid-cols-1 gap-4 lg:grid-cols-2">
                            <div class="space-y-2">
                                <label class="fieldset-label" for="name">
                                    Full Name <span class="text-error">*</span>
                                </label>
                                <input
                                    id="name"
                                    v-model="formData.name"
                                    type="text"
                                    class="input w-full"
                                    placeholder="Full Name"
                                    required />
                            </div>
                            <div class="space-y-2">
                                <label class="fieldset-label" for="email">
                                    Email <span class="text-error">*</span>
                                </label>
                                <input
                                    id="email"
                                    v-model="formData.email"
                                    type="email"
                                    class="input w-full"
                                    placeholder="Email Address"
                                    required />
                            </div>
                            <div class="space-y-2">
                                <label class="fieldset-label" for="phone">Phone</label>
                                <input
                                    id="phone"
                                    v-model="formData.phone"
                                    type="text"
                                    class="input w-full"
                                    placeholder="Phone Number"
                                    maxlength="20" />
                            </div>
                            <div class="space-y-2">
                                <label class="fieldset-label" for="role">
                                    Role <span class="text-error">*</span>
                                </label>
                                <select id="role" v-model.number="formData.role_id" class="select w-full" required>
                                    <template v-if="roles.length > 0">
                                        <option v-for="role in roles" :key="role.id" :value="role.id">
                                            {{ role.display_name }}
                                        </option>
                                    </template>
                                    <option v-else disabled>Loading roles...</option>
                                </select>
                            </div>
                            <div class="space-y-2">
                                <label class="fieldset-label" for="status">
                                    Status <span class="text-error">*</span>
                                </label>
                                <select id="status" v-model="formData.status" class="select w-full" required>
                                    <option value="active">Active</option>
                                    <option value="inactive">inactive</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Upload Image -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <div class="card-title">Profile Photo</div>
                        <div class="mt-2">
                            <FileUploader
                                label-idle="<div>Drag and Drop your image or <span style='text-decoration: underline'>Browse</span></div>" />
                            <p class="text-base-content/60 mt-2 text-xs">
                                Recommended: Square image, at least 400x400px
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Password -->
                <div class="card bg-base-100 shadow md:col-span-2">
                    <div class="card-body gap-0">
                        <div class="card-title">Password</div>
                        <p class="text-base-content/60 mb-4 text-sm">Password must be at least 8 characters</p>
                        <div class="fieldset grid grid-cols-1 gap-5 gap-y-3 lg:grid-cols-2">
                            <div class="space-y-2">
                                <label class="fieldset-label" for="password">
                                    Password <span class="text-error">*</span>
                                </label>
                                <label class="input w-full focus:outline-0">
                                    <span class="iconify lucide--key-round text-base-content/60 size-4" />
                                    <input
                                        id="password"
                                        v-model="formData.password"
                                        class="grow focus:outline-0"
                                        placeholder="Password"
                                        minlength="8"
                                        :type="showPassword ? 'text' : 'password'"
                                        required />
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
                                <label class="fieldset-label" for="confirm-password">
                                    Confirm Password <span class="text-error">*</span>
                                </label>
                                <label class="input w-full focus:outline-0">
                                    <span class="iconify lucide--key-round text-base-content/60 size-4" />
                                    <input
                                        id="confirm-password"
                                        v-model="formData.password_confirmation"
                                        class="grow focus:outline-0"
                                        placeholder="Confirm Password"
                                        minlength="8"
                                        :type="showPassword ? 'text' : 'password'"
                                        required />
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
                <button type="submit" class="btn btn-sm btn-primary" :disabled="saving">
                    <span v-if="saving" class="loading loading-spinner loading-xs"></span>
                    <span v-else class="iconify lucide--plus size-4" />
                    {{ saving ? 'Creating...' : 'Create User' }}
                </button>
            </div>
        </form>
    </div>
</template>
