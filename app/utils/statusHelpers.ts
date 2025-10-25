/**
 * Status & Badge Helper Functions
 *
 * Centralized utilities for status-to-badge-class mapping across the application.
 * Ensures consistent badge styling for entity statuses.
 */

/**
 * Default status-to-badge-class mappings
 * Used across products, customers, orders, etc.
 */
export const DEFAULT_STATUS_MAP: Record<string, string> = {
    // Common statuses
    active: "badge-success",
    inactive: "badge-warning",
    suspended: "badge-error",
    banned: "badge-error",
    draft: "badge-ghost",
    archived: "badge-ghost",

    // Order/Payment statuses
    pending: "badge-warning",
    processing: "badge-info",
    completed: "badge-success",
    cancelled: "badge-error",
    failed: "badge-error",
    refunded: "badge-warning",
    paid: "badge-success",
    unpaid: "badge-error",

    // Shipping statuses
    shipped: "badge-info",
    delivered: "badge-success",
    returned: "badge-warning",

    // General statuses
    approved: "badge-success",
    rejected: "badge-error",
    published: "badge-success",
    enabled: "badge-success",
    disabled: "badge-warning",
};

/**
 * Get badge CSS class for a given status
 *
 * @param status - The status string (e.g., "active", "pending")
 * @param customMap - Optional custom status-to-class mapping (extends default map)
 * @returns CSS class string for daisyUI badge component
 *
 * @example
 * ```typescript
 * // Using default map
 * getStatusBadgeClass('active') // Returns: "badge-success"
 *
 * // Using custom map
 * getStatusBadgeClass('vip', { vip: 'badge-primary' }) // Returns: "badge-primary"
 *
 * // Unknown status returns ghost badge
 * getStatusBadgeClass('unknown') // Returns: "badge-ghost"
 * ```
 */
export const getStatusBadgeClass = (
    status: string | undefined | null,
    customMap?: Record<string, string>
): string => {
    if (!status) return "badge-ghost";

    const statusLower = status.toLowerCase();
    const map = { ...DEFAULT_STATUS_MAP, ...customMap };

    return map[statusLower] || "badge-ghost";
};

/**
 * Default type-to-badge-class mappings
 * Used for attribute types, module types, etc.
 */
export const DEFAULT_TYPE_MAP: Record<string, string> = {
    // Attribute types
    select: "badge-primary",
    color: "badge-secondary",
    radio: "badge-accent",
    checkbox: "badge-info",
    text: "badge-neutral",

    // Module types
    core: "badge-primary",
    feature: "badge-secondary",
    plugin: "badge-accent",

    // User roles
    admin: "badge-error",
    manager: "badge-warning",
    staff: "badge-info",
    customer: "badge-success",
};

/**
 * Get badge CSS class for entity types
 *
 * @param type - The type string (e.g., "select", "admin")
 * @param customMap - Optional custom type-to-class mapping (extends default map)
 * @returns CSS class string for daisyUI badge component
 *
 * @example
 * ```typescript
 * getTypeBadgeClass('select') // Returns: "badge-primary"
 * getTypeBadgeClass('admin') // Returns: "badge-error"
 * ```
 */
export const getTypeBadgeClass = (
    type: string | undefined | null,
    customMap?: Record<string, string>
): string => {
    if (!type) return "badge-ghost";

    const typeLower = type.toLowerCase();
    const map = { ...DEFAULT_TYPE_MAP, ...customMap };

    return map[typeLower] || "badge-ghost";
};

/**
 * Default type-to-label mappings
 * Human-readable labels for technical type names
 */
export const DEFAULT_TYPE_LABELS: Record<string, string> = {
    // Attribute types
    select: "Select Dropdown",
    color: "Color Picker",
    radio: "Radio Button",
    checkbox: "Checkbox",
    text: "Text Input",

    // Common types
    boolean: "Yes/No",
    number: "Number",
    date: "Date",
    datetime: "Date & Time",
};

