/**
 * Generate URL-friendly slug from text
 * @param text - Text to convert to slug
 * @returns URL-friendly slug
 * @example generateSlug('Hello World!') => "hello-world"
 * @example generateSlug('Laptop Gaming 2024') => "laptop-gaming-2024"
 */
export const generateSlug = (text: string): string => {
    if (!text) return "";

    return text
        .toLowerCase()
        .trim()
        // Replace Indonesian characters
        .replace(/[àáâäãåā]/g, "a")
        .replace(/[èéêëē]/g, "e")
        .replace(/[ìíîïī]/g, "i")
        .replace(/[òóôöõō]/g, "o")
        .replace(/[ùúûüū]/g, "u")
        // Remove special characters
        .replace(/[^\w\s-]/g, "")
        // Replace whitespace with dash
        .replace(/[\s_]+/g, "-")
        // Replace multiple dashes with single dash
        .replace(/-+/g, "-")
        // Remove leading/trailing dashes
        .replace(/^-+|-+$/g, "");
};

/**
 * Capitalize first letter of each word
 * @param text - Text to capitalize
 * @returns Capitalized text
 * @example capitalize('hello world') => "Hello World"
 */
export const capitalize = (text: string): string => {
    if (!text) return "";

    return text
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

/**
 * Capitalize only first letter of text
 * @param text - Text to capitalize
 * @returns Capitalized text
 * @example capitalizeFirst('hello world') => "Hello world"
 */
export const capitalizeFirst = (text: string): string => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Convert to title case
 * @param text - Text to convert
 * @returns Title case text
 * @example toTitleCase('hello-world') => "Hello World"
 */
export const toTitleCase = (text: string): string => {
    if (!text) return "";

    return text
        .replace(/[-_]/g, " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
};

/**
 * Generate random string
 * @param length - Length of random string (default: 8)
 * @returns Random string
 * @example randomString(6) => "a8f3k9"
 */
export const randomString = (length = 8): string => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

/**
 * Extract initials from name
 * @param name - Full name
 * @returns Initials (max 2 characters)
 * @example getInitials('John Doe') => "JD"
 */
export const getInitials = (name: string): string => {
    if (!name) return "";

    const words = name.trim().split(" ");
    if (words.length === 1) {
        return words[0].charAt(0).toUpperCase();
    }

    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};

/**
 * Convert camelCase to kebab-case
 * @param text - CamelCase text
 * @returns kebab-case text
 * @example camelToKebab('helloWorld') => "hello-world"
 */
export const camelToKebab = (text: string): string => {
    if (!text) return "";
    return text.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
};

/**
 * Convert kebab-case to camelCase
 * @param text - kebab-case text
 * @returns camelCase text
 * @example kebabToCamel('hello-world') => "helloWorld"
 */
export const kebabToCamel = (text: string): string => {
    if (!text) return "";
    return text.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
};

/**
 * Mask email address
 * @param email - Email address
 * @returns Masked email
 * @example maskEmail('john@example.com') => "j***@example.com"
 */
export const maskEmail = (email: string): string => {
    if (!email) return "";

    const [username, domain] = email.split("@");
    if (!domain) return email;

    const maskedUsername = username.charAt(0) + "***";
    return `${maskedUsername}@${domain}`;
};

/**
 * Mask phone number
 * @param phone - Phone number
 * @returns Masked phone number
 * @example maskPhone('081234567890') => "0812****7890"
 */
export const maskPhone = (phone: string): string => {
    if (!phone) return "";

    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length < 8) return phone;

    return cleaned.substring(0, 4) + "****" + cleaned.substring(cleaned.length - 4);
};
