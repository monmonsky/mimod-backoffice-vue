/**
 * API Response Helper Functions
 *
 * Utilities for extracting data from nested API response structures.
 * Handles different response formats consistently across the application.
 */

import type { PaginationMeta } from "~/composables/usePagination";

/**
 * Extract nested value from object using dot notation path
 *
 * @param obj - The object to extract from
 * @param path - Dot-notation path (e.g., "data.products.data")
 * @param defaultValue - Default value if path not found
 * @returns Extracted value or default
 *
 * @example
 * ```typescript
 * const response = {
 *   data: {
 *     products: {
 *       data: [{ id: 1 }],
 *       total: 100
 *     }
 *   }
 * };
 *
 * extractNestedValue(response, 'data.products.data'); // Returns: [{ id: 1 }]
 * extractNestedValue(response, 'data.products.total'); // Returns: 100
 * extractNestedValue(response, 'data.missing', []); // Returns: []
 * ```
 */
export const extractNestedValue = <T = any>(
    obj: any,
    path: string,
    defaultValue: T = undefined as T
): T => {
    if (!obj || !path) return defaultValue;

    const keys = path.split(".");
    let current = obj;

    for (const key of keys) {
        if (current === null || current === undefined || !(key in current)) {
            return defaultValue;
        }
        current = current[key];
    }

    return current !== undefined ? current : defaultValue;
};

/**
 * Extract list data from various API response formats
 *
 * Supports multiple common API response structures:
 * - { data: { items: { data: [...] } } }
 * - { data: { items: [...] } }
 * - { data: [...] }
 * - { items: [...] }
 * - [...]
 *
 * @param response - API response object
 * @param dataPath - Optional custom path to data array
 * @returns Extracted array or empty array
 *
 * @example
 * ```typescript
 * // Laravel pagination format
 * const response1 = { data: { products: { data: [{...}] } } };
 * extractListData(response1, 'data.products.data'); // Returns: [{...}]
 *
 * // Simple format
 * const response2 = { data: [{...}] };
 * extractListData(response2); // Returns: [{...}]
 *
 * // Array response
 * const response3 = [{ id: 1 }];
 * extractListData(response3); // Returns: [{ id: 1 }]
 * ```
 */
export const extractListData = <T = any>(
    response: any,
    dataPath?: string
): T[] => {
    if (!response) return [];

    // If custom path provided, use it
    if (dataPath) {
        return extractNestedValue(response, dataPath, []);
    }

    // If response is already an array
    if (Array.isArray(response)) {
        return response;
    }

    // Try common patterns
    const patterns = [
        "data.data",           // Laravel pagination with wrapper
        "data",                // Simple data wrapper
        "items.data",          // Items with pagination
        "items",               // Simple items array
        "results",             // Common in some APIs
    ];

    for (const pattern of patterns) {
        const value = extractNestedValue(response, pattern);
        if (Array.isArray(value)) {
            return value;
        }
    }

    // Last resort: check if response.data[0] is an object with data property
    if (response.data && Array.isArray(response.data) && response.data[0]?.data) {
        return response.data[0].data;
    }

    return [];
};

/**
 * Extract pagination metadata from API response
 *
 * Supports Laravel pagination format and custom structures.
 *
 * @param response - API response object
 * @param metaPath - Optional path to pagination meta object
 * @returns Pagination metadata object
 *
 * @example
 * ```typescript
 * const response = {
 *   data: {
 *     products: {
 *       current_page: 2,
 *       per_page: 20,
 *       total: 156,
 *       last_page: 8
 *     }
 *   }
 * };
 *
 * const meta = extractPaginationMeta(response, 'data.products');
 * // Returns: {
 * //   current_page: 2,
 * //   per_page: 20,
 * //   total: 156,
 * //   last_page: 8
 * // }
 * ```
 */
