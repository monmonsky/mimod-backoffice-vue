/**
 * Delete Confirmation Composable
 *
 * Reusable composable for handling delete confirmation dialogs.
 * Eliminates duplicate delete modal logic across table components.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * const { deleteProduct } = useProducts();
 * const { data: productsResponse, refresh } = getProducts();
 *
 * const {
 *   confirmDelete,
 *   itemToDelete,
 *   isDeleting,
 *   openDeleteModal,
 *   closeDeleteModal,
 *   handleDelete,
 * } = useDeleteConfirmation(
 *   deleteProduct,
 *   'product',
 *   refresh
 * );
 * </script>
 *
 * <template>
 *   <!-- Trigger button -->
 *   <button @click="openDeleteModal(product.id)">Delete</button>
 *
 *   <!-- Delete confirmation modal -->
 *   <dialog :open="confirmDelete" class="modal">
 *     <div class="modal-box">
 *       <h3>Delete Product?</h3>
 *       <p>Are you sure you want to delete this product?</p>
 *       <div class="modal-action">
 *         <button @click="closeDeleteModal">Cancel</button>
 *         <button @click="handleDelete" :disabled="isDeleting">
 *           {{ isDeleting ? 'Deleting...' : 'Delete' }}
 *         </button>
 *       </div>
 *     </div>
 *   </dialog>
 * </template>
 * ```
 */

import { getErrorMessage } from "~/utils/errorHandlers";

export interface DeleteConfirmationOptions {
    /**
     * Custom success message (default: "{EntityName} deleted successfully!")
     */
    successMessage?: string;

    /**
     * Custom error message (default: "Failed to delete {entityName}")
     */
    errorMessage?: string;

    /**
     * Called before delete (can be async)
     * Return false to cancel delete
     */
    beforeDelete?: (id: any) => boolean | Promise<boolean>;

    /**
     * Called after successful delete
     */
    afterDelete?: (id: any) => void | Promise<void>;

    /**
     * Log errors to console
     */
    logErrors?: boolean;
}

/**
 * Delete confirmation composable
 *
 * @param deleteFunction - Async function that deletes the item (receives item ID)
 * @param entityName - Name of the entity being deleted (e.g., "product", "customer")
 * @param refreshFunction - Optional function to refresh data after delete
 * @param options - Additional configuration options
 * @returns Object with refs and methods for delete confirmation
 */
export const useDeleteConfirmation = <TId = number>(
    deleteFunction: (id: TId) => Promise<any>,
    entityName: string = "item",
    refreshFunction?: () => Promise<void> | void,
    options: DeleteConfirmationOptions = {}
) => {
    const { success, error: showError } = useToast();

    // State
    const confirmDelete = ref(false);
    const itemToDelete = ref<TId | null>(null);
    const isDeleting = ref(false);

    // Options with defaults
    const {
        successMessage = `${entityName.charAt(0).toUpperCase() + entityName.slice(1)} deleted successfully!`,
        errorMessage = `Failed to delete ${entityName}`,
        beforeDelete,
        afterDelete,
        logErrors = import.meta.dev,
    } = options;

    /**
     * Open delete confirmation modal
     *
     * @param id - ID of the item to delete
     */
    const openDeleteModal = (id: TId) => {
        itemToDelete.value = id;
        confirmDelete.value = true;
    };

    /**
     * Close delete confirmation modal and reset state
     */
    const closeDeleteModal = () => {
        confirmDelete.value = false;
        itemToDelete.value = null;
    };

    /**
     * Handle delete action
     */
    const handleDelete = async () => {
        if (!itemToDelete.value) {
            console.warn("No item selected for deletion");
            return;
        }

        try {
            // Call beforeDelete hook if provided
            if (beforeDelete) {
                const shouldContinue = await beforeDelete(itemToDelete.value);
                if (shouldContinue === false) {
                    closeDeleteModal();
                    return;
                }
            }

            isDeleting.value = true;

            // Perform delete
            await deleteFunction(itemToDelete.value);

            // Show success message
            success(successMessage);

            // Call afterDelete hook if provided
            if (afterDelete) {
                await afterDelete(itemToDelete.value);
            }

            // Close modal and reset
            closeDeleteModal();

            // Refresh data if refresh function provided
            if (refreshFunction) {
                await refreshFunction();
            }
        } catch (err: any) {
            // Log error if enabled
            if (logErrors) {
                console.error(`Delete ${entityName} error:`, err);
            }

            // Extract and show error message
            const message = getErrorMessage(err, errorMessage);
            showError(message);
        } finally {
            isDeleting.value = false;
        }
    };

    return {
        // State
        confirmDelete,
        itemToDelete,
        isDeleting,

        // Methods
        openDeleteModal,
        closeDeleteModal,
        handleDelete,
    };
};

