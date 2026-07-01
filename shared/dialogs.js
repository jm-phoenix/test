/**
 * GuideOS
 * Module: dialogs.js
 * Version: 1.0.0
 * Purpose: Reusable dialog/modal system for GuideOS.
 * Follows CODING_STANDARD.md: No business logic, presentation only.
 */

/**
 * Dialog system for GuideOS.
 * Provides reusable modal dialogs for alerts, confirmations, and custom content.
 * This module manipulates the DOM but only for dialog-related elements.
 */
const Dialogs = (function() {
    'use strict';

    // Dialog container element
    let dialogContainer = null;

    // Currently open dialog
    let currentDialog = null;

    // Dialog types
    const DIALOG_TYPES = {
        INFO: 'info',
        WARNING: 'warning',
        ERROR: 'error',
        CONFIRM: 'confirm',
        CUSTOM: 'custom'
    };

    /**
     * Initialize the dialog system.
     * Creates the dialog container if it doesn't exist.
     */
    function initialize() {
        if (dialogContainer) {
            return;
        }

        // Create dialog container
        dialogContainer = document.getElementById('dialog-container');
        
        if (!dialogContainer) {
            dialogContainer = document.createElement('div');
            dialogContainer.id = 'dialog-container';
            dialogContainer.className = 'dialog-container';
            document.body.appendChild(dialogContainer);
        }

        // Add event listener for backdrop clicks
        dialogContainer.addEventListener('click', function(event) {
            if (event.target === dialogContainer && currentDialog) {
                closeDialog(currentDialog);
            }
        });

        // Add keyboard support
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && currentDialog) {
                // Close on Escape, but allow dialogs to prevent this
                if (currentDialog.closeOnEscape !== false) {
                    closeDialog(currentDialog);
                }
            }
        });
    }

    /**
     * Create a dialog element.
     * @param {Object} options - Dialog options.
     * @returns {HTMLElement} - The dialog element.
     */
    function createDialog(options) {
        const dialog = document.createElement('div');
        dialog.className = 'dialog';
        
        // Set dialog type class
        if (options.type) {
            dialog.classList.add('dialog-' + options.type);
        }

        // Create backdrop
        const backdrop = document.createElement('div');
        backdrop.className = 'dialog-backdrop';
        dialog.appendChild(backdrop);

        // Create dialog content container
        const content = document.createElement('div');
        content.className = 'dialog-content';
        
        // Add title if provided
        if (options.title) {
            const title = document.createElement('h2');
            title.className = 'dialog-title';
            title.textContent = options.title;
            content.appendChild(title);
        }

        // Add message if provided
        if (options.message) {
            const message = document.createElement('p');
            message.className = 'dialog-message';
            message.textContent = options.message;
            content.appendChild(message);
        }

        // Add custom content if provided
        if (options.content) {
            if (typeof options.content === 'string') {
                content.innerHTML += options.content;
            } else if (options.content instanceof HTMLElement) {
                content.appendChild(options.content);
            }
        }

        // Add buttons
        if (options.buttons && options.buttons.length > 0) {
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'dialog-buttons';
            
            options.buttons.forEach(function(button) {
                const btn = document.createElement('button');
                btn.className = 'btn ' + (button.className || 'btn-primary');
                btn.textContent = button.text;
                btn.addEventListener('click', function() {
                    if (button.callback) {
                        button.callback();
                    }
                    if (button.close !== false) {
                        closeDialog(dialog);
                    }
                });
                buttonContainer.appendChild(btn);
            });
            
            content.appendChild(buttonContainer);
        }

        dialog.appendChild(content);
        
        // Store dialog options
        dialog.dialogOptions = options;
        
        return dialog;
    }

    /**
     * Show a dialog.
     * @param {Object} options - Dialog options.
     * @returns {HTMLElement} - The dialog element.
     */
    function showDialog(options) {
        initialize();

        // Default options
        const defaults = {
            type: DIALOG_TYPES.INFO,
            title: '',
            message: '',
            content: null,
            buttons: [],
            closeOnEscape: true,
            closeOnBackdrop: true
        };

        const opts = { ...defaults, ...options };

        // Create dialog
        const dialog = createDialog(opts);
        
        // Add to container
        dialogContainer.appendChild(dialog);
        
        // Focus first button if available
        const firstButton = dialog.querySelector('.dialog-buttons .btn');
        if (firstButton) {
            firstButton.focus();
        }

        // Store as current dialog
        currentDialog = dialog;
        
        // Add backdrop click handler
        if (opts.closeOnBackdrop !== false) {
            dialog.querySelector('.dialog-backdrop').addEventListener('click', function() {
                closeDialog(dialog);
            });
        }

        return dialog;
    }

    /**
     * Close a dialog.
     * @param {HTMLElement} dialog - The dialog to close.
     */
    function closeDialog(dialog) {
        if (!dialog) {
            return;
        }

        // Call onClose callback if provided
        if (dialog.dialogOptions && dialog.dialogOptions.onClose) {
            dialog.dialogOptions.onClose();
        }

        // Remove from DOM
        if (dialog.parentNode) {
            dialog.parentNode.removeChild(dialog);
        }

        // Clear current dialog if it's the one being closed
        if (currentDialog === dialog) {
            currentDialog = null;
        }

        // Restore focus to the element that opened the dialog if possible
        if (dialog.dialogOptions && dialog.dialogOptions.returnFocusTo) {
            const element = dialog.dialogOptions.returnFocusTo;
            if (element && element.focus) {
                element.focus();
            }
        }
    }

    /**
     * Close all open dialogs.
     */
    function closeAllDialogs() {
        if (dialogContainer) {
            const dialogs = dialogContainer.querySelectorAll('.dialog');
            dialogs.forEach(function(dialog) {
                closeDialog(dialog);
            });
        }
        currentDialog = null;
    }

    /**
     * Show an alert dialog.
     * @param {string} message - The message to display.
     * @param {string} title - Optional title.
     * @param {Function} callback - Optional callback when closed.
     */
    function alert(message, title, callback) {
        showDialog({
            type: DIALOG_TYPES.INFO,
            title: title || 'Information',
            message: message,
            buttons: [
                {
                    text: 'OK',
                    className: 'btn-primary',
                    callback: callback
                }
            ]
        });
    }

    /**
     * Show a warning dialog.
     * @param {string} message - The message to display.
     * @param {string} title - Optional title.
     * @param {Function} callback - Optional callback when closed.
     */
    function warning(message, title, callback) {
        showDialog({
            type: DIALOG_TYPES.WARNING,
            title: title || 'Warning',
            message: message,
            buttons: [
                {
                    text: 'OK',
                    className: 'btn-primary',
                    callback: callback
                }
            ]
        });
    }

    /**
     * Show an error dialog.
     * @param {string} message - The message to display.
     * @param {string} title - Optional title.
     * @param {Function} callback - Optional callback when closed.
     */
    function error(message, title, callback) {
        showDialog({
            type: DIALOG_TYPES.ERROR,
            title: title || 'Error',
            message: message,
            buttons: [
                {
                    text: 'OK',
                    className: 'btn-primary',
                    callback: callback
                }
            ]
        });
    }

    /**
     * Show a confirmation dialog.
     * @param {string} message - The message to display.
     * @param {Function} onConfirm - Callback when confirmed.
     * @param {Function} onCancel - Optional callback when cancelled.
     * @param {string} title - Optional title.
     * @param {string} confirmText - Optional confirm button text.
     * @param {string} cancelText - Optional cancel button text.
     */
    function confirm(message, onConfirm, onCancel, title, confirmText, cancelText) {
        showDialog({
            type: DIALOG_TYPES.CONFIRM,
            title: title || 'Confirm',
            message: message,
            buttons: [
                {
                    text: cancelText || 'Cancel',
                    className: 'btn-secondary',
                    callback: onCancel
                },
                {
                    text: confirmText || 'Confirm',
                    className: 'btn-primary',
                    callback: onConfirm
                }
            ]
        });
    }

    /**
     * Show a custom dialog with HTML content.
     * @param {Object} options - Dialog options.
     * @returns {HTMLElement} - The dialog element.
     */
    function custom(options) {
        return showDialog({ ...options, type: DIALOG_TYPES.CUSTOM });
    }

    // Public API
    return {
        initialize: initialize,
        showDialog: showDialog,
        closeDialog: closeDialog,
        closeAllDialogs: closeAllDialogs,
        alert: alert,
        warning: warning,
        error: error,
        confirm: confirm,
        custom: custom,
        DIALOG_TYPES: DIALOG_TYPES
    };
})();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Dialogs;
}
