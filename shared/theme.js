/**
 * GuideOS Theme Module
 * Version: 1.0.0
 * 
 * Handles theme management including default theme, dark mode, and manufacturer theme.
 */

/**
 * Theme Module
 * @namespace Theme
 */
const Theme = (function() {
    'use strict';
    
    // Default theme colors
    const DEFAULT_THEME = {
        primaryColor: '#0054A6',
        secondaryColor: '#003366',
        accentColor: '#0078D7',
        backgroundColor: '#F5F5F5',
        surfaceColor: '#FFFFFF',
        textColor: '#333333',
        warningColor: '#FFA500',
        dangerColor: '#DC143C',
        successColor: '#2E8B57',
        informationColor: '#0078D7'
    };
    
    // Dark mode colors
    const DARK_THEME = {
        backgroundColor: '#1A1A1A',
        surfaceColor: '#2D2D2D',
        textColor: '#E0E0E0'
    };
    
    // Current state
    let state = {
        darkMode: false,
        manufacturerTheme: false,
        manufacturerColors: {}
    };
    
    // Storage keys
    const STORAGE_KEYS = {
        DARK_MODE: 'viewer_dark_mode',
        MANUFACTURER_THEME: 'viewer_manufacturer_theme',
        MANUFACTURER_COLORS: 'viewer_manufacturer_colors'
    };
    
    /**
     * Apply theme colors to CSS variables
     * @private
     */
    function _applyTheme() {
        const root = document.documentElement;
        
        // Always apply default theme first
        root.style.setProperty('--primary-color', DEFAULT_THEME.primaryColor);
        root.style.setProperty('--secondary-color', DEFAULT_THEME.secondaryColor);
        root.style.setProperty('--accent-color', DEFAULT_THEME.accentColor);
        root.style.setProperty('--warning-color', DEFAULT_THEME.warningColor);
        root.style.setProperty('--danger-color', DEFAULT_THEME.dangerColor);
        root.style.setProperty('--success-color', DEFAULT_THEME.successColor);
        root.style.setProperty('--information-color', DEFAULT_THEME.informationColor);
        
        // Apply background and text colors based on mode
        if (state.darkMode) {
            root.style.setProperty('--background-color', DARK_THEME.backgroundColor);
            root.style.setProperty('--surface-color', DARK_THEME.surfaceColor);
            root.style.setProperty('--text-color', DARK_THEME.textColor);
        } else {
            root.style.setProperty('--background-color', DEFAULT_THEME.backgroundColor);
            root.style.setProperty('--surface-color', DEFAULT_THEME.surfaceColor);
            root.style.setProperty('--text-color', DEFAULT_THEME.textColor);
        }
        
        // Apply manufacturer theme if enabled
        if (state.manufacturerTheme && Object.keys(state.manufacturerColors).length > 0) {
            root.setAttribute('data-manufacturer-theme', 'true');
            
            // Apply manufacturer colors
            if (state.manufacturerColors.primaryColor) {
                root.style.setProperty('--manufacturer-primary', state.manufacturerColors.primaryColor);
            }
            if (state.manufacturerColors.secondaryColor) {
                root.style.setProperty('--manufacturer-secondary', state.manufacturerColors.secondaryColor);
            }
            if (state.manufacturerColors.accentColor) {
                root.style.setProperty('--manufacturer-accent', state.manufacturerColors.accentColor);
            }
            if (state.manufacturerColors.backgroundColor) {
                root.style.setProperty('--manufacturer-background', state.manufacturerColors.backgroundColor);
            }
            if (state.manufacturerColors.surfaceColor) {
                root.style.setProperty('--manufacturer-surface', state.manufacturerColors.surfaceColor);
            }
            if (state.manufacturerColors.textColor) {
                root.style.setProperty('--manufacturer-text', state.manufacturerColors.textColor);
            }
            if (state.manufacturerColors.warningColor) {
                root.style.setProperty('--manufacturer-warning', state.manufacturerColors.warningColor);
            }
            if (state.manufacturerColors.dangerColor) {
                root.style.setProperty('--manufacturer-danger', state.manufacturerColors.dangerColor);
            }
            if (state.manufacturerColors.successColor) {
                root.style.setProperty('--manufacturer-success', state.manufacturerColors.successColor);
            }
            if (state.manufacturerColors.informationColor) {
                root.style.setProperty('--manufacturer-information', state.manufacturerColors.informationColor);
            }
        } else {
            root.removeAttribute('data-manufacturer-theme');
        }
        
        // Set dark mode attribute
        if (state.darkMode) {
            root.setAttribute('data-theme', 'dark');
        } else {
            root.removeAttribute('data-theme');
        }
    }
    
    /**
     * Load theme settings from storage
     * @private
     */
    function _loadSettings() {
        // Load dark mode
        const darkMode = Storage.load(STORAGE_KEYS.DARK_MODE, false);
        state.darkMode = darkMode;
        
        // Load manufacturer theme
        const manufacturerTheme = Storage.load(STORAGE_KEYS.MANUFACTURER_THEME, false);
        state.manufacturerTheme = manufacturerTheme;
        
        // Load manufacturer colors
        const manufacturerColors = Storage.load(STORAGE_KEYS.MANUFACTURER_COLORS, {});
        state.manufacturerColors = manufacturerColors;
    }
    
    /**
     * Save theme settings to storage
     * @private
     */
    function _saveSettings() {
        Storage.save(STORAGE_KEYS.DARK_MODE, state.darkMode);
        Storage.save(STORAGE_KEYS.MANUFACTURER_THEME, state.manufacturerTheme);
        Storage.save(STORAGE_KEYS.MANUFACTURER_COLORS, state.manufacturerColors);
    }
    
    /**
     * Initialize the Theme module
     */
    function initialize() {
        _loadSettings();
        _applyTheme();
    }
    
    /**
     * Toggle dark mode on/off
     */
    function toggleDarkMode() {
        state.darkMode = !state.darkMode;
        _applyTheme();
        _saveSettings();
    }
    
    /**
     * Set dark mode explicitly
     * @param {boolean} enabled - Whether to enable dark mode
     */
    function setDarkMode(enabled) {
        state.darkMode = enabled;
        _applyTheme();
        _saveSettings();
    }
    
    /**
     * Get current dark mode state
     * @returns {boolean} True if dark mode is enabled
     */
    function isDarkMode() {
        return state.darkMode;
    }
    
    /**
     * Toggle manufacturer theme on/off
     */
    function toggleManufacturerTheme() {
        state.manufacturerTheme = !state.manufacturerTheme;
        _applyTheme();
        _saveSettings();
    }
    
    /**
     * Set manufacturer theme explicitly
     * @param {boolean} enabled - Whether to enable manufacturer theme
     */
    function setManufacturerTheme(enabled) {
        state.manufacturerTheme = enabled;
        _applyTheme();
        _saveSettings();
    }
    
    /**
     * Get current manufacturer theme state
     * @returns {boolean} True if manufacturer theme is enabled
     */
    function isManufacturerTheme() {
        return state.manufacturerTheme;
    }
    
    /**
     * Set manufacturer colors
     * @param {Object} colors - Object containing color properties
     */
    function setManufacturerColors(colors) {
        state.manufacturerColors = { ...state.manufacturerColors, ...colors };
        _applyTheme();
        _saveSettings();
    }
    
    /**
     * Get current manufacturer colors
     * @returns {Object} The manufacturer color configuration
     */
    function getManufacturerColors() {
        return { ...state.manufacturerColors };
    }
    
    /**
     * Get the current theme configuration
     * @returns {Object} Complete theme state
     */
    function getCurrentTheme() {
        return {
            darkMode: state.darkMode,
            manufacturerTheme: state.manufacturerTheme,
            manufacturerColors: { ...state.manufacturerColors }
        };
    }
    
    /**
     * Reset to default theme
     */
    function resetToDefault() {
        state.darkMode = false;
        state.manufacturerTheme = false;
        state.manufacturerColors = {};
        _applyTheme();
        _saveSettings();
    }
    
    /**
     * Apply theme from a GuideSpec theme object
     * @param {Object} guideTheme - Theme object from GuideSpec
     */
    function applyGuideTheme(guideTheme) {
        if (!guideTheme || !guideTheme.enabled) {
            setManufacturerTheme(false);
            return;
        }
        
        const colors = {};
        
        if (guideTheme.primaryColor) colors.primaryColor = guideTheme.primaryColor;
        if (guideTheme.secondaryColor) colors.secondaryColor = guideTheme.secondaryColor;
        if (guideTheme.accentColor) colors.accentColor = guideTheme.accentColor;
        if (guideTheme.backgroundColor) colors.backgroundColor = guideTheme.backgroundColor;
        if (guideTheme.surfaceColor) colors.surfaceColor = guideTheme.surfaceColor;
        if (guideTheme.textColor) colors.textColor = guideTheme.textColor;
        if (guideTheme.warningColor) colors.warningColor = guideTheme.warningColor;
        if (guideTheme.dangerColor) colors.dangerColor = guideTheme.dangerColor;
        if (guideTheme.successColor) colors.successColor = guideTheme.successColor;
        if (guideTheme.informationColor) colors.informationColor = guideTheme.informationColor;
        
        setManufacturerColors(colors);
        setManufacturerTheme(true);
    }
    
    // Public API
    return {
        initialize,
        toggleDarkMode,
        setDarkMode,
        isDarkMode,
        toggleManufacturerTheme,
        setManufacturerTheme,
        isManufacturerTheme,
        setManufacturerColors,
        getManufacturerColors,
        getCurrentTheme,
        resetToDefault,
        applyGuideTheme
    };
})();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Theme;
}
