<script setup lang="ts">
import DisabledDemo from "./DisabledDemo.vue";
import EmailInputDemo from "./EmailInputDemo.vue";
import GroupDemo from "./GroupDemo.vue";
import MultipleDemo from "./MultipleDemo.vue";
import RemovableDemo from "./RemovableDemo.vue";
import SearchableDemo from "./SearchableDemo.vue";
import SimpleDemo from "./SimpleDemo.vue";
import TextInputDemo from "./TextInputDemo.vue";

definePageMeta({
    layout: "components",
});
</script>

<template>
    <div>
        <ComponentPageTitle
            label="Interactions"
            title="Select"
            description="Feature-rich select and input components with support for groups, search, multiple, and more" />
        <div class="bg-base-200/40 rounded-box mt-6 px-5 py-4 lg:mt-12">
            <p class="text-base-content/60 font-medium">Usage guidelines</p>
            <p class="mt-1">
                <span class="me-1">- Plugin Documentation:</span>
                <Link href="https://choices-js.github.io/Choices/" target="_blank" class="text-primary">
                    Choices.js
                </Link>
            </p>
        </div>
        <p class="text-base-content/60 mt-6 font-medium">Demos</p>
        <div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Simple</div>
                <div class="p-5">
                    <SimpleDemo />
                </div>
            </div>
            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Disabled</div>
                <div class="p-5">
                    <DisabledDemo />
                </div>
            </div>
            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Group</div>
                <div class="p-5">
                    <GroupDemo />
                </div>
            </div>
            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Multiple</div>
                <div class="p-5">
                    <MultipleDemo />
                </div>
            </div>
            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Removable</div>
                <div class="p-5">
                    <RemovableDemo />
                </div>
            </div>
            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Searchable</div>
                <div class="p-5">
                    <SearchableDemo />
                </div>
            </div>
            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Text Input</div>
                <div class="p-5">
                    <TextInputDemo />
                </div>
            </div>
            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Email Input</div>
                <div class="p-5">
                    <EmailInputDemo />
                </div>
            </div>
        </div>
    </div>
</template>
