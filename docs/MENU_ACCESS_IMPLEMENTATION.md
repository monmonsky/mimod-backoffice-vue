# Menu Access Control Implementation

## Overview
Sistem ini memfilter sidebar menu berdasarkan role modules yang dimiliki user yang sedang login.

## Files Modified/Created

### 1. `app/stores/auth.ts` - Updated
**Changes:**
- Added `Module` interface
- Added `Role` interface with `modules` array
- Updated `User` interface to include `role?: Role`

```typescript
interface Module {
    id: number;
    name: string;
    display_name: string;
    route: string | null;
    icon: string | null;
    group_name: string | null;
    is_visible: boolean;
    is_active: boolean;
}

interface Role {
    id: number;
    name: string;
    display_name: string;
    modules?: Module[];
}

interface User {
    // ... existing fields
    role?: Role;
}
```

### 2. `app/composables/useMenuAccess.ts` - Created
**Purpose:** Handle menu filtering logic

**Key Functions:**
- `userModuleRoutes` - Get accessible routes from user's role modules
- `userModuleNames` - Get accessible module names
- `hasRouteAccess(route)` - Check if user can access a route
- `hasModuleAccess(moduleName)` - Check if user can access a module
- `filterMenuByAccess(menuItems)` - Filter menu items by access
- `finalAccessibleMenu` - Get cleaned up accessible menu (removes empty title sections)

**Special Logic:**
- Super admin (`role.name === "super_admin"`) has access to all menu items
- Only shows modules where `is_visible` and `is_active` are `true`
- Filters parent menus if all children are inaccessible
- Removes title sections that have no menu items

### 3. `app/layouts/admin.vue` - Updated
**Changes:**
- Added `useMenuAccess()` composable
- Changed `adminMenuItems` to `finalAccessibleMenu.value`
- Menu now dynamically filtered based on user role

```typescript
// Before
const menuItemsWithBadges = computed(() => {
    return adminMenuItems.map((item) => {
        // ...
    });
});

// After
const { finalAccessibleMenu } = useMenuAccess();

const menuItemsWithBadges = computed(() => {
    return finalAccessibleMenu.value.map((item) => {
        // ...
    });
});
```

## API Requirements

### Login Response
The API must return user data with role and modules:

```json
{
    "status": true,
    "message": "Login successful",
    "data": {
        "token": "...",
        "expires_in": 3600,
        "user": {
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com",
            "role": {
                "id": 2,
                "name": "manager",
                "display_name": "Manager",
                "modules": [
                    {
                        "id": 1,
                        "name": "dashboard",
                        "display_name": "Dashboard",
                        "route": "/dashboards",
                        "icon": "lucide--monitor-dot",
                        "group_name": "overview",
                        "is_visible": true,
                        "is_active": true
                    },
                    {
                        "id": 2,
                        "name": "orders",
                        "display_name": "All Orders",
                        "route": "/orders",
                        "icon": "lucide--shopping-cart",
                        "group_name": "orders",
                        "is_visible": true,
                        "is_active": true
                    }
                ]
            }
        }
    }
}
```

### Module Fields
- `id` - Module ID
- `name` - Module name (must match menu item route or ID)
- `display_name` - Display name
- `route` - Full route path (e.g., `/orders`, `/catalogs/products`)
- `icon` - Icon class (optional)
- `group_name` - Group name (optional)
- `is_visible` - Must be `true` to show in menu
- `is_active` - Must be `true` to be accessible

## How It Works

### 1. User Login
```
User logs in → API returns user with role.modules → Stored in authStore
```

### 2. Menu Rendering
```
Admin layout loads
    ↓
useMenuAccess() composable runs
    ↓
Checks user.role.modules
    ↓
Filters adminMenuItems based on accessible routes
    ↓
Returns finalAccessibleMenu
    ↓
Menu rendered with badges
```

### 3. Access Check Logic

**For Super Admin:**
```typescript
if (user.role.name === "super_admin") {
    return true; // Access to everything
}
```

**For Other Roles:**
```typescript
// Get accessible routes
const routes = user.role.modules
    .filter(m => m.is_visible && m.is_active)
    .map(m => m.route);

// Check if menu item route is in accessible routes
if (routes.includes(menuItem.url)) {
    return true; // Show menu item
}
```

**For Parent Menus with Children:**
```typescript
// Filter children first
const filteredChildren = parent.children.filter(child =>
    hasRouteAccess(child.url)
);

// If no children accessible, hide parent
if (filteredChildren.length === 0) {
    return null; // Hide parent menu
}

// Show parent with filtered children
return { ...parent, children: filteredChildren };
```

