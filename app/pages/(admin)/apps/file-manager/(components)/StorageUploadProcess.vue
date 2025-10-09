<template>
    <div class="card card-border border-base-300">
        <div class="card-body px-4 pt-3 pb-2">
            <div>
                <div class="flex items-center justify-between">
                    <span class="font-medium max-sm:text-sm">Feedback video (.mp4)</span>
                    <div class="inline-flex gap-2">
                        <span class="iconify lucide--pause size-4" />
                        <span class="iconify lucide--x-circle text-error size-4" />
                    </div>
                </div>
                <div class="mt-1 flex items-center justify-between text-xs">
                    <span>70%</span>
                    <span>1.2 GiB</span>
                </div>
                <progress class="progress progress-success h-1 align-super" max="100" :value="70" />
            </div>

            <div>
                <div class="flex items-center justify-between">
                    <span class="font-medium max-sm:text-sm">Company revenue (.xlsx)</span>
                    <div class="inline-flex gap-2">
                        <span class="iconify lucide--play size-4" />
                        <span class="iconify lucide--x-circle text-error size-4" />
                    </div>
                </div>
                <div class="mt-1 flex items-center justify-between text-xs">
                    <span>20%</span>
                    <span>12 MiB</span>
                </div>
                <progress class="progress progress-error h-1 align-super" max="100" :value="20" />
            </div>
        </div>
    </div>
</template>
