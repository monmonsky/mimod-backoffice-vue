<script setup lang="ts">
import BundleOffer from "./components/BundleOffer.vue";
import CTA from "./components/CTA.vue";
import FAQ from "./components/FAQ.vue";
import FeatureList from "./components/Features.vue";
import Footer from "./components/Footer.vue";
import Hero from "./components/Hero.vue";
import Showcase from "./components/Showcase.vue";
import Testimonial from "./components/Testimonial.vue";
import Topbar from "./components/Topbar.vue";
</script>
`
<template>
    <div>
        <Topbar />
        <Hero />
        <FeatureList />
        <Showcase />
        <Testimonial />
        <CTA />
        <FAQ />
        <BundleOffer />
        <Footer />
    </div>
</template>
