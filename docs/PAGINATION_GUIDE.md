# Pagination Guide - Mimod Backoffice

Panduan lengkap penggunaan global pagination helper dengan **default 20 items per page**.

## Global Helper: `usePagination()`

File: [app/composables/usePagination.ts](app/composables/usePagination.ts)

### Default Values
```typescript
DEFAULT_PER_PAGE = 20      // Default items per page
DEFAULT_PAGE = 1           // Default starting page
DEFAULT_SORT_ORDER = 'desc' // Default sort order
```

---

## 📖 Usage Examples

### 1. Basic Usage in Composable

```typescript
// app/composables/useProducts.ts
import type { PaginationParams } from "./usePagination";

export const useProducts = () => {
    const { buildPaginationParams } = usePagination();

    const getProducts = (params?: Partial<PaginationParams>) => {
        // Automatically applies default per_page: 20
        const paginationParams = buildPaginationParams(params);

        return $fetch("/catalog/products", {
            params: paginationParams
        });
    };

    return { getProducts };
};
```

**Call without params:**
```typescript
const products = await getProducts();
// API call: /catalog/products?page=1&per_page=20&order=desc
```

**Call with custom params:**
```typescript
const products = await getProducts({
    page: 2,
    search: 'laptop',
    category_id: 5
});
// API call: /catalog/products?page=2&per_page=20&order=desc&search=laptop&category_id=5
```

---

### 2. Reactive Pagination State in Components

```vue
<script setup lang="ts">
const { createPaginationState } = usePagination();
const { getProducts } = useProducts();

// Create reactive pagination state
const pagination = createPaginationState(); // Default per_page: 20

const products = ref([]);
const loading = ref(false);

const fetchProducts = async () => {
    loading.value = true;
    try {
        const response = await getProducts(pagination.params.value);
        products.value = response.data;
        pagination.updateMeta(response.meta);
    } finally {
        loading.value = false;
    }
};

// Watch for pagination changes
watch(() => pagination.params.value, () => {
    fetchProducts();
}, { deep: true });

// Initial fetch
onMounted(() => {
    fetchProducts();
});
</script>

<template>
    <div>
        <!-- Search -->
        <input
            v-model="pagination.searchQuery.value"
            placeholder="Search..."
        />

        <!-- Data table -->
        <table>
            <tr v-for="product in products" :key="product.id">
                <td>{{ product.name }}</td>
            </tr>
        </table>

        <!-- Pagination controls -->
        <div>
            <button @click="pagination.prevPage()" :disabled="pagination.currentPage.value === 1">
                Previous
            </button>

            <span>Page {{ pagination.currentPage.value }} of {{ pagination.lastPage.value }}</span>

            <button @click="pagination.nextPage()" :disabled="pagination.currentPage.value === pagination.lastPage.value">
                Next
            </button>
        </div>

        <!-- Per page selector -->
        <select v-model="pagination.perPage.value" @change="fetchProducts">
            <option :value="10">10 per page</option>
            <option :value="20">20 per page</option>
            <option :value="50">50 per page</option>
            <option :value="100">100 per page</option>
        </select>
    </div>
</template>
```

---

### 3. Pagination Info Text

```typescript
const { getPaginationInfo } = usePagination();

const meta = {
    current_page: 2,
    per_page: 20,
    total: 156,
    last_page: 8
};

const info = getPaginationInfo(meta);
// Output: "Showing 21 to 40 of 156 items"
```

---

### 4. Page Numbers for UI

```typescript
const { getPageNumbers } = usePagination();

const pages = getPageNumbers(5, 20, 5); // currentPage, lastPage, maxVisible
// Output: [1, '...', 3, 4, 5, 6, 7, '...', 20]
```

