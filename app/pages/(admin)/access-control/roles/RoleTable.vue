<script setup lang="ts">
import RoleTableRow from "./RoleTableRow.vue";
import { rolesData } from "./data";

const searchQuery = ref("");
const statusFilter = ref("");
const typeFilter = ref("");

const filteredRoles = computed(() => {
    return rolesData.filter((role) => {
        const matchesSearch =
            searchQuery.value === "" ||
            role.roleName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            role.displayName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            role.description.toLowerCase().includes(searchQuery.value.toLowerCase());

        const matchesStatus = statusFilter.value === "" || role.status.toLowerCase() === statusFilter.value.toLowerCase();

        const matchesType = typeFilter.value === "" || role.type.toLowerCase() === typeFilter.value.toLowerCase();

        return matchesSearch && matchesStatus && matchesType;
    });
});
</script>
<template>
    <div>
        <div class="card bg-base-100 shadow">
            <div class="card-body p-0">
                <div class="flex items-center justify-between px-5 pt-5">
                    <div class="inline-flex items-center gap-3">
                        <label class="input input-sm">
                            <span class="iconify lucide--search text-base-content/80 size-3.5" />
                            <input
                                v-model="searchQuery"
                                type="search"
                                class="w-24 sm:w-48"
                                placeholder="Search along roles"
                                aria-label="Search along roles" />
                        </label>
                        <div class="hidden sm:block">
                            <select v-model="statusFilter" class="select select-sm w-40" aria-label="Status">
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                        <div class="hidden sm:block">
                            <select v-model="typeFilter" class="select select-sm w-40" aria-label="Type">
                                <option value="">All Types</option>
                                <option value="system">System</option>
                                <option value="custom">Custom</option>
                            </select>
                        </div>
                    </div>
                    <div class="inline-flex items-center gap-3">
                        <NuxtLink
                            to="/access-control/roles/create"
                            aria-label="Create role link"
                            class="btn btn-primary btn-sm max-sm:btn-square">
                            <span class="iconify lucide--plus size-4" />
                            <span class="hidden sm:inline">New Role</span>
                        </NuxtLink>
                        <div class="dropdown dropdown-bottom dropdown-end">
                            <div
                                tabindex="0"
                                role="button"
                                class="btn btn-ghost border-base-300 btn-sm btn-square"
                                aria-label="More option">
                                <span class="iconify lucide--settings-2 size-4" />
                            </div>
                            <div tabindex="0" class="dropdown-content bg-base-100 rounded-box z-1 w-52 shadow">
                                <ul class="menu w-full p-2">
                                    <li>
                                        <div>
                                            <span class="iconify lucide--wand size-4" />
                                            Bulk Actions
                                        </div>
                                    </li>
                                </ul>
                                <hr class="border-base-300" />
                                <ul class="menu w-full p-2">
                                    <li>
                                        <div>
                                            <span class="iconify lucide--download-cloud size-4" />
                                            Import Roles
                                        </div>
                                    </li>
                                    <li>
                                        <div>
                                            <span class="iconify lucide--upload-cloud size-4" />
                                            Export Roles
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-4 overflow-auto">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Role Name</th>
                                <th>Display Name</th>
                                <th>Description</th>
                                <th>Priority</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Total Users</th>
                                <th>Created At</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            <RoleTableRow
                                v-for="(role, index) in filteredRoles"
                                :key="index"
                                v-bind="role" />
                        </tbody>
                    </table>
                </div>
                <div class="flex items-center justify-between p-6">
                    <div class="text-base-content/80 hover:text-base-content flex gap-2 text-sm">
                        <span class="hidden sm:inline">Per page</span>
                        <select class="select select-xs w-18" aria-label="Per page">
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                    <span class="text-base-content/80 hidden text-sm lg:inline">
                        Showing <span class="text-base-content font-medium">1 to {{ filteredRoles.length }}</span> of {{ filteredRoles.length }} items
                    </span>
                    <div class="inline-flex items-center gap-1">
                        <button class="btn btn-circle sm:btn-sm btn-xs btn-ghost" aria-label="Prev">
                            <span class="iconify lucide--chevron-left" />
                        </button>
                        <button class="btn btn-primary btn-circle sm:btn-sm btn-xs">1</button>
                        <button class="btn btn-ghost btn-circle sm:btn-sm btn-xs">2</button>
                        <button class="btn btn-ghost btn-circle sm:btn-sm btn-xs">3</button>
                        <button class="btn btn-circle sm:btn-sm btn-xs btn-ghost" aria-label="Next">
                            <span class="iconify lucide--chevron-right" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <dialog id="access-control-role-delete" class="modal">
            <div class="modal-box">
                <div class="flex items-center justify-between text-lg font-medium">
                    Confirm Delete
                    <form method="dialog">
                        <button class="btn btn-sm btn-ghost btn-circle" aria-label="Close modal">
                            <span class="iconify lucide--x size-4" />
                        </button>
                    </form>
                </div>
                <p class="py-4">You are about to delete this role. Would you like to proceed further ?</p>
                <div class="modal-action">
                    <form method="dialog">
                        <button class="btn btn-ghost btn-sm">No</button>
                    </form>
                    <form method="dialog">
                        <button class="btn btn-sm btn-error">Yes, delete it</button>
                    </form>
                </div>
            </div>
            <form method="dialog" class="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    </div>
</template>
