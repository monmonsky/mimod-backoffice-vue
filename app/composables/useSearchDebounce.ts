/**
 * Search Debounce Composable
 *
 * Provides debounced search functionality to prevent excessive API calls.
 * Automatically delays search execution until user stops typing.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * const search = ref('');
 * const { debouncedValue, isDebouncing } = useSearchDebounce(search, 500);
 *
 * // Watch debounced value for API calls
 * watch(debouncedValue, (value) => {
 *   fetchProducts({ search: value });
 * });
 * </script>
 *
 * <template>
 *   <input v-model="search" placeholder="Search..." />
 *   <span v-if="isDebouncing">Searching...</span>
 * </template>
 * ```
 */

/**
 * Debounce a search input value
 *
 * @param searchRef - Reactive reference to the search string
 * @param delay - Delay in milliseconds before updating debounced value (default: 500ms)
 * @returns Object with debounced value and debouncing state
 */
export const useSearchDebounce = (searchRef: Ref<string>, delay: number = 500) => {
    const debouncedValue = ref(searchRef.value);
    const isDebouncing = ref(false);
    let timeoutId: NodeJS.Timeout | null = null;

    // Watch for changes in search input
    watch(searchRef, (newValue) => {
        isDebouncing.value = true;

        // Clear previous timeout
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        // Set new timeout
        timeoutId = setTimeout(() => {
            debouncedValue.value = newValue;
            isDebouncing.value = false;
        }, delay);
    });

    // Cleanup on unmount
    onUnmounted(() => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    });

    // Method to immediately flush the debounced value
    const flush = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        debouncedValue.value = searchRef.value;
        isDebouncing.value = false;
    };

    // Method to cancel pending debounce
    const cancel = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        isDebouncing.value = false;
    };

    return {
        debouncedValue: readonly(debouncedValue),
        isDebouncing: readonly(isDebouncing),
        flush,
        cancel,
    };
};

/**
 * Advanced search debounce with additional features
 *
 * @param searchRef - Reactive reference to the search string
 * @param options - Configuration options
 * @returns Object with debounced value, state, and methods
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * const search = ref('');
 * const {
 *   debouncedValue,
 *   isDebouncing,
 *   minLengthMet,
 *   shouldSearch
 * } = useAdvancedSearchDebounce(search, {
 *   delay: 500,
 *   minLength: 3,
 *   trimWhitespace: true
 * });
 *
 * watch(debouncedValue, (value) => {
 *   if (shouldSearch.value) {
 *     fetchProducts({ search: value });
 *   }
 * });
 * </script>
 * ```
 */
export const useAdvancedSearchDebounce = (
    searchRef: Ref<string>,
    options: {
        delay?: number;
        minLength?: number;
        trimWhitespace?: boolean;
        resetOnEmpty?: boolean;
    } = {}
) => {
    const {
        delay = 500,
        minLength = 0,
        trimWhitespace = true,
        resetOnEmpty = true,
    } = options;

    const debouncedValue = ref(searchRef.value);
    const isDebouncing = ref(false);
    let timeoutId: NodeJS.Timeout | null = null;

    // Computed: Check if search meets minimum length requirement
    const minLengthMet = computed(() => {
        const value = trimWhitespace ? searchRef.value.trim() : searchRef.value;
        return value.length >= minLength;
    });

    // Computed: Should perform search
    const shouldSearch = computed(() => {
        if (resetOnEmpty && searchRef.value === '') {
            return true; // Allow empty search to reset results
        }
        return minLengthMet.value;
    });

    // Watch for changes in search input
    watch(searchRef, (newValue) => {
        isDebouncing.value = true;

        // Clear previous timeout
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        // Process value
        let processedValue = newValue;
        if (trimWhitespace) {
            processedValue = processedValue.trim();
        }

        // Handle empty search
        if (resetOnEmpty && newValue === '') {
            debouncedValue.value = '';
            isDebouncing.value = false;
            return;
        }

        // Set new timeout
        timeoutId = setTimeout(() => {
            if (shouldSearch.value) {
                debouncedValue.value = processedValue;
            }
            isDebouncing.value = false;
        }, delay);
    });

    // Cleanup on unmount
    onUnmounted(() => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    });

    // Method to immediately flush the debounced value
    const flush = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        const processedValue = trimWhitespace ? searchRef.value.trim() : searchRef.value;
        debouncedValue.value = processedValue;
        isDebouncing.value = false;
    };

    // Method to cancel pending debounce
    const cancel = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        isDebouncing.value = false;
    };

    // Method to reset search
    const reset = () => {
        cancel();
        searchRef.value = '';
        debouncedValue.value = '';
    };

    return {
        debouncedValue: readonly(debouncedValue),
        isDebouncing: readonly(isDebouncing),
        minLengthMet: readonly(minLengthMet),
        shouldSearch: readonly(shouldSearch),
        flush,
        cancel,
        reset,
    };
};
