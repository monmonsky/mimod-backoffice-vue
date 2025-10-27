# Permission System Documentation

Sistem permission yang granular untuk kontrol akses CRUD operations dan custom actions.

## Architecture

### 1. **Data Flow**

```
Backend API (Login)
    ↓
Auth Store (Save permissions in cookie)
    ↓
usePermissionCheck (Check permissions)
    ↓
Components (Show/Hide UI elements)
```

### 2. **Files Structure**

```
app/
├── stores/
│   └── auth.ts                          # Store user permissions
├── composables/
│   └── usePermissionCheck.ts            # Permission checking logic
└── pages/
    └── (admin)/
        └── catalogs/
            └── products/
                └── ProductsTable.vue    # Example implementation
```

---

## Backend Response Format

### Login Response Structure

```json
{
  "user": {
    "id": 2,
    "name": "Admin User",
    "email": "admin@mimod.com",
    "role": {
      "id": 2,
      "name": "admin",
      "display_name": "Administrator",
      "modules": [...]
    },
    "permissions": [
      {
        "id": 11,
        "name": "products.create",
        "display_name": "Create Products",
        "action": "create",
        "module": "products",
        "is_active": true
      },
      {
        "id": 12,
        "name": "products.update",
        "display_name": "Update Products",
        "action": "update",
        "module": "products",
        "is_active": true
      },
      {
        "id": 13,
        "name": "products.delete",
        "display_name": "Delete Products",
        "action": "delete",
        "module": "products",
        "is_active": false
      }
    ]
  }
}
```

### Permission Object Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Unique permission ID |
| `name` | string | Permission name format: `{module}.{action}` |
| `display_name` | string | Human-readable name |
| `action` | string | Action type (view, create, update, delete, etc) |
| `module` | string | Module name (products, orders, users, etc) |
| `is_active` | boolean | Is permission granted/active? |

---

## Auth Store

### Types

```typescript
export interface Permission {
    id: number;
    name: string;
    display_name: string;
    action: string;
    module: string;
    is_active: boolean;
}
```

### Computed Properties

```typescript
// Get all user permissions
userPermissions: Permission[]

// Get active permission names only
userPermissionNames: string[]  // ["products.view", "products.create", ...]
```

---

## usePermissionCheck Composable

### Core Functions

#### 1. **hasPermission(permissionName)**
Check if user has specific permission.

```typescript
const { hasPermission } = usePermissionCheck();

hasPermission('products.create')  // true/false
hasPermission('users.delete')     // true/false
```

#### 2. **hasAnyPermission(permissionNames)**
Check if user has ANY of the specified permissions.

```typescript
const { hasAnyPermission } = usePermissionCheck();

hasAnyPermission([
    'products.create',
    'products.update'
])  // true if user has at least one
```

#### 3. **hasAllPermissions(permissionNames)**
Check if user has ALL of the specified permissions.

```typescript
const { hasAllPermissions } = usePermissionCheck();

hasAllPermissions([
    'products.view',
    'products.create',
    'products.update'
])  // true only if user has all three
```

### CRUD Shortcuts

#### 4. **canView(moduleName)**
```typescript
canView('products')  // Check products.view
```

#### 5. **canShow(moduleName)**
```typescript
canShow('products')  // Check products.show
```

#### 6. **canCreate(moduleName)**
```typescript
canCreate('products')  // Check products.create
```

#### 7. **canUpdate(moduleName)**
```typescript
canUpdate('products')  // Check products.update
```

#### 8. **canDelete(moduleName)**
```typescript
canDelete('products')  // Check products.delete
```

#### 9. **canDoAction(moduleName, action)**
For custom actions beyond CRUD.

```typescript
canDoAction('products', 'export')       // Check products.export
canDoAction('orders', 'update-status')  // Check orders.update-status
canDoAction('products', 'update-stock') // Check products.update-stock
```

### Helper Functions

#### 10. **getModulePermissions(moduleName)**
Get all permissions for a module.

```typescript
const { getModulePermissions } = usePermissionCheck();

const productPerms = getModulePermissions('products');
// Returns: [
//   { name: 'products.view', action: 'view', ... },
//   { name: 'products.create', action: 'create', ... },
//   ...
// ]
```

