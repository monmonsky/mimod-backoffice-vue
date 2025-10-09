<script lang="ts" setup>
import Swiper from "swiper";
import "swiper/css";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

const testimonials = [
    {
        id: "landing-testimonial-1",
        image: "/images/landing/testimonial-avatar-1.jpg",
        name: "Pouya Saadeghi",
        role: "Creator of daisyUI",
        comment:
            "This is the ultimate admin dashboard template, with all the essential blocks and features you need. Save you months of development time and helps you launch your app faster",
    },
    {
        id: "landing-testimonial-2",
        image: "/images/landing/testimonial-avatar-2.jpg",
        name: "Alexandre Cohen",
        role: "Co-owner / CTO of Disphere",
        comment:
            "Exceptional dashboard with a sleek design and seamless integration of DaisyUI components. Perfect for my existing project !",
    },
] as const;

const swiperOptions = {
    slidesPerView: 1,
    cardsEffect: {
        rotate: false,
        perSlideOffset: 10,
        slideShadows: false,
    },
    loop: true,
    speed: 1500,
    autoplay: {
        delay: 5000,
    },
    spaceBetween: 20,
    navigation: {
        prevEl: ".testimonial-swiper-button-prev",
        nextEl: ".testimonial-swiper-button-next",
    },
    modules: [Navigation, Pagination, Autoplay],
};

onMounted(() => {
    new Swiper("#testimonial-swiper", swiperOptions);
});
</script>

<template>
    <section id="testimonial" class="relative container py-8 md:py-12 xl:py-16 2xl:py-24">
        <div
            class="absolute inset-0 bg-[url('/images/landing/testimonial-background.svg')] bg-cover bg-center bg-no-repeat opacity-8 dark:opacity-6" />

        <div class="relative">
            <div class="text-center">
                <div class="rounded-box inline-flex items-center border border-orange-500/10 bg-orange-500/5 p-2">
                    <span class="iconify lucide--sparkles size-5 text-orange-600" />
                </div>
                <h2 class="mt-4 text-2xl font-semibold sm:text-3xl">Voices That Matter</h2>
                <p class="text-base-content/70 mt-3 inline-block max-w-lg max-sm:text-sm">
                    Hear directly from users who’ve successfully transformed their workflow with our dashboard solution.
                </p>
            </div>

            <div class="relative mt-24 w-full">
                <div id="testimonial-swiper" class="swiper">
                    <div class="swiper-wrapper">
                        <div
                            v-for="(testimonial, index) in testimonials"
                            :key="index"
                            class="swiper-slide flex flex-col items-center justify-center">
                            <div class="text-center">
                                <div class="avatar">
                                    <div class="mask mask-squircle bg-base-200 w-24">
                                        <img :src="testimonial.image" alt="testimonial" />
                                    </div>
                                </div>
                                <p class="mt-6 text-xl font-medium">{{ testimonial.name }}</p>
                                <p class="text-base-content/80">{{ testimonial.role }}</p>
                                <div class="mt-6 flex items-center justify-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        class="size-6 text-yellow-500"
                                        viewBox="0 0 24 24">
                                        <path
                                            fill="currentColor"
                                            d="m12 17.275l-4.15 2.5q-.275.175-.575.15t-.525-.2t-.35-.437t-.05-.588l1.1-4.725L3.775 10.8q-.25-.225-.312-.513t.037-.562t.3-.45t.55-.225l4.85-.425l1.875-4.45q.125-.3.388-.45t.537-.15t.537.15t.388.45l1.875 4.45l4.85.425q.35.05.55.225t.3.45t.038.563t-.313.512l-3.675 3.175l1.1 4.725q.075.325-.05.588t-.35.437t-.525.2t-.575-.15z" />
                                    </svg>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        class="size-6 text-yellow-500"
                                        viewBox="0 0 24 24">
                                        <path
                                            fill="currentColor"
                                            d="m12 17.275l-4.15 2.5q-.275.175-.575.15t-.525-.2t-.35-.437t-.05-.588l1.1-4.725L3.775 10.8q-.25-.225-.312-.513t.037-.562t.3-.45t.55-.225l4.85-.425l1.875-4.45q.125-.3.388-.45t.537-.15t.537.15t.388.45l1.875 4.45l4.85.425q.35.05.55.225t.3.45t.038.563t-.313.512l-3.675 3.175l1.1 4.725q.075.325-.05.588t-.35.437t-.525.2t-.575-.15z" />
                                    </svg>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        class="size-6 text-yellow-500"
                                        viewBox="0 0 24 24">
                                        <path
                                            fill="currentColor"
                                            d="m12 17.275l-4.15 2.5q-.275.175-.575.15t-.525-.2t-.35-.437t-.05-.588l1.1-4.725L3.775 10.8q-.25-.225-.312-.513t.037-.562t.3-.45t.55-.225l4.85-.425l1.875-4.45q.125-.3.388-.45t.537-.15t.537.15t.388.45l1.875 4.45l4.85.425q.35.05.55.225t.3.45t.038.563t-.313.512l-3.675 3.175l1.1 4.725q.075.325-.05.588t-.35.437t-.525.2t-.575-.15z" />
                                    </svg>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        class="size-6 text-yellow-500"
                                        viewBox="0 0 24 24">
                                        <path
                                            fill="currentColor"
                                            d="m12 17.275l-4.15 2.5q-.275.175-.575.15t-.525-.2t-.35-.437t-.05-.588l1.1-4.725L3.775 10.8q-.25-.225-.312-.513t.037-.562t.3-.45t.55-.225l4.85-.425l1.875-4.45q.125-.3.388-.45t.537-.15t.537.15t.388.45l1.875 4.45l4.85.425q.35.05.55.225t.3.45t.038.563t-.313.512l-3.675 3.175l1.1 4.725q.075.325-.05.588t-.35.437t-.525.2t-.575-.15z" />
                                    </svg>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        class="size-6 text-yellow-500"
                                        viewBox="0 0 24 24">
                                        <path
                                            fill="currentColor"
                                            d="m12 17.275l-4.15 2.5q-.275.175-.575.15t-.525-.2t-.35-.437t-.05-.588l1.1-4.725L3.775 10.8q-.25-.225-.312-.513t.037-.562t.3-.45t.55-.225l4.85-.425l1.875-4.45q.125-.3.388-.45t.537-.15t.537.15t.388.45l1.875 4.45l4.85.425q.35.05.55.225t.3.45t.038.563t-.313.512l-3.675 3.175l1.1 4.725q.075.325-.05.588t-.35.437t-.525.2t-.575-.15z" />
                                    </svg>
                                </div>
                                <p class="mt-6 inline-block max-w-[600px]">{{ testimonial.comment }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="absolute top-1/2 right-5 left-5 z-1 flex -translate-y-1/2 transform justify-between">
                    <button class="btn btn-circle testimonial-swiper-button-prev" aria-label="prev">
                        <span class="iconify lucide--chevron-left size-4" />
                    </button>
                    <button class="btn btn-circle testimonial-swiper-button-next" aria-label="next">
                        <span class="iconify lucide--chevron-right size-4" />
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>
