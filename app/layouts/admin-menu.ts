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
        url: "/catalogs/products",
    },
    {
        id: "brands",
        icon: "lucide--tag",
        label: "Brands",
        url: "/catalogs/brands",
    },
    {
        id: "categories",
        icon: "lucide--folder-tree",
        label: "Categories",
        url: "/catalogs/categories",
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
        id: "modules",
        icon: "lucide--box",
        label: "Modules",
        url: "/access-control/modules",
    },
    {
        id: "user-activity",
        icon: "lucide--file-text",
        label: "User activity",
        url: "/access-control/user-activity",
    },
    {
        id: "store-tokens",
        icon: "lucide--key",
        label: "Store Tokens",
        url: "/access-control/store-tokens",
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
        id: "payments",
        icon: "lucide--credit-card",
        label: "Payments",
        url: "/settings/payments",
    },
    {
        id: "shippings",
        icon: "lucide--truck",
        label: "Shippings",
        url: "/settings/shippings",
    },
];
