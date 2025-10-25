/**
 * Error Handling Utilities
 *
 * Centralized error message extraction and handling functions.
 * Ensures consistent error messaging across the application.
 */

/**
 * API Error Response Interface
 */
export interface ApiError {
    data?: {
        message?: string;
        errors?: Record<string, string[]>;
        statusCode?: number | string;
    };
    message?: string;
    statusCode?: number;
    status?: number;
}

/**
 * Extract error message from various error formats
 *
 * Handles different API error response structures and provides fallback messages.
 *
 * @param error - The error object (can be from API, try-catch, or any format)
 * @param defaultMessage - Fallback message if no error message found
 * @returns Extracted error message string
 *
 * @example
 * ```typescript
 * // API error with nested message
 * const apiError = { data: { message: "Product not found" } };
 * getErrorMessage(apiError); // Returns: "Product not found"
 *
 * // Error with default message
 * getErrorMessage(null, "Failed to save"); // Returns: "Failed to save"
 *
 * // Standard Error object
 * const error = new Error("Connection failed");
 * getErrorMessage(error); // Returns: "Connection failed"
 *
 * // Usage in try-catch
 * try {
 *   await deleteProduct(id);
 * } catch (err) {
 *   showError(getErrorMessage(err, "Failed to delete product"));
 * }
 * ```
 */
export const getErrorMessage = (
    error: any,
    defaultMessage: string = "An error occurred"
): string => {
    if (!error) return defaultMessage;

    // Try nested data.message (most common API format)
    if (error?.data?.message) {
        return error.data.message;
    }

    // Try direct message property
    if (error?.message) {
        return error.message;
    }

    // Try response.data.message (axios format)
    if (error?.response?.data?.message) {
        return error.response.data.message;
    }

    // Try statusText
    if (error?.statusText) {
        return error.statusText;
    }

    // If error is a string, return it
    if (typeof error === "string") {
        return error;
    }

    return defaultMessage;
};

/**
 * Extract validation errors from API response
 *
 * Many APIs return field-level validation errors in a specific format.
 * This function extracts and formats them for display.
 *
 * @param error - The error object
 * @returns Object with field names as keys and error messages as values
 *
 * @example
 * ```typescript
 * const apiError = {
 *   data: {
 *     errors: {
 *       email: ["Email is required", "Email must be valid"],
 *       password: ["Password must be at least 8 characters"]
 *     }
 *   }
 * };
 *
 * const errors = getValidationErrors(apiError);
 * // Returns: {
 * //   email: "Email is required",
 * //   password: "Password must be at least 8 characters"
 * // }
 * ```
 */
export const getValidationErrors = (error: any): Record<string, string> => {
    if (!error?.data?.errors) return {};

    const errors: Record<string, string> = {};
    const apiErrors = error.data.errors;

    // Convert array of errors to first error message per field
    Object.keys(apiErrors).forEach((field) => {
        const fieldErrors = apiErrors[field];
        if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
            errors[field] = fieldErrors[0];
        } else if (typeof fieldErrors === "string") {
            errors[field] = fieldErrors;
        }
    });

    return errors;
};

/**
 * Check if error is a validation error (422 status)
 *
 * @param error - The error object
 * @returns True if error is a validation error
 */
export const isValidationError = (error: any): boolean => {
    const statusCode = error?.data?.statusCode || error?.statusCode || error?.status;
    return statusCode === 422 || statusCode === "422";
};

/**
 * Check if error is an authentication error (401 status)
 *
 * @param error - The error object
 * @returns True if error is an authentication error
 */
export const isAuthError = (error: any): boolean => {
    const statusCode = error?.data?.statusCode || error?.statusCode || error?.status;
    return statusCode === 401 || statusCode === "401";
};

/**
 * Check if error is a permission/authorization error (403 status)
 *
 * @param error - The error object
 * @returns True if error is a permission error
 */
export const isPermissionError = (error: any): boolean => {
    const statusCode = error?.data?.statusCode || error?.statusCode || error?.status;
    return statusCode === 403 || statusCode === "403";
};

