/**
 * GuideOS Storage Module
 * Version: 1.0.0
 * 
 * Handles all LocalStorage operations for the GuideOS platform.
 * This is the ONLY module allowed to access LocalStorage directly.
 */

/**
 * Storage Module
 * @namespace Storage
 */
const Storage = (function() {
    'use strict';
    
    const PREFIX = 'guideos_';
    
    /**
     * Generate a storage key with the GuideOS prefix
     * @param {string} key - The key to prefix
     * @returns {string} The prefixed key
     * @private
     */
    function _prefixKey(key) {
        return PREFIX + key;
    }
    
    /**
     * Save data to LocalStorage
     * @param {string} key - The key to save under
     * @param {*} value - The value to save (will be JSON serialized)
     * @returns {boolean} True if successful, false otherwise
     */
    function save(key, value) {
        try {
            const prefixedKey = _prefixKey(key);
            const serialized = JSON.stringify(value);
            localStorage.setItem(prefixedKey, serialized);
            return true;
        } catch (error) {
            console.error('Storage save error:', error);
            return false;
        }
    }
    
    /**
     * Load data from LocalStorage
     * @param {string} key - The key to load
     * @param {*} defaultValue - Default value if key doesn't exist
     * @returns {*} The loaded value or default
     */
    function load(key, defaultValue = null) {
        try {
            const prefixedKey = _prefixKey(key);
            const serialized = localStorage.getItem(prefixedKey);
            if (serialized === null) {
                return defaultValue;
            }
            return JSON.parse(serialized);
        } catch (error) {
            console.error('Storage load error:', error);
            return defaultValue;
        }
    }
    
    /**
     * Remove a key from LocalStorage
     * @param {string} key - The key to remove
     * @returns {boolean} True if successful, false otherwise
     */
    function remove(key) {
        try {
            const prefixedKey = _prefixKey(key);
            localStorage.removeItem(prefixedKey);
            return true;
        } catch (error) {
            console.error('Storage remove error:', error);
            return false;
        }
    }
    
    /**
     * Check if a key exists in LocalStorage
     * @param {string} key - The key to check
     * @returns {boolean} True if exists, false otherwise
     */
    function exists(key) {
        try {
            const prefixedKey = _prefixKey(key);
            return localStorage.getItem(prefixedKey) !== null;
        } catch (error) {
            console.error('Storage exists error:', error);
            return false;
        }
    }
    
    /**
     * Clear all GuideOS data from LocalStorage
     * @returns {boolean} True if successful, false otherwise
     */
    function clear() {
        try {
            // Get all keys that start with our prefix
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(PREFIX)) {
                    keysToRemove.push(key);
                }
            }
            
            // Remove all GuideOS keys
            keysToRemove.forEach(key => {
                localStorage.removeItem(key);
            });
            
            return true;
        } catch (error) {
            console.error('Storage clear error:', error);
            return false;
        }
    }
    
    /**
     * Get all keys that start with the GuideOS prefix
     * @returns {string[]} Array of keys (without prefix)
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
            console.error('Storage getAllKeys error:', error);
            return [];
        }
    }
    
    /**
     * Get the raw storage size used by GuideOS
     * @returns {number} Size in bytes
     */
    function getSize() {
        try {
            let size = 0;
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(PREFIX)) {
                    const value = localStorage.getItem(key);
                    size += key.length + value.length;
                }
            }
            return size * 2; // Each character is 2 bytes in UTF-16
        } catch (error) {
            console.error('Storage getSize error:', error);
            return 0;
        }
    }
    
    // Public API
    return {
        save,
        load,
        remove,
        exists,
        clear,
        getAllKeys,
        getSize
    };
})();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Storage;
}