**Use in template:**
```vue
<template>
    <div class="pagination">
        <button
            v-for="(page, index) in pageNumbers"
            :key="index"
            @click="page !== '...' && pagination.goToPage(page)"
            :disabled="page === '...'"
            :class="{ active: page === pagination.currentPage.value }"
        >
            {{ page }}
        </button>
    </div>
</template>

<script setup lang="ts">
const { getPageNumbers } = usePagination();
const pagination = createPaginationState();

const pageNumbers = computed(() =>
    getPageNumbers(
        pagination.currentPage.value,
        pagination.lastPage.value
    )
);
</script>
```

---

## 🔧 API Reference

### `buildPaginationParams(params?)`
Build standardized pagination parameters with defaults.

**Parameters:**
- `params` (optional): Partial pagination params

**Returns:** Complete `PaginationParams` with defaults applied

**Example:**
```typescript
buildPaginationParams({ page: 2, search: 'test' })
// Returns: { page: 2, per_page: 20, order: 'desc', search: 'test' }
```

---

### `createPaginationState(initialPerPage?)`
Create reactive pagination state with helpers.

**Parameters:**
- `initialPerPage` (optional): Initial per_page value (default: 20)

**Returns:** Object with reactive state and methods

**State:**
- `currentPage`: Current page number
- `perPage`: Items per page
- `total`: Total items
- `lastPage`: Last page number
- `sortBy`: Sort column
- `sortOrder`: Sort direction ('asc' | 'desc')
- `searchQuery`: Search query string

**Computed:**
- `meta`: Pagination metadata object
- `params`: Complete pagination params for API calls

**Methods:**
- `updateMeta(meta)`: Update pagination from API response
- `goToPage(page)`: Go to specific page
- `nextPage()`: Go to next page
- `prevPage()`: Go to previous page
- `resetPage()`: Reset to page 1
- `setPerPage(value)`: Change items per page
- `setSort(column, order?)`: Set sort column and order
- `toggleSortOrder()`: Toggle between asc/desc
- `setSearch(query)`: Set search query
- `reset()`: Reset all pagination state

---

### `getPaginationInfo(meta)`
Get pagination info text.

**Parameters:**
- `meta`: Pagination metadata

**Returns:** String like "Showing 1 to 20 of 100 items"

---

### `getPageNumbers(currentPage, lastPage, maxVisible?)`
Get array of page numbers for pagination UI.

**Parameters:**
- `currentPage`: Current page number
- `lastPage`: Last page number
- `maxVisible`: Max visible page buttons (default: 5)

**Returns:** Array of page numbers and '...' separators

**Example:**
```typescript
getPageNumbers(10, 50, 5)
// Returns: [1, '...', 8, 9, 10, 11, 12, '...', 50]
```

---

## 📋 Complete Component Example

