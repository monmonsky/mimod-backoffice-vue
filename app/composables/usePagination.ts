/**
 * Global Pagination Helper
 *
 * Provides standardized pagination functionality across the application
 * Default per_page: 20 items
 */

export interface PaginationParams {
    page?: number;
    per_page?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    search?: string;
    [key: string]: any; // Allow additional custom filters
}

export interface PaginationMeta {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from?: number;
    to?: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
}

export const DEFAULT_PER_PAGE = 20;
export const DEFAULT_PAGE = 1;
export const DEFAULT_SORT_ORDER: 'asc' | 'desc' = 'desc';

export const usePagination = () => {
    /**
     * Build pagination query parameters with defaults
     * @param params - Optional pagination parameters
     * @returns Standardized pagination parameters
     */
    const buildPaginationParams = (params?: Partial<PaginationParams>): PaginationParams => {
        return {
            page: params?.page || DEFAULT_PAGE,
            per_page: params?.per_page || DEFAULT_PER_PAGE,
            sort: params?.sort,
            order: params?.order || DEFAULT_SORT_ORDER,
            search: params?.search,
            ...params, // Spread any additional custom filters
        };
    };

    /**
     * Create reactive pagination state
     * @param initialPerPage - Initial items per page (default: 20)
     * @returns Reactive pagination state and helpers
     */
    const createPaginationState = (initialPerPage: number = DEFAULT_PER_PAGE) => {
        const currentPage = ref(DEFAULT_PAGE);
        const perPage = ref(initialPerPage);
        const total = ref(0);
        const lastPage = ref(1);
        const sortBy = ref<string | undefined>(undefined);
        const sortOrder = ref<'asc' | 'desc'>(DEFAULT_SORT_ORDER);
        const searchQuery = ref('');

        const meta = computed<PaginationMeta>(() => ({
            current_page: currentPage.value,
            per_page: perPage.value,
            total: total.value,
            last_page: lastPage.value,
        }));

        const params = computed<PaginationParams>(() => ({
            page: currentPage.value,
            per_page: perPage.value,
            sort: sortBy.value,
            order: sortOrder.value,
            search: searchQuery.value || undefined,
        }));

        const updateMeta = (newMeta: PaginationMeta) => {
            currentPage.value = newMeta.current_page;
            perPage.value = newMeta.per_page;
            total.value = newMeta.total;
            lastPage.value = newMeta.last_page;
        };

        const goToPage = (page: number) => {
            if (page >= 1 && page <= lastPage.value) {
                currentPage.value = page;
            }
        };

        const nextPage = () => {
            if (currentPage.value < lastPage.value) {
                currentPage.value++;
            }
        };

        const prevPage = () => {
            if (currentPage.value > 1) {
                currentPage.value--;
            }
        };

        const resetPage = () => {
            currentPage.value = DEFAULT_PAGE;
        };

        const setPerPage = (value: number) => {
            perPage.value = value;
            resetPage(); // Reset to first page when changing per_page
        };

        const setSort = (column: string, order?: 'asc' | 'desc') => {
            sortBy.value = column;
            sortOrder.value = order || DEFAULT_SORT_ORDER;
            resetPage();
        };

        const toggleSortOrder = () => {
            sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
            resetPage();
        };

        const setSearch = (query: string) => {
            searchQuery.value = query;
            resetPage(); // Reset to first page when searching
        };

        const reset = () => {
            currentPage.value = DEFAULT_PAGE;
            perPage.value = initialPerPage;
            total.value = 0;
            lastPage.value = 1;
            sortBy.value = undefined;
            sortOrder.value = DEFAULT_SORT_ORDER;
            searchQuery.value = '';
        };

        return {
            // State
            currentPage,
            perPage,
            total,
            lastPage,
            sortBy,
            sortOrder,
            searchQuery,

            // Computed
            meta,
            params,

            // Methods
            updateMeta,
            goToPage,
            nextPage,
            prevPage,
            resetPage,
            setPerPage,
            setSort,
            toggleSortOrder,
            setSearch,
            reset,
        };
    };

    /**
     * Calculate pagination info text
     * @param meta - Pagination metadata
     * @returns Pagination info string (e.g., "Showing 1 to 20 of 100 items")
     */
    const getPaginationInfo = (meta: PaginationMeta): string => {
        const from = (meta.current_page - 1) * meta.per_page + 1;
        const to = Math.min(meta.current_page * meta.per_page, meta.total);

        if (meta.total === 0) {
            return 'No items found';
        }

        return `Showing ${from} to ${to} of ${meta.total} items`;
    };

    /**
     * Get array of page numbers for pagination UI
     * @param currentPage - Current page number
     * @param lastPage - Last page number
     * @param maxVisible - Maximum visible page numbers (default: 5)
     * @returns Array of page numbers to display
     */
    const getPageNumbers = (
        currentPage: number,
        lastPage: number,
        maxVisible: number = 5
    ): (number | string)[] => {
        if (lastPage <= maxVisible) {
            return Array.from({ length: lastPage }, (_, i) => i + 1);
        }

        const pages: (number | string)[] = [];
        const half = Math.floor(maxVisible / 2);

        let start = Math.max(currentPage - half, 1);
        let end = Math.min(start + maxVisible - 1, lastPage);

        if (end - start < maxVisible - 1) {
            start = Math.max(end - maxVisible + 1, 1);
        }

        if (start > 1) {
            pages.push(1);
            if (start > 2) {
                pages.push('...');
            }
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (end < lastPage) {
            if (end < lastPage - 1) {
                pages.push('...');
            }
            pages.push(lastPage);
        }

        return pages;
    };

    /**
     * Per page options for select dropdown
     */
    const perPageOptions = [10, 20, 50, 100];

    return {
        DEFAULT_PER_PAGE,
        DEFAULT_PAGE,
        DEFAULT_SORT_ORDER,
        buildPaginationParams,
        createPaginationState,
        getPaginationInfo,
        getPageNumbers,
        perPageOptions,
    };
};
