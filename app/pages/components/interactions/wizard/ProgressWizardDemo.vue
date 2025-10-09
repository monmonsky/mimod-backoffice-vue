<script lang="ts" setup>
import { useWizard } from "./use-wizard";

const steps = ["Personal Details", "Account Settings", "Permissions", "Review"];

const { currentStep, totalSteps, canNext, canPrevious, isLastStep, goNext, goPrevious, goTo } = useWizard(steps.length);

const progressPercent = computed(() => ((currentStep.value - 1) * 100) / totalSteps);
const progressNextPercent = computed(() => (currentStep.value * 100) / totalSteps);
</script>

<template>
    <div>
        <div>
            <div class="grid grid-cols-4 items-center gap-3">
                <div
                    v-for="(step, index) in steps"
                    :key="index"
                    class="text-base-content/80 hover:text-base-content flex cursor-pointer items-center justify-center gap-2"
                    @click="goTo(index + 1)">
                    <div
                        :class="[
                            'flex size-6 items-center justify-center rounded-full font-medium',
                            index + 1 >= currentStep ? 'bg-base-200' : 'bg-primary text-primary-content',
                        ]">
                        <span class="iconify lucide--check" :class="index + 1 >= currentStep ? 'hidden' : ''" />
                        <span :class="index + 1 >= currentStep ? '' : 'hidden'">{{ index + 1 }}</span>
                    </div>
                    <span class="font-medium max-lg:hidden">{{ step }}</span>
                </div>
            </div>

            <div class="bg-base-200 relative mt-2 h-1.5 overflow-hidden rounded-full">
                <div
                    class="bg-primary absolute h-full w-full origin-left scale-x-0 rounded-full transition-all duration-500"
                    :style="{ scale: `${progressPercent}% 100%` }" />
                <div
                    class="bg-primary/30 h-full w-full origin-left scale-x-0 rounded-full transition-all duration-500"
                    :style="{ scale: `${progressNextPercent}% 100%` }" />
            </div>
        </div>

        <div
            class="bg-base-200/30 border-base-300 text-base-content/50 rounded-box mt-6 flex h-40 items-center justify-center p-5 font-medium">
            Step {{ currentStep }} of {{ steps.length }}
        </div>

        <div class="mt-4 flex justify-between">
            <button v-if="canPrevious" class="btn gap-2" @click="goPrevious">
                <span class="iconify lucide--chevron-left size-4" />
                <span>Prev</span>
            </button>
            <button v-if="canNext" class="btn ms-auto gap-2" @click="goNext">
                <span>Next</span>
                <span class="iconify lucide--chevron-right size-4" />
            </button>
            <button v-if="isLastStep" class="btn btn-primary ms-auto gap-2">
                <span class="iconify lucide--flag size-4" />
                <span>Finish</span>
            </button>
        </div>
    </div>
</template>