/**
 * Get human-readable label for a type
 *
 * @param type - The type string
 * @param customLabels - Optional custom type-to-label mapping (extends default)
 * @returns Human-readable label string
 *
 * @example
 * ```typescript
 * getTypeLabel('select') // Returns: "Select Dropdown"
 * getTypeLabel('color') // Returns: "Color Picker"
 * getTypeLabel('unknown') // Returns: "unknown" (fallback to original)
 * ```
 */
export const getTypeLabel = (
    type: string | undefined | null,
    customLabels?: Record<string, string>
): string => {
    if (!type) return "";

    const typeLower = type.toLowerCase();
    const labels = { ...DEFAULT_TYPE_LABELS, ...customLabels };

    return labels[typeLower] || type;
};

/**
 * Get status text with proper capitalization
 *
 * @param status - The status string
 * @returns Capitalized status string
 *
 * @example
 * ```typescript
 * getStatusText('active') // Returns: "Active"
 * getStatusText('pending_approval') // Returns: "Pending Approval"
 * ```
 */
export const getStatusText = (status: string | undefined | null): string => {
    if (!status) return "";

    return status
        .split("_")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
};

/**
 * Check if status is considered "active" or "positive"
 *
 * @param status - The status string
 * @returns True if status is positive/active
 *
 * @example
 * ```typescript
 * isActiveStatus('active') // Returns: true
 * isActiveStatus('completed') // Returns: true
 * isActiveStatus('inactive') // Returns: false
 * ```
 */
export const isActiveStatus = (status: string | undefined | null): boolean => {
    if (!status) return false;

    const activeStatuses = [
        "active",
        "enabled",
        "published",
        "approved",
        "completed",
        "paid",
        "delivered",
        "success",
    ];

    return activeStatuses.includes(status.toLowerCase());
};

/**
 * Check if status is considered "inactive" or "negative"
 *
 * @param status - The status string
 * @returns True if status is negative/inactive
 */
export const isInactiveStatus = (status: string | undefined | null): boolean => {
    if (!status) return false;

    const inactiveStatuses = [
        "inactive",
        "disabled",
        "suspended",
        "banned",
        "cancelled",
        "rejected",
        "failed",
        "unpaid",
        "error",
    ];

    return inactiveStatuses.includes(status.toLowerCase());
};

/**
 * Check if status is considered "pending" or "in-progress"
 *
 * @param status - The status string
 * @returns True if status is pending/in-progress
 */
export const isPendingStatus = (status: string | undefined | null): boolean => {
    if (!status) return false;

    const pendingStatuses = [
        "pending",
        "processing",
        "draft",
        "review",
        "shipping",
        "in_progress",
    ];

    return pendingStatuses.includes(status.toLowerCase());
};

/**
 * Get badge class for user activity action
 * @param action - User activity action (create, update, delete, login, logout)
 * @returns Tailwind badge class
 *
 * @example
 * ```typescript
 * const badgeClass = getUserActivityBadgeClass("create_product");
 * // Returns: "badge-success"
 * ```
 */
export const getUserActivityBadgeClass = (
    action: string | undefined | null
): string => {
    if (!action) return "badge-ghost";
    const actionLower = action.toLowerCase();

    if (actionLower.includes("create") || actionLower.includes("add")) return "badge-success";
    if (actionLower.includes("update") || actionLower.includes("edit")) return "badge-info";
    if (actionLower.includes("delete") || actionLower.includes("remove")) return "badge-error";
    if (actionLower.includes("login")) return "badge-primary";
    if (actionLower.includes("logout")) return "badge-warning";

    return "badge-ghost";
};

/**
 * Get badge class for active/inactive status
 * @param isActive - Boolean indicating if item is active
 * @returns Tailwind badge class
 *
 * @example
 * ```typescript
 * const badgeClass = getActiveBadgeClass(true);
 * // Returns: "badge-success"
 * ```
 */
export const getActiveBadgeClass = (
    isActive: boolean | undefined | null
): string => {
    if (isActive === null || isActive === undefined) return "badge-ghost";
    return isActive ? "badge-success" : "badge-warning";
};

/**
 * Get badge class for visible/hidden status
 * @param isVisible - Boolean indicating if item is visible
 * @returns Tailwind badge class
 *
 * @example
 * ```typescript
 * const badgeClass = getVisibleBadgeClass(true);
 * // Returns: "badge-info"
 * ```
 */
