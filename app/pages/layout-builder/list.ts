import { defineAsyncComponent } from "vue";

export const sidebars = [
    {
        title: "Ecommerce",
        comp: defineAsyncComponent(() => import("@/pages/components/layouts/sidebar/EcommerceSidebarDemo.vue")),
    },
    {
        title: "Payment",
        comp: defineAsyncComponent(() => import("@/pages/components/layouts/sidebar/PaymentSidebarDemo.vue")),
    },
    {
        title: "Project",
        comp: defineAsyncComponent(() => import("@/pages/components/layouts/sidebar/ProjectSidebarDemo.vue")),
    },
    {
        title: "Chat",
        comp: defineAsyncComponent(() => import("@/pages/components/layouts/sidebar/ChatSidebarDemo.vue")),
    },
    {
        title: "Documentation",
        comp: defineAsyncComponent(() => import("@/pages/components/layouts/sidebar/DocumentationSidebarDemo.vue")),
    },
    {
        title: "Huge Icons",
        comp: defineAsyncComponent(() => import("@/pages/components/layouts/sidebar/HugeIconsSidebarDemo.vue")),
    },
    {
        title: "Remix Icons",
        comp: defineAsyncComponent(() => import("@/pages/components/layouts/sidebar/RemixIconsSidebarDemo.vue")),
    },
    {
        title: "Custom Background",
        comp: defineAsyncComponent(() => import("@/pages/components/layouts/sidebar/CustomBackgroundSidebarDemo.vue")),
    },
];

export const topbars = [
    {
        title: "Classic",
        comp: defineAsyncComponent(() => import("@/pages/components/layouts/topbar/ClassicTopbarDemo.vue")),
    },
    {
        title: "Greeting",
        comp: defineAsyncComponent(() => import("@/pages/components/layouts/topbar/GreetingTopbarDemo.vue")),
    },
    {
        title: "Editor",
        comp: defineAsyncComponent(() => import("@/pages/components/layouts/topbar/EditorTopbarDemo.vue")),
    },
    {
        title: "Nav Menu 1",
        comp: defineAsyncComponent(() => import("@/pages/components/layouts/topbar/NavMenu1TopbarDemo.vue")),
    },
    {
        title: "Nav Menu 2",
        comp: defineAsyncComponent(() => import("@/pages/components/layouts/topbar/NavMenu2TopbarDemo.vue")),
    },
    {
        title: "Custom Background",
        comp: defineAsyncComponent(() => import("@/pages/components/layouts/topbar/CustomBackgroundTopbarDemo.vue")),
    },
];

export const footers = [
    {
        title: "Minimal",
        comp: defineAsyncComponent(() => import("@/pages/components/layouts/footer/MinimalFooterDemo.vue")),
    },
    {
        title: "Social",
        comp: defineAsyncComponent(() => import("@/pages/components/layouts/footer/SocialFooterDemo.vue")),
    },
    {
        title: "Branding",
        comp: defineAsyncComponent(() => import("@/pages/components/layouts/footer/BrandingFooterDemo.vue")),
    },
    {
        title: "Legal",
        comp: defineAsyncComponent(() => import("@/pages/components/layouts/footer/LegalFooterDemo.vue")),
    },
    {
        title: "Status",
        comp: defineAsyncComponent(() => import("@/pages/components/layouts/footer/StatusFooterDemo.vue")),
    },
    {
        title: "Support",
        comp: defineAsyncComponent(() => import("@/pages/components/layouts/footer/SupportFooterDemo.vue")),
    },
    {
        title: "Options 1",
        comp: defineAsyncComponent(() => import("@/pages/components/layouts/footer/Options1FooterDemo.vue")),
    },
    {
        title: "Options 2",
        comp: defineAsyncComponent(() => import("@/pages/components/layouts/footer/Options2FooterDemo.vue")),
    },
    {
        title: "Custom Background",
        comp: defineAsyncComponent(() => import("@/pages/components/layouts/footer/CustomBackgroundFooterDemo.vue")),
    },
];
