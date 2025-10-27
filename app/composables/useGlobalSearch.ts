import type { Order } from "~/types/orders";
import type { Product } from "~/types/catalogs/products";
import type { Customer } from "~/types/customers";

export interface SearchResults {
    orders: Order[];
    products: Product[];
    customers: Customer[];
    loading: boolean;
}

export const useGlobalSearch = () => {
    const config = useRuntimeConfig();
    const authStore = useAuthStore();

    const searchQuery = ref("");
    const results = ref<SearchResults>({
        orders: [],
        products: [],
        customers: [],
        loading: false,
    });

    let debounceTimeout: NodeJS.Timeout | null = null;

    const performSearch = async (query: string) => {
        if (!query || query.length < 2) {
            results.value = {
                orders: [],
                products: [],
                customers: [],
                loading: false,
            };
            return;
        }

        results.value.loading = true;

        try {
            // Parallel API calls for better performance
            const [ordersRes, productsRes, customersRes] = await Promise.all([
                // Search orders
                $fetch("/orders", {
                    baseURL: config.public.apiBase,
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                    },
                    params: {
                        search: query,
                        per_page: 5, // Limit to 5 results per category
                    },
                }).catch(() => ({ data: { orders: { data: [] } } })),

                // Search products
                $fetch("/catalog/products", {
                    baseURL: config.public.apiBase,
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                    },
                    params: {
                        search: query,
                        per_page: 5,
                    },
                }).catch(() => ({ data: { products: [] } })),

                // Search customers
                $fetch("/customers", {
                    baseURL: config.public.apiBase,
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                    },
                    params: {
                        search: query,
                        per_page: 5,
                    },
                }).catch(() => ({ data: { customers: [] } })),
            ]);

            results.value = {
                orders: ordersRes.data?.orders?.data || [],
                products: productsRes.data?.products?.data || [],
                customers: customersRes.data?.customers?.data || [],
                loading: false,
            };
        } catch (error) {
            console.error("Global search error:", error);
            results.value.loading = false;
        }
    };

    const search = (query: string) => {
        searchQuery.value = query;

        // Clear previous timeout
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        // Set new timeout for debouncing
        debounceTimeout = setTimeout(() => {
            performSearch(query);
        }, 300); // 300ms debounce
    };

    const clearSearch = () => {
        searchQuery.value = "";
        results.value = {
            orders: [],
            products: [],
            customers: [],
            loading: false,
        };
    };

    const totalResults = computed(() => {
        return (
            results.value.orders.length +
            results.value.products.length +
            results.value.customers.length
        );
    });

    const hasResults = computed(() => totalResults.value > 0);

    return {
        searchQuery,
        results,
        search,
        clearSearch,
        totalResults,
        hasResults,
    };
};
