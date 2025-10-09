<script setup lang="ts">
import CheckboxDemo from "./CheckboxDemo.vue";
import EmailDemo from "./EmailDemo.vue";
import FormDemo from "./FormDemo.vue";
import NumberDemo from "./NumberDemo.vue";
import RadioDemo from "./RadioDemo.vue";
import RangeDemo from "./RangeDemo.vue";
import RatingsDemo from "./RatingsDemo.vue";
import SelectDemo from "./SelectDemo.vue";
import TextDemo from "./TextDemo.vue";
import ToggleDemo from "./ToggleDemo.vue";

definePageMeta({
    layout: "components",
});
</script>

<template>
    <div>
        <ComponentPageTitle
            label="Interactions"
            title="Form Validation"
            description="Flexible form validation with inputs, checkboxes, radios, toggles, selects, and custom controls" />
        <p class="text-base-content/60 mt-6 font-medium lg:mt-12">Demos</p>

        <div class="bg-base-100 card card-border mt-6">
            <div class="bg-base-200/30 flex items-center gap-2.5 px-5 py-3 font-medium">
                <span class="iconify lucide--form-input size-4.5" />
                Form
            </div>
            <div class="p-5">
                <FormDemo />
            </div>
        </div>

        <p class="text-base-content/60 mt-6 font-medium">Form Elements</p>
        <div class="mt-6 grid grid-cols-1 gap-6 space-y-6 lg:grid-cols-2 xl:grid-cols-3">
            <div class="bg-base-100 card card-border h-fit">
                <div class="bg-base-200/30 flex items-center gap-2.5 px-5 py-3 font-medium">
                    <span class="iconify lucide--text size-4.5" />
                    Text
                </div>
                <div class="p-5">
                    <TextDemo />
                </div>
            </div>

            <div class="bg-base-100 card card-border h-fit">
                <div class="bg-base-200/30 flex items-center gap-2.5 px-5 py-3 font-medium">
                    <span class="iconify lucide--binary size-4.5" />
                    Number
                </div>
                <div class="p-5">
                    <NumberDemo />
                </div>
            </div>

            <div class="bg-base-100 card card-border h-fit">
                <div class="bg-base-200/30 flex items-center gap-2.5 px-5 py-3 font-medium">
                    <span class="iconify lucide--mail size-4.5" />
                    Email
                </div>
                <div class="p-5">
                    <EmailDemo />
                </div>
            </div>

            <div class="bg-base-100 card card-border h-fit">
                <div class="bg-base-200/30 flex items-center gap-2.5 px-5 py-3 font-medium">
                    <span class="iconify lucide--circle-dot size-4.5" />
                    Radio
                </div>
                <div class="p-5">
                    <RadioDemo />
                </div>
            </div>

            <div class="bg-base-100 card card-border h-fit">
                <div class="bg-base-200/30 flex items-center gap-2.5 px-5 py-3 font-medium">
                    <span class="iconify lucide--square-check size-4.5" />
                    Checkbox
                </div>
                <div class="p-5">
                    <CheckboxDemo />
                </div>
            </div>

            <div class="bg-base-100 card card-border h-fit">
                <div class="bg-base-200/30 flex items-center gap-2.5 px-5 py-3 font-medium">
                    <span class="iconify lucide--toggle-right size-4.5" />
                    Toggle
                </div>
                <div class="p-5">
                    <ToggleDemo />
                </div>
            </div>

            <div class="bg-base-100 card card-border h-fit">
                <div class="bg-base-200/30 flex items-center gap-2.5 px-5 py-3 font-medium">
                    <span class="iconify lucide--diamond size-4.5" />
                    Select
                </div>
                <div class="p-5">
                    <SelectDemo />
                </div>
            </div>

            <div class="bg-base-100 card card-border h-fit">
                <div class="bg-base-200/30 flex items-center gap-2.5 px-5 py-3 font-medium">
                    <span class="iconify lucide--settings-2 size-4.5" />
                    Range
                </div>
                <div class="p-5">
                    <RangeDemo />
                </div>
            </div>

            <div class="bg-base-100 card card-border h-fit">
                <div class="bg-base-200/30 flex items-center gap-2.5 px-5 py-3 font-medium">
                    <span class="iconify lucide--star size-4.5" />
                    Ratings
                </div>
                <div class="p-5">
                    <RatingsDemo />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
