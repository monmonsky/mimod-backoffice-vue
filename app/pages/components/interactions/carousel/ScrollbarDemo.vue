<script lang="ts" setup>
import "swiper/css";
import "swiper/css/scrollbar";
import { Navigation, Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/vue";

import { carouselDemoImages } from "./helpers";

const options = {
    speed: 1000,
    navigation: {
        prevEl: ".scrollbar-carousel-demo-btn-prev",
        nextEl: ".scrollbar-carousel-demo-btn-next",
    },
    scrollbar: {
        el: ".swiper-scrollbar",
        draggable: true,
    },
    breakpoints: {
        0: {
            slidesPerView: 1.8,
            spaceBetween: 12,
        },
        768: {
            slidesPerView: 2.8,
            spaceBetween: 16,
        },
        1440: {
            slidesPerView: 3.4,
            spaceBetween: 20,
        },
    },
    modules: [Navigation, Scrollbar],
};
</script>

<template>
    <div class="relative isolate mb-10 md:mx-20">
        <Swiper v-bind="options">
            <SwiperSlide v-for="(url, i) in carouselDemoImages" :key="i">
                <img :src="url" alt="Image" class="rounded-box h-40 w-full object-cover md:h-60" />
            </SwiperSlide>
        </Swiper>
        <div class="absolute -inset-x-16 top-1/2 z-1 flex -translate-y-1/2 justify-between max-md:hidden">
            <button class="scrollbar-carousel-demo-btn-prev btn btn-circle btn-soft" aria-label="Navigation">
                <span class="iconify lucide--chevron-left size-5" />
            </button>
            <button class="scrollbar-carousel-demo-btn-next btn btn-circle btn-soft" aria-label="Navigation">
                <span class="iconify lucide--chevron-right size-5" />
            </button>
        </div>
        <div class="absolute start-0 end-0 -bottom-8">
            <div class="swiper-scrollbar" />
        </div>
    </div>
</template>
