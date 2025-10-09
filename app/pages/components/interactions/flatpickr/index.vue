<script setup lang="ts">
import MandarinLocaleDemo from "./ChineseLocaleDemo.vue";
import ConfirmPluginDemo from "./ConfirmPluginDemo.vue";
import ControlsDemo from "./ControlsDemo.vue";
import DateDemo from "./DateDemo.vue";
import DateTimeDemo from "./DateTimeDemo.vue";
import DisabledDatesDemo from "./DisabledDatesDemo.vue";
import DisabledDemo from "./DisabledDemo.vue";
import EnabledDatesDemo from "./EnabledDatesDemo.vue";
import HindiLocaleDemo from "./HindiLocaleDemo.vue";
import HumanFriendlyDemo from "./HumanFriendlyDemo.vue";
import InlineDemo from "./InlineDemo.vue";
import MinMaxDemo from "./MinMaxDemo.vue";
import MonthPluginDemo from "./MonthPluginDemo.vue";
import MultipleDemo from "./MultipleDemo.vue";
import RangeDemo from "./RangeDemo.vue";
import RangePluginDemo from "./RangePluginDemo.vue";
import Time24Demo from "./Time24Demo.vue";
import TimeDemo from "./TimeDemo.vue";
import WeekNumberDemo from "./WeekNumberDemo.vue";
import WeekPluginDemo from "./WeekPluginDemo.vue";

definePageMeta({
    layout: "components",
});
</script>

<template>
    <div>
        <ComponentPageTitle
            label="Interactions"
            title="Flatpickr"
            description="Feature-rich calendar with date, time, range, plugins, and full localization support." />
        <div class="bg-base-200/40 rounded-box mt-6 px-5 py-4 lg:mt-12">
            <p class="text-base-content/60 font-medium">Usage guidelines</p>
            <p class="mt-1">
                <span class="me-1">- Plugin Documentation:</span>
                <NuxtLink href="https://flatpickr.js.org/" target="_blank" class="text-primary"> Flatpickr </NuxtLink>
            </p>
        </div>
        <p class="text-base-content/60 mt-6 font-medium">Demos</p>
        <div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Date</div>
                <div class="p-5">
                    <DateDemo />
                </div>
            </div>
            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Disabled</div>
                <div class="p-5">
                    <DisabledDemo />
                </div>
            </div>
            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Time (AM/PM)</div>
                <div class="p-5">
                    <TimeDemo />
                </div>
            </div>
            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Time (24 Hours)</div>
                <div class="p-5">
                    <Time24Demo />
                </div>
            </div>
            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Date Time</div>
                <div class="p-5">
                    <DateTimeDemo />
                </div>
            </div>
            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Human Friendly</div>
                <div class="p-5">
                    <HumanFriendlyDemo />
                </div>
            </div>
            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Controls</div>
                <div class="p-5">
                    <ControlsDemo />
                </div>
            </div>
        </div>
        <p class="text-base-content/70 mt-6 font-medium">Inline</p>
        <div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Inline</div>
                <div class="p-5">
                    <InlineDemo />
                </div>
            </div>
            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Min max</div>
                <div class="p-5">
                    <MinMaxDemo />
                </div>
            </div>
            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Enabled Dates</div>
                <div class="p-5">
                    <EnabledDatesDemo />
                </div>
            </div>
            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Disabled Dates</div>
                <div class="p-5">
                    <DisabledDatesDemo />
                </div>
            </div>
            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Multiple</div>
                <div class="p-5">
                    <MultipleDemo />
                </div>
            </div>
            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Range</div>
                <div class="p-5">
                    <RangeDemo />
                </div>
            </div>
            <div class="bg-base-100 card card-border max-sm:hidden">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Week Number</div>
                <div class="p-5">
                    <WeekNumberDemo />
                </div>
            </div>
        </div>
        <p class="text-base-content/70 mt-6 font-medium">Plugins</p>
        <div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Range</div>
                <div class="p-5">
                    <RangePluginDemo />
                </div>
            </div>
            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Confirm</div>
                <div class="p-5">
                    <ConfirmPluginDemo />
                </div>
            </div>
            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Select Week</div>
                <div class="p-5">
                    <WeekPluginDemo />
                </div>
            </div>
            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Month</div>
                <div class="p-5">
                    <MonthPluginDemo />
                </div>
            </div>
        </div>
        <p class="text-base-content/70 mt-6 font-medium">Localization (Demo)</p>
        <div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Hindi</div>
                <div class="p-5">
                    <HindiLocaleDemo />
                </div>
            </div>
            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Mandarin</div>
                <div class="p-5">
                    <MandarinLocaleDemo />
                </div>
            </div>
        </div>
    </div>
</template>
