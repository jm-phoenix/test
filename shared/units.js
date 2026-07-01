/**
 * GuideOS Units Module
 * Version: 1.0.0
 * 
 * Provides unit conversion utilities.
 * Part of Sprint 03 - Knowledge Engine
 */

/**
 * Units Module
 * @namespace Units
 */
const Units = (function() {
    'use strict';
    
    /**
     * Convert a value from one unit to another
     * @param {number} value - The value to convert
     * @param {string} fromUnit - The source unit
     * @param {string} toUnit - The target unit
     * @returns {number|null} The converted value or null if conversion not possible
     */
    function convert(value, fromUnit, toUnit) {
        return Localization.convert(value, fromUnit, toUnit, _getUnitType(fromUnit));
    }
    
    /**
     * Format a value with its unit
     * @param {number} value - The value to format
     * @param {string} unit - The unit
     * @param {number} precision - Decimal precision
     * @returns {string} Formatted value with unit
     */
    function format(value, unit, precision = 2) {
        return Localization.format(value, unit, precision);
    }
    
    /**
     * Get the unit type for a unit
     * @private
     */
    function _getUnitType(unit) {
        if (!unit || typeof unit !== 'string') {
            return null;
        }
        
        const unitTypeMap = {
            // Pressure
            'psi': 'pressure', 'bar': 'pressure', 'kPa': 'pressure', 'MPa': 'pressure',
            // Torque
            'lb-ft': 'torque', 'lb-in': 'torque', 'N-m': 'torque', 'kgf-m': 'torque',
            // Temperature
            '°C': 'temperature', '°F': 'temperature',
            // Distance
            'km': 'distance', 'mi': 'distance',
            // Length
            'mm': 'length', 'cm': 'length', 'm': 'length', 'in': 'length', 'ft': 'length',
            // Weight
            'kg': 'weight', 'g': 'weight', 'lb': 'weight', 'oz': 'weight',
            // Volume
            'L': 'volume', 'mL': 'volume', 'gal': 'volume', 'qt': 'volume',
            // Flow
            'L/min': 'flow', 'GPM': 'flow', 'm³/h': 'flow',
            // Speed
            'rpm': 'speed',
            // Time
            's': 'time', 'min': 'time', 'h': 'time',
            // Angle
            '°': 'angle', 'rad': 'angle',
            // Voltage
            'V': 'voltage', 'kV': 'voltage',
            // Current
            'A': 'current', 'mA': 'current',
            // Frequency
            'Hz': 'frequency', 'kHz': 'frequency',
            // Power
            'W': 'power', 'kW': 'power', 'HP': 'power',
            // Diameter (same as length)
            'diameter': 'diameter'
        };
        
        return unitTypeMap[unit] || null;
    }
    
    /**
     * Get the preferred unit system
     * @returns {string} The current preferred unit system
     */
    function getPreferredSystem() {
        return Localization.getUnitSystem();
    }
    
    /**
     * Set the preferred unit system
     * @param {string} system - The unit system to use
     */
    function setPreferredSystem(system) {
        Localization.setUnitSystem(system);
    }
    
    /**
     * Check if a unit is supported
     * @param {string} unit - The unit to check
     * @returns {boolean} True if the unit is supported
     */
    function isSupportedUnit(unit) {
        if (!unit || typeof unit !== 'string') {
            return false;
        }
        
        const unitType = _getUnitType(unit);
        if (!unitType) {
            return false;
        }
        
        const supportedUnits = Localization.getSupportedUnits(unitType);
        return supportedUnits.includes(unit);
    }
    
    /**
     * Get all supported units
     * @returns {Object} All supported units organized by type
     */
    function getAllSupportedUnits() {
        const allUnits = {};
        const unitTypes = Object.keys(Localization.getSupportedUnits);
        
        for (const type of unitTypes) {
            allUnits[type] = Localization.getSupportedUnits(type);
        }
        
        return allUnits;
    }
    
    /**
     * Convert an entity to the preferred unit system
     * @param {Object} entity - The entity to convert
     * @returns {Object} The converted entity
     */
    function convertEntity(entity) {
        if (!entity || !entity.type || !entity.value) {
            return entity;
        }
        
        return Localization.localizeEntity(entity);
    }
    
    // Public API
    return {
        convert,
        format,
        getPreferredSystem,
        setPreferredSystem,
        isSupportedUnit,
        getAllSupportedUnits,
        convertEntity
    };
})();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Units;
}
