/**
 * GuideOS
 * Module: entities.js
 * Version: 1.0.0
 * Purpose: Entity Engine for resolving placeholders in GuideSpec.
 * Follows CODING_STANDARD.md: No DOM manipulation, single responsibility.
 */

/**
 * Entity Engine for GuideOS.
 * Resolves placeholders (e.g., {torque1}) to their actual values.
 * Supports localization (unit conversion) and formatting.
 */
const Entities = (function() {
    'use strict';

    // Unit conversion factors (from GUIDE_SPEC.md)
    const UNIT_CONVERSIONS = {
        // Pressure
        psi: {
            bar: 0.0689476,
            kPa: 6.89476,
            MPa: 0.00689476
        },
        bar: {
            psi: 14.5038,
            kPa: 100,
            MPa: 0.1
        },
        kPa: {
            psi: 0.145038,
            bar: 0.01,
            MPa: 0.001
        },
        MPa: {
            psi: 145.038,
            bar: 10,
            kPa: 1000
        },
        
        // Torque
        'lb-ft': {
            'N-m': 1.35582,
            'lb-in': 12,
            'kgf-m': 0.138255
        },
        'lb-in': {
            'lb-ft': 0.0833333,
            'N-m': 0.112985,
            'kgf-m': 0.0115212
        },
        'N-m': {
            'lb-ft': 0.737562,
            'lb-in': 8.85075,
            'kgf-m': 0.101972
        },
        'kgf-m': {
            'lb-ft': 7.23301,
            'lb-in': 86.7962,
            'N-m': 9.80665
        },
        
        // Length/Distance
        mm: {
            cm: 0.1,
            m: 0.001,
            in: 0.0393701,
            ft: 0.00328084
        },
        cm: {
            mm: 10,
            m: 0.01,
            in: 0.393701,
            ft: 0.0328084
        },
        m: {
            mm: 1000,
            cm: 100,
            in: 39.3701,
            ft: 3.28084
        },
        in: {
            mm: 25.4,
            cm: 2.54,
            m: 0.0254,
            ft: 0.0833333
        },
        ft: {
            mm: 304.8,
            cm: 30.48,
            m: 0.3048,
            in: 12
        },
        
        // Distance (long)
        km: {
            mi: 0.621371
        },
        mi: {
            km: 1.60934
        },
        
        // Temperature (special handling for °C/°F)
        '°C': {
            '°F': function(c) { return c * 9/5 + 32; }
        },
        '°F': {
            '°C': function(f) { return (f - 32) * 5/9; }
        },
        
        // Weight
        kg: {
            g: 1000,
            lb: 2.20462,
            oz: 35.274
        },
        g: {
            kg: 0.001,
            lb: 0.00220462,
            oz: 0.035274
        },
        lb: {
            kg: 0.453592,
            g: 453.592,
            oz: 16
        },
        oz: {
            kg: 0.0283495,
            g: 28.3495,
            lb: 0.0625
        },
        
        // Volume
        L: {
            mL: 1000,
            gal: 0.264172,
            qt: 1.05669
        },
        mL: {
            L: 0.001,
            gal: 0.000264172,
            qt: 0.00105669
        },
        gal: {
            L: 3.78541,
            mL: 3785.41,
            qt: 4
        },
        qt: {
            L: 0.946353,
            mL: 946.353,
            gal: 0.25
        },
        
        // Flow
        'L/min': {
            GPM: 0.264172,
            'm³/h': 0.06
        },
        GPM: {
            'L/min': 3.78541,
            'm³/h': 0.227125
        },
        'm³/h': {
            'L/min': 16.6667,
            GPM: 4.40287
        },
        
        // Power
        W: {
            kW: 0.001,
            HP: 0.00134102
        },
        kW: {
            W: 1000,
            HP: 1.34102
        },
        HP: {
            W: 745.7,
            kW: 0.7457
        },
        
        // Voltage
        V: {
            kV: 0.001
        },
        kV: {
            V: 1000
        },
        
        // Current
        A: {
            mA: 1000
        },
        mA: {
            A: 0.001
        },
        
        // Frequency
        Hz: {
            kHz: 0.001
        },
        kHz: {
            Hz: 1000
        },
        
        // Speed (no conversion, just display)
        rpm: {}
    };

    // Unit system preferences
    const UNIT_SYSTEMS = {
        original: 'original',
        metric: {
            pressure: 'bar',
            torque: 'N-m',
            length: 'mm',
            distance: 'km',
            temperature: '°C',
            weight: 'kg',
            volume: 'L',
            flow: 'L/min',
            power: 'kW',
            voltage: 'V',
            current: 'A',
            frequency: 'Hz'
        },
        imperial: {
            pressure: 'psi',
            torque: 'lb-ft',
            length: 'in',
            distance: 'mi',
            temperature: '°F',
            weight: 'lb',
            volume: 'gal',
            flow: 'GPM',
            power: 'HP',
            voltage: 'V',
            current: 'A',
            frequency: 'Hz'
        }
    };

    /**
     * Resolve all placeholders in an instruction.
     * @param {string} instruction - The instruction text with placeholders.
     * @param {Object} entities - The entities object for the step.
     * @param {string} unitSystem - The unit system to use ('original', 'metric', 'imperial').
     * @returns {string} - The instruction with placeholders replaced.
     */
    function resolveInstruction(instruction, entities, unitSystem) {
        if (!instruction || !entities) {
            return instruction || '';
        }

        let result = instruction;

        for (const [placeholder, entity] of Object.entries(entities)) {
            const placeholderRegex = new RegExp('\{' + Utils.escapeHtml(placeholder) + '\}', 'g');
            const resolvedValue = resolveEntity(entity, unitSystem);
            result = result.replace(placeholderRegex, resolvedValue);
        }

        return result;
    }

    /**
     * Resolve an entity to its display value.
     * @param {Object} entity - The entity to resolve.
     * @param {string} unitSystem - The unit system to use.
     * @returns {string} - The resolved value.
     */
    function resolveEntity(entity, unitSystem) {
        if (!entity || !entity.type) {
            return '';
        }

        switch (entity.type) {
            case 'torque':
            case 'pressure':
            case 'temperature':
            case 'distance':
            case 'length':
            case 'weight':
            case 'volume':
            case 'flow':
            case 'power':
            case 'voltage':
            case 'current':
            case 'frequency':
            case 'diameter':
                return resolveEngineeringEntity(entity, unitSystem);

            case 'tool':
            case 'part':
            case 'chemical':
            case 'bearing':
            case 'seal':
            case 'lubricant':
            case 'wireGauge':
            case 'thread':
            case 'fastener':
            case 'material':
                return resolveObjectEntity(entity);

            case 'document':
            case 'manual':
            case 'video':
            case 'website':
            case 'warning':
            case 'note':
                return resolveReferenceEntity(entity);

            default:
                // Unknown entity type - return placeholder
                return '{' + entity.type + '}';
        }
    }

    /**
     * Resolve an engineering entity with unit conversion.
     * @param {Object} entity - The engineering entity.
     * @param {string} unitSystem - The unit system to use.
     * @returns {string} - The resolved value with units.
     */
    function resolveEngineeringEntity(entity, unitSystem) {
        if (entity.value === undefined || !entity.unit) {
            return '';
        }

        const originalValue = entity.value;
        const originalUnit = entity.unit;
        let displayValue = originalValue;
        let displayUnit = originalUnit;

        // If not original, try to convert
        if (unitSystem !== 'original' && UNIT_SYSTEMS[unitSystem]) {
            const targetUnit = UNIT_SYSTEMS[unitSystem][entity.type];
            if (targetUnit && targetUnit !== originalUnit) {
                displayValue = convertValue(originalValue, originalUnit, targetUnit, entity.type);
                displayUnit = targetUnit;
            }
        }

        // Format the value
        const precision = entity.precision !== undefined ? entity.precision : getDefaultPrecision(entity.type);
        const formattedValue = formatValue(displayValue, precision);

        return formattedValue + ' ' + displayUnit;
    }

    /**
     * Convert a value from one unit to another.
     * @param {number} value - The value to convert.
     * @param {string} fromUnit - The source unit.
     * @param {string} toUnit - The target unit.
     * @param {string} entityType - The entity type.
     * @returns {number} - The converted value.
     */
    function convertValue(value, fromUnit, toUnit, entityType) {
        if (fromUnit === toUnit) {
            return value;
        }

        // Special handling for temperature (non-linear conversion)
        if (entityType === 'temperature' && (fromUnit === '°C' || fromUnit === '°F')) {
            const conversion = UNIT_CONVERSIONS[fromUnit][toUnit];
            if (typeof conversion === 'function') {
                return conversion(value);
            }
        }

        // Linear conversion for other units
        const fromToTo = UNIT_CONVERSIONS[fromUnit][toUnit];
        if (fromToTo !== undefined) {
            return value * fromToTo;
        }

        // Try reverse conversion
        const toToFrom = UNIT_CONVERSIONS[toUnit][fromUnit];
        if (toToFrom !== undefined) {
            return value / toToFrom;
        }

        // No conversion available
        console.warn('No conversion available from ' + fromUnit + ' to ' + toUnit + ' for ' + entityType);
        return value;
    }

    /**
     * Get default precision for an entity type.
     * @param {string} entityType - The entity type.
     * @returns {number} - The default precision.
     */
    function getDefaultPrecision(entityType) {
        const precisionMap = {
            torque: 0,
            pressure: 1,
            temperature: 0,
            distance: 2,
            length: 2,
            weight: 2,
            volume: 2,
            flow: 1,
            power: 1,
            voltage: 1,
            current: 2,
            frequency: 1,
            diameter: 2
        };
        return precisionMap[entityType] || 2;
    }

    /**
     * Format a numeric value.
     * @param {number} value - The value to format.
     * @param {number} precision - The number of decimal places.
     * @returns {string} - The formatted value.
     */
    function formatValue(value, precision) {
        if (precision === 0) {
            return Math.round(value).toString();
        }
        return value.toFixed(precision);
    }

    /**
     * Resolve an object entity (tool, part, etc.).
     * @param {Object} entity - The object entity.
     * @returns {string} - The resolved value.
     */
    function resolveObjectEntity(entity) {
        if (entity.name) {
            return entity.name;
        }
        if (entity.partNumber) {
            return entity.partNumber;
        }
        if (entity.description) {
            return entity.description;
        }
        return entity.type;
    }

    /**
     * Resolve a reference entity (manual, video, etc.).
     * @param {Object} entity - The reference entity.
     * @returns {string} - The resolved value.
     */
    function resolveReferenceEntity(entity) {
        if (entity.title) {
            return entity.title;
        }
        if (entity.url) {
            return entity.url;
        }
        if (entity.description) {
            return entity.description;
        }
        return entity.type;
    }

    /**
     * Get all entities from a guide.
     * @param {Object} guide - The guide object.
     * @returns {Object} - All entities organized by phase and step.
     */
    function getAllEntities(guide) {
        const entities = {};

        if (guide.phases) {
            guide.phases.forEach(function(phase) {
                if (phase.steps) {
                    phase.steps.forEach(function(step) {
                        if (step.entities) {
                            entities[step.id] = step.entities;
                        }
                    });
                }
            });
        }

        return entities;
    }

    /**
     * Get all placeholders in an instruction.
     * @param {string} instruction - The instruction text.
     * @returns {string[]} - Array of placeholder names.
     */
    function getPlaceholders(instruction) {
        if (!instruction) {
            return [];
        }

        const placeholderRegex = /\{([^}]+)\}/g;
        const placeholders = [];
        let match;

        while ((match = placeholderRegex.exec(instruction)) !== null) {
            placeholders.push(match[1]);
        }

        return placeholders;
    }

    /**
     * Check if an instruction contains unresolved placeholders.
     * @param {string} instruction - The instruction text.
     * @param {Object} entities - The entities object for the step.
     * @returns {boolean} - True if there are unresolved placeholders.
     */
    function hasUnresolvedPlaceholders(instruction, entities) {
        if (!instruction || !entities) {
            return false;
        }

        const placeholders = getPlaceholders(instruction);
        return placeholders.some(function(placeholder) {
            return !(placeholder in entities);
        });
    }

    // Public API
    return {
        resolveInstruction: resolveInstruction,
        resolveEntity: resolveEntity,
        resolveEngineeringEntity: resolveEngineeringEntity,
        convertValue: convertValue,
        getAllEntities: getAllEntities,
        getPlaceholders: getPlaceholders,
        hasUnresolvedPlaceholders: hasUnresolvedPlaceholders,
        UNIT_SYSTEMS: UNIT_SYSTEMS,
        UNIT_CONVERSIONS: UNIT_CONVERSIONS
    };
})();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Entities;
}
