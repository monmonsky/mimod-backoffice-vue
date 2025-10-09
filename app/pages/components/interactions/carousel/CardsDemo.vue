<script setup lang="ts">
import "swiper/css";
import "swiper/css/effect-cards";
import { Autoplay, EffectCards, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/vue";
import { ref } from "vue";

import { carouselDemoImages } from "./helpers";

const options = ref({
    centeredSlides: true,
    loop: true,
    speed: 1000,
    autoplay: {
        delay: 5000,
    },
    effect: "cards",
    navigation: {
        prevEl: ".cards-carousel-demo-btn-prev",
        nextEl: ".cards-carousel-demo-btn-next",
    },
    breakpoints: {
        0: {
            slidesPerView: 1.8,
        },
        768: {
            slidesPerView: 2.8,
            cardsEffect: {
                perSlideOffset: 4,
                perSlideRotate: 4,
            },
        },
        1440: {
            slidesPerView: 3.4,
            cardsEffect: {
                perSlideOffset: 8,
                perSlideRotate: 4,
            },
        },
    },
    modules: [Navigation, Autoplay, EffectCards],
});
</script>
<template>
    <div class="relative isolate md:mx-20">
        <div class="overflow-hidden">
            <Swiper v-bind="options">
                <SwiperSlide v-for="(url, i) in carouselDemoImages" :key="i">
                    <img :src="url" alt="Image" class="rounded-box h-40 w-full object-cover md:h-60" />
                </SwiperSlide>
            </Swiper>
        </div>
        <div class="absolute -inset-x-16 top-1/2 z-1 flex -translate-y-1/2 justify-between max-md:hidden">
            <button class="cards-carousel-demo-btn-prev btn btn-circle btn-soft" aria-label="Navigation">
                <span class="iconify lucide--chevron-left size-5" />
            </button>
            <button class="cards-carousel-demo-btn-next btn btn-circle btn-soft" aria-label="Navigation">
                <span class="iconify lucide--chevron-right size-5" />
            </button>
        </div>
    </div>
</template>
