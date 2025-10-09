import type { ISidebarMenuItem } from "~/components/admin-layout/SidebarMenuItem.vue";

export const adminMenuItems: ISidebarMenuItem[] = [
    {
        id: "overview-label",
        isTitle: true,
        label: "Overview",
    },
    {
        id: "dashboard",
        icon: "lucide--monitor-dot",
        label: "Dashboard",
        url: "/dashboards/ecommerce",
    },
    {
        id: "orders-label",
        isTitle: true,
        label: "Orders",
    },
    {
        id: "orders",
        icon: "lucide--shopping-cart",
        label: "Orders",
        url: "/apps/ecommerce/orders",
    },
    {
        id: "catalogs-label",
        isTitle: true,
        label: "Catalogs",
    },
    {
        id: "products",
        icon: "lucide--package",
        label: "Products",
        url: "/apps/ecommerce/products",
    },
    {
        id: "brands",
        icon: "lucide--tag",
        label: "Brands",
        url: "/catalogs/brands",
    },
    {
        id: "customers-label",
        isTitle: true,
        label: "Customers",
    },
    {
        id: "customers",
        icon: "lucide--users",
        label: "Customers",
        url: "/apps/ecommerce/customers",
    },
    {
        id: "marketing-label",
        isTitle: true,
        label: "Marketing",
    },
    {
        id: "marketing",
        icon: "lucide--megaphone",
        label: "Marketing",
        children: [
            {
                id: "marketing-coupons",
                label: "Coupons",
                url: "/marketing/coupons",
            },
            {
                id: "marketing-flash-sale",
                label: "Flash Sale",
                url: "/marketing/flash-sale",
            },
        ],
    },
    {
        id: "access-control-label",
        isTitle: true,
        label: "Access Control",
    },
    {
        id: "users",
        icon: "lucide--user",
        label: "Users",
        url: "/access-control/users",
    },
    {
        id: "roles",
        icon: "lucide--shield",
        label: "Roles",
        url: "/access-control/roles",
    },
    {
        id: "permissions",
        icon: "lucide--lock",
        label: "Permissions",
        url: "/access-control/permissions",
    },
    {
        id: "module",
        icon: "lucide--box",
        label: "Module",
        url: "/access-control/module",
    },
    {
        id: "user-log",
        icon: "lucide--file-text",
        label: "User Log",
        url: "/access-control/user-log",
    },
    {
        id: "setting-label",
        isTitle: true,
        label: "Setting",
    },
    {
        id: "general",
        icon: "lucide--settings",
        label: "General",
        url: "/settings/general",
    },
    {
        id: "old-label",
        isTitle: true,
        label: "Old",
    },
    {
        id: "dashboards-old",
        icon: "lucide--monitor-dot",
        label: "Dashboard",
        children: [
            {
                id: "dashboards-ecommerce",
                label: "Ecommerce",
                url: "/dashboards/ecommerce",
            },
            {
                id: "dashboards-crm",
                label: "CRM",
                url: "/dashboards/crm",
            },
            {
                id: "dashboards-gen-ai",
                label: "Gen AI",
                url: "/dashboards/gen-ai",
            },
        ],
    },
    {
        id: "agentic-hub",
        icon: "lucide--bot-message-square",
        label: "Agentic Hub",
        children: [
            {
                id: "agentic-hub-storage",
                label: "Storage",
                url: "/agentic/storage",
                badges: ["new"],
            },
        ],
    },
    {
        id: "apps-ecommerce",
        icon: "lucide--store",
        label: "Ecommerce",
        children: [
            {
                id: "apps-ecommerce-orders",
                label: "Orders",
                url: "/apps/ecommerce/orders",
            },
            {
                id: "apps-ecommerce-products",
                label: "Products",
                url: "/apps/ecommerce/products",
            },
            {
                id: "apps-ecommerce-sellers",
                label: "Sellers",
                url: "/apps/ecommerce/sellers",
            },
            {
                id: "apps-ecommerce-customers",
                label: "Customers",
                url: "/apps/ecommerce/customers",
            },
            {
                id: "apps-ecommerce-shops",
                label: "Shops",
                url: "/apps/ecommerce/shops",
            },
        ],
    },
    {
        id: "apps-ai",
        icon: "lucide--brain-circuit",
        label: "Gen AI",
        children: [
            {
                id: "apps-ai-home",
                label: "Home",
                url: "/apps/gen-ai/home",
            },
            {
                id: "apps-ai-content",
                label: "Content",
                url: "/apps/gen-ai/content",
            },
            {
                id: "apps-ai-image",
                label: "Image",
                url: "/apps/gen-ai/image",
            },
            {
                id: "apps-ai-library",
                label: "Library",
                url: "/apps/gen-ai/library",
            },
        ],
    },
    {
        id: "apps-file-manager",
        icon: "lucide--server",
        label: "File Manager",
        url: "/apps/file-manager",
    },
    {
        id: "apps-chat",
        icon: "lucide--messages-square",
        label: "Chat",
        url: "/apps/chat",
    },
    {
        id: "auth",
        icon: "lucide--shield-check",
        label: "Auth",
        children: [
            {
                id: "auth-login",
                label: "Login",
                url: "/auth/login",
            },
            {
                id: "auth-register",
                label: "Register",
                url: "/auth/register",
            },
            {
                id: "auth-forgot-password",
                label: "Forgot Password",
                url: "/auth/forgot-password",
            },
            {
                id: "auth-reset-password",
                label: "Reset Password",
                url: "/auth/reset-password",
            },
        ],
    },
    {
        id: "pages",
        icon: "lucide--files",
        label: "Pages",
        children: [
            {
                id: "pages-settings",
                label: "Settings",
                url: "/pages/settings",
            },
            {
                id: "pages-get-help",
                label: "Get Help",
                url: "/pages/get-help",
            },
        ],
    },
    {
        id: "landing",
        icon: "lucide--file",
        label: "Landing",
        url: "/landing",
        linkProp: {
            target: "_blank",
        },
    },
    {
        id: "layout-builder",
        icon: "lucide--blocks",
        label: "Layout Builder",
        url: "/layout-builder",
        badges: ["new"],
        linkProp: {
            target: "_blank",
        },
    },
];
