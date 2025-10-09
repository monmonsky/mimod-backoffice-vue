<template>
    <div class="dropdown dropdown-bottom dropdown-center">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle btn-sm" aria-label="Menu">
            <span class="iconify lucide--more-vertical size-4" />
        </div>
        <div tabindex="0" class="dropdown-content bg-base-100 rounded-box mt-2 w-52 shadow">
            <ul class="menu w-full p-1.5">
                <li>
                    <div>
                        <span class="iconify lucide--arrow-down-to-line size-4" />
                        Download
                    </div>
                </li>
                <li>
                    <div>
                        <span class="iconify lucide--pen-line size-4" />
                        Rename
                    </div>
                </li>
                <li>
                    <div>
                        <span class="iconify lucide--user-round-plus size-4" />
                        Share
                    </div>
                </li>
            </ul>
            <hr class="border-base-300" />
            <ul class="menu w-full p-1.5">
                <li>
                    <div class="text-error hover:bg-error/10">
                        <span class="iconify lucide--trash size-4" />
                        Move to bin
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