#### 11. **getModuleAccess(moduleName)**
Get summary of CRUD permissions for a module.

```typescript
const { getModuleAccess } = usePermissionCheck();

const access = getModuleAccess('products');
// Returns: {
//   canView: true,
//   canShow: true,
//   canCreate: true,
//   canUpdate: true,
//   canDelete: false
// }
```

#### 12. **hasFullAccess(moduleName)**
Check if user has full CRUD access.

```typescript
hasFullAccess('products')
// true if has: view, create, update, delete
```

#### 13. **hasAnyAccess(moduleName)**
Check if user has at least view access.

```typescript
hasAnyAccess('products')
// true if has any of: view, show, create, update, delete
```

---

## Implementation Examples

### Example 1: Hide/Show Buttons

**File**: `ProductsTable.vue`

```vue
<script setup lang="ts">
// Import composable
const { canCreate, canUpdate, canDelete } = usePermissionCheck();
</script>

<template>
  <!-- Create button - only show if user can create -->
  <NuxtLink
    v-if="canCreate('products')"
    to="/catalogs/products/create"
    class="btn btn-primary">
    New Product
  </NuxtLink>

  <!-- Actions in table -->
  <div class="flex gap-2">
    <!-- Edit button -->
    <NuxtLink
      v-if="canUpdate('products')"
      :to="`/products/${product.id}/edit`"
      class="btn btn-ghost btn-xs">
      Edit
    </NuxtLink>

    <!-- Delete button -->
    <button
      v-if="canDelete('products')"
      @click="deleteProduct(product.id)"
      class="btn btn-ghost btn-xs text-error">
      Delete
    </button>
  </div>
</template>
```

### Example 2: Protect Actions

```typescript
const { canUpdate } = usePermissionCheck();
const { error } = useToast();

const handleSubmit = async () => {
    // Check permission before API call
    if (!canUpdate('products')) {
        error('You do not have permission to update products');
        return;
    }

    try {
        await updateProduct(productData);
        success('Product updated successfully');
    } catch (err) {
        error('Failed to update product');
    }
};
```

### Example 3: Conditional Form Fields

```vue
<script setup lang="ts">
const { canUpdate, canDoAction } = usePermissionCheck();
</script>

<template>
  <form>
    <!-- Basic fields - always visible -->
    <input v-model="product.name" />

    <!-- Price field - only editable if has update-price permission -->
    <input
      v-model="product.price"
      :disabled="!canDoAction('products', 'update-price')" />

    <!-- Stock field - only editable if has update-stock permission -->
    <input
      v-model="product.stock"
      :disabled="!canDoAction('products', 'update-stock')" />

    <!-- Submit button -->
    <button
      v-if="canUpdate('products')"
      type="submit">
      Save Changes
    </button>
  </form>
</template>
```

### Example 4: Complex Permission Logic

```vue
<script setup lang="ts">
const { hasAllPermissions, hasAnyPermission } = usePermissionCheck();

// User must have both permissions
const canManageInventory = hasAllPermissions([
    'products.update',
    'products.update-stock'
]);

// User needs at least one
const canAccessReports = hasAnyPermission([
    'reports.view',
    'reports.export',
    'analytics.view'
]);
</script>

<template>
  <div v-if="canManageInventory">
    <!-- Inventory management UI -->
  </div>

  <div v-if="canAccessReports">
    <!-- Reports section -->
  </div>
</template>
```

### Example 5: Get Module Summary

```vue
<script setup lang="ts">
const { getModuleAccess } = usePermissionCheck();

const productAccess = getModuleAccess('products');

// Display permission summary
const accessSummary = computed(() => {
    const actions = [];
    if (productAccess.canView) actions.push('View');
    if (productAccess.canCreate) actions.push('Create');
    if (productAccess.canUpdate) actions.push('Update');
    if (productAccess.canDelete) actions.push('Delete');
    return actions.join(', ');
});
</script>

<template>
  <div class="badge">
    Your access: {{ accessSummary }}
  </div>
</template>
```

---

## Permission Naming Convention

### Standard Format

```
{module}.{action}
```

### Standard Actions

| Action | Description |
|--------|-------------|
| `view` | Can list/view records |
| `show` | Can view detail of single record |
| `create` | Can create new records |
| `update` | Can edit existing records |
| `delete` | Can delete records |

