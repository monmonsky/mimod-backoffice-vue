<script setup lang="ts">
import FileTableRow from "./FileTableRow.vue";

interface IFileTableRow {
    icon: string;
    name: string;
    size: string;
    date: string;
    owner: string;
    sharedWith: string;
}

const files: IFileTableRow[] = [
    {
        icon: "lucide--video",
        name: "Latest Video",
        size: "5.1 GiB",
        date: "26 Dec 2024",
        owner: "Denish",
        sharedWith: `<span class="text-base-content/60">3 members</span>`,
    },
    {
        icon: "lucide--file-text",
        name: "Company Documents",
        size: "7.8 MiB",
        date: "25 Dec 2024",
        owner: "Company",
        sharedWith: `
      <span class="text-error flex items-center gap-2">
        <span class="iconify lucide--shield size-4"></span>
        Private
      </span>`,
    },
    {
        icon: "lucide--figma",
        name: "Figma Design",
        size: "1.4 MiB",
        date: "23 Dec 2024",
        owner: "Turkes Duis",
        sharedWith: `<span class="text-base-content/60">7 members</span>`,
    },
    {
        icon: "lucide--music",
        name: "Top Music",
        size: "4.8 MiB",
        date: "19 Dec 2024",
        owner: "Me",
        sharedWith: `
      <span class="text-success flex items-center gap-2">
        <span class="iconify lucide--globe size-4"></span>
        Public
      </span>`,
    },
    {
        icon: "lucide--file-spreadsheet",
        name: "Office Sheet",
        size: "56 KiB",
        date: "11 Dec 2024",
        owner: "Mr. Boss",
        sharedWith: `<span class="text-base-content/60">2 members</span>`,
    },
    {
        icon: "lucide--message-circle-dashed",
        name: "Chat Backup",
        size: "252 KiB",
        date: "12 Nov 2024",
        owner: "Withden",
        sharedWith: `
      <div class="text-error flex items-center gap-2">
        <span class="iconify lucide--shield size-4"></span>
        Private
      </div>`,
    },
];
</script>

<template>
    <div class="card card-border bg-base-100">
        <div class="card-body p-0">
            <div class="flex items-center justify-between gap-3 px-5 pt-5">
                <div class="inline-flex items-center gap-3">
                    <div class="dropdown dropdown-bottom dropdown-start">
                        <div
                            tabindex="0"
                            role="button"
                            class="btn btn-ghost btn-square border-base-300 btn-sm"
                            aria-label="Add">
                            <span class="iconify lucide--plus size-4" />
                        </div>
                        <div tabindex="0" class="dropdown-content bg-base-100 rounded-box mt-2 w-52 shadow">
                            <ul class="menu w-full p-1.5">
                                <li>
                                    <div>
                                        <span class="iconify lucide--folder size-4" />
                                        New Folder
                                    </div>
                                </li>
                            </ul>
                            <hr class="border-base-300" />
                            <ul class="menu w-full p-1.5">
                                <li>
                                    <div>
                                        <span class="iconify lucide--folder-up size-4" />
                                        Upload Folder
                                    </div>
                                </li>
                                <li>
                                    <div>
                                        <span class="iconify lucide--file-up size-4" />
                                        Upload File
                                    </div>
                                </li>
                            </ul>
                            <hr class="border-base-300" />
                            <ul class="menu w-full p-1.5">
                                <li>
                                    <div>
                                        <span class="iconify lucide--file-text size-4" />
                                        Create Document
                                    </div>
                                </li>
                                <li>
                                    <div>
                                        <span class="iconify lucide--file-spreadsheet size-4" />
                                        Create Sheet
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <button class="btn-outline border-base-300 btn btn-sm hidden sm:flex">
                        <span class="iconify lucide--folder-git-2 size-4" />
                        <span>Organize</span>
                    </button>
                </div>

                <div class="inline-flex items-center gap-3">
                    <label class="input input-sm">
                        <span class="iconify lucide--search text-base-content/80 size-4" />
                        <input type="search" class="grow" placeholder="Search along files" aria-label="Search chat" />
                    </label>
                    <div class="hidden sm:block">
                        <select class="select select-sm w-32" aria-label="File type">
                            <option disabled selected>File type</option>
                            <option>Images</option>
                            <option>Videos</option>
                            <option>Documents</option>
                            <option>Archives</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div class="inline-flex items-center gap-1">
                        <button class="btn btn-sm btn-ghost btn-square" aria-label="Grid">
                            <span class="iconify lucide--grid-2x2 size-4" />
                        </button>
                        <button class="btn btn-sm btn-soft btn-square" aria-label="List">
                            <span class="iconify lucide--list size-4" />
                        </button>
                    </div>
                </div>
            </div>

            <div class="overflow-auto">
                <table class="rounded-box mt-2 table">
                    <thead>
                        <tr>
                            <th>
                                <input class="checkbox checkbox-sm" aria-label="Checkbox example" type="checkbox" />
                            </th>
                            <th>Name</th>
                            <th>Size</th>
                            <th>Created At</th>
                            <th>Owner</th>
                            <th>Shared With</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <FileTableRow v-for="(file, index) in files" :key="index" v-bind="file" />
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