## Menu Structure Mapping

### Current Menu Items → Module Routes

| Menu Item | Route | Module Name |
|-----------|-------|-------------|
| Dashboard | `/dashboards` | `dashboard` |
| All Orders | `/orders` | `orders` |
| Unpaid Orders | `/orders/unpaid` | `orders-unpaid` |
| Ready to Ship | `/orders/ready-to-ship` | `orders-ready-to-ship` |
| Shipped Orders | `/orders/shipped` | `orders-shipped` |
| Completed Orders | `/orders/completed` | `orders-completed` |
| Cancelled Orders | `/orders/cancelled` | `orders-cancelled` |
| Products | `/catalogs/products` | `products` |
| Brands | `/catalogs/brands` | `brands` |
| Categories | `/catalogs/categories` | `categories` |
| Attributes | `/catalogs/attributes` | `attributes` |
| Customers | `/customers` | `customers` |
| Navigation | `/appearance/navigation` | `appearance-navigation` |
| Users | `/access-control/users` | `users` |
| Roles | `/access-control/roles` | `roles` |
| Permissions | `/access-control/permissions` | `permissions` |
| Modules | `/access-control/modules` | `modules` |
| User Activity | `/access-control/user-activity` | `user-activity` |
| Store Tokens | `/access-control/store-tokens` | `store-tokens` |
| Settings | `/settings` | `settings` |
| Payment Methods | `/settings/payment-methods` | `payment-methods` |
| Payment Configs | `/settings/payment-configs` | `payment-configs` |
| Shipping Methods | `/settings/shipping-methods` | `shipping-methods` |
| Shipping Configs | `/settings/shipping-configs` | `shipping-configs` |

## Example Scenarios

### Scenario 1: Manager Role
**Accessible Modules:**
- dashboard
- orders (all children)
- products
- customers

**Result:**
- ✅ Dashboard
- ✅ All Orders section (with all children)
- ✅ Catalogs > Products only
- ✅ Customers
- ❌ Access Control (hidden)
- ❌ Settings (hidden)

### Scenario 2: Customer Service Role
**Accessible Modules:**
- dashboard
- orders-unpaid
- orders-ready-to-ship
- customers

**Result:**
- ✅ Dashboard
- ✅ Action Required (only Unpaid & Ready to Ship children)
- ✅ Customers
- ❌ All Orders (hidden - no access)
- ❌ Catalogs (hidden)
- ❌ Shipped/Completed Orders (hidden)

### Scenario 3: Super Admin
**Result:**
- ✅ All menu items visible (no filtering)

## Testing

### 1. Test Super Admin
```
Login as super_admin → Should see all menu items
```

### 2. Test Limited Role
```
Login as manager → Should only see assigned modules
```

### 3. Test Empty Access
```
Login with role that has no modules → Should see empty sidebar
```

### 4. Test Partial Parent Menu
```
Login with access to some children → Parent shows with filtered children
Login with access to no children → Parent hidden entirely
```

## Troubleshooting

### Menu items not showing
1. Check `user.role.modules` in browser console:
   ```javascript
   console.log(authStore.user.role.modules)
   ```

2. Verify module `route` matches menu item `url`:
   ```javascript
   // Module route must exactly match
   module.route === menuItem.url
   ```

3. Check `is_visible` and `is_active`:
   ```javascript
   module.is_visible === true && module.is_active === true
   ```

### All menus showing for non-super-admin
1. Check role name:
   ```javascript
   console.log(authStore.user.role.name)
   // Should NOT be "super_admin"
   ```

2. Check if `finalAccessibleMenu` is being used:
   ```vue
   <!-- In admin.vue -->
   <Sidebar :menu-items="menuItemsWithBadges" />
   ```

### Parent menu showing but empty
- Check if `cleanupEmptyTitles()` is working
- Title sections should be removed if no items follow

## Future Enhancements

1. **Permission-based Access**
   - Currently based on modules only
   - Can extend to check specific permissions within modules

2. **Dynamic Menu from API**
   - Load menu structure from API instead of static file
   - More flexible for multi-tenant systems

3. **Page-level Access Control**
   - Add middleware to protect routes
   - Redirect if user tries to access unauthorized page

4. **Cache User Modules**
   - Cache module access in localStorage
   - Reduce API calls on page refresh
