/**
 * Async Operation Composable
 *
 * Wraps async operations with automatic loading state, error handling, and toast notifications.
 * Reduces boilerplate code for common async patterns (save, delete, submit, etc.)
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * const { execute, isLoading, error } = useAsyncOperation(
 *   async () => await saveProduct(productData),
 *   {
 *     successMessage: 'Product saved!',
 *     errorMessage: 'Failed to save product',
 *     onSuccess: () => navigateTo('/products'),
 *   }
 * );
 * </script>
 *
 * <template>
 *   <button @click="execute" :disabled="isLoading">
 *     {{ isLoading ? 'Saving...' : 'Save' }}
 *   </button>
 * </template>
 * ```
 */

import { getErrorMessage } from '~/utils/errorHandlers';
import { logErrorDetails } from '~/utils/debugHelpers';

export interface AsyncOperationOptions<T = any> {
    /**
     * Success message to show in toast
     */
    successMessage?: string;

    /**
     * Error message to show in toast (can be overridden by API error)
     */
    errorMessage?: string;

    /**
     * Show success toast notification
     * @default true
     */
    showSuccessToast?: boolean;

    /**
     * Show error toast notification
     * @default true
     */
    showErrorToast?: boolean;

    /**
     * Callback executed on success
     */
    onSuccess?: (result: T) => void | Promise<void>;

    /**
     * Callback executed on error
     */
    onError?: (error: any) => void | Promise<void>;

    /**
     * Callback executed in finally block
     */
    onFinally?: () => void | Promise<void>;

    /**
     * Log errors to console (development only)
     * @default true
     */
    logErrors?: boolean;

    /**
     * Error log label for debugging
     */
    errorLabel?: string;

    /**
     * Throw error after handling (useful for parent error handlers)
     * @default false
     */
    throwError?: boolean;
}

/**
 * Execute async operation with loading state and error handling
 *
 * @param asyncFn - Async function to execute
 * @param options - Configuration options
 * @returns Object with execute method, loading state, error state, and result
 */
export const useAsyncOperation = <T = any>(
    asyncFn: () => Promise<T>,
    options: AsyncOperationOptions<T> = {}
) => {
    const {
        successMessage,
        errorMessage = 'An error occurred',
        showSuccessToast = true,
        showErrorToast = true,
        onSuccess,
        onError,
        onFinally,
        logErrors = import.meta.dev,
        errorLabel = 'Async Operation',
        throwError = false,
    } = options;

    const { success, error: showError } = useToast();

    const isLoading = ref(false);
    const error = ref<any>(null);
    const result = ref<T | null>(null);

    /**
     * Execute the async operation
     */
    const execute = async (): Promise<T | null> => {
        try {
            isLoading.value = true;
            error.value = null;

            // Execute async function
            const data = await asyncFn();
            result.value = data;

            // Show success toast
            if (showSuccessToast && successMessage) {
                success(successMessage);
            }

            // Call success callback
            if (onSuccess) {
                await onSuccess(data);
            }

            return data;
        } catch (err: any) {
            error.value = err;

            // Log error if enabled
            if (logErrors) {
                logErrorDetails(errorLabel, err);
            }

            // Show error toast
            if (showErrorToast) {
                const message = getErrorMessage(err, errorMessage);
                showError(message);
            }

            // Call error callback
            if (onError) {
                await onError(err);
            }

            // Re-throw error if requested
            if (throwError) {
                throw err;
            }

            return null;
        } finally {
            isLoading.value = false;

            // Call finally callback
            if (onFinally) {
                await onFinally();
            }
        }
    };

    /**
     * Reset state
     */
    const reset = () => {
        isLoading.value = false;
        error.value = null;
        result.value = null;
    };

    return {
        execute,
        isLoading: readonly(isLoading),
        error: readonly(error),
        result: readonly(result),
        reset,
    };
};

/**
 * Execute async operation with parameters
 *
 * Useful when the async operation needs dynamic parameters.
 *
 * @param asyncFn - Async function that accepts parameters
 * @param options - Configuration options
 * @returns Object with execute method (with params), loading state, error state, and result
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * const { execute, isLoading } = useAsyncOperationWithParams(
 *   async (productId: number) => await deleteProduct(productId),
 *   {
 *     successMessage: 'Product deleted!',
 *     errorMessage: 'Failed to delete product',
 *   }
 * );
 *
 * const handleDelete = (id: number) => {
 *   execute(id);
 * };
 * </script>
 * ```
 */