export const extractPaginationMeta = (
    response: any,
    metaPath?: string
): PaginationMeta => {
    const defaultMeta: PaginationMeta = {
        current_page: 1,
        per_page: 20,
        total: 0,
        last_page: 1,
        from: 0,
        to: 0,
    };

    if (!response) return defaultMeta;

    // If custom path provided, extract from there
    let source = response;
    if (metaPath) {
        source = extractNestedValue(response, metaPath, response);
    }

    // Try common patterns for pagination meta
    const patterns = [
        "",                    // Direct on source
        "data",                // Nested in data
        "meta",                // Separate meta object
        "pagination",          // Named pagination object
    ];

    for (const pattern of patterns) {
        const obj = pattern ? extractNestedValue(source, pattern) : source;

        if (obj && typeof obj === "object") {
            // Check if this object has pagination properties
            if ("current_page" in obj || "page" in obj || "total" in obj) {
                return {
                    current_page: obj.current_page || obj.page || defaultMeta.current_page,
                    per_page: obj.per_page || obj.limit || obj.page_size || defaultMeta.per_page,
                    total: obj.total || obj.total_count || defaultMeta.total,
                    last_page: obj.last_page || obj.total_pages || Math.ceil((obj.total || 0) / (obj.per_page || 20)),
                    from: obj.from || ((obj.current_page || 1) - 1) * (obj.per_page || 20) + 1,
                    to: obj.to || Math.min((obj.current_page || 1) * (obj.per_page || 20), obj.total || 0),
                };
            }
        }
    }

    // Special case: Laravel pagination with data[0] containing meta
    if (response.data && Array.isArray(response.data) && response.data[0]) {
        const firstItem = response.data[0];
        if ("current_page" in firstItem) {
            return {
                current_page: firstItem.current_page || defaultMeta.current_page,
                per_page: firstItem.per_page || defaultMeta.per_page,
                total: firstItem.total || defaultMeta.total,
                last_page: firstItem.last_page || defaultMeta.last_page,
                from: firstItem.from || defaultMeta.from,
                to: firstItem.to || defaultMeta.to,
            };
        }
    }

    return defaultMeta;
};

/**
 * Extract single item data from API response
 *
 * @param response - API response object
 * @param dataPath - Optional path to item data
 * @returns Extracted item or null
 *
 * @example
 * ```typescript
 * const response = { data: { product: { id: 1, name: "Product" } } };
 * const product = extractItemData(response, 'data.product');
 * // Returns: { id: 1, name: "Product" }
 * ```
 */
export const extractItemData = <T = any>(
    response: any,
    dataPath?: string
): T | null => {
    if (!response) return null;

    // If custom path provided, use it
    if (dataPath) {
        return extractNestedValue(response, dataPath, null);
    }

    // Try common patterns
    const patterns = [
        "data",
        "item",
        "result",
    ];

    for (const pattern of patterns) {
        const value = extractNestedValue(response, pattern);
        if (value && typeof value === "object" && !Array.isArray(value)) {
            return value;
        }
    }

    // If response itself is an object (not array, not null)
    if (typeof response === "object" && !Array.isArray(response) && response !== null) {
        return response;
    }

    return null;
};

/**
 * Check if response indicates success
 *
 * @param response - API response object
 * @returns True if response indicates success
 *
 * @example
 * ```typescript
 * const response = { status: true, statusCode: "200", data: {...} };
 * isSuccessResponse(response); // Returns: true
 * ```
 */
export const isSuccessResponse = (response: any): boolean => {
    if (!response) return false;

    // Check status boolean
    if (response.status === true) return true;

    // Check statusCode
    const statusCode = response.statusCode || response.status_code;
    if (statusCode) {
        const code = typeof statusCode === "string" ? parseInt(statusCode) : statusCode;
        return code >= 200 && code < 300;
    }

    // Check success field
    if (response.success === true) return true;

    // If has data property, consider it success
    if (response.data !== undefined) return true;

    return false;
};

/**
 * Extract message from API response
 *
 * @param response - API response object
 * @param defaultMessage - Default message if not found
 * @returns Extracted message string
 *
 * @example
 * ```typescript
 * const response = { message: "Product created successfully" };
 * extractMessage(response); // Returns: "Product created successfully"
 * ```
 */
export const extractMessage = (
    response: any,
    defaultMessage: string = ""
): string => {
    if (!response) return defaultMessage;

    return (
        response.message ||
        response.msg ||
        response.data?.message ||
        response.data?.msg ||
        defaultMessage
    );
};

/**
 * Create standardized list response
 *
 * Useful for transforming various API responses into a consistent format.
 *
 * @param response - API response object
 * @param dataPath - Path to list data
 * @param metaPath - Path to pagination meta
 * @returns Standardized list response
 *
 * @example
 * ```typescript
 * const apiResponse = { ... }; // Any format
 * const standardized = createListResponse(apiResponse, 'data.products.data', 'data.products');
 * // Returns: {
 * //   data: [...],
 * //   meta: { current_page: 1, ... }
 * // }
 * ```
 */
export const createListResponse = <T = any>(
    response: any,
    dataPath?: string,
    metaPath?: string
): { data: T[]; meta: PaginationMeta } => {
    return {
        data: extractListData<T>(response, dataPath),
        meta: extractPaginationMeta(response, metaPath),
    };
};

/**
 * Safe JSON parse with fallback
 *
 * @param jsonString - JSON string to parse
 * @param defaultValue - Default value if parse fails
 * @returns Parsed object or default value
 *
 * @example
 * ```typescript
 * safeJsonParse('{"id": 1}'); // Returns: { id: 1 }
 * safeJsonParse('invalid', {}); // Returns: {}
 * ```
 */
export const safeJsonParse = <T = any>(
    jsonString: string,
    defaultValue: T = null as T
): T => {
    try {
        return JSON.parse(jsonString);
    } catch {
        return defaultValue;
    }
};
