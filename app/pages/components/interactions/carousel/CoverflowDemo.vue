<script lang="ts" setup>
import "swiper/css";
import "swiper/css/effect-coverflow";
import { Autoplay, EffectCoverflow, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/vue";

import { carouselDemoImages } from "./helpers";

const options = {
    centeredSlides: true,
    loop: true,
    speed: 1000,
    autoplay: {
        delay: 5000,
    },
    effect: "coverflow",
    navigation: {
        prevEl: ".coverflow-carousel-demo-btn-prev",
        nextEl: ".coverflow-carousel-demo-btn-next",
    },
    coverflowEffect: {
        scale: 0.85,
        stretch: 0,
        rotate: 0,
    },
    breakpoints: {
        0: {
            slidesPerView: 1.6,
            spaceBetween: 4,
        },
        768: {
            slidesPerView: 2.8,
            spaceBetween: 6,
        },
        1440: {
            slidesPerView: 3.4,
            spaceBetween: 8,
        },
    },
    modules: [Navigation, Autoplay, EffectCoverflow],
};
</script>

<template>
    <div class="relative isolate md:mx-20">
        <Swiper v-bind="options">
            <SwiperSlide v-for="(url, i) in carouselDemoImages" :key="i">
                <img :src="url" alt="Image" class="rounded-box h-44 w-full object-cover md:h-60" />
            </SwiperSlide>
        </Swiper>
        <div class="absolute -inset-x-16 top-1/2 z-1 flex -translate-y-1/2 justify-between max-md:hidden">
            <button class="coverflow-carousel-demo-btn-prev btn btn-circle btn-soft" aria-label="Navigation">
                <span class="iconify lucide--chevron-left size-5" />
            </button>
            <button class="coverflow-carousel-demo-btn-next btn btn-circle btn-soft" aria-label="Navigation">
                <span class="iconify lucide--chevron-right size-5" />
            </button>
        </div>
    </div>
</template>
