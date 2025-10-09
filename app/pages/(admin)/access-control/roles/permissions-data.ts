export interface IPermission {
    name: string;
    value: string;
}

export interface IMenu {
    name: string;
    permissions: IPermission[];
}

export interface IComponent {
    name: string;
    menus: IMenu[];
}

export const componentsPermissions: IComponent[] = [
    {
        name: "Access Control",
        menus: [
            {
                name: "Roles",
                permissions: [
                    { name: "Create", value: "roles.create" },
                    { name: "Read", value: "roles.read" },
                    { name: "Update", value: "roles.update" },
                    { name: "Delete", value: "roles.delete" },
                ],
            },
            {
                name: "Users",
                permissions: [
                    { name: "Create", value: "users.create" },
                    { name: "Read", value: "users.read" },
                    { name: "Update", value: "users.update" },
                    { name: "Delete", value: "users.delete" },
                ],
            },
            {
                name: "Permissions",
                permissions: [
                    { name: "Create", value: "permissions.create" },
                    { name: "Read", value: "permissions.read" },
                    { name: "Update", value: "permissions.update" },
                    { name: "Delete", value: "permissions.delete" },
                ],
            },
        ],
    },
    {
        name: "Catalogs",
        menus: [
            {
                name: "Products",
                permissions: [
                    { name: "Create", value: "products.create" },
                    { name: "Read", value: "products.read" },
                    { name: "Update", value: "products.update" },
                    { name: "Delete", value: "products.delete" },
                ],
            },
            {
                name: "Brands",
                permissions: [
                    { name: "Create", value: "brands.create" },
                    { name: "Read", value: "brands.read" },
                    { name: "Update", value: "brands.update" },
                    { name: "Delete", value: "brands.delete" },
                ],
            },
        ],
    },
    {
        name: "Orders",
        menus: [
            {
                name: "Orders",
                permissions: [
                    { name: "Create", value: "orders.create" },
                    { name: "Read", value: "orders.read" },
                    { name: "Update", value: "orders.update" },
                    { name: "Delete", value: "orders.delete" },
                    { name: "Approve", value: "orders.approve" },
                ],
            },
        ],
    },
    {
        name: "Customers",
        menus: [
            {
                name: "Customers",
                permissions: [
                    { name: "Create", value: "customers.create" },
                    { name: "Read", value: "customers.read" },
                    { name: "Update", value: "customers.update" },
                    { name: "Delete", value: "customers.delete" },
                ],
            },
        ],
    },
    {
        name: "Marketing",
        menus: [
            {
                name: "Coupons",
                permissions: [
                    { name: "Create", value: "coupons.create" },
                    { name: "Read", value: "coupons.read" },
                    { name: "Update", value: "coupons.update" },
                    { name: "Delete", value: "coupons.delete" },
                ],
            },
            {
                name: "Flash Sale",
                permissions: [
                    { name: "Create", value: "flash-sale.create" },
                    { name: "Read", value: "flash-sale.read" },
                    { name: "Update", value: "flash-sale.update" },
                    { name: "Delete", value: "flash-sale.delete" },
                ],
            },
        ],
    },
];

// Sample role permissions (for demonstration)
export const rolePermissions: Record<number, string[]> = {
    1: [
        // Super Admin - all permissions
        "roles.create",
        "roles.read",
        "roles.update",
        "roles.delete",
        "users.create",
        "users.read",
        "users.update",
        "users.delete",
        "permissions.create",
        "permissions.read",
        "permissions.update",
        "permissions.delete",
        "products.create",
        "products.read",
        "products.update",
        "products.delete",
        "brands.create",
        "brands.read",
        "brands.update",
        "brands.delete",
        "orders.create",
        "orders.read",
        "orders.update",
        "orders.delete",
        "orders.approve",
        "customers.create",
        "customers.read",
        "customers.update",
        "customers.delete",
        "coupons.create",
        "coupons.read",
        "coupons.update",
        "coupons.delete",
        "flash-sale.create",
        "flash-sale.read",
        "flash-sale.update",
        "flash-sale.delete",
    ],
    2: [
        // Admin - most permissions
        "users.read",
        "users.update",
        "products.create",
        "products.read",
        "products.update",
        "products.delete",
        "brands.create",
        "brands.read",
        "brands.update",
        "brands.delete",
        "orders.read",
        "orders.update",
        "orders.approve",
        "customers.read",
        "customers.update",
    ],
    3: [
        // Manager
        "products.read",
        "products.update",
        "orders.read",
        "orders.update",
        "customers.read",
    ],
    4: [
        // Staff
        "products.read",
        "orders.read",
        "customers.read",
    ],
};
