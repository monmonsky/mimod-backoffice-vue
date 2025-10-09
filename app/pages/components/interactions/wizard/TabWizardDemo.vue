<script lang="ts" setup>
import { useWizard } from "./use-wizard";

const { currentStep, totalSteps, canNext, canPrevious, goNext, goPrevious, goTo, isLastStep } = useWizard(4);
</script>

<template>
    <div>
        <div role="tablist" class="tabs tabs-box">
            <a role="tab" class="tab grow gap-2" :class="{ 'tab-active': currentStep === 1 }" @click="goTo(1)">
                <span class="iconify lucide--user size-4" />
                <span class="max-md:hidden">Personal Details</span>
            </a>
            <a role="tab" class="tab grow gap-2" :class="{ 'tab-active': currentStep === 2 }" @click="goTo(2)">
                <span class="iconify lucide--settings-2 size-4" />
                <span class="max-md:hidden">Account Settings</span>
            </a>
            <a role="tab" class="tab grow gap-2" :class="{ 'tab-active': currentStep === 3 }" @click="goTo(3)">
                <span class="iconify lucide--shield-check size-4" />
                <span class="max-md:hidden">Permissions</span>
            </a>
            <a role="tab" class="tab grow gap-2" :class="{ 'tab-active': currentStep === 4 }" @click="goTo(4)">
                <span class="iconify lucide--check-circle-2 size-4" />
                <span class="max-md:hidden">Review</span>
            </a>
        </div>

        <div
            class="bg-base-200/30 border-base-300 text-base-content/50 rounded-box mt-6 flex h-40 items-center justify-center p-5 font-medium">
            Step {{ currentStep }} of {{ totalSteps }}
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
