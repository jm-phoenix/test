/**
 * GuideOS
 * Module: theme.js
 * Version: 1.0.0
 * Purpose: Theme Engine for GuideOS Viewer and Admin.
 * Follows CODING_STANDARD.md: No DOM manipulation, single responsibility.
 */

/**
 * Theme Engine for GuideOS.
 * Manages light/dark mode, manufacturer themes, and CSS variable application.
 * This module does NOT manipulate the DOM directly. It provides theme data and
 * relies on the caller to apply styles.
 */
const Theme = (function() {
    'use strict';

    // Default Theme Colors (Light Mode)
    const DEFAULT_THEME = {
        // Base Colors
        backgroundColor: '#f8f9fa',
        surfaceColor: '#ffffff',
        textColor: '#212529',
        textSecondary: '#6c757d',
        textMuted: '#adaeaf',
        borderColor: '#dee2e6',
        
        // Primary Colors
        primaryColor: '#0054a6',
        secondaryColor: '#6c757d',
        accentColor: '#007bff',
        
        // Card Colors
        cardBackground: '#ffffff',
        cardBorder: '#dee2e6',
        
        // Warning Colors
        warningColor: '#ffc107',
        warningBackground: '#fff3cd',
        warningBorder: '#ffeeba',
        
        // Danger Colors
        dangerColor: '#dc3545',
        dangerBackground: '#f8d7da',
        dangerBorder: '#f5c6cb',
        
        // Success Colors
        successColor: '#28a745',
        successBackground: '#d4edda',
        successBorder: '#c3e6cb',
        
        // Information Colors
        informationColor: '#17a2b8',
        informationBackground: '#d1ecf1',
        informationBorder: '#bee5eb'
    };

    // Dark Mode Theme Colors
    const DARK_THEME = {
        // Base Colors
        backgroundColor: '#1a1a1a',
        surfaceColor: '#2d2d2d',
        textColor: '#e0e0e0',
        textSecondary: '#a0a0a0',
        textMuted: '#606060',
        borderColor: '#404040',
        
        // Primary Colors (same as light mode for consistency)
        primaryColor: '#0054a6',
        secondaryColor: '#6c757d',
        accentColor: '#007bff',
        
        // Card Colors
        cardBackground: '#2d2d2d',
        cardBorder: '#404040',
        
        // Warning Colors (same as light mode)
        warningColor: '#ffc107',
        warningBackground: '#3a3520',
        warningBorder: '#5a4a20',
        
        // Danger Colors
        dangerColor: '#dc3545',
        dangerBackground: '#3a2020',
        dangerBorder: '#5a2a2a',
        
        // Success Colors
        successColor: '#28a745',
        successBackground: '#203a20',
        successBorder: '#2a5a2a',
        
        // Information Colors
        informationColor: '#17a2b8',
        informationBackground: '#203a3a',
        informationBorder: '#2a5a5a'
    };

    // Manufacturer Theme (example: Wilden)
    const MANUFACTURER_THEME = {
        primaryColor: '#0054a6',
        secondaryColor: '#6c757d',
        accentColor: '#007bff',
        backgroundColor: '#f0f4f8',
        surfaceColor: '#ffffff',
        textColor: '#1a1a1a',
        logo: 'assets/logos/wilden.png'
    };

    // Current theme state
    let currentTheme = 'light';
    let manufacturerThemeEnabled = false;

    /**
     * Initialize the Theme Engine.
     * Loads saved preferences from storage.
     * @param {Object} storage - The Storage module instance.
     */
    function initialize(storage) {
        // Load saved theme preferences
        const savedTheme = storage.load('Theme', 'light');
        const savedManufacturerTheme = storage.load('ManufacturerTheme', false);
        
        currentTheme = savedTheme;
        manufacturerThemeEnabled = savedManufacturerTheme;
        
        // Apply the theme
        applyTheme();
    }

    /**
     * Get the current theme name.
     * @returns {string} - 'light' or 'dark'.
     */
    function getCurrentTheme() {
        return currentTheme;
    }

    /**
     * Get the current manufacturer theme state.
     * @returns {boolean} - True if manufacturer theme is enabled.
     */
    function isManufacturerThemeEnabled() {
        return manufacturerThemeEnabled;
    }

    /**
     * Toggle between light and dark mode.
     * @returns {string} - The new theme ('light' or 'dark').
     */
    function toggleDarkMode() {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme();
        return currentTheme;
    }

    /**
     * Enable or disable manufacturer theme.
     * @param {boolean} enable - True to enable, false to disable.
     * @returns {boolean} - The new state.
     */
    function toggleManufacturerTheme(enable) {
        manufacturerThemeEnabled = typeof enable === 'boolean' ? enable : !manufacturerThemeEnabled;
        applyTheme();
        return manufacturerThemeEnabled;
    }

    /**
     * Set the theme explicitly.
     * @param {string} theme - 'light' or 'dark'.
     */
    function setTheme(theme) {
        if (theme === 'light' || theme === 'dark') {
            currentTheme = theme;
            applyTheme();
        }
    }

    /**
     * Set manufacturer theme colors.
     * @param {Object} colors - Manufacturer theme colors.
     */
    function setManufacturerTheme(colors) {
        if (colors) {
            Object.assign(MANUFACTURER_THEME, colors);
            applyTheme();
        }
    }

    /**
     * Get the current theme colors as an object.
     * @returns {Object} - Theme color object.
     */
    function getThemeColors() {
        const baseTheme = currentTheme === 'dark' ? DARK_THEME : DEFAULT_THEME;
        
        if (manufacturerThemeEnabled) {
            return {
                ...baseTheme,
                primaryColor: MANUFACTURER_THEME.primaryColor || baseTheme.primaryColor,
                secondaryColor: MANUFACTURER_THEME.secondaryColor || baseTheme.secondaryColor,
                accentColor: MANUFACTURER_THEME.accentColor || baseTheme.accentColor,
                backgroundColor: MANUFACTURER_THEME.backgroundColor || baseTheme.backgroundColor,
                surfaceColor: MANUFACTURER_THEME.surfaceColor || baseTheme.surfaceColor,
                textColor: MANUFACTURER_THEME.textColor || baseTheme.textColor
            };
        }
        
        return baseTheme;
    }

    /**
     * Apply the current theme to the document.
     * This updates CSS variables on the root element.
     */
    function applyTheme() {
        const colors = getThemeColors();
        const root = document.documentElement;
        
        if (!root) {
            return;
        }

        // Apply theme data attribute
        root.setAttribute('data-theme', currentTheme);
        if (manufacturerThemeEnabled) {
            root.setAttribute('data-theme', 'manufacturer');
        }

        // Apply CSS variables
        Object.keys(colors).forEach(function(key) {
            const cssKey = '--' + key;
            root.style.setProperty(cssKey, colors[key]);
            
            // Also set manufacturer-specific variables
            if (manufacturerThemeEnabled && MANUFACTURER_THEME[key]) {
                root.style.setProperty('--manufacturer-' + key, MANUFACTURER_THEME[key]);
            }
        });
    }

    /**
     * Save the current theme settings.
     * @param {Object} storage - The Storage module instance.
     */
    function saveTheme(storage) {
        storage.save('Theme', currentTheme);
        storage.save('ManufacturerTheme', manufacturerThemeEnabled);
    }

    // Public API
    return {
        initialize: initialize,
        getCurrentTheme: getCurrentTheme,
        isManufacturerThemeEnabled: isManufacturerThemeEnabled,
        toggleDarkMode: toggleDarkMode,
        toggleManufacturerTheme: toggleManufacturerTheme,
        setTheme: setTheme,
        setManufacturerTheme: setManufacturerTheme,
        getThemeColors: getThemeColors,
        applyTheme: applyTheme,
        saveTheme: saveTheme,
        
        // Constants for reference
        DEFAULT_THEME: DEFAULT_THEME,
        DARK_THEME: DARK_THEME
    };
})();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Theme;
}