export const getVisibleBadgeClass = (
    isVisible: boolean | undefined | null
): string => {
    if (isVisible === null || isVisible === undefined) return "badge-ghost";
    return isVisible ? "badge-info" : "badge-ghost";
};

/**
 * Get badge class for user status
 * @param status - User status (active, suspended, inactive)
 * @returns Tailwind badge class
 *
 * @example
 * ```typescript
 * const badgeClass = getUserStatusBadgeClass("active");
 * // Returns: "badge-success"
 * ```
 */
export const getUserStatusBadgeClass = (
    status: string | undefined | null
): string => {
    if (!status) return "badge-ghost";
    const statusLower = status.toLowerCase();

    if (statusLower === "active") return "badge-success";
    if (statusLower === "suspended") return "badge-warning";
    if (statusLower === "inactive" || statusLower === "banned") return "badge-error";

    return "badge-ghost";
};

/**
 * Order status to badge class mappings
 */
export const ORDER_STATUS_MAP: Record<string, string> = {
    pending: "badge-warning",
    processing: "badge-info",
    completed: "badge-success",
    cancelled: "badge-error",
    on_hold: "badge-warning",
    refunded: "badge-ghost",
};

/**
 * Get badge class for order status
 * @param status - Order status
 * @returns Tailwind badge class
 *
 * @example
 * ```typescript
 * const badgeClass = getOrderStatusBadgeClass("completed");
 * // Returns: "badge-success"
 * ```
 */
export const getOrderStatusBadgeClass = (
    status: string | undefined | null
): string => {
    if (!status) return "badge-ghost";
    const statusLower = status.toLowerCase();
    return ORDER_STATUS_MAP[statusLower] || "badge-ghost";
};

/**
 * Payment status to badge class mappings
 */
export const PAYMENT_STATUS_MAP: Record<string, string> = {
    paid: "badge-success",
    unpaid: "badge-error",
    pending: "badge-warning",
    failed: "badge-error",
    refunded: "badge-ghost",
};

/**
 * Get badge class for payment status
 * @param status - Payment status
 * @returns Tailwind badge class
 *
 * @example
 * ```typescript
 * const badgeClass = getPaymentStatusBadgeClass("paid");
 * // Returns: "badge-success"
 * ```
 */
export const getPaymentStatusBadgeClass = (
    status: string | undefined | null
): string => {
    if (!status) return "badge-ghost";
    const statusLower = status.toLowerCase();
    return PAYMENT_STATUS_MAP[statusLower] || "badge-ghost";
};

/**
 * Customer segment to badge class mappings
 */
export const CUSTOMER_SEGMENT_MAP: Record<string, string> = {
    vip: "badge-error",
    regular: "badge-success",
    new: "badge-info",
    inactive: "badge-ghost",
};

/**
 * Get badge class for customer segment
 * @param segment - Customer segment
 * @returns Tailwind badge class
 *
 * @example
 * ```typescript
 * const badgeClass = getCustomerSegmentBadgeClass("vip");
 * // Returns: "badge-error"
 * ```
 */
export const getCustomerSegmentBadgeClass = (
    segment: string | undefined | null
): string => {
    if (!segment) return "badge-ghost";
    const segmentLower = segment.toLowerCase();
    return CUSTOMER_SEGMENT_MAP[segmentLower] || "badge-ghost";
};

/**
 * Coupon status to badge class mappings
 */
export const COUPON_STATUS_MAP: Record<string, string> = {
    active: "badge-success",
    inactive: "badge-ghost",
    expired: "badge-error",
    scheduled: "badge-info",
};

/**
 * Get badge class for coupon status
 * @param status - Coupon status
 * @returns Tailwind badge class
 *
 * @example
 * ```typescript
 * const badgeClass = getCouponStatusBadgeClass("active");
 * // Returns: "badge-success"
 * ```
 */
export const getCouponStatusBadgeClass = (
    status: string | undefined | null
): string => {
    if (!status) return "badge-ghost";
    const statusLower = status.toLowerCase();
    return COUPON_STATUS_MAP[statusLower] || "badge-ghost";
};
