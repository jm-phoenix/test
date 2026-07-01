/**
 * GuideOS Localization Engine
 * Version: 1.0.0
 * 
 * Handles unit conversion and localization for engineering values.
 * Part of Sprint 03 - Knowledge Engine
 */

/**
 * Localization Engine Module
 * @namespace Localization
 */
const Localization = (function() {
    'use strict';
    
    // Current unit system preference
    let currentUnitSystem = 'original';
    
    // Current language preference
    let currentLanguage = 'en';
    
    // Storage keys
    const STORAGE_KEYS = {
        UNIT_SYSTEM: 'viewer_unit_system',
        LANGUAGE: 'viewer_language'
    };
    
    // Unit conversion factors
    const CONVERSION_FACTORS = {
        // Pressure conversions
        pressure: {
            psi: { bar: 0.0689476, kPa: 6.89476, MPa: 0.00689476 },
            bar: { psi: 14.5038, kPa: 100, MPa: 0.1 },
            kPa: { psi: 0.145038, bar: 0.01, MPa: 0.001 },
            MPa: { psi: 145.038, bar: 10, kPa: 1000 }
        },
        
        // Torque conversions
        torque: {
            'lb-ft': { 'N-m': 1.35582, 'lb-in': 12, 'kgf-m': 0.138255 },
            'N-m': { 'lb-ft': 0.737562, 'lb-in': 8.85075, 'kgf-m': 0.101972 },
            'lb-in': { 'lb-ft': 0.0833333, 'N-m': 0.112985, 'kgf-m': 0.0115212 },
            'kgf-m': { 'lb-ft': 7.23301, 'N-m': 9.80665, 'lb-in': 86.7962 }
        },
        
        // Temperature conversions (special handling for °C and °F)
        temperature: {
            '°C': { '°F': (c) => c * 9/5 + 32 },
            '°F': { '°C': (f) => (f - 32) * 5/9 }
        },
        
        // Distance conversions
        distance: {
            km: { mi: 0.621371, m: 1000, cm: 100000, mm: 1000000 },
            mi: { km: 1.60934, m: 1609.34, ft: 5280, in: 63360 },
            m: { km: 0.001, mi: 0.000621371, cm: 100, mm: 1000 },
            cm: { km: 0.00001, mi: 0.00000621371, m: 0.01, mm: 10 },
            mm: { km: 0.000001, mi: 0.000000621371, m: 0.001, cm: 0.1 }
        },
        
        // Length conversions (same as distance for now)
        length: {
            mm: { cm: 0.1, m: 0.001, in: 0.0393701, ft: 0.00328084 },
            cm: { mm: 10, m: 0.01, in: 0.393701, ft: 0.0328084 },
            m: { mm: 1000, cm: 100, in: 39.3701, ft: 3.28084 },
            in: { mm: 25.4, cm: 2.54, m: 0.0254, ft: 0.0833333 },
            ft: { mm: 304.8, cm: 30.48, m: 0.3048, in: 12 }
        },
        
        // Weight conversions
        weight: {
            kg: { g: 1000, lb: 2.20462, oz: 35.274 },
            g: { kg: 0.001, lb: 0.00220462, oz: 0.035274 },
            lb: { kg: 0.453592, g: 453.592, oz: 16 },
            oz: { kg: 0.0283495, g: 28.3495, lb: 0.0625 }
        },
        
        // Volume conversions
        volume: {
            L: { mL: 1000, gal: 0.264172, qt: 1.05669 },
            mL: { L: 0.001, gal: 0.000264172, qt: 0.00105669 },
            gal: { L: 3.78541, mL: 3785.41, qt: 4 },
            qt: { L: 0.946353, mL: 946.353, gal: 0.25 }
        },
        
        // Flow conversions
        flow: {
            'L/min': { GPM: 0.264172, 'm³/h': 0.06 },
            GPM: { 'L/min': 3.78541, 'm³/h': 0.227125 },
            'm³/h': { 'L/min': 16.6667, GPM: 4.40287 }
        },
        
        // Speed conversions
        speed: {
            rpm: { rpm: 1 } // RPM is display only, no conversion
        },
        
        // Time conversions
        time: {
            s: { min: 0.0166667, h: 0.000277778 },
            min: { s: 60, h: 0.0166667 },
            h: { s: 3600, min: 60 }
        },
        
        // Angle conversions
        angle: {
            '°': { rad: 0.0174533 },
            rad: { '°': 57.2958 }
        },
        
        // Voltage conversions
        voltage: {
            V: { kV: 0.001 },
            kV: { V: 1000 }
        },
        
        // Current conversions
        current: {
            A: { mA: 1000 },
            mA: { A: 0.001 }
        },
        
        // Frequency conversions
        frequency: {
            Hz: { kHz: 0.001 },
            kHz: { Hz: 1000 }
        },
        
        // Power conversions
        power: {
            W: { kW: 0.001, HP: 0.00134102 },
            kW: { W: 1000, HP: 1.34102 },
            HP: { W: 745.7, kW: 0.7457 }
        },
        
        // Diameter conversions (same as length)
        diameter: {
            mm: { cm: 0.1, m: 0.001, in: 0.0393701, ft: 0.00328084 },
            cm: { mm: 10, m: 0.01, in: 0.393701, ft: 0.0328084 },
            m: { mm: 1000, cm: 100, in: 39.3701, ft: 3.28084 },
            in: { mm: 25.4, cm: 2.54, m: 0.0254, ft: 0.0833333 },
            ft: { mm: 304.8, cm: 30.48, m: 0.3048, in: 12 }
        }
    };
    
    // Unit system definitions
    const UNIT_SYSTEMS = {
        original: {
            name: 'Original',
            description: 'Use the original units from the guide'
        },
        imperial: {
            name: 'Imperial',
            description: 'Convert to Imperial units where applicable',
            preferences: {
                pressure: 'psi',
                torque: 'lb-ft',
                temperature: '°F',
                distance: 'mi',
                length: 'in',
                weight: 'lb',
                volume: 'gal',
                flow: 'GPM'
            }
        },
        metric: {
            name: 'Metric',
            description: 'Convert to Metric units where applicable',
            preferences: {
                pressure: 'bar',
                torque: 'N-m',
                temperature: '°C',
                distance: 'km',
                length: 'mm',
                weight: 'kg',
                volume: 'L',
                flow: 'L/min'
            }
        }
    };
    
    /**
     * Initialize the localization module
     */
    function initialize() {
        // Load saved preferences
        const savedUnitSystem = Storage.load(STORAGE_KEYS.UNIT_SYSTEM, 'original');
        const savedLanguage = Storage.load(STORAGE_KEYS.LANGUAGE, 'en');
        
        setUnitSystem(savedUnitSystem);
        setLanguage(savedLanguage);
    }
    
    /**
     * Set the current unit system
     * @param {string} system - The unit system to use ('original', 'imperial', 'metric')
     */
    function setUnitSystem(system) {
        if (UNIT_SYSTEMS[system]) {
            currentUnitSystem = system;
            Storage.save(STORAGE_KEYS.UNIT_SYSTEM, system);
        } else {
            console.warn(`Unknown unit system: ${system}`);
        }
    }
    
    /**
     * Get the current unit system
     * @returns {string} The current unit system
     */
    function getUnitSystem() {
        return currentUnitSystem;
    }
    
    /**
     * Set the current language
     * @param {string} language - The language code
     */
    function setLanguage(language) {
        currentLanguage = language;
        Storage.save(STORAGE_KEYS.LANGUAGE, language);
    }
    
    /**
     * Get the current language
     * @returns {string} The current language
     */
    function getLanguage() {
        return currentLanguage;
    }
    
    /**
     * Get available unit systems
     * @returns {Object} Available unit systems
     */
    function getAvailableUnitSystems() {
        return { ...UNIT_SYSTEMS };
    }
    
    /**
     * Localize an entity value based on current unit system
     * @param {Object} entity - The entity to localize
     * @returns {Object|null} The localized entity or null if not localizable
     */
    function localizeEntity(entity) {
        if (!entity || !entity.type || !entity.value) {
            return null;
        }
        
        // If using original units, return as-is
        if (currentUnitSystem === 'original') {
            return { ...entity };
        }
        
        // Get the unit system preferences
        const systemPrefs = UNIT_SYSTEMS[currentUnitSystem];
        if (!systemPrefs || !systemPrefs.preferences) {
            return { ...entity };
        }
        
        // Check if this entity type has a preferred unit
        const preferredUnit = systemPrefs.preferences[entity.type];
        if (!preferredUnit) {
            return { ...entity };
        }
        
        // If already in preferred unit, return as-is
        if (entity.unit === preferredUnit) {
            return { ...entity };
        }
        
        // Convert to preferred unit
        const conversionFactors = CONVERSION_FACTORS[entity.type];
        if (!conversionFactors) {
            return { ...entity };
        }
        
        const fromUnit = entity.unit;
        const toUnit = preferredUnit;
        
        // Special handling for temperature (non-linear conversion)
        if (entity.type === 'temperature') {
            const converter = conversionFactors[fromUnit] && conversionFactors[fromUnit][toUnit];
            if (typeof converter === 'function') {
                return {
                    ...entity,
                    value: converter(entity.value),
                    unit: toUnit
                };
            }
        }
        
        // Standard linear conversion
        const fromFactors = conversionFactors[fromUnit];
        const toFactors = conversionFactors[toUnit];
        
        if (fromFactors && toFactors && fromFactors[toUnit] !== undefined) {
            return {
                ...entity,
                value: entity.value * fromFactors[toUnit],
                unit: toUnit
            };
        }
        
        // If no direct conversion, return original
        return { ...entity };
    }
    
    /**
     * Convert a value from one unit to another
     * @param {number} value - The value to convert
     * @param {string} fromUnit - The source unit
     * @param {string} toUnit - The target unit
     * @param {string} unitType - The type of unit (pressure, torque, etc.)
     * @returns {number|null} The converted value or null if conversion not possible
     */
    function convert(value, fromUnit, toUnit, unitType) {
        if (value === null || value === undefined || fromUnit === toUnit) {
            return value;
        }
        
        const conversionFactors = CONVERSION_FACTORS[unitType];
        if (!conversionFactors) {
            return null;
        }
        
        // Special handling for temperature
        if (unitType === 'temperature') {
            const converter = conversionFactors[fromUnit] && conversionFactors[fromUnit][toUnit];
            if (typeof converter === 'function') {
                return converter(value);
            }
        }
        
        // Standard linear conversion
        const fromFactors = conversionFactors[fromUnit];
        if (fromFactors && fromFactors[toUnit] !== undefined) {
            return value * fromFactors[toUnit];
        }
        
        return null;
    }
    
    /**
     * Format a value with its unit
     * @param {number} value - The value to format
     * @param {string} unit - The unit
     * @param {number} precision - Decimal precision
     * @returns {string} Formatted value with unit
     */
    function format(value, unit, precision = 2) {
        if (value === null || value === undefined) {
            return '';
        }
        
        const num = Number(value);
        if (isNaN(num)) {
            return String(value);
        }
        
        // For whole numbers, don't show decimal places
        if (num === Math.floor(num)) {
            return `${num} ${unit}`;
        }
        
        return `${num.toFixed(precision)} ${unit}`;
    }
    
    /**
     * Get the preferred unit for a unit type
     * @param {string} unitType - The type of unit
     * @returns {string|null} The preferred unit or null if not defined
     */
    function getPreferredUnit(unitType) {
        const systemPrefs = UNIT_SYSTEMS[currentUnitSystem];
        if (!systemPrefs || !systemPrefs.preferences) {
            return null;
        }
        
        return systemPrefs.preferences[unitType] || null;
    }
    
    /**
     * Check if a unit type can be converted
     * @param {string} unitType - The type of unit
     * @returns {boolean} True if the unit type supports conversion
     */
    function supportsConversion(unitType) {
        return CONVERSION_FACTORS[unitType] !== undefined;
    }
    
    /**
     * Get supported units for a unit type
     * @param {string} unitType - The type of unit
     * @returns {Array} Array of supported units
     */
    function getSupportedUnits(unitType) {
        const factors = CONVERSION_FACTORS[unitType];
        if (!factors) {
            return [];
        }
        
        const units = new Set();
        for (const [fromUnit, conversions] of Object.entries(factors)) {
            units.add(fromUnit);
            for (const toUnit of Object.keys(conversions)) {
                units.add(toUnit);
            }
        }
        
        return Array.from(units);
    }
    
    // Public API
    return {
        initialize,
        setUnitSystem,
        getUnitSystem,
        setLanguage,
        getLanguage,
        getAvailableUnitSystems,
        localizeEntity,
        convert,
        format,
        getPreferredUnit,
        supportsConversion,
        getSupportedUnits
    };
})();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Localization;
}
