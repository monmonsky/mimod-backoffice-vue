<script lang="ts" setup>
import "swiper/css";
import "swiper/css/thumbs";
import { Autoplay, Navigation, Thumbs } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper/types";
import { Swiper, SwiperSlide } from "swiper/vue";
import { ref } from "vue";

import { carouselDemoImages } from "./helpers";

const thumbsSwiper = ref<SwiperClass | null>(null);
</script>

<template>
    <div class="relative isolate md:mx-20">
        <Swiper
            :loop="true"
            :speed="1000"
            :autoplay="{ delay: 5000 }"
            :navigation="{
                prevEl: '.thumbs-carousel-demo-btn-prev',
                nextEl: '.thumbs-carousel-demo-btn-next',
            }"
            :thumbs="{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }"
            :breakpoints="{
                0: { slidesPerView: 1, spaceBetween: 12 },
                768: { slidesPerView: 1.2, spaceBetween: 16 },
                1440: { slidesPerView: 1.4, spaceBetween: 20 },
            }"
            :modules="[Navigation, Autoplay, Thumbs]">
            <SwiperSlide v-for="(url, i) in carouselDemoImages" :key="i">
                <img :src="url" alt="Image" class="rounded-box h-64 w-full object-cover md:h-90" />
            </SwiperSlide>
        </Swiper>

        <div class="mt-4">
            <Swiper
                :watch-slides-progress="true"
                :modules="[Thumbs]"
                :breakpoints="{
                    0: { slidesPerView: 6, spaceBetween: 4 },
                    768: { slidesPerView: 8, spaceBetween: 6 },
                    1440: { slidesPerView: 10, spaceBetween: 8 },
                }"
                @swiper="(swiper: SwiperClass) => (thumbsSwiper = swiper)">
                <SwiperSlide v-for="(url, i) in carouselDemoImages" :key="i" class="rounded-box overflow-hidden">
                    <img :src="url" alt="Thumbnail" class="h-10 w-full cursor-pointer object-cover md:h-16" />
                </SwiperSlide>
            </Swiper>
        </div>

        <div class="absolute -inset-x-16 top-1/2 z-1 flex -translate-y-1/2 justify-between max-md:hidden">
            <button class="thumbs-carousel-demo-btn-prev btn btn-circle btn-soft" aria-label="Navigation">
                <span class="iconify lucide--chevron-left size-5" />
            </button>
            <button class="thumbs-carousel-demo-btn-next btn btn-circle btn-soft" aria-label="Navigation">
                <span class="iconify lucide--chevron-right size-5" />
            </button>
        </div>
    </div>
</template>
