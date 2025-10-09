<script lang="ts" setup></script>

<template>
    <div class="card bg-base-100 card-border max-w-4xl grow">
        <div class="card-body p-3">
            <textarea
                aria-label="Message"
                class="textarea m-0 h-28 w-full resize-none border-0 p-1 text-base focus:outline-none max-sm:placeholder:text-sm">
Put this image in the Excel sheet and save this file to the project folder</textarea
            >
            <div class="mt-0.5 flex items-center gap-2.5">
                <div
                    class="border-base-300 rounded-box hover:bg-base-200 flex cursor-pointer items-center gap-2 border px-2 py-0.5">
                    <span class="iconify lucide--file-spreadsheet size-3.5" />
                    <span class="text-sm">Report.xlsx</span>
                    <span class="iconify lucide--x size-3.5" />
                </div>
                <div
                    class="border-base-300 rounded-box hover:bg-base-200 flex cursor-pointer items-center gap-2 border px-2 py-0.5 max-sm:hidden">
                    <span class="iconify lucide--file-image size-3.5" />
                    <span class="text-sm">DesignDraft.png</span>
                    <span class="iconify lucide--x size-3.5" />
                </div>
                <button class="btn btn-xs btn-circle btn-ghost" aria-label="Add">
                    <span class="iconify lucide--plus-circle text-base-content/80 size-4.5" />
                </button>
            </div>
            <div class="mt-0.5 flex items-end justify-between">
                <div class="inline-flex items-center gap-0.5">
                    <div class="dropdown dropdown-start">
                        <div tabindex="0" role="button" class="badge badge-sm cursor-pointer" aria-label="Priority">
                            <div class="bg-primary size-1.5 rounded-full" />
                            <p>Queue</p>
                        </div>
                        <ul tabindex="0" class="dropdown-content bg-base-100 rounded-box menu mt-2 w-36 p-1.5 shadow">
                            <li>
                                <div>
                                    <div class="bg-error size-1.5 rounded-full" />
                                    Urgent
                                </div>
                            </li>
                            <li>
                                <div>
                                    <div class="bg-primary size-1.5 rounded-full" />
                                    Queue
                                </div>
                            </li>
                            <li>
                                <div>
                                    <div class="bg-base-content/30 size-1.5 rounded-full" />
                                    Background
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="flex items-center gap-2">
                    <button class="btn btn-sm btn-circle btn-ghost" aria-label="Voice">
                        <span class="iconify lucide--mic text-base-content/80 size-4.5" />
                    </button>
                    <button class="btn btn-primary btn-circle btn-sm" aria-label="Send">
                        <span class="iconify lucide--arrow-up size-4" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