### Custom Actions

| Action | Example | Description |
|--------|---------|-------------|
| `export` | `products.export` | Can export data |
| `import` | `products.import` | Can import data |
| `publish` | `products.publish` | Can publish items |
| `restore` | `products.restore` | Can restore deleted items |
| `approve` | `orders.approve` | Can approve pending items |
| `update-status` | `orders.update-status` | Can change order status |
| `update-price` | `products.update-price` | Can change product price |
| `update-stock` | `products.update-stock` | Can update stock levels |
| `print` | `orders.print` | Can print documents |
| `assign` | `roles.assign` | Can assign roles to users |

---

## Super Admin Bypass

**Super admin** role has access to everything automatically:

```typescript
// All checks return true for super_admin
if (authStore.user?.role?.name === "super_admin") {
    return true;
}
```

---

## Security Best Practices

### 1. **Frontend Permission Check is for UX Only**

```typescript
// ✅ Good: Frontend check for UX (hide button)
<button v-if="canDelete('products')">Delete</button>

// ❌ Bad: Only frontend check without backend validation
const deleteProduct = async (id) => {
    // No permission check here is dangerous!
    await $fetch(`/products/${id}`, { method: 'DELETE' });
};

// ✅ Good: Frontend + Backend validation
const deleteProduct = async (id) => {
    if (!canDelete('products')) {
        error('No permission');
        return;
    }
    // Backend will also validate permission
    await $fetch(`/products/${id}`, { method: 'DELETE' });
};
```

### 2. **Backend Must Always Validate**

User bisa bypass frontend dengan:
- DevTools
- Direct API calls (Postman, curl)
- Browser extensions

**Backend MUST check permissions on every request!**

### 3. **Use Appropriate Actions**

```typescript
// ✅ Good: Specific permission for specific action
canDoAction('orders', 'update-status')  // For status update only

// ❌ Bad: Too broad permission
canUpdate('orders')  // Allows updating everything
```

---

## Testing Permission System

### Test Cases

1. **Super Admin** → Should see all buttons
2. **Admin with full CRUD** → Should see all CRUD buttons
3. **Manager without delete** → Should NOT see delete button
4. **Staff with view only** → Should only see view button
5. **User with custom permission** → Should see custom action buttons

### Testing Steps

1. Login dengan different roles
2. Check console untuk permission logs
3. Verify buttons show/hide correctly
4. Try performing actions
5. Verify backend also validates

---

## Common Modules & Permissions

### Products
- `products.view`
- `products.show`
- `products.create`
- `products.update`
- `products.delete`
- `products.update-price`
- `products.update-stock`
- `products.publish`

### Orders
- `orders.view`
- `orders.show`
- `orders.create`
- `orders.update`
- `orders.delete`
- `orders.update-status`
- `orders.print`

### Customers
- `customers.view`
- `customers.show`
- `customers.create`
- `customers.update`
- `customers.delete`

### Users & Roles
- `users.view`
- `users.create`
- `users.update`
- `users.delete`
- `roles.view`
- `roles.create`
- `roles.update`
- `roles.assign`

### Settings
- `settings.view`
- `settings.update`
- `payment.update`
- `shipping.update`

---

## Troubleshooting

### Permissions Not Working

1. **Check user data in console**:
```javascript
const authStore = useAuthStore();
console.log('User:', authStore.user);
console.log('Permissions:', authStore.userPermissions);
console.log('Permission names:', authStore.userPermissionNames);
```

2. **Check permission name format**:
```javascript
// ✅ Correct
'products.create'

// ❌ Wrong
'product.create'   // Singular
'Products.create'  // Capital
'products_create'  // Underscore
```

3. **Check is_active flag**:
```javascript
// Permission must have is_active: true
{
  "name": "products.delete",
  "is_active": true  // ✅ Active
}
```

4. **Verify backend response**:
- Check Network tab di DevTools
- Verify `/auth/login` response includes `permissions` array
- Verify permissions have correct structure

---

## Future Enhancements

- [ ] `v-permission` directive untuk cleaner template
- [ ] Role-based permission presets
- [ ] Permission groups/categories
- [ ] Permission inheritance
- [ ] Temporary permission grants
- [ ] Permission audit logging
