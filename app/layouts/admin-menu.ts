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
        url: "/dashboards",
    },
    {
        id: "orders",
        icon: "lucide--shopping-cart",
        label: "All Orders",
        url: "/orders",
    },
    {
        id: "orders-action-required",
        icon: "lucide--clipboard-list",
        label: "Action Required",
        children: [
            {
                id: "orders-unpaid",
                label: "Unpaid Orders",
                url: "/orders/unpaid",
            },
            {
                id: "orders-ready-to-ship",
                label: "Ready to Ship",
                url: "/orders/ready-to-ship",
            },
        ],
    },
    {
        id: "orders-history",
        icon: "lucide--history",
        label: "Order History",
        children: [
            {
                id: "orders-shipped",
                label: "Shipped Orders",
                url: "/orders/shipped",
            },
            {
                id: "orders-completed",
                label: "Completed Orders",
                url: "/orders/completed",
            },
            {
                id: "orders-cancelled",
                label: "Cancelled Orders",
                url: "/orders/cancelled",
            },
        ],
    },
    {
        id: "catalogs",
        icon: "lucide--package",
        label: "Catalogs",
        children: [
            {
                id: "products",
                label: "Products",
                url: "/catalogs/products",
            },
            {
                id: "brands",
                label: "Brands",
                url: "/catalogs/brands",
            },
            {
                id: "categories",
                label: "Categories",
                url: "/catalogs/categories",
            },
            {
                id: "attributes",
                label: "Attributes",
                url: "/catalogs/attributes",
            },
        ],
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
        url: "/customers",
    },
    // {
    //     id: "marketing-label",
    //     isTitle: true,
    //     label: "Marketing",
    // },
    // {
    //     id: "marketing",
    //     icon: "lucide--megaphone",
    //     label: "Marketing",
    //     children: [
    //         {
    //             id: "marketing-coupons",
    //             label: "Coupons",
    //             url: "/marketing/coupons",
    //         },
    //         // {
    //         //     id: "marketing-flash-sale",
    //         //     label: "Flash Sale",
    //         //     url: "/marketing/flash-sale",
    //         // },
    //     ],
    // },
    {
        id: "appearance-label",
        isTitle: true,
        label: "Appearance",
    },
    {
        id: "appearance",
        icon: "lucide--palette",
        label: "Appearance",
        children: [
            {
                id: "appearance-navigation",
                label: "Navigation",
                url: "/appearance/navigation",
            },
        ],
    },
    {
        id: "access-control",
        icon: "lucide--shield-check",
        label: "Access Control",
        children: [
            {
                id: "users",
                label: "Users",
                url: "/access-control/users",
            },
            {
                id: "roles",
                label: "Roles",
                url: "/access-control/roles",
            },
            {
                id: "permissions",
                label: "Permissions",
                url: "/access-control/permissions",
            },
            {
                id: "modules",
                label: "Modules",
                url: "/access-control/modules",
            },
            {
                id: "user-activity",
                label: "User Activity",
                url: "/access-control/user-activity",
            },
            {
                id: "store-tokens",
                label: "Store Tokens",
                url: "/access-control/store-tokens",
            },
        ],
    },
    {
        id: "setting-label",
        isTitle: true,
        label: "Setting",
    },
    {
        id: "settings",
        icon: "lucide--settings",
        label: "Settings",
        url: "/settings",
    },
    {
        id: "payment",
        icon: "lucide--credit-card",
        label: "Payment",
        children: [
            {
                id: "payment-methods",
                label: "Payment Methods",
                url: "/settings/payment-methods",
            },
            {
                id: "payment-configs",
                label: "Payment Configs",
                url: "/settings/payment-configs",
            },
        ],
    },
    {
        id: "shipping",
        icon: "lucide--truck",
        label: "Shipping",
        children: [
            {
                id: "shipping-methods",
                label: "Shipping Methods",
                url: "/settings/shipping-methods",
            },
            {
                id: "shipping-configs",
                label: "Shipping Configs",
                url: "/settings/shipping-configs",
            },
        ],
    },
];