/**
 * Bulk delete confirmation composable
 *
 * Similar to useDeleteConfirmation but for deleting multiple items at once.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * const { deleteProducts } = useProducts(); // Assumes bulk delete endpoint
 *
 * const {
 *   confirmDelete,
 *   itemsToDelete,
 *   isDeleting,
 *   openBulkDeleteModal,
 *   handleBulkDelete,
 * } = useBulkDeleteConfirmation(
 *   deleteProducts,
 *   'products',
 *   refresh
 * );
 * </script>
 *
 * <template>
 *   <button @click="openBulkDeleteModal([1, 2, 3])">
 *     Delete Selected (3)
 *   </button>
 * </template>
 * ```
 */
export const useBulkDeleteConfirmation = <TId = number>(
    bulkDeleteFunction: (ids: TId[]) => Promise<any>,
    entityName: string = "items",
    refreshFunction?: () => Promise<void> | void,
    options: DeleteConfirmationOptions = {}
) => {
    const { success, error: showError } = useToast();

    // State
    const confirmDelete = ref(false);
    const itemsToDelete = ref<TId[]>([]);
    const isDeleting = ref(false);

    // Options with defaults
    const {
        successMessage,
        errorMessage = `Failed to delete ${entityName}`,
        beforeDelete,
        afterDelete,
        logErrors = import.meta.dev,
    } = options;

    /**
     * Open bulk delete confirmation modal
     *
     * @param ids - Array of item IDs to delete
     */
    const openBulkDeleteModal = (ids: TId[]) => {
        itemsToDelete.value = ids;
        confirmDelete.value = true;
    };

    /**
     * Close bulk delete confirmation modal
     */
    const closeBulkDeleteModal = () => {
        confirmDelete.value = false;
        itemsToDelete.value = [];
    };

    /**
     * Handle bulk delete action
     */
    const handleBulkDelete = async () => {
        if (!itemsToDelete.value || itemsToDelete.value.length === 0) {
            console.warn("No items selected for deletion");
            return;
        }

        try {
            // Call beforeDelete hook if provided
            if (beforeDelete) {
                const shouldContinue = await beforeDelete(itemsToDelete.value as any);
                if (shouldContinue === false) {
                    closeBulkDeleteModal();
                    return;
                }
            }

            isDeleting.value = true;

            // Perform bulk delete
            await bulkDeleteFunction(itemsToDelete.value);

            // Show success message
            const count = itemsToDelete.value.length;
            const message = successMessage || `${count} ${entityName} deleted successfully!`;
            success(message);

            // Call afterDelete hook if provided
            if (afterDelete) {
                await afterDelete(itemsToDelete.value as any);
            }

            // Close modal and reset
            closeBulkDeleteModal();

            // Refresh data if refresh function provided
            if (refreshFunction) {
                await refreshFunction();
            }
        } catch (err: any) {
            // Log error if enabled
            if (logErrors) {
                console.error(`Bulk delete ${entityName} error:`, err);
            }

            // Extract and show error message
            const message = getErrorMessage(err, errorMessage);
            showError(message);
        } finally {
            isDeleting.value = false;
        }
    };

    return {
        // State
        confirmDelete,
        itemsToDelete,
        isDeleting,

        // Computed
        deleteCount: computed(() => itemsToDelete.value.length),

        // Methods
        openBulkDeleteModal,
        closeBulkDeleteModal,
        handleBulkDelete,
    };
};