/**
 * Check if error is a not found error (404 status)
 *
 * @param error - The error object
 * @returns True if error is a not found error
 */
export const isNotFoundError = (error: any): boolean => {
    const statusCode = error?.data?.statusCode || error?.statusCode || error?.status;
    return statusCode === 404 || statusCode === "404";
};

/**
 * Check if error is a server error (500 status)
 *
 * @param error - The error object
 * @returns True if error is a server error
 */
export const isServerError = (error: any): boolean => {
    const statusCode = error?.data?.statusCode || error?.statusCode || error?.status;
    const code = typeof statusCode === "string" ? parseInt(statusCode) : statusCode;
    return code >= 500 && code < 600;
};

/**
 * Get user-friendly error message based on status code
 *
 * @param error - The error object
 * @param customMessages - Optional custom messages for specific status codes
 * @returns User-friendly error message
 *
 * @example
 * ```typescript
 * const error = { statusCode: 404 };
 * getFriendlyErrorMessage(error); // Returns: "The requested resource was not found"
 *
 * // With custom message
 * getFriendlyErrorMessage(error, {
 *   404: "Product not found"
 * }); // Returns: "Product not found"
 * ```
 */
export const getFriendlyErrorMessage = (
    error: any,
    customMessages?: Record<number, string>
): string => {
    const statusCode = error?.data?.statusCode || error?.statusCode || error?.status;
    const code = typeof statusCode === "string" ? parseInt(statusCode) : statusCode;

    // Check custom messages first
    if (customMessages && customMessages[code]) {
        return customMessages[code];
    }

    // Default friendly messages
    const friendlyMessages: Record<number, string> = {
        400: "Invalid request. Please check your input and try again",
        401: "You need to login to perform this action",
        403: "You don't have permission to perform this action",
        404: "The requested resource was not found",
        422: "Please check the form for errors",
        429: "Too many requests. Please try again later",
        500: "Server error. Please try again later",
        502: "Service temporarily unavailable",
        503: "Service temporarily unavailable",
    };

    return friendlyMessages[code] || getErrorMessage(error, "An unexpected error occurred");
};

/**
 * Log error details to console (useful for debugging)
 *
 * @param label - Label for the error log
 * @param error - The error object
 * @param additionalContext - Optional additional context to log
 *
 * @example
 * ```typescript
 * try {
 *   await uploadImage(file);
 * } catch (err) {
 *   logError("Image Upload", err, { fileName: file.name });
 *   showError(getErrorMessage(err, "Failed to upload image"));
 * }
 * ```
 */
export const logError = (
    label: string,
    error: any,
    additionalContext?: Record<string, any>
): void => {
    console.error(`=== ${label.toUpperCase()} ERROR ===`);
    console.error("Error:", error);
    console.error("Message:", getErrorMessage(error));

    if (error?.data) {
        console.error("Data:", error.data);
    }

    if (error?.statusCode || error?.status) {
        console.error("Status Code:", error.statusCode || error.status);
    }

    if (additionalContext) {
        console.error("Context:", additionalContext);
    }

    console.error("=".repeat(label.length + 16));
};

/**
 * Handle error with toast notification
 *
 * Combines error extraction and toast display in one function.
 * Requires useToast() composable in scope.
 *
 * @param error - The error object
 * @param defaultMessage - Default message if error message not found
 * @param showToast - The error function from useToast()
 *
 * @example
 * ```typescript
 * const { error: showError } = useToast();
 *
 * try {
 *   await deleteProduct(id);
 * } catch (err) {
 *   handleErrorWithToast(err, "Failed to delete product", showError);
 * }
 * ```
 */
export const handleErrorWithToast = (
    error: any,
    defaultMessage: string,
    showToast: (message: string) => void
): void => {
    const message = getFriendlyErrorMessage(error) || getErrorMessage(error, defaultMessage);
    showToast(message);

    // Log to console in development
    if (import.meta.dev) {
        logError("API Error", error);
    }
};
