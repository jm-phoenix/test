/**
 * GuideOS Dialogs Module
 * Version: 1.0.0
 * 
 * Provides reusable dialog infrastructure for the GuideOS platform.
 */

/**
 * Dialogs Module
 * @namespace Dialogs
 */
const Dialogs = (function() {
    'use strict';
    
    // Dialog container
    let dialogContainer = null;
    
    // Current dialog stack
    const dialogStack = [];
    
    /**
     * Create the dialog container if it doesn't exist
     * @private
     */
    function _ensureContainer() {
        if (dialogContainer && document.body.contains(dialogContainer)) {
            return;
        }
        
        dialogContainer = document.createElement('div');
        dialogContainer.id = 'guideos-dialog-container';
        dialogContainer.className = 'guideos-dialog-container';
        dialogContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;
        `;
        
        document.body.appendChild(dialogContainer);
    }
    
    /**
     * Create a dialog element
     * @param {string} type - Dialog type (alert, confirm, prompt, custom)
     * @param {Object} options - Dialog options
     * @returns {HTMLElement} The dialog element
     * @private
     */
    function _createDialog(type, options) {
        const dialog = document.createElement('div');
        dialog.className = `guideos-dialog guideos-dialog-${type}`;
        dialog.setAttribute('role', 'dialog');
        dialog.setAttribute('aria-modal', 'true');
        dialog.setAttribute('aria-labelledby', `${type}-title`);
        
        // Apply theme
        dialog.style.cssText = `
            background-color: var(--surface-color);
            color: var(--text-color);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            padding: var(--spacing-lg);
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: var(--shadow-lg);
            pointer-events: auto;
            animation: fadeIn 0.2s ease;
        `;
        
        return dialog;
    }
    
    /**
     * Create a button element
     * @param {string} text - Button text
     * @param {Function} onClick - Click handler
     * @param {string} type - Button type (primary, secondary, danger)
     * @returns {HTMLElement} The button element
     * @private
     */
    function _createButton(text, onClick, type = 'primary') {
        const button = document.createElement('button');
        button.className = `guideos-btn guideos-btn-${type}`;
        button.textContent = text;
        button.addEventListener('click', onClick);
        
        button.style.cssText = `
            padding: var(--spacing-sm) var(--spacing-lg);
            margin: 0 var(--spacing-xs);
            border: none;
            border-radius: var(--border-radius);
            cursor: pointer;
            font-size: var(--font-size-md);
            transition: all var(--transition-fast);
        `;
        
        if (type === 'primary') {
            button.style.cssText += `
                background-color: var(--primary-color);
                color: white;
            `;
        } else if (type === 'secondary') {
            button.style.cssText += `
                background-color: var(--surface-color);
                color: var(--text-color);
                border: 1px solid var(--border-color);
            `;
        } else if (type === 'danger') {
            button.style.cssText += `
                background-color: var(--danger-color);
                color: white;
            `;
        }
        
        button.addEventListener('mouseenter', () => {
            if (type === 'primary') {
                button.style.backgroundColor = 'var(--secondary-color)';
            } else if (type === 'secondary') {
                button.style.backgroundColor = 'var(--background-color)';
            }
        });
        
        button.addEventListener('mouseleave', () => {
            if (type === 'primary') {
                button.style.backgroundColor = 'var(--primary-color)';
            } else if (type === 'secondary') {
                button.style.backgroundColor = 'var(--surface-color)';
            }
        });
        
        return button;
    }
    
    /**
     * Show a dialog
     * @param {HTMLElement} dialog - The dialog element
     * @param {Function} onClose - Close callback
     * @private
     */
    function _showDialog(dialog, onClose) {
        _ensureContainer();
        
        // Add overlay
        const overlay = document.createElement('div');
        overlay.className = 'guideos-dialog-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 999;
            pointer-events: auto;
        `;
        overlay.addEventListener('click', onClose);
        
        dialogContainer.appendChild(overlay);
        dialogContainer.appendChild(dialog);
        
        // Focus first focusable element
        const focusableElements = dialog.querySelectorAll('button, input, textarea, select, [tabindex]');
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
        
        // Add to stack
        dialogStack.push({ dialog, overlay, onClose });
        
        // Trap focus
        _trapFocus(dialog);
    }
    
    /**
     * Close the current dialog
     * @private
     */
    function _closeDialog() {
        if (dialogStack.length === 0) {
            return;
        }
        
        const { dialog, overlay, onClose } = dialogStack.pop();
        
        if (overlay && dialogContainer.contains(overlay)) {
            dialogContainer.removeChild(overlay);
        }
        
        if (dialog && dialogContainer.contains(dialog)) {
            dialogContainer.removeChild(dialog);
        }
        
        // Restore focus to previous element
        if (dialogStack.length > 0) {
            const prevDialog = dialogStack[dialogStack.length - 1].dialog;
            const focusableElements = prevDialog.querySelectorAll('button, input, textarea, select, [tabindex]');
            if (focusableElements.length > 0) {
                focusableElements[0].focus();
            }
        }
        
        if (onClose) {
            onClose();
        }
    }
    
    /**
     * Trap focus within a dialog
     * @param {HTMLElement} dialog - The dialog element
     * @private
     */
    function _trapFocus(dialog) {
        const focusableElements = dialog.querySelectorAll('button, input, textarea, select, [tabindex]');
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        dialog.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }
            
            if (e.key === 'Escape') {
                _closeDialog();
            }
        });
    }
    
    /**
     * Show an alert dialog
     * @param {string} title - Dialog title
     * @param {string} message - Dialog message
     * @param {string} buttonText - Button text (default: 'OK')
     * @returns {Promise<void>} Resolves when dialog is closed
     */
    function alert(title, message, buttonText = 'OK') {
        return new Promise((resolve) => {
            const dialog = _createDialog('alert', { title, message });
            
            const titleEl = document.createElement('h2');
            titleEl.id = 'alert-title';
            titleEl.textContent = title;
            titleEl.style.cssText = `
                margin-bottom: var(--spacing-md);
                font-size: var(--font-size-lg);
            `;
            
            const messageEl = document.createElement('p');
            messageEl.textContent = message;
            messageEl.style.cssText = `
                margin-bottom: var(--spacing-lg);
                color: var(--text-secondary);
            `;
            
            const button = _createButton(buttonText, () => {
                _closeDialog();
                resolve();
            }, 'primary');
            
            dialog.appendChild(titleEl);
            dialog.appendChild(messageEl);
            dialog.appendChild(button);
            
            _showDialog(dialog, () => {
                resolve();
            });
        });
    }
    
    /**
     * Show a confirmation dialog
     * @param {string} title - Dialog title
     * @param {string} message - Dialog message
     * @param {string} confirmText - Confirm button text (default: 'OK')
     * @param {string} cancelText - Cancel button text (default: 'Cancel')
     * @returns {Promise<boolean>} Resolves with true if confirmed, false if cancelled
     */
    function confirm(title, message, confirmText = 'OK', cancelText = 'Cancel') {
        return new Promise((resolve) => {
            const dialog = _createDialog('confirm', { title, message });
            
            const titleEl = document.createElement('h2');
            titleEl.id = 'confirm-title';
            titleEl.textContent = title;
            titleEl.style.cssText = `
                margin-bottom: var(--spacing-md);
                font-size: var(--font-size-lg);
            `;
            
            const messageEl = document.createElement('p');
            messageEl.textContent = message;
            messageEl.style.cssText = `
                margin-bottom: var(--spacing-lg);
                color: var(--text-secondary);
            `;
            
            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = `
                display: flex;
                justify-content: flex-end;
                gap: var(--spacing-sm);
            `;
            
            const cancelBtn = _createButton(cancelText, () => {
                _closeDialog();
                resolve(false);
            }, 'secondary');
            
            const confirmBtn = _createButton(confirmText, () => {
                _closeDialog();
                resolve(true);
            }, 'primary');
            
            buttonContainer.appendChild(cancelBtn);
            buttonContainer.appendChild(confirmBtn);
            
            dialog.appendChild(titleEl);
            dialog.appendChild(messageEl);
            dialog.appendChild(buttonContainer);
            
            _showDialog(dialog, () => {
                resolve(false);
            });
        });
    }
    
    /**
     * Show a warning dialog
     * @param {string} title - Dialog title
     * @param {string} message - Dialog message
     * @param {string} buttonText - Button text (default: 'OK')
     * @returns {Promise<void>} Resolves when dialog is closed
     */
    function warning(title, message, buttonText = 'OK') {
        return new Promise((resolve) => {
            const dialog = _createDialog('warning', { title, message });
            
            const titleEl = document.createElement('h2');
            titleEl.id = 'warning-title';
            titleEl.textContent = title;
            titleEl.style.cssText = `
                margin-bottom: var(--spacing-md);
                font-size: var(--font-size-lg);
                color: var(--warning-color);
            `;
            
            const messageEl = document.createElement('p');
            messageEl.textContent = message;
            messageEl.style.cssText = `
                margin-bottom: var(--spacing-lg);
                color: var(--text-secondary);
            `;
            
            const button = _createButton(buttonText, () => {
                _closeDialog();
                resolve();
            }, 'primary');
            
            dialog.appendChild(titleEl);
            dialog.appendChild(messageEl);
            dialog.appendChild(button);
            
            _showDialog(dialog, () => {
                resolve();
            });
        });
    }
    
    /**
     * Show an error dialog
     * @param {string} title - Dialog title
     * @param {string} message - Dialog message
     * @param {string} buttonText - Button text (default: 'OK')
     * @returns {Promise<void>} Resolves when dialog is closed
     */
    function error(title, message, buttonText = 'OK') {
        return new Promise((resolve) => {
            const dialog = _createDialog('error', { title, message });
            
            const titleEl = document.createElement('h2');
            titleEl.id = 'error-title';
            titleEl.textContent = title;
            titleEl.style.cssText = `
                margin-bottom: var(--spacing-md);
                font-size: var(--font-size-lg);
                color: var(--danger-color);
            `;
            
            const messageEl = document.createElement('p');
            messageEl.textContent = message;
            messageEl.style.cssText = `
                margin-bottom: var(--spacing-lg);
                color: var(--text-secondary);
            `;
            
            const button = _createButton(buttonText, () => {
                _closeDialog();
                resolve();
            }, 'primary');
            
            dialog.appendChild(titleEl);
            dialog.appendChild(messageEl);
            dialog.appendChild(button);
            
            _showDialog(dialog, () => {
                resolve();
            });
        });
    }
    
    /**
     * Show a prompt dialog
     * @param {string} title - Dialog title
     * @param {string} message - Dialog message
     * @param {string} defaultValue - Default input value
     * @param {string} confirmText - Confirm button text (default: 'OK')
     * @param {string} cancelText - Cancel button text (default: 'Cancel')
     * @returns {Promise<string|null>} Resolves with the input value or null if cancelled
     */
    function prompt(title, message, defaultValue = '', confirmText = 'OK', cancelText = 'Cancel') {
        return new Promise((resolve) => {
            const dialog = _createDialog('prompt', { title, message });
            
            const titleEl = document.createElement('h2');
            titleEl.id = 'prompt-title';
            titleEl.textContent = title;
            titleEl.style.cssText = `
                margin-bottom: var(--spacing-md);
                font-size: var(--font-size-lg);
            `;
            
            const messageEl = document.createElement('p');
            messageEl.textContent = message;
            messageEl.style.cssText = `
                margin-bottom: var(--spacing-md);
                color: var(--text-secondary);
            `;
            
            const input = document.createElement('input');
            input.type = 'text';
            input.value = defaultValue;
            input.style.cssText = `
                width: 100%;
                padding: var(--spacing-sm) var(--spacing-md);
                margin-bottom: var(--spacing-lg);
                border: 1px solid var(--border-color);
                border-radius: var(--border-radius);
                font-size: var(--font-size-md);
                color: var(--text-color);
                background-color: var(--surface-color);
            `;
            
            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = `
                display: flex;
                justify-content: flex-end;
                gap: var(--spacing-sm);
            `;
            
            const cancelBtn = _createButton(cancelText, () => {
                _closeDialog();
                resolve(null);
            }, 'secondary');
            
            const confirmBtn = _createButton(confirmText, () => {
                _closeDialog();
                resolve(input.value);
            }, 'primary');
            
            buttonContainer.appendChild(cancelBtn);
            buttonContainer.appendChild(confirmBtn);
            
            dialog.appendChild(titleEl);
            dialog.appendChild(messageEl);
            dialog.appendChild(input);
            dialog.appendChild(buttonContainer);
            
            _showDialog(dialog, () => {
                resolve(null);
            });
            
            // Focus input
            input.focus();
        });
    }
    
    /**
     * Show a custom dialog
     * @param {Object} options - Dialog options
     * @param {string} options.title - Dialog title
     * @param {HTMLElement|string} options.content - Dialog content (HTML element or string)
     * @param {Array} options.buttons - Array of button configurations
     * @returns {Promise<number>} Resolves with the index of the clicked button
     */
    function custom(options) {
        return new Promise((resolve) => {
            const dialog = _createDialog('custom', options);
            
            const titleEl = document.createElement('h2');
            titleEl.id = 'custom-title';
            titleEl.textContent = options.title || '';
            titleEl.style.cssText = `
                margin-bottom: var(--spacing-md);
                font-size: var(--font-size-lg);
            `;
            
            const contentEl = document.createElement('div');
            contentEl.className = 'guideos-dialog-content';
            contentEl.style.cssText = `
                margin-bottom: var(--spacing-lg);
                color: var(--text-secondary);
            `;
            
            if (typeof options.content === 'string') {
                contentEl.innerHTML = options.content;
            } else if (options.content instanceof HTMLElement) {
                contentEl.appendChild(options.content);
            }
            
            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = `
                display: flex;
                justify-content: flex-end;
                gap: var(--spacing-sm);
            `;
            
            (options.buttons || []).forEach((btn, index) => {
                const button = _createButton(
                    btn.text || 'Button',
                    () => {
                        _closeDialog();
                        resolve(index);
                        if (btn.onClick) btn.onClick();
                    },
                    btn.type || 'secondary'
                );
                buttonContainer.appendChild(button);
            });
            
            dialog.appendChild(titleEl);
            dialog.appendChild(contentEl);
            dialog.appendChild(buttonContainer);
            
            _showDialog(dialog, () => {
                resolve(-1);
            });
        });
    }
    
    /**
     * Close all open dialogs
     */
    function closeAll() {
        while (dialogStack.length > 0) {
            _closeDialog();
        }
    }
    
    // Public API
    return {
        alert,
        confirm,
        warning,
        error,
        prompt,
        custom,
        closeAll
    };
})();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Dialogs;
}
