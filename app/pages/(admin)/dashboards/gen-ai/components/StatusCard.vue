<script setup lang="ts"></script>

<template>
    <div class="card bg-base-100 shadow">
        <div class="p-5">
            <div class="flex items-center gap-3">
                <span class="iconify lucide--heart-pulse size-4" />
                <p class="grow font-medium">System Status</p>
                <div class="flex items-center gap-3">
                    <span class="text-base-content/60 text-sm italic max-sm:hidden">Fully operational</span>
                    <div class="inline-grid *:[grid-area:1/1]">
                        <div class="status status-success animate-ping" />
                        <div class="status status-success" />
                    </div>
                </div>
            </div>
            <div class="mt-4 grid gap-3 sm:grid-cols-2">
                <div class="border-base-200 hover:bg-base-200/50 rounded-box cursor-pointer border p-3 transition-all">
                    <div class="flex items-center gap-2">
                        <span class="iconify lucide--badge-check text-success size-4.5" />
                        <p class="text-sm">API Success Rate</p>
                    </div>
                    <div class="mt-2.5 flex items-end justify-between gap-2">
                        <p class="text-lg/none font-medium">98%</p>
                        <p class="text-success text-sm/none">Stable</p>
                    </div>
                </div>
                <div class="border-base-200 hover:bg-base-200/50 rounded-box cursor-pointer border p-3 transition-all">
                    <div class="flex items-center gap-2">
                        <span class="iconify lucide--clock text-primary size-4.5" />
                        <p class="text-sm">Response Time</p>
                    </div>
                    <div class="mt-2.5 flex items-end justify-between gap-2">
                        <p class="text-lg/none font-medium">200ms</p>
                        <p class="text-primary text-sm/none">Acceptable</p>
                    </div>
                </div>

                <div class="border-base-200 hover:bg-base-200/50 rounded-box cursor-pointer border p-3 transition-all">
                    <div class="flex items-center gap-2">
                        <span class="iconify lucide--zap text-secondary size-4.5" />
                        <p class="text-sm">AI Performance</p>
                    </div>
                    <div class="mt-2.5 flex items-end justify-between gap-2">
                        <p class="text-lg/none font-medium">350 tokens/req</p>
                        <p class="text-secondary text-sm/none">Efficient</p>
                    </div>
                </div>

                <div class="border-base-200 hover:bg-base-200/50 rounded-box cursor-pointer border p-3 transition-all">
                    <div class="flex items-center gap-2">
                        <span class="iconify lucide--server text-error size-4.5" />
                        <p class="text-sm">Server Load</p>
                    </div>
                    <div class="mt-2.5 flex items-end justify-between gap-2">
                        <p class="text-lg/none font-medium">75%</p>
                        <p class="text-error text-sm/none">High Load</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
