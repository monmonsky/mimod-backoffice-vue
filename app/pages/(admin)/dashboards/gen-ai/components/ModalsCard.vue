<template>
    <div class="card bg-base-100 shadow">
        <div class="p-5">
            <div class="flex items-center gap-3">
                <span class="iconify lucide--brain-circuit text-base-content/80 size-4.5" />
                <p class="grow font-medium">Modals</p>
                <button class="btn btn-ghost btn-xs btn-circle">
                    <span class="iconify lucide--settings-2 size-4" />
                </button>
            </div>
            <div class="mt-5 grid gap-5 sm:grid-cols-2">
                <div class="group flex cursor-pointer items-center gap-3">
                    <div
                        class="border-base-300 group-hover:bg-base-200 flex size-9 items-center justify-center rounded-lg border border-dashed transition-all">
                        <span class="iconify lucide--plus" />
                    </div>
                    <p class="leading-none font-medium">Add Modal</p>
                </div>
                <div class="flex items-center gap-3">
                    <div class="bg-primary/10 grid size-9 place-items-center rounded-lg">
                        <div class="mask mask-hexagon-2 bg-primary/30 size-5" />
                    </div>
                    <div>
                        <p class="leading-none font-medium">NeuraX-7</p>
                        <p class="text-base-content/60 text-sm">99k users</p>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    <div class="bg-secondary/10 grid size-9 place-items-center rounded-lg">
                        <div class="mask mask-diamond bg-secondary/30 size-5" />
                    </div>
                    <div>
                        <p class="leading-none font-medium">SynthaMind-5</p>
                        <p class="text-base-content/60 text-sm">120k users</p>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    <div class="bg-success/10 grid size-9 place-items-center rounded-lg">
                        <div class="mask mask-pentagon bg-success/30 size-5" />
                    </div>
                    <div>
                        <p class="leading-none font-medium">QuantumVision-X</p>
                        <p class="text-base-content/60 text-sm">85k users</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
