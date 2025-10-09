<script setup lang="ts">
import ModalUsagesChart from "./ModalUsagesChart.vue";
</script>

<template>
    <div class="card bg-base-100 shadow">
        <div class="card-body px-0 pb-0">
            <div class="px-6">
                <div class="flex items-start justify-between">
                    <span class="text-lg/none font-medium">Modals Overview</span>
                    <div class="flex items-center gap-1.5">
                        <button class="btn btn-circle btn-sm border-base-300 btn-outline">
                            <span class="iconify lucide--arrow-up-down size-4" />
                        </button>
                        <button class="btn btn-circle btn-sm border-base-300 btn-outline">
                            <span class="iconify lucide--layout-grid size-4" />
                        </button>
                        <button class="btn btn-circle btn-sm border-base-300 btn-outline max-sm:hidden">
                            <span class="iconify lucide--refresh-cw size-4" />
                        </button>
                    </div>
                </div>
                <div class="mt-1 flex justify-between">
                    <div>
                        <div class="flex items-center gap-3">
                            <span class="text-4xl font-semibold">627K</span>
                            <span class="text-primary font-medium">+2.14%</span>
                        </div>
                        <span class="text-base-content/60 text-sm">Tokens processed today</span>
                    </div>
                    <div class="dropdown dropdown-end mt-1">
                        <div
                            tabIndex="0"
                            role="button"
                            class="text-base-content/60 hover:text-base-content flex cursor-pointer items-center gap-1 text-sm transition-all">
                            This Month
                            <span class="iconify lucide--chevron-down size-3" />
                        </div>
                        <ul
                            tabIndex="0"
                            class="dropdown-content menu bg-base-100 rounded-box z-1 mt-1 w-36 p-1 shadow transition-all hover:shadow-md">
                            <li>
                                <a>Today</a>
                            </li>
                            <li>
                                <a>This Week</a>
                            </li>
                            <li>
                                <a>This Month</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div>
                <ModalUsagesChart />
            </div>
        </div>
    </div>
</template>
