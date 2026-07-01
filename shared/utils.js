/**
 * GuideOS
 * Module: utils.js
 * Version: 1.0.0
 * Purpose: Utility functions for GuideOS.
 * Follows CODING_STANDARD.md: No DOM manipulation, reusable functions.
 */

/**
 * Utility functions for GuideOS.
 * Contains reusable helper functions that do not belong to any specific module.
 */
const Utils = (function() {
    'use strict';

    /**
     * Debounce a function to limit how often it can be called.
     * @param {Function} func - The function to debounce.
     * @param {number} wait - The time to wait in milliseconds.
     * @returns {Function} - The debounced function.
     */
    function debounce(func, wait) {
        let timeoutId = null;
        
        return function() {
            const context = this;
            const args = arguments;
            
            clearTimeout(timeoutId);
            timeoutId = setTimeout(function() {
                func.apply(context, args);
            }, wait);
        };
    }

    /**
     * Throttle a function to limit how often it can be called.
     * @param {Function} func - The function to throttle.
     * @param {number} limit - The maximum number of times the function can be called per second.
     * @returns {Function} - The throttled function.
     */
    function throttle(func, limit) {
        let inThrottle = false;
        
        return function() {
            const context = this;
            const args = arguments;
            
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(function() {
                    inThrottle = false;
                }, 1000 / limit);
            }
        };
    }

    /**
     * Generate a unique ID.
     * @param {string} prefix - Optional prefix for the ID.
     * @returns {string} - A unique ID.
     */
    function generateId(prefix) {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        return (prefix ? prefix + '-' : '') + timestamp + '-' + random;
    }

    /**
     * Format a date for display.
     * @param {Date|string} date - The date to format.
     * @param {string} format - Optional format string (e.g., 'YYYY-MM-DD').
     * @returns {string} - The formatted date.
     */
    function formatDate(date, format) {
        const d = new Date(date);
        
        if (isNaN(d.getTime())) {
            return 'Invalid Date';
        }

        if (!format) {
            return d.toLocaleDateString();
        }

        const pad = function(num) {
            return num.toString().padStart(2, '0');
        };

        const replacements = {
            'YYYY': d.getFullYear(),
            'MM': pad(d.getMonth() + 1),
            'DD': pad(d.getDate()),
            'HH': pad(d.getHours()),
            'mm': pad(d.getMinutes()),
            'ss': pad(d.getSeconds()),
            'MMM': d.toLocaleString('default', { month: 'short' }),
            'MMMM': d.toLocaleString('default', { month: 'long' })
        };

        return format.replace(/YYYY|MM|DD|HH|mm|ss|MMM|MMMM/g, function(match) {
            return replacements[match];
        });
    }

    /**
     * Copy text to the clipboard.
     * @param {string} text - The text to copy.
     * @returns {boolean} - True if successful, false otherwise.
     */
    function copyText(text) {
        if (!text) {
            return false;
        }

        try {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            const success = document.execCommand('copy');
            document.body.removeChild(textarea);
            return success;
        } catch (error) {
            console.error('Utils: Failed to copy text:', error);
            return false;
        }
    }

    /**
     * Escape HTML special characters to prevent XSS.
     * @param {string} text - The text to escape.
     * @returns {string} - The escaped text.
     */
    function escapeHtml(text) {
        if (!text) {
            return '';
        }
        
        const htmlEntities = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '/': '&#x2F;'
        };

        return text.replace(/[&<>"'/]/g, function(char) {
            return htmlEntities[char];
        });
    }

    /**
     * Sanitize a URL to ensure it's safe.
     * @param {string} url - The URL to sanitize.
     * @returns {string|null} - The sanitized URL or null if invalid.
     */
    function sanitizeUrl(url) {
        if (!url) {
            return null;
        }

        try {
            // Basic URL validation
            const parsed = new URL(url.startsWith('http') ? url : 'https://' + url);
            
            // Only allow http, https, and data URLs
            if (!['http:', 'https:', 'data:'].includes(parsed.protocol)) {
                return null;
            }

            return parsed.href;
        } catch (error) {
            return null;
        }
    }

    /**
     * Check if a value is a valid hexadecimal color.
     * @param {string} color - The color to validate.
     * @returns {boolean} - True if valid, false otherwise.
     */
    function isValidHexColor(color) {
        if (!color) {
            return false;
        }
        
        // Match #RGB, #RRGGBB, or #RRGGBBAA
        const hexColorRegex = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/;
        return hexColorRegex.test(color);
    }

    /**
     * Parse a query string into an object.
     * @param {string} query - The query string to parse.
     * @returns {Object} - The parsed query parameters.
     */
    function parseQueryString(query) {
        const params = {};
        
        if (!query) {
            return params;
        }

        // Remove leading '?' if present
        const cleanQuery = query.startsWith('?') ? query.substring(1) : query;
        
        cleanQuery.split('&').forEach(function(pair) {
            const [key, value] = pair.split('=');
            if (key) {
                params[decodeURIComponent(key)] = value ? decodeURIComponent(value) : '';
            }
        });

        return params;
    }

    /**
     * Get query parameters from the current URL.
     * @returns {Object} - The query parameters.
     */
    function getQueryParams() {
        if (typeof window !== 'undefined') {
            return parseQueryString(window.location.search);
        }
        return {};
    }

    /**
     * Calculate the path for a guide based on its ID.
     * @param {string} guideId - The guide ID (8 hex characters).
     * @returns {string} - The path to the guide JSON file.
     */
    function calculateGuidePath(guideId) {
        if (!guideId || guideId.length !== 8) {
            return '';
        }
        
        const prefix = guideId.substring(0, 2).toUpperCase();
        const filename = guideId.toUpperCase() + '.json';
        return 'guides/' + prefix + '/' + filename;
    }

    /**
     * Check if a value is empty (null, undefined, empty string, empty array, empty object).
     * @param {*} value - The value to check.
     * @returns {boolean} - True if empty, false otherwise.
     */
    function isEmpty(value) {
        if (value === null || value === undefined) {
            return true;
        }
        
        if (typeof value === 'string') {
            return value.trim() === '';
        }
        
        if (Array.isArray(value)) {
            return value.length === 0;
        }
        
        if (typeof value === 'object') {
            return Object.keys(value).length === 0;
        }
        
        return false;
    }

    /**
     * Deep clone an object or array.
     * @param {*} obj - The object to clone.
     * @returns {*} - The cloned object.
     */
    function deepClone(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        
        if (Array.isArray(obj)) {
            return obj.map(deepClone);
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
     * Deep merge two objects.
     * @param {Object} target - The target object.
     * @param {Object} source - The source object.
     * @returns {Object} - The merged object.
     */
    function deepMerge(target, source) {
        const output = { ...target };
        
        for (const key in source) {
            if (source.hasOwnProperty(key)) {
                if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                    output[key] = deepMerge(output[key] || {}, source[key]);
                } else {
                    output[key] = source[key];
                }
            }
        }
        
        return output;
    }

    // Public API
    return {
        debounce: debounce,
        throttle: throttle,
        generateId: generateId,
        formatDate: formatDate,
        copyText: copyText,
        escapeHtml: escapeHtml,
        sanitizeUrl: sanitizeUrl,
        isValidHexColor: isValidHexColor,
        parseQueryString: parseQueryString,
        getQueryParams: getQueryParams,
        calculateGuidePath: calculateGuidePath,
        isEmpty: isEmpty,
        deepClone: deepClone,
        deepMerge: deepMerge
    };
})();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}
