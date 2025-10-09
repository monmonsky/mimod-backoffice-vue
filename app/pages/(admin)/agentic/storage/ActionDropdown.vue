<script lang="ts" setup></script>

<template>
    <div class="dropdown dropdown-bottom dropdown-end">
        <div tabIndex="0" role="button" class="btn btn-ghost btn-circle btn-xs" aria-label="Menu">
            <span class="iconify lucide--more-vertical size-3.5" />
        </div>
        <div
            tabIndex="0"
            class="dropdown-content bg-base-100 rounded-box mt-2 w-40 shadow transition-all hover:shadow-lg">
            <ul class="menu w-full p-1.5">
                <li>
                    <div>
                        <span class="iconify lucide--sparkles size-4" />
                        Enhance
                    </div>
                </li>
                <li>
                    <div>
                        <span class="iconify lucide--brain size-4" />
                        Insights
                    </div>
                </li>
                <li>
                    <div>
                        <span class="iconify lucide--wand-2 size-4" />
                        Auto Tag
                    </div>
                </li>
            </ul>
            <hr class="border-base-300" />
            <ul class="menu w-full p-1.5">
                <li>
                    <div class="text-error hover:bg-error/10">
                        <span class="iconify lucide--trash size-4" />
                        Delete
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
