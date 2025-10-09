<script setup lang="ts">
import BrandingFooterDemo from "./BrandingFooterDemo.vue";
import CustomBackgroundFooterDemo from "./CustomBackgroundFooterDemo.vue";
import LegalFooterDemo from "./LegalFooterDemo.vue";
import MinimalFooterDemo from "./MinimalFooterDemo.vue";
import Options1FooterDemo from "./Options1FooterDemo.vue";
import Options2FooterDemo from "./Options2FooterDemo.vue";
import SocialFooterDemo from "./SocialFooterDemo.vue";
import StatusFooterDemo from "./StatusFooterDemo.vue";
import SupportFooterDemo from "./SupportFooterDemo.vue";

definePageMeta({
    layout: "components",
});
</script>

<template>
    <div>
        <ComponentPageTitle
            label="Layouts"
            title="Footer"
            description="Footer demos showcase minimal, social, branding, legal, status, support, and customizable layouts." />

        <div class="bg-base-200/40 rounded-box mt-6 flex items-center gap-3 px-5 py-4 lg:mt-12">
            <span class="iconify lucide--info text-base-content/70 size-4.5" />
            <p>
                <span class="me-1">Play with layouts using</span>
                <NuxtLink href="/layout-builder" target="_blank" class="text-primary"> Layout Builder </NuxtLink>
            </p>
        </div>

        <p class="text-base-content/60 mt-6 font-medium">Demos</p>

        <div class="mt-6 space-y-8">
            <div class="card bg-base-100 card-border">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Minimal</div>
                <div class="py-2">
                    <MinimalFooterDemo />
                </div>
            </div>
            <div class="card bg-base-100 card-border">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Social</div>
                <div class="py-2">
                    <SocialFooterDemo />
                </div>
            </div>
            <div class="card bg-base-100 card-border">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Branding</div>
                <div class="py-2">
                    <BrandingFooterDemo />
                </div>
            </div>
            <div class="card bg-base-100 card-border">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Legal</div>
                <div class="py-2">
                    <LegalFooterDemo />
                </div>
            </div>
            <div class="card bg-base-100 card-border">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Status</div>
                <div class="py-2">
                    <StatusFooterDemo />
                </div>
            </div>

            <div class="card bg-base-100 card-border">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Support</div>
                <div class="py-2">
                    <SupportFooterDemo />
                </div>
            </div>

            <div class="card bg-base-100 card-border">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Options 1</div>
                <div class="py-2">
                    <Options1FooterDemo />
                </div>
            </div>
            <div class="card bg-base-100 card-border">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Options 2</div>
                <div class="py-2">
                    <Options2FooterDemo />
                </div>
            </div>
            <div class="card bg-base-100 card-border">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Custom Background</div>
                <CustomBackgroundFooterDemo />
            </div>
        </div>
    </div>
</template>

<style scoped></style>
