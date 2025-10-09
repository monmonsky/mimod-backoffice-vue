<script setup lang="ts"></script>

<template>
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
        <div class="card bg-base-100 h-full cursor-pointer p-4 shadow transition-all hover:shadow-md sm:col-span-2">
            <div class="flex justify-between">
                <p class="leading-none font-medium">Quick Insights</p>
                <button class="btn btn-xs btn-ghost btn-circle -m-1">
                    <span class="iconify lucide--pin size-4 text-orange-400" />
                </button>
            </div>
            <div class="mt-3.5 flex h-full items-stretch gap-4 sm:gap-8">
                <div>
                    <p class="text-2xl font-semibold">
                        <sup class="text-base-content/40 me-0.5 text-lg">$</sup>1245
                        <span class="text-base-content/60 text-xl" />
                    </p>
                    <p class="text-base-content/50 mt-auto pt-1 text-center text-sm/none">Today</p>
                </div>
                <div class="border-base-300 h-full border-s border-dashed" />
                <div>
                    <p class="text-2xl font-semibold">
                        <sup class="text-base-content/40 me-0.5 text-lg">$</sup>12.
                        <span class="text-base-content/60 text-xl">74</span> K
                    </p>
                    <p class="text-base-content/50 mt-auto pt-1 text-center text-sm/none">This Month</p>
                </div>
                <div class="border-base-300 h-full border-s border-dashed max-sm:hidden" />
                <div class="max-sm:hidden">
                    <p class="text-2xl font-semibold">
                        +18.4%
                        <span class="text-base-content/60 text-xl" />
                    </p>
                    <p class="text-base-content/50 mt-auto pt-1 text-center text-sm/none">Growth</p>
                </div>
            </div>
        </div>
        <div class="card bg-base-100 cursor-pointer p-4 shadow transition-all hover:shadow-md">
            <div class="flex justify-between">
                <p class="text-sm/none">Token Consumption</p>
                <button class="btn btn-xs btn-ghost btn-circle -m-1">
                    <span class="iconify lucide--flame text-base-content/80 size-4" />
                </button>
            </div>
            <p class="mt-2 text-2xl font-medium">18.47 M</p>
            <div class="flex items-end justify-between gap-2">
                <p class="text-base-content/50 text-sm/none">Higher than usual</p>
                <div class="bg-base-200 rounded-box p-1">
                    <span class="iconify lucide--chevron-right text-base-content/80 block" />
                </div>
            </div>
        </div>
        <div class="card bg-base-100 cursor-pointer p-4 shadow transition-all hover:shadow-md">
            <div class="flex justify-between">
                <p class="text-sm/none">AI Model Accuracy</p>
                <button class="btn btn-xs btn-ghost btn-circle -m-1">
                    <span class="iconify lucide--target text-base-content/80 size-4" />
                </button>
            </div>
            <p class="mt-2 text-2xl font-medium">97.2%</p>
            <div class="flex items-end justify-between gap-2">
                <p class="text-base-content/50 text-sm/none">Stable performance</p>
                <div class="bg-base-200 rounded-box p-1">
                    <span class="iconify lucide--chevron-right text-base-content/80 block" />
                </div>
            </div>
        </div>
        <div class="card bg-base-100 cursor-pointer p-4 shadow transition-all hover:shadow-md">
            <div class="flex justify-between">
                <p class="text-sm/none">Processing Power</p>
                <button class="btn btn-xs btn-ghost btn-circle -m-1">
                    <span class="iconify lucide--cpu text-base-content/80 size-4" />
                </button>
            </div>
            <p class="mt-2 text-2xl font-medium">96 <span class="text-base">TFLOPS</span></p>
            <div class="flex items-end justify-between gap-2">
                <p class="text-base-content/50 text-sm/none">Performance at peak</p>
                <div class="bg-base-200 rounded-box p-1">
                    <span class="iconify lucide--chevron-right text-base-content/80 block" />
                </div>
            </div>
        </div>

        <div class="bg-neutral text-neutral-content card h-full p-3 shadow">
            <p class="text-lg/5.5 font-medium">Supercharge Your AI Capabilities</p>
            <div class="mt-auto flex items-end justify-between gap-3 pt-2">
                <div>
                    <p class="text-sm/none italic opacity-80">Enhanced AI</p>
                </div>
                <button class="btn btn-sm rounded-full">Upgrade</button>
            </div>
        </div>
    </div>
</template>
