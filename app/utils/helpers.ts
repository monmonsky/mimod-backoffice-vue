/**
 * Debounce function execution
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(func: T, wait: number) => {
    let timeout: NodeJS.Timeout;

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Throttle function execution
 * @param func - Function to throttle
 * @param limit - Time limit in milliseconds
 * @returns Throttled function
 */
export const throttle = <T extends (...args: any[]) => any>(func: T, limit: number) => {
    let inThrottle: boolean;

    return function executedFunction(...args: Parameters<T>) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
};

/**
 * Deep clone an object
 * @param obj - Object to clone
 * @returns Cloned object
 */
export const deepClone = <T>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if object has property
 * @param obj - Object to check
 * @param path - Property path (e.g., 'user.address.city')
 * @returns True if property exists
 */
export const hasProperty = (obj: any, path: string): boolean => {
    const keys = path.split(".");
    let current = obj;

    for (const key of keys) {
        if (!current || typeof current !== "object" || !(key in current)) {
            return false;
        }
        current = current[key];
    }

    return true;
};

/**
 * Get nested property value
 * @param obj - Object to get value from
 * @param path - Property path (e.g., 'user.address.city')
 * @param defaultValue - Default value if property not found
 * @returns Property value or default value
 */
export const getNestedValue = (obj: any, path: string, defaultValue: any = null): any => {
    const keys = path.split(".");
    let current = obj;

    for (const key of keys) {
        if (!current || typeof current !== "object" || !(key in current)) {
            return defaultValue;
        }
        current = current[key];
    }

    return current;
};

/**
 * Group array by property
 * @param array - Array to group
 * @param key - Property key to group by
 * @returns Grouped object
 */
export const groupBy = <T extends Record<string, any>>(
    array: T[],
    key: keyof T,
): Record<string, T[]> => {
    return array.reduce(
        (result, item) => {
            const groupKey = String(item[key]);
            if (!result[groupKey]) {
                result[groupKey] = [];
            }
            result[groupKey].push(item);
            return result;
        },
        {} as Record<string, T[]>,
    );
};

/**
 * Remove duplicate items from array
 * @param array - Array to remove duplicates from
 * @param key - Optional key for object arrays
 * @returns Array with unique items
 */
export const unique = <T>(array: T[], key?: keyof T): T[] => {
    if (!key) {
        return Array.from(new Set(array));
    }

    const seen = new Set();
    return array.filter((item) => {
        const value = item[key];
        if (seen.has(value)) {
            return false;
        }
        seen.add(value);
        return true;
    });
};

/**
 * Sort array by property
 * @param array - Array to sort
 * @param key - Property key to sort by
 * @param order - Sort order ('asc' or 'desc')
 * @returns Sorted array
 */
export const sortBy = <T extends Record<string, any>>(
    array: T[],
    key: keyof T,
    order: "asc" | "desc" = "asc",
): T[] => {
    return [...array].sort((a, b) => {
        const aValue = a[key];
        const bValue = b[key];

        if (aValue < bValue) return order === "asc" ? -1 : 1;
        if (aValue > bValue) return order === "asc" ? 1 : -1;
        return 0;
    });
};

/**
 * Sleep/delay execution
 * @param ms - Milliseconds to sleep
 * @returns Promise that resolves after delay
 */
export const sleep = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Generate random number between min and max
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Random number
 */
export const randomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Chunk array into smaller arrays
 * @param array - Array to chunk
 * @param size - Size of each chunk
 * @returns Array of chunks
 */
export const chunk = <T>(array: T[], size: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
};

/**
 * Copy text to clipboard
 * @param text - Text to copy
 * @returns Promise that resolves when copied
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            // Fallback for older browsers
            const textarea = document.createElement("textarea");
            textarea.value = text;
            textarea.style.position = "fixed";
            textarea.style.left = "-999999px";
            document.body.appendChild(textarea);
            textarea.select();
            const success = document.execCommand("copy");
            document.body.removeChild(textarea);
            return success;
        }
    } catch {
        return false;
    }
};

/**
 * Download data as file
 * @param data - Data to download
 * @param filename - Name of file
 * @param type - MIME type
 */
export const downloadFile = (data: string | Blob, filename: string, type = "text/plain"): void => {
    const blob = data instanceof Blob ? data : new Blob([data], { type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};

/**
 * Parse query string to object
 * @param queryString - Query string to parse
 * @returns Parsed object
 */
export const parseQueryString = (queryString: string): Record<string, string> => {
    const params: Record<string, string> = {};
    const searchParams = new URLSearchParams(queryString);

    searchParams.forEach((value, key) => {
        params[key] = value;
    });

    return params;
};

/**
 * Build query string from object
 * @param params - Object to convert to query string
 * @returns Query string
 */
export const buildQueryString = (params: Record<string, any>): string => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
            searchParams.append(key, String(value));
        }
    });

    return searchParams.toString();
};
