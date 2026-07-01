/**
 * GuideOS
 * Module: storage.js
 * Version: 1.0.0
 * Purpose: LocalStorage abstraction for GuideOS Viewer and Admin.
 * Follows CODING_STANDARD.md: No DOM manipulation, single responsibility.
 */

/**
 * Storage module for GuideOS.
 * Centralizes all LocalStorage operations to ensure consistency and avoid duplicates.
 * This is the ONLY module allowed to access LocalStorage directly.
 */
const Storage = (function() {
    'use strict';

    // Prefix for all GuideOS storage keys
    const PREFIX = 'GuideOS.';

    /**
     * Save a value to LocalStorage.
     * @param {string} key - The storage key (without prefix).
     * @param {*} value - The value to save (will be stringified if not a string).
     * @returns {boolean} - True if successful, false otherwise.
     */
    function save(key, value) {
        try {
            const fullKey = PREFIX + key;
            const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
            localStorage.setItem(fullKey, stringValue);
            return true;
        } catch (error) {
            console.error('Storage: Failed to save key "' + key + '":', error);
            return false;
        }
    }

    /**
     * Load a value from LocalStorage.
     * @param {string} key - The storage key (without prefix).
     * @param {*} defaultValue - Default value if key does not exist.
     * @returns {*} - The parsed value or defaultValue if not found.
     */
    function load(key, defaultValue) {
        try {
            const fullKey = PREFIX + key;
            const value = localStorage.getItem(fullKey);
            if (value === null) {
                return defaultValue;
            }
            // Try to parse as JSON, fall back to string
            try {
                return JSON.parse(value);
            } catch (e) {
                return value;
            }
        } catch (error) {
            console.error('Storage: Failed to load key "' + key + '":', error);
            return defaultValue;
        }
    }

    /**
     * Remove a value from LocalStorage.
     * @param {string} key - The storage key (without prefix).
     * @returns {boolean} - True if successful, false otherwise.
     */
    function remove(key) {
        try {
            const fullKey = PREFIX + key;
            localStorage.removeItem(fullKey);
            return true;
        } catch (error) {
            console.error('Storage: Failed to remove key "' + key + '":', error);
            return false;
        }
    }

    /**
     * Check if a key exists in LocalStorage.
     * @param {string} key - The storage key (without prefix).
     * @returns {boolean} - True if the key exists, false otherwise.
     */
    function exists(key) {
        try {
            const fullKey = PREFIX + key;
            return localStorage.getItem(fullKey) !== null;
        } catch (error) {
            console.error('Storage: Failed to check key "' + key + '":', error);
            return false;
        }
    }

    /**
     * Clear all GuideOS-related data from LocalStorage.
     * @returns {boolean} - True if successful, false otherwise.
     */
    function clear() {
        try {
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(PREFIX)) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(function(key) {
                localStorage.removeItem(key);
            });
            return true;
        } catch (error) {
            console.error('Storage: Failed to clear:', error);
            return false;
        }
    }

    /**
     * Get all GuideOS-related keys from LocalStorage.
     * @returns {string[]} - Array of keys (without prefix).
     */
    function getAllKeys() {
        try {
            const keys = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(PREFIX)) {
                    keys.push(key.substring(PREFIX.length));
                }
            }
            return keys;
        } catch (error) {
            console.error('Storage: Failed to get all keys:', error);
            return [];
        }
    }

    // Public API
    return {
        save: save,
        load: load,
        remove: remove,
        exists: exists,
        clear: clear,
        getAllKeys: getAllKeys
    };
})();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Storage;
}