```vue
<script setup lang="ts">
import type { Product } from '~/types/catalogs/products';

const { createPaginationState, getPaginationInfo, getPageNumbers, perPageOptions } = usePagination();
const { getProducts } = useProducts();

// State
const pagination = createPaginationState(); // Default per_page: 20
const products = ref<Product[]>([]);
const loading = ref(false);

// Fetch function
const fetchProducts = async () => {
    loading.value = true;
    try {
        const response = await getProducts(pagination.params.value);
        products.value = response.data;
        pagination.updateMeta(response.meta);
    } catch (error) {
        console.error('Failed to fetch products', error);
    } finally {
        loading.value = false;
    }
};

// Computed
const paginationInfo = computed(() => getPaginationInfo(pagination.meta.value));
const pageNumbers = computed(() =>
    getPageNumbers(pagination.currentPage.value, pagination.lastPage.value)
);

// Watch for param changes
watch(() => pagination.params.value, fetchProducts, { deep: true });

// Initial load
onMounted(fetchProducts);
</script>

<template>
    <div class="space-y-4">
        <!-- Header -->
        <div class="flex justify-between items-center">
            <h1 class="text-2xl font-bold">Products</h1>

            <!-- Search -->
            <input
                v-model="pagination.searchQuery.value"
                type="search"
                placeholder="Search products..."
                class="input input-bordered"
            />
        </div>

        <!-- Loading -->
        <div v-if="loading" class="loading loading-spinner loading-lg"></div>

        <!-- Table -->
        <div v-else class="overflow-x-auto">
            <table class="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="product in products" :key="product.id">
                        <td>{{ product.id }}</td>
                        <td>{{ product.name }}</td>
                        <td>{{ product.price }}</td>
                        <td>{{ product.status }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination Footer -->
        <div class="flex justify-between items-center">
            <!-- Info -->
            <div class="text-sm text-base-content/60">
                {{ paginationInfo }}
            </div>

            <!-- Page Numbers -->
            <div class="join">
                <button
                    class="join-item btn btn-sm"
                    @click="pagination.prevPage()"
                    :disabled="pagination.currentPage.value === 1"
                >
                    «
                </button>

                <button
                    v-for="(page, index) in pageNumbers"
                    :key="index"
                    class="join-item btn btn-sm"
                    :class="{ 'btn-active': page === pagination.currentPage.value }"
                    @click="page !== '...' && pagination.goToPage(page as number)"
                    :disabled="page === '...'"
                >
                    {{ page }}
                </button>

                <button
                    class="join-item btn btn-sm"
                    @click="pagination.nextPage()"
                    :disabled="pagination.currentPage.value === pagination.lastPage.value"
                >
                    »
                </button>
            </div>

            <!-- Per Page Selector -->
            <select
                v-model="pagination.perPage.value"
                class="select select-sm select-bordered"
            >
                <option v-for="option in perPageOptions" :key="option" :value="option">
                    {{ option }} / page
                </option>
            </select>
        </div>
    </div>
</template>
```

---

## 🎯 Migration Guide

### Before (Manual Pagination)
```typescript
const page = ref(1);
const perPage = ref(10); // ❌ Inconsistent value
const search = ref('');

const params = computed(() => ({
    page: page.value,
    per_page: perPage.value,
    search: search.value
}));
```

### After (Using Helper)
```typescript
const pagination = createPaginationState(); // ✅ Default per_page: 20

// All params automatically handled
const params = pagination.params;
```

---

## ✅ Checklist: Update All Composables

Apply `usePagination()` to these composables:

- [x] `useProducts.ts`
- [ ] `useCategories.ts`
- [ ] `useBrands.ts`
- [ ] `useAttributes.ts`
- [ ] `useOrders.ts`
- [ ] `useCustomers.ts`
- [ ] `useCoupons.ts`
- [ ] `useUsers.ts`
- [ ] `useMenus.ts`
- [ ] `useStoreTokens.ts`

---

## 🔍 TypeScript Types

```typescript
interface PaginationParams {
    page?: number;
    per_page?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    search?: string;
    [key: string]: any; // Custom filters
}

interface PaginationMeta {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from?: number;
    to?: number;
}

interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
}
```

---

## 📚 Best Practices

1. **Always use default per_page: 20**
   ```typescript
   // ✅ Good - Uses default 20
   const products = await getProducts();

   // ❌ Bad - Hardcoded different value
   const products = await getProducts({ per_page: 10 });
   ```

2. **Use reactive state in components**
   ```typescript
   // ✅ Good - Reactive pagination state
   const pagination = createPaginationState();

   // ❌ Bad - Manual reactive refs
   const page = ref(1);
   const perPage = ref(20);
   ```

3. **Reset page when filtering/searching**
   ```typescript
   // ✅ Good - Automatically handled by helper
   pagination.setSearch('query'); // Resets to page 1

   // ❌ Bad - Manual reset
   searchQuery.value = 'query';
   page.value = 1; // Easy to forget!
   ```

4. **Consistent per_page options**
   ```typescript
   // ✅ Good - Use perPageOptions from helper
   const { perPageOptions } = usePagination(); // [10, 20, 50, 100]

   // ❌ Bad - Custom inconsistent options
   const options = [5, 15, 25]; // Different everywhere
   ```

---

**Created:** 2025-10-25
**Author:** Development Team
**Project:** Mimod Backoffice Vue
