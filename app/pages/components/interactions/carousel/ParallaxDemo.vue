<script lang="ts" setup>
import "swiper/css";
import "swiper/css/parallax";
import { Navigation, Parallax } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/vue";

import { carouselDemoImages } from "./helpers";

const options = {
    slidesPerView: 1.4,
    centeredSlides: true,
    loop: true,
    speed: 1000,
    spaceBetween: 20,
    navigation: {
        prevEl: ".parallax-carousel-demo-btn-prev",
        nextEl: ".parallax-carousel-demo-btn-next",
    },
    parallax: {},
    modules: [Navigation, Parallax],
};
</script>

<template>
    <div class="relative isolate md:mx-20">
        <Swiper v-bind="options">
            <SwiperSlide v-for="(url, i) in carouselDemoImages" :key="i">
                <div class="relative h-60 md:h-88">
                    <img :src="url" alt="Image" class="rounded-box absolute -z-1 h-60 w-full object-cover md:h-88" />
                    <div class="rounded-box absolute inset-x-0 bottom-0 h-36 bg-linear-to-t from-black to-transparent">
                        <div class="rounded-box px-4 pt-12 text-white md:px-6 md:pt-14">
                            <p class="font-medium md:text-lg" data-swiper-parallax="-300">Image #{{ i + 1 }}</p>
                            <p
                                class="mt-1 line-clamp-3 text-xs leading-tight opacity-80 md:text-sm"
                                data-swiper-parallax="-400">
                                Crisp nature images with forests, mountains, and calm landscapes—perfect for adding a
                                natural, peaceful touch to websites or design previews.
                            </p>
                        </div>
                    </div>
                </div>
            </SwiperSlide>
        </Swiper>
        <div class="absolute -inset-x-16 top-1/2 z-1 flex -translate-y-1/2 justify-between max-md:hidden">
            <button class="parallax-carousel-demo-btn-prev btn btn-circle btn-soft" aria-label="Navigation">
                <span class="iconify lucide--chevron-left size-5" />
            </button>
            <button class="parallax-carousel-demo-btn-next btn btn-circle btn-soft" aria-label="Navigation">
                <span class="iconify lucide--chevron-right size-5" />
            </button>
        </div>
        <div class="absolute start-0 end-0 -bottom-8">
            <div class="swiper-scrollbar" />
        </div>
    </div>
</template>