export const useAsyncOperationWithParams = <TParams extends any[], TResult = any>(
    asyncFn: (...args: TParams) => Promise<TResult>,
    options: AsyncOperationOptions<TResult> = {}
) => {
    const {
        successMessage,
        errorMessage = 'An error occurred',
        showSuccessToast = true,
        showErrorToast = true,
        onSuccess,
        onError,
        onFinally,
        logErrors = import.meta.dev,
        errorLabel = 'Async Operation',
        throwError = false,
    } = options;

    const { success, error: showError } = useToast();

    const isLoading = ref(false);
    const error = ref<any>(null);
    const result = ref<TResult | null>(null);

    /**
     * Execute the async operation with parameters
     */
    const execute = async (...args: TParams): Promise<TResult | null> => {
        try {
            isLoading.value = true;
            error.value = null;

            // Execute async function with parameters
            const data = await asyncFn(...args);
            result.value = data;

            // Show success toast
            if (showSuccessToast && successMessage) {
                success(successMessage);
            }

            // Call success callback
            if (onSuccess) {
                await onSuccess(data);
            }

            return data;
        } catch (err: any) {
            error.value = err;

            // Log error if enabled
            if (logErrors) {
                logErrorDetails(errorLabel, err, { params: args });
            }

            // Show error toast
            if (showErrorToast) {
                const message = getErrorMessage(err, errorMessage);
                showError(message);
            }

            // Call error callback
            if (onError) {
                await onError(err);
            }

            // Re-throw error if requested
            if (throwError) {
                throw err;
            }

            return null;
        } finally {
            isLoading.value = false;

            // Call finally callback
            if (onFinally) {
                await onFinally();
            }
        }
    };

    /**
     * Reset state
     */
    const reset = () => {
        isLoading.value = false;
        error.value = null;
        result.value = null;
    };

    return {
        execute,
        isLoading: readonly(isLoading),
        error: readonly(error),
        result: readonly(result),
        reset,
    };
};

/**
 * Execute multiple async operations in parallel
 *
 * @param operations - Array of async operations
 * @param options - Configuration options
 * @returns Object with execute method, loading state, errors, and results
 *
 * @example
 * ```typescript
 * const { execute, isLoading, results } = useParallelAsyncOperations([
 *   () => fetchProducts(),
 *   () => fetchCategories(),
 *   () => fetchBrands(),
 * ], {
 *   successMessage: 'All data loaded!',
 * });
 *
 * onMounted(() => execute());
 * ```
 */
export const useParallelAsyncOperations = <T = any>(
    operations: Array<() => Promise<T>>,
    options: AsyncOperationOptions<T[]> = {}
) => {
    const {
        successMessage,
        errorMessage = 'One or more operations failed',
        showSuccessToast = true,
        showErrorToast = true,
        onSuccess,
        onError,
        onFinally,
        logErrors = import.meta.dev,
        throwError = false,
    } = options;

    const { success, error: showError } = useToast();

    const isLoading = ref(false);
    const errors = ref<any[]>([]);
    const results = ref<T[]>([]);

    /**
     * Execute all operations in parallel
     */
    const execute = async (): Promise<T[] | null> => {
        try {
            isLoading.value = true;
            errors.value = [];
            results.value = [];

            // Execute all operations in parallel
            const settledResults = await Promise.allSettled(
                operations.map((op) => op())
            );

            // Separate successful results and errors
            const successfulResults: T[] = [];
            const failedResults: any[] = [];

            settledResults.forEach((result, index) => {
                if (result.status === 'fulfilled') {
                    successfulResults.push(result.value);
                } else {
                    failedResults.push({
                        index,
                        error: result.reason,
                    });

                    // Log individual errors
                    if (logErrors) {
                        logErrorDetails(`Operation ${index + 1}`, result.reason);
                    }
                }
            });

            results.value = successfulResults;
            errors.value = failedResults;

            // If any operation failed
            if (failedResults.length > 0) {
                if (showErrorToast) {
                    showError(`${failedResults.length} operation(s) failed`);
                }

                if (onError) {
                    await onError(failedResults);
                }

                if (throwError) {
                    throw new Error(`${failedResults.length} operations failed`);
                }

                return null;
            }

            // All operations succeeded
            if (showSuccessToast && successMessage) {
                success(successMessage);
            }

            if (onSuccess) {
                await onSuccess(successfulResults);
            }

            return successfulResults;
        } catch (err: any) {
            if (logErrors) {
                logErrorDetails('Parallel Operations', err);
            }

            if (showErrorToast) {
                const message = getErrorMessage(err, errorMessage);
                showError(message);
            }

            if (throwError) {
                throw err;
            }

            return null;
        } finally {
            isLoading.value = false;

            if (onFinally) {
                await onFinally();
            }
        }
    };

    /**
     * Reset state
     */
    const reset = () => {
        isLoading.value = false;
        errors.value = [];
        results.value = [];
    };

    return {
        execute,
        isLoading: readonly(isLoading),
        errors: readonly(errors),
        results: readonly(results),
        hasErrors: computed(() => errors.value.length > 0),
        successCount: computed(() => results.value.length),
        failureCount: computed(() => errors.value.length),
        reset,
    };
};
