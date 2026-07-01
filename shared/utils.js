/**
 * GuideOS Utilities Module
 * Version: 1.0.0
 * 
 * Common utility functions used throughout the GuideOS platform.
 */

/**
 * Utilities Module
 * @namespace Utils
 */
const Utils = (function() {
    'use strict';
    
    /**
     * Debounce a function to limit how often it can be called
     * @param {Function} func - The function to debounce
     * @param {number} wait - The time to wait in milliseconds
     * @returns {Function} The debounced function
     */
    function debounce(func, wait) {
        let timeoutId = null;
        
        return function(...args) {
            const context = this;
            clearTimeout(timeoutId);
            
            timeoutId = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }
    
    /**
     * Throttle a function to limit how often it can be called
     * @param {Function} func - The function to throttle
     * @param {number} limit - The maximum number of times the function can be called per second
     * @returns {Function} The throttled function
     */
    function throttle(func, limit) {
        let inThrottle = false;
        
        return function(...args) {
            const context = this;
            
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                
                setTimeout(() => {
                    inThrottle = false;
                }, 1000 / limit);
            }
        };
    }
    
    /**
     * Generate a unique ID
     * @param {string} prefix - Optional prefix for the ID
     * @returns {string} A unique ID
     */
    function generateId(prefix = '') {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        return prefix + timestamp + random;
    }
    
    /**
     * Format a date for display
     * @param {Date|string|number} date - The date to format
     * @param {string} format - Optional format string
     * @returns {string} Formatted date string
     */
    function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
        const d = new Date(date);
        
        const pad = (num) => num.toString().padStart(2, '0');
        
        const replacements = {
            'YYYY': d.getFullYear(),
            'MM': pad(d.getMonth() + 1),
            'DD': pad(d.getDate()),
            'HH': pad(d.getHours()),
            'mm': pad(d.getMinutes()),
            'ss': pad(d.getSeconds()),
            'YY': d.getFullYear().toString().substring(2)
        };
        
        let result = format;
        for (const [key, value] of Object.entries(replacements)) {
            result = result.replace(new RegExp(key, 'g'), value);
        }
        
        return result;
    }
    
    /**
     * Copy text to clipboard
     * @param {string} text - The text to copy
     * @returns {Promise<boolean>} True if successful
     */
    function copyText(text) {
        return new Promise((resolve) => {
            try {
                // Use modern clipboard API if available
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(text).then(() => {
                        resolve(true);
                    }).catch(() => {
                        resolve(false);
                    });
                    return;
                }
                
                // Fallback for older browsers
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                
                try {
                    const success = document.execCommand('copy');
                    resolve(success);
                } catch (err) {
                    resolve(false);
                }
                
                document.body.removeChild(textarea);
            } catch (error) {
                resolve(false);
            }
        });
    }
    
    /**
     * Escape HTML special characters
     * @param {string} text - The text to escape
     * @returns {string} Escaped text
     */
    function escapeHtml(text) {
        if (typeof text !== 'string') {
            return String(text);
        }
        
        const htmlEntities = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        
        return text.replace(/[&<>"']/g, char => htmlEntities[char]);
    }
    
    /**
     * Unescape HTML entities
     * @param {string} text - The text to unescape
     * @returns {string} Unescaped text
     */
    function unescapeHtml(text) {
        if (typeof text !== 'string') {
            return String(text);
        }
        
        const htmlEntities = {
            '&amp;': '&',
            '&lt;': '<',
            '&gt;': '>',
            '&quot;': '"',
            '&#39;': "'"
        };
        
        return text.replace(/&amp;|&lt;|&gt;|&quot;|&#39;/g, entity => htmlEntities[entity]);
    }
    
    /**
     * Check if a value is a valid hexadecimal color
     * @param {string} color - The color string to check
     * @returns {boolean} True if valid hex color
     */
    function isValidHexColor(color) {
        if (typeof color !== 'string') {
            return false;
        }
        
        // Match #RGB, #RRGGBB, or #RRGGBBAA
        const hexColorRegex = /^#([A-Fa-f0-9]{3,4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/;
        return hexColorRegex.test(color);
    }
    
    /**
     * Check if a string is a valid Guide ID
     * @param {string} id - The ID to check
     * @returns {boolean} True if valid Guide ID
     */
    function isValidGuideId(id) {
        if (typeof id !== 'string') {
            return false;
        }
        
        // Guide ID must be exactly 8 uppercase hexadecimal characters
        return /^[0-9A-F]{8}$/.test(id);
    }
    
    /**
     * Get URL parameter by name
     * @param {string} name - The parameter name
     * @param {string} url - Optional URL to parse (defaults to current URL)
     * @returns {string|null} The parameter value or null
     */
    function getUrlParam(name, url = window.location.href) {
        const urlObj = new URL(url);
        return urlObj.searchParams.get(name);
    }
    
    /**
     * Set URL parameter
     * @param {string} name - The parameter name
     * @param {string} value - The parameter value
     * @returns {string} The new URL
     */
    function setUrlParam(name, value) {
        const urlObj = new URL(window.location.href);
        urlObj.searchParams.set(name, value);
        return urlObj.toString();
    }
    
    /**
     * Remove URL parameter
     * @param {string} name - The parameter name
     * @returns {string} The new URL
     */
    function removeUrlParam(name) {
        const urlObj = new URL(window.location.href);
        urlObj.searchParams.delete(name);
        return urlObj.toString();
    }
    
    /**
     * Check if an object is empty
     * @param {Object} obj - The object to check
     * @returns {boolean} True if empty
     */
    function isEmpty(obj) {
        if (obj === null || obj === undefined) {
            return true;
        }
        
        if (typeof obj === 'object') {
            return Object.keys(obj).length === 0;
        }
        
        if (typeof obj === 'string') {
            return obj.trim() === '';
        }
        
        return false;
    }
    
    /**
     * Deep clone an object
     * @param {*} obj - The object to clone
     * @returns {*} The cloned object
     */
    function deepClone(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        
        if (Array.isArray(obj)) {
            return obj.map(item => deepClone(item));
        }
        
        const cloned = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                cloned[key] = deepClone(obj[key]);
            }
        }
        return cloned;
    }
    
    /**
     * Deep merge objects
     * @param {...Object} objects - Objects to merge
     * @returns {Object} Merged object
     */
    function deepMerge(...objects) {
        const result = {};
        
        for (const obj of objects) {
            if (!obj || typeof obj !== 'object') {
                continue;
            }
            
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (typeof obj[key] === 'object' && obj[key] !== null && 
                        typeof result[key] === 'object' && result[key] !== null) {
                        result[key] = deepMerge(result[key], obj[key]);
                    } else {
                        result[key] = obj[key];
                    }
                }
            }
        }
        
        return result;
    }
    
    /**
     * Check if two values are deeply equal
     * @param {*} a - First value
     * @param {*} b - Second value
     * @returns {boolean} True if deeply equal
     */
    function deepEqual(a, b) {
        if (a === b) {
            return true;
        }
        
        if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) {
            return false;
        }
        
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
        
        if (keysA.length !== keysB.length) {
            return false;
        }
        
        for (const key of keysA) {
            if (!keysB.includes(key) || !deepEqual(a[key], b[key])) {
                return false;
            }
        }
        
        return true;
    }
    
    // Public API
    return {
        debounce,
        throttle,
        generateId,
        formatDate,
        copyText,
        escapeHtml,
        unescapeHtml,
        isValidHexColor,
        isValidGuideId,
        getUrlParam,
        setUrlParam,
        removeUrlParam,
        isEmpty,
        deepClone,
        deepMerge,
        deepEqual
    };
})();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}
