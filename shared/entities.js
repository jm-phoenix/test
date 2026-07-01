/**
 * GuideOS Entity Engine
 * Version: 1.0.0
 * 
 * Handles resolution and processing of GuideSpec entities.
 * Part of Sprint 03 - Knowledge Engine
 */

/**
 * Entity Engine Module
 * @namespace Entities
 */
const Entities = (function() {
    'use strict';
    
    // Cache for resolved entities
    const entityCache = new Map();
    
    // Current guide context
    let currentGuide = null;
    
    /**
     * Set the current guide context
     * @param {Object} guide - The current guide
     */
    function setCurrentGuide(guide) {
        currentGuide = guide;
        entityCache.clear();
    }
    
    /**
     * Get the current guide context
     * @returns {Object|null} The current guide
     */
    function getCurrentGuide() {
        return currentGuide;
    }
    
    /**
     * Resolve an entity reference in an instruction
     * @param {string} instruction - The instruction text with placeholders
     * @param {Object} entities - The entities object for the step
     * @param {Object} options - Resolution options
     * @returns {string} The instruction with placeholders replaced by entity values
     */
    function resolveInstruction(instruction, entities, options = {}) {
        if (!instruction || typeof instruction !== 'string') {
            return instruction || '';
        }
        
        if (!entities || typeof entities !== 'object') {
            return instruction;
        }
        
        // Default options
        const opts = {
            localize: true,
            format: true,
            ...options
        };
        
        // Find all placeholders in the instruction
        const placeholderRegex = /\{([^}]+)\}/g;
        let result = instruction;
        
        let match;
        while ((match = placeholderRegex.exec(instruction)) !== null) {
            const placeholder = match[1];
            const entity = entities[placeholder];
            
            if (entity) {
                // Get the entity value
                let value = getEntityValue(entity, opts);
                
                // Replace the placeholder
                result = result.replace(`{${placeholder}}`, value);
            } else {
                // Entity not found, leave placeholder as-is or show warning
                console.warn(`Entity not found: ${placeholder}`);
            }
        }
        
        return result;
    }
    
    /**
     * Get the display value for an entity
     * @param {Object} entity - The entity object
     * @param {Object} options - Display options
     * @returns {string} The formatted entity value
     */
    function getEntityValue(entity, options = {}) {
        if (!entity || typeof entity !== 'object') {
            return '';
        }
        
        const opts = {
            localize: true,
            format: true,
            ...options
        };
        
        const type = entity.type;
        
        // Handle engineering value entities
        if (['pressure', 'torque', 'temperature', 'voltage', 'current', 'frequency',
              'distance', 'flow', 'weight', 'speed', 'time', 'angle', 'length', 'diameter', 'power'].includes(type)) {
            
            return formatEntityValue(entity, opts);
        }
        
        // Handle object entities
        if (['tool', 'part', 'bearing', 'seal', 'lubricant', 'chemical', 'material'].includes(type)) {
            return formatObjectEntity(entity);
        }
        
        // Handle reference entities
        if (['document', 'manual', 'video', 'website', 'warning', 'note'].includes(type)) {
            return formatReferenceEntity(entity);
        }
        
        // Unknown entity type
        return formatUnknownEntity(entity);
    }
    
    /**
     * Format an engineering value entity
     * @private
     */
    function formatEntityValue(entity, options) {
        if (!entity.value && entity.value !== 0) {
            return '';
        }
        
        let value = entity.value;
        let unit = entity.unit || '';
        
        // Apply localization if requested
        if (options.localize) {
            const localized = Localization.localizeEntity(entity);
            if (localized) {
                value = localized.value;
                unit = localized.unit;
            }
        }
        
        // Format the value
        const precision = entity.precision !== undefined ? entity.precision : 2;
        const formattedValue = _formatNumber(value, precision);
        
        // Combine value and unit
        if (unit) {
            return `${formattedValue} ${unit}`;
        }
        
        return formattedValue;
    }
    
    /**
     * Format an object entity
     * @private
     */
    function formatObjectEntity(entity) {
        const parts = [];
        
        if (entity.name) {
            parts.push(entity.name);
        }
        
        if (entity.partNumber) {
            parts.push(`(Part #${entity.partNumber})`);
        }
        
        if (entity.description) {
            parts.push(`- ${entity.description}`);
        }
        
        return parts.join(' ') || entity.type || 'Unknown';
    }
    
    /**
     * Format a reference entity
     * @private
     */
    function formatReferenceEntity(entity) {
        if (entity.title) {
            return entity.title;
        }
        
        if (entity.name) {
            return entity.name;
        }
        
        if (entity.url) {
            return entity.url;
        }
        
        return entity.type || 'Reference';
    }
    
    /**
     * Format an unknown entity
     * @private
     */
    function formatUnknownEntity(entity) {
        console.warn(`Unknown entity type: ${entity.type}`);
        return `[${entity.type}]`;
    }
    
    /**
     * Format a number with specified precision
     * @private
     */
    function _formatNumber(value, precision) {
        if (value === null || value === undefined) {
            return '';
        }
        
        const num = Number(value);
        if (isNaN(num)) {
            return String(value);
        }
        
        // For whole numbers, don't show decimal places
        if (num === Math.floor(num)) {
            return String(num);
        }
        
        return num.toFixed(precision);
    }
    
    /**
     * Get an entity by name from a step
     * @param {string} name - The entity name
     * @param {Object} step - The step containing the entity
     * @returns {Object|null} The entity or null if not found
     */
    function getEntity(name, step) {
        if (!step || !step.entities || typeof step.entities !== 'object') {
            return null;
        }
        
        return step.entities[name] || null;
    }
    
    /**
     * Resolve all entities in a guide
     * @param {Object} guide - The guide to process
     * @returns {Object} The guide with resolved entities
     */
    function resolveAllEntities(guide) {
        if (!guide || !guide.phases) {
            return guide;
        }
        
        // Create a deep copy to avoid modifying the original
        const resolvedGuide = Utils.deepClone(guide);
        
        for (const phase of resolvedGuide.phases || []) {
            for (const step of phase.steps || []) {
                if (step.instruction && step.entities) {
                    step.instruction = resolveInstruction(step.instruction, step.entities);
                }
                
                // Resolve entities in warnings
                if (step.warnings && Array.isArray(step.warnings)) {
                    for (const warning of step.warnings) {
                        if (warning.description) {
                            warning.description = resolveInstruction(warning.description, step.entities);
                        }
                    }
                }
                
                // Resolve entities in resources
                if (step.resources && Array.isArray(step.resources)) {
                    for (const resource of step.resources) {
                        if (resource.description) {
                            resource.description = resolveInstruction(resource.description, step.entities);
                        }
                    }
                }
            }
        }
        
        return resolvedGuide;
    }
    
    /**
     * Get all entities from a guide
     * @param {Object} guide - The guide to search
     * @returns {Object} All entities organized by step
     */
    function getAllEntities(guide) {
        const allEntities = {};
        
        if (!guide || !guide.phases) {
            return allEntities;
        }
        
        for (const phase of guide.phases || []) {
            for (const step of phase.steps || []) {
                if (step.id && step.entities) {
                    allEntities[step.id] = step.entities;
                }
            }
        }
        
        return allEntities;
    }
    
    /**
     * Get all unique entity types in a guide
     * @param {Object} guide - The guide to search
     * @returns {Array} Array of unique entity types
     */
    function getEntityTypes(guide) {
        const types = new Set();
        
        if (!guide || !guide.phases) {
            return Array.from(types);
        }
        
        for (const phase of guide.phases || []) {
            for (const step of phase.steps || []) {
                if (step.entities) {
                    for (const entity of Object.values(step.entities)) {
                        if (entity && entity.type) {
                            types.add(entity.type);
                        }
                    }
                }
            }
        }
        
        return Array.from(types);
    }
    
    /**
     * Check if a guide contains engineering entities that can be localized
     * @param {Object} guide - The guide to check
     * @returns {boolean} True if the guide contains localizable entities
     */
    function hasLocalizableEntities(guide) {
        const engineeringTypes = [
            'pressure', 'torque', 'temperature', 'voltage', 'current', 'frequency',
            'distance', 'flow', 'weight', 'speed', 'time', 'angle', 'length', 'diameter', 'power'
        ];
        
        if (!guide || !guide.phases) {
            return false;
        }
        
        for (const phase of guide.phases || []) {
            for (const step of phase.steps || []) {
                if (step.entities) {
                    for (const entity of Object.values(step.entities)) {
                        if (entity && engineeringTypes.includes(entity.type)) {
                            return true;
                        }
                    }
                }
            }
        }
        
        return false;
    }
    
    /**
     * Clear the entity cache
     */
    function clearCache() {
        entityCache.clear();
    }
    
    // Public API
    return {
        setCurrentGuide,
        getCurrentGuide,
        resolveInstruction,
        getEntityValue,
        getEntity,
        resolveAllEntities,
        getAllEntities,
        getEntityTypes,
        hasLocalizableEntities,
        clearCache
    };
})();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Entities;
}
