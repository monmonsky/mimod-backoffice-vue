/**
 * Validate email format
 * @param email - Email address to validate
 * @returns True if valid email format
 */
export const isValidEmail = (email: string): boolean => {
    if (!email) return false;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate Indonesian phone number
 * @param phone - Phone number to validate
 * @returns True if valid Indonesian phone format
 */
export const isValidPhone = (phone: string): boolean => {
    if (!phone) return false;

    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, "");

    // Indonesian phone numbers: 08xx-xxxx-xxxx (10-13 digits)
    return /^08\d{8,11}$/.test(cleaned);
};

/**
 * Validate URL format
 * @param url - URL to validate
 * @returns True if valid URL format
 */
export const isValidUrl = (url: string): boolean => {
    if (!url) return false;

    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

/**
 * Validate password strength
 * @param password - Password to validate
 * @param minLength - Minimum length (default: 8)
 * @returns Object with validation result and message
 */
export const validatePassword = (
    password: string,
    minLength = 8,
): { isValid: boolean; message: string } => {
    if (!password) {
        return { isValid: false, message: "Password is required" };
    }

    if (password.length < minLength) {
        return { isValid: false, message: `Password must be at least ${minLength} characters` };
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUpperCase) {
        return { isValid: false, message: "Password must contain at least one uppercase letter" };
    }

    if (!hasLowerCase) {
        return { isValid: false, message: "Password must contain at least one lowercase letter" };
    }

    if (!hasNumber) {
        return { isValid: false, message: "Password must contain at least one number" };
    }

    if (!hasSpecialChar) {
        return { isValid: false, message: "Password must contain at least one special character" };
    }

    return { isValid: true, message: "Password is strong" };
};

/**
 * Validate Indonesian ID card number (NIK)
 * @param nik - NIK to validate
 * @returns True if valid NIK format (16 digits)
 */
export const isValidNIK = (nik: string): boolean => {
    if (!nik) return false;

    const cleaned = nik.replace(/\D/g, "");
    return cleaned.length === 16;
};

/**
 * Validate Indonesian postal code
 * @param postalCode - Postal code to validate
 * @returns True if valid postal code format (5 digits)
 */
export const isValidPostalCode = (postalCode: string): boolean => {
    if (!postalCode) return false;

    const cleaned = postalCode.replace(/\D/g, "");
    return cleaned.length === 5;
};

/**
 * Validate credit card number using Luhn algorithm
 * @param cardNumber - Credit card number to validate
 * @returns True if valid credit card number
 */
export const isValidCreditCard = (cardNumber: string): boolean => {
    if (!cardNumber) return false;

    const cleaned = cardNumber.replace(/\D/g, "");

    if (cleaned.length < 13 || cleaned.length > 19) return false;

    let sum = 0;
    let isEven = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
        let digit = parseInt(cleaned.charAt(i), 10);

        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        isEven = !isEven;
    }

    return sum % 10 === 0;
};

/**
 * Check if value is empty (null, undefined, empty string, empty array, empty object)
 * @param value - Value to check
 * @returns True if empty
 */
export const isEmpty = (value: any): boolean => {
    if (value === null || value === undefined) return true;
    if (typeof value === "string") return value.trim() === "";
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === "object") return Object.keys(value).length === 0;
    return false;
};

/**
 * Validate file type
 * @param file - File to validate
 * @param allowedTypes - Array of allowed MIME types
 * @returns True if file type is allowed
 */
export const isValidFileType = (file: File, allowedTypes: string[]): boolean => {
    if (!file) return false;
    return allowedTypes.includes(file.type);
};

/**
 * Validate file size
 * @param file - File to validate
 * @param maxSizeMB - Maximum file size in MB
 * @returns True if file size is within limit
 */
export const isValidFileSize = (file: File, maxSizeMB: number): boolean => {
    if (!file) return false;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
};
