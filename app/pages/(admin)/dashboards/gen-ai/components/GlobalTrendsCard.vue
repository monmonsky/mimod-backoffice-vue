<template>
    <div aria-label="Card" class="card bg-base-100 shadow">
        <div class="card-body p-0">
            <div class="flex items-center gap-3 px-5 pt-5">
                <span class="iconify lucide--globe size-4.5" />
                <span class="font-medium">Global AI Trends</span>
                <button class="btn btn-outline border-base-300 max-sm:btn-square btn-sm ms-auto">
                    <span class="iconify lucide--download size-3.5" />
                    <span class="max-sm:hidden">Download</span>
                </button>
            </div>
            <div class="space-y-2.5 p-5">
                <div class="bg-base-200/80 flex h-8 w-full items-center justify-between rounded-full">
                    <div class="bg-primary/30 flex h-8 w-[67%] items-center rounded-full ps-5 text-sm">India</div>
                    <span class="me-4 text-sm">67%</span>
                </div>
                <div class="bg-base-200/80 flex h-8 w-full items-center justify-between rounded-full">
                    <div class="bg-secondary/30 flex h-8 w-[78%] items-center rounded-full ps-5 text-sm">
                        United States
                    </div>
                    <span class="me-4 text-sm">78%</span>
                </div>
                <div class="bg-base-200/80 flex h-8 w-full items-center justify-between rounded-full">
                    <div class="bg-success/30 flex h-8 w-[52%] items-center rounded-full ps-5 text-sm">Japan</div>
                    <span class="me-4 text-sm">52%</span>
                </div>
                <div class="bg-base-200/80 flex h-8 w-full items-center justify-between rounded-full">
                    <div class="bg-warning/30 flex h-8 w-[80%] items-center rounded-full ps-5 text-sm">Germany</div>
                    <span class="me-4 text-sm">80%</span>
                </div>
                <div class="bg-base-200/80 flex h-8 w-full items-center justify-between rounded-full">
                    <div class="bg-info/30 flex h-8 w-[45%] items-center rounded-full ps-5 text-sm">Canada</div>
                    <span class="me-4 text-sm">45%</span>
                </div>
                <div class="bg-base-200/80 flex h-8 w-full items-center justify-between rounded-full">
                    <div class="bg-error/30 flex h-8 w-[30%] items-center rounded-full ps-5 text-sm">Brazil</div>
                    <span class="me-4 text-sm">30%</span>
                </div>
            </div>
        </div>
    </div>
</template>
