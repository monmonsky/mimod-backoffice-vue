/**
 * Debug & Logging Helper Functions
 *
 * Centralized logging utilities for consistent debugging across the application.
 * All logs are conditionally enabled based on environment.
 */

/**
 * Check if we're in development mode
 */
export const isDev = (): boolean => {
    return import.meta.dev || process.env.NODE_ENV === 'development';
};

/**
 * Log levels for structured logging
 */
export enum LogLevel {
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
}

/**
 * Log level colors for console output
 */
const LOG_LEVEL_COLORS: Record<LogLevel, string> = {
    [LogLevel.DEBUG]: '#6B7280',  // Gray
    [LogLevel.INFO]: '#3B82F6',   // Blue
    [LogLevel.WARN]: '#F59E0B',   // Orange
    [LogLevel.ERROR]: '#EF4444',  // Red
};

/**
 * Format timestamp for logs
 */
const getTimestamp = (): string => {
    const now = new Date();
    return now.toISOString();
};

/**
 * Base logger function
 */
const log = (
    level: LogLevel,
    label: string,
    message: any,
    data?: any
): void => {
    if (!isDev()) return;

    const timestamp = getTimestamp();
    const color = LOG_LEVEL_COLORS[level];

    console.groupCollapsed(
        `%c[${level}] ${label} %c${timestamp}`,
        `color: ${color}; font-weight: bold`,
        `color: #9CA3AF; font-size: 0.85em`
    );

    if (message) {
        console.log('Message:', message);
    }

    if (data) {
        console.log('Data:', data);
    }

    console.trace('Stack Trace');
    console.groupEnd();
};

/**
 * Log API request details
 *
 * @param method - HTTP method
 * @param url - Request URL
 * @param params - Request parameters
 * @param body - Request body
 *
 * @example
 * ```typescript
 * logApiRequest('POST', '/catalog/products', { page: 1 }, { name: 'Product' });
 * ```
 */
export const logApiRequest = (
    method: string,
    url: string,
    params?: Record<string, any>,
    body?: any
): void => {
    if (!isDev()) return;

    console.groupCollapsed(
        `%c⬆ API REQUEST %c${method} ${url}`,
        'color: #10B981; font-weight: bold',
        'color: #6B7280'
    );

    console.log('Method:', method);
    console.log('URL:', url);

    if (params && Object.keys(params).length > 0) {
        console.log('Params:', params);
    }

    if (body) {
        console.log('Body:', body);
    }

    console.log('Timestamp:', getTimestamp());
    console.groupEnd();
};

/**
 * Log API response details
 *
 * @param method - HTTP method
 * @param url - Request URL
 * @param status - Response status code
 * @param data - Response data
 * @param duration - Request duration in milliseconds
 *
 * @example
 * ```typescript
 * logApiResponse('POST', '/catalog/products', 201, { id: 1 }, 450);
 * ```
 */
export const logApiResponse = (
    method: string,
    url: string,
    status: number,
    data?: any,
    duration?: number
): void => {
    if (!isDev()) return;

    const isSuccess = status >= 200 && status < 300;
    const color = isSuccess ? '#10B981' : '#EF4444';
    const icon = isSuccess ? '⬇' : '❌';

    console.groupCollapsed(
        `%c${icon} API RESPONSE %c${method} ${url} %c${status}${duration ? ` (${duration}ms)` : ''}`,
        `color: ${color}; font-weight: bold`,
        'color: #6B7280',
        `color: ${color}; font-weight: bold`
    );

    console.log('Method:', method);
    console.log('URL:', url);
    console.log('Status:', status);

    if (duration) {
        console.log('Duration:', `${duration}ms`);
    }

    if (data) {
        console.log('Data:', data);
    }

    console.log('Timestamp:', getTimestamp());
    console.groupEnd();
};

/**
 * Log API error details
 *
 * @param method - HTTP method
 * @param url - Request URL
 * @param error - Error object
 *
 * @example
 * ```typescript
 * try {
 *   await $fetch('/api/products');
 * } catch (err) {
 *   logApiError('GET', '/api/products', err);
 * }
 * ```
 */
export const logApiError = (
    method: string,
    url: string,
    error: any
): void => {
    if (!isDev()) return;

    console.groupCollapsed(
        `%c❌ API ERROR %c${method} ${url}`,
        'color: #EF4444; font-weight: bold',
        'color: #6B7280'
    );

    console.log('Method:', method);
    console.log('URL:', url);
    console.error('Error:', error);

    if (error?.statusCode || error?.status) {
        console.log('Status Code:', error.statusCode || error.status);
    }

    if (error?.data?.message) {
        console.log('Message:', error.data.message);
    }

    if (error?.data?.errors) {
        console.log('Validation Errors:', error.data.errors);
    }

    console.log('Timestamp:', getTimestamp());
    console.trace('Stack Trace');
    console.groupEnd();
};

/**
 * Log component lifecycle event
 *
 * @param componentName - Name of the component
 * @param lifecycle - Lifecycle event name
 * @param data - Optional data to log
 *
 * @example
 * ```typescript
 * onMounted(() => {
 *   logComponentLifecycle('ProductsTable', 'onMounted', { count: products.value.length });
 * });
 * ```
 */
export const logComponentLifecycle = (
    componentName: string,
    lifecycle: string,
    data?: any
): void => {
    if (!isDev()) return;

    console.log(
        `%c🔄 ${componentName} %c${lifecycle}`,
        'color: #8B5CF6; font-weight: bold',
        'color: #6B7280',
        data || ''
    );
};

/**
 * Log state change
 *
 * @param stateName - Name of the state
 * @param oldValue - Old value
 * @param newValue - New value
 *
 * @example
 * ```typescript
 * watch(selectedProduct, (newVal, oldVal) => {
 *   logStateChange('selectedProduct', oldVal, newVal);
 * });
 * ```
 */
