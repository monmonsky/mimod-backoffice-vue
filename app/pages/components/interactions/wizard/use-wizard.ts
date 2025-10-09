import { computed, ref } from "vue";

export function useWizard(totalSteps: number, initialStep = 1) {
    const currentStep = ref(initialStep);

    const canPrevious = computed(() => currentStep.value > 1);
    const canNext = computed(() => currentStep.value < totalSteps);
    const isLastStep = computed(() => currentStep.value === totalSteps);

    const goTo = (index: number) => {
        if (index < 1) currentStep.value = 1;
        else if (index > totalSteps) currentStep.value = totalSteps;
        else currentStep.value = index;
    };

    const goNext = () => {
        if (currentStep.value < totalSteps) currentStep.value++;
    };

    const goPrevious = () => {
        if (currentStep.value > 1) currentStep.value--;
    };

    return {
        currentStep,
        totalSteps,
        canNext,
        canPrevious,
        goNext,
        goPrevious,
        isLastStep,
        goTo,
    };
}