export const logStateChange = (
    stateName: string,
    oldValue: any,
    newValue: any
): void => {
    if (!isDev()) return;

    console.groupCollapsed(
        `%c📊 STATE CHANGE %c${stateName}`,
        'color: #F59E0B; font-weight: bold',
        'color: #6B7280'
    );

    console.log('State:', stateName);
    console.log('Old Value:', oldValue);
    console.log('New Value:', newValue);
    console.log('Timestamp:', getTimestamp());
    console.groupEnd();
};

/**
 * Log performance metric
 *
 * @param label - Performance label
 * @param duration - Duration in milliseconds
 * @param threshold - Warning threshold in milliseconds
 *
 * @example
 * ```typescript
 * const start = performance.now();
 * await fetchProducts();
 * const duration = performance.now() - start;
 * logPerformance('Fetch Products', duration, 1000);
 * ```
 */
export const logPerformance = (
    label: string,
    duration: number,
    threshold: number = 1000
): void => {
    if (!isDev()) return;

    const isWarning = duration >= threshold;
    const color = isWarning ? '#F59E0B' : '#10B981';
    const icon = isWarning ? '⚠️' : '⚡';

    console.log(
        `%c${icon} PERFORMANCE %c${label} %c${duration.toFixed(2)}ms`,
        `color: ${color}; font-weight: bold`,
        'color: #6B7280',
        `color: ${color}; font-weight: bold`
    );
};

/**
 * Create a performance timer
 *
 * @param label - Timer label
 * @returns Object with end() method to stop timer
 *
 * @example
 * ```typescript
 * const timer = startTimer('Fetch Products');
 * await fetchProducts();
 * timer.end(); // Logs: "⚡ PERFORMANCE Fetch Products 450ms"
 * ```
 */
export const startTimer = (label: string) => {
    const start = performance.now();

    return {
        end: (threshold: number = 1000) => {
            const duration = performance.now() - start;
            logPerformance(label, duration, threshold);
            return duration;
        },
    };
};

/**
 * Log table data info (useful for debugging table components)
 *
 * @param tableName - Name of the table
 * @param data - Table data array
 * @param meta - Pagination metadata
 *
 * @example
 * ```typescript
 * logTableData('Products', products.value, pagination.value);
 * ```
 */
export const logTableData = (
    tableName: string,
    data: any[],
    meta?: {
        current_page?: number;
        per_page?: number;
        total?: number;
        last_page?: number;
    }
): void => {
    if (!isDev()) return;

    console.groupCollapsed(
        `%c📋 TABLE DATA %c${tableName}`,
        'color: #3B82F6; font-weight: bold',
        'color: #6B7280'
    );

    console.log('Table:', tableName);
    console.log('Items:', data);
    console.log('Count:', data.length);

    if (meta) {
        console.log('Pagination:', {
            page: `${meta.current_page}/${meta.last_page}`,
            perPage: meta.per_page,
            total: meta.total,
        });
    }

    console.log('Timestamp:', getTimestamp());
    console.groupEnd();
};

/**
 * Log debug message (only in development)
 *
 * @param label - Debug label
 * @param message - Message or data to log
 *
 * @example
 * ```typescript
 * logDebug('Product Filter', { status: 'active', brand: 5 });
 * ```
 */
export const logDebug = (label: string, message: any): void => {
    log(LogLevel.DEBUG, label, message);
};

/**
 * Log info message
 *
 * @param label - Info label
 * @param message - Message or data to log
 */
export const logInfo = (label: string, message: any): void => {
    log(LogLevel.INFO, label, message);
};

/**
 * Log warning message
 *
 * @param label - Warning label
 * @param message - Message or data to log
 */
export const logWarn = (label: string, message: any): void => {
    log(LogLevel.WARN, label, message);
};

/**
 * Log error message (detailed error logging - already in errorHandlers.ts, but included for completeness)
 *
 * @param label - Error label
 * @param error - Error object
 * @param context - Additional context
 */
export const logErrorDetails = (
    label: string,
    error: any,
    context?: Record<string, any>
): void => {
    if (!isDev()) return;

    console.groupCollapsed(
        `%c❌ ERROR %c${label}`,
        'color: #EF4444; font-weight: bold',
        'color: #6B7280'
    );

    console.error('Error:', error);

    if (error?.message) {
        console.log('Message:', error.message);
    }

    if (error?.data) {
        console.log('Data:', error.data);
    }

    if (error?.statusCode || error?.status) {
        console.log('Status Code:', error.statusCode || error.status);
    }

    if (context) {
        console.log('Context:', context);
    }

    console.log('Timestamp:', getTimestamp());
    console.trace('Stack Trace');
    console.groupEnd();
};

/**
 * Create a console group for related logs
 *
 * @param label - Group label
 * @param collapsed - Whether group should start collapsed
 * @returns Object with add() and end() methods
 *
 * @example
 * ```typescript
 * const group = createLogGroup('Product Operations');
 * group.add('Fetching products...');
 * await fetchProducts();
 * group.add('Products fetched:', products.value.length);
 * group.end();
 * ```
 */
export const createLogGroup = (label: string, collapsed: boolean = false) => {
    if (!isDev()) return { add: () => {}, end: () => {} };

    if (collapsed) {
        console.groupCollapsed(`%c${label}`, 'color: #3B82F6; font-weight: bold');
    } else {
        console.group(`%c${label}`, 'color: #3B82F6; font-weight: bold');
    }

    return {
        add: (message: string, data?: any) => {
            if (data !== undefined) {
                console.log(message, data);
            } else {
                console.log(message);
            }
        },
        end: () => {
            console.groupEnd();
        },
    };
};
