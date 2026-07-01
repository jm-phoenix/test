/**
 * GuideOS Validation Module
 * Version: 1.0.0
 * 
 * Validates GuideSpec JSON files against the specification.
 */

/**
 * Validation Module
 * @namespace Validation
 */
const Validation = (function() {
    'use strict';
    
    // Required fields for each section
    const REQUIRED_FIELDS = {
        guide: ['id', 'title', 'description', 'version', 'language', 'availableLanguages', 'category', 'difficulty', 'estimatedMinutes', 'keywords', 'author', 'created', 'updated'],
        equipment: ['manufacturer', 'series', 'model'],
        phase: ['id', 'title', 'description', 'estimatedMinutes', 'steps'],
        step: ['id', 'title', 'instruction']
    };
    
    // Supported entity types
    const SUPPORTED_ENTITY_TYPES = [
        // Engineering Values
        'pressure', 'torque', 'temperature', 'voltage', 'current', 'frequency',
        'distance', 'flow', 'weight', 'speed', 'time', 'angle',
        'length', 'diameter', 'power',
        // Technical Objects
        'tool', 'part', 'bearing', 'seal', 'lubricant', 'chemical', 'material',
        // Reference Objects
        'document', 'manual', 'video', 'website', 'warning', 'note'
    ];
    
    // Supported warning types
    const SUPPORTED_WARNING_TYPES = ['danger', 'warning', 'information', 'success'];
    
    // Supported resource types
    const SUPPORTED_RESOURCE_TYPES = [
        'OEM Manual', 'Installation Manual', 'Maintenance Manual',
        'Datasheet', 'Parts List', 'Exploded View', 'Technical Bulletin',
        'FAQ', 'Website', 'PDF'
    ];
    
    // Supported video providers
    const SUPPORTED_VIDEO_PROVIDERS = ['YouTube', 'Vimeo', 'OEM', 'Internal'];
    
    // Supported code block languages
    const SUPPORTED_CODE_LANGUAGES = [
        'Bash', 'CMD', 'PowerShell', 'Python', 'JavaScript',
        'HTML', 'JSON', 'XML', 'YAML', 'SQL'
    ];
    
    // Supported unit types
    const SUPPORTED_UNITS = {
        pressure: ['psi', 'bar', 'kPa', 'MPa'],
        torque: ['lb-ft', 'lb-in', 'N-m', 'kgf-m'],
        temperature: ['°C', '°F'],
        distance: ['km', 'mi'],
        length: ['mm', 'cm', 'm', 'in', 'ft'],
        weight: ['kg', 'g', 'lb', 'oz'],
        volume: ['L', 'mL', 'gal', 'qt'],
        flow: ['L/min', 'GPM', 'm³/h'],
        speed: ['rpm'],
        time: ['s', 'min', 'h'],
        angle: ['°', 'rad'],
        voltage: ['V', 'kV'],
        current: ['A', 'mA'],
        frequency: ['Hz', 'kHz'],
        power: ['W', 'kW', 'HP'],
        diameter: ['mm', 'cm', 'm', 'in']
    };
    
    /**
     * Validation result object
     * @typedef {Object} ValidationResult
     * @property {boolean} valid - Whether the validation passed
     * @property {Array} errors - Array of error messages
     * @property {Array} warnings - Array of warning messages
     */
    
    /**
     * Validate a GuideSpec object
     * @param {Object} guide - The guide to validate
     * @returns {ValidationResult} The validation result
     */
    function validateGuide(guide) {
        const result = {
            valid: true,
            errors: [],
            warnings: []
        };
        
        if (!guide || typeof guide !== 'object') {
            result.valid = false;
            result.errors.push('Guide is not a valid object');
            return result;
        }
        
        // Check guideSpecVersion
        if (!guide.guideSpecVersion) {
            result.warnings.push('guideSpecVersion is missing, assuming 1.0');
        } else if (guide.guideSpecVersion !== '1.0') {
            result.warnings.push(`Unsupported GuideSpec version: ${guide.guideSpecVersion}`);
        }
        
        // Validate guide section
        _validateGuideSection(guide.guide, result);
        
        // Validate equipment section
        _validateEquipmentSection(guide.equipment, result);
        
        // Validate theme section
        _validateThemeSection(guide.theme, result);
        
        // Validate phases
        if (guide.phases) {
            _validatePhases(guide.phases, result);
        } else {
            result.valid = false;
            result.errors.push('Phases are required');
        }
        
        // Validate translations
        _validateTranslations(guide.translations, result);
        
        // Validate resources
        _validateResources(guide.resources, result);
        
        // Validate videos
        _validateVideos(guide.videos, result);
        
        // Validate search links
        _validateSearchLinks(guide.searchLinks, result);
        
        // Validate metadata
        _validateMetadata(guide.metadata, result);
        
        return result;
    }
    
    /**
     * Validate the guide section
     * @private
     */
    function _validateGuideSection(guide, result) {
        if (!guide) {
            result.valid = false;
            result.errors.push('Guide section is required');
            return;
        }
        
        for (const field of REQUIRED_FIELDS.guide) {
            if (guide[field] === undefined || guide[field] === null || guide[field] === '') {
                result.valid = false;
                result.errors.push(`Guide.${field} is required`);
            }
        }
        
        // Validate guide ID format
        if (guide.id && !/^[0-9A-F]{8}$/.test(guide.id)) {
            result.valid = false;
            result.errors.push(`Guide ID must be 8 uppercase hexadecimal characters: ${guide.id}`);
        }
        
        // Validate availableLanguages
        if (guide.availableLanguages && !Array.isArray(guide.availableLanguages)) {
            result.valid = false;
            result.errors.push('Guide.availableLanguages must be an array');
        }
        
        // Validate keywords
        if (guide.keywords && !Array.isArray(guide.keywords)) {
            result.valid = false;
            result.errors.push('Guide.keywords must be an array');
        }
        
        // Validate difficulty
        const validDifficulties = ['Beginner', 'Easy', 'Intermediate', 'Advanced', 'Expert'];
        if (guide.difficulty && !validDifficulties.includes(guide.difficulty)) {
            result.warnings.push(`Unknown difficulty level: ${guide.difficulty}`);
        }
    }
    
    /**
     * Validate the equipment section
     * @private
     */
    function _validateEquipmentSection(equipment, result) {
        if (!equipment) {
            result.valid = false;
            result.errors.push('Equipment section is required');
            return;
        }
        
        for (const field of REQUIRED_FIELDS.equipment) {
            if (equipment[field] === undefined || equipment[field] === null || equipment[field] === '') {
                result.valid = false;
                result.errors.push(`Equipment.${field} is required`);
            }
        }
    }
    
    /**
     * Validate the theme section
     * @private
     */
    function _validateThemeSection(theme, result) {
        if (!theme) {
            return; // Theme is optional
        }
        
        if (theme.enabled !== undefined && typeof theme.enabled !== 'boolean') {
            result.warnings.push('Theme.enabled should be a boolean');
        }
        
        // Validate color fields
        const colorFields = ['primaryColor', 'secondaryColor', 'accentColor', 'backgroundColor', 
                            'surfaceColor', 'textColor', 'warningColor', 'dangerColor', 
                            'successColor', 'informationColor'];
        
        for (const field of colorFields) {
            if (theme[field] && !Utils.isValidHexColor(theme[field])) {
                result.warnings.push(`Invalid hex color for Theme.${field}: ${theme[field]}`);
            }
        }
    }
    
    /**
     * Validate phases
     * @private
     */
    function _validatePhases(phases, result) {
        if (!Array.isArray(phases)) {
            result.valid = false;
            result.errors.push('Phases must be an array');
            return;
        }
        
        if (phases.length === 0) {
            result.valid = false;
            result.errors.push('At least one phase is required');
            return;
        }
        
        const phaseIds = new Set();
        
        for (const phase of phases) {
            // Validate phase structure
            for (const field of REQUIRED_FIELDS.phase) {
                if (phase[field] === undefined || phase[field] === null || phase[field] === '') {
                    result.valid = false;
                    result.errors.push(`Phase.${field} is required`);
                }
            }
            
            // Check for duplicate phase IDs
            if (phase.id && phaseIds.has(phase.id)) {
                result.valid = false;
                result.errors.push(`Duplicate phase ID: ${phase.id}`);
            } else if (phase.id) {
                phaseIds.add(phase.id);
            }
            
            // Validate steps
            if (phase.steps && Array.isArray(phase.steps)) {
                _validateSteps(phase.steps, result, phase.id);
            } else {
                result.valid = false;
                result.errors.push(`Phase ${phase.id || 'unknown'} must have steps array`);
            }
        }
    }
    
    /**
     * Validate steps
     * @private
     */
    function _validateSteps(steps, result, phaseId) {
        if (!Array.isArray(steps)) {
            result.valid = false;
            result.errors.push('Steps must be an array');
            return;
        }
        
        if (steps.length === 0) {
            result.warnings.push(`Phase ${phaseId} has no steps`);
            return;
        }
        
        const stepIds = new Set();
        const stepDependencies = [];
        
        for (const step of steps) {
            // Validate step structure
            for (const field of REQUIRED_FIELDS.step) {
                if (step[field] === undefined || step[field] === null || step[field] === '') {
                    result.valid = false;
                    result.errors.push(`Step.${field} is required`);
                }
            }
            
            // Check for duplicate step IDs
            if (step.id && stepIds.has(step.id)) {
                result.valid = false;
                result.errors.push(`Duplicate step ID: ${step.id}`);
            } else if (step.id) {
                stepIds.add(step.id);
            }
            
            // Validate entities
            if (step.entities) {
                _validateEntities(step.entities, result, step.id);
            }
            
            // Validate warnings
            if (step.warnings) {
                _validateWarnings(step.warnings, result, step.id);
            }
            
            // Validate code blocks
            if (step.codeBlocks) {
                _validateCodeBlocks(step.codeBlocks, result, step.id);
            }
            
            // Validate resources
            if (step.resources) {
                _validateResources(step.resources, result, step.id);
            }
            
            // Collect dependencies for circular dependency check
            if (step.dependencies && Array.isArray(step.dependencies)) {
                stepDependencies.push({
                    stepId: step.id,
                    dependencies: step.dependencies
                });
            }
        }
        
        // Check for circular dependencies
        _checkCircularDependencies(stepDependencies, result);
    }
    
    /**
     * Validate entities
     * @private
     */
    function _validateEntities(entities, result, stepId) {
        if (!entities || typeof entities !== 'object') {
            result.warnings.push(`Step ${stepId} has invalid entities`);
            return;
        }
        
        const entityNames = new Set();
        
        for (const [name, entity] of Object.entries(entities)) {
            // Check for duplicate entity names
            if (entityNames.has(name)) {
                result.valid = false;
                result.errors.push(`Duplicate entity name in step ${stepId}: ${name}`);
            }
            entityNames.add(name);
            
            // Validate entity structure
            if (!entity || typeof entity !== 'object') {
                result.valid = false;
                result.errors.push(`Entity ${name} in step ${stepId} is not an object`);
                continue;
            }
            
            // Check for type field
            if (!entity.type) {
                result.valid = false;
                result.errors.push(`Entity ${name} in step ${stepId} is missing type`);
                continue;
            }
            
            // Check if type is supported
            if (!SUPPORTED_ENTITY_TYPES.includes(entity.type)) {
                result.warnings.push(`Unsupported entity type in step ${stepId}: ${entity.type}`);
            }
            
            // Validate entity based on type
            _validateEntityByType(entity, result, stepId, name);
        }
    }
    
    /**
     * Validate entity by its type
     * @private
     */
    function _validateEntityByType(entity, result, stepId, entityName) {
        const type = entity.type;
        
        // Engineering value types
        if (['pressure', 'torque', 'temperature', 'voltage', 'current', 'frequency',
              'distance', 'flow', 'weight', 'speed', 'time', 'angle', 'length', 'diameter', 'power'].includes(type)) {
            
            if (entity.value === undefined) {
                result.valid = false;
                result.errors.push(`Entity ${entityName} in step ${stepId} is missing value`);
            }
            
            if (entity.unit === undefined) {
                result.valid = false;
                result.errors.push(`Entity ${entityName} in step ${stepId} is missing unit`);
            } else if (SUPPORTED_UNITS[type] && !SUPPORTED_UNITS[type].includes(entity.unit)) {
                result.warnings.push(`Unsupported unit for ${type} entity ${entityName} in step ${stepId}: ${entity.unit}`);
            }
        }
        
        // Object types
        if (['tool', 'part', 'bearing', 'seal', 'lubricant', 'chemical', 'material'].includes(type)) {
            if (!entity.name && !entity.partNumber && !entity.description) {
                result.warnings.push(`Entity ${entityName} in step ${stepId} (${type}) has no identifying information`);
            }
        }
        
        // Reference types
        if (['document', 'manual', 'video', 'website'].includes(type)) {
            if (!entity.title && !entity.url) {
                result.warnings.push(`Entity ${entityName} in step ${stepId} (${type}) has no title or URL`);
            }
        }
    }
    
    /**
     * Validate warnings
     * @private
     */
    function _validateWarnings(warnings, result, stepId) {
        if (!Array.isArray(warnings)) {
            result.warnings.push(`Step ${stepId} has invalid warnings`);
            return;
        }
        
        for (const warning of warnings) {
            if (!warning || typeof warning !== 'object') {
                result.warnings.push(`Invalid warning in step ${stepId}`);
                continue;
            }
            
            if (!warning.type) {
                result.warnings.push(`Warning in step ${stepId} is missing type`);
            } else if (!SUPPORTED_WARNING_TYPES.includes(warning.type)) {
                result.warnings.push(`Unsupported warning type in step ${stepId}: ${warning.type}`);
            }
            
            if (!warning.title && !warning.description) {
                result.warnings.push(`Warning in step ${stepId} has no title or description`);
            }
        }
    }
    
    /**
     * Validate code blocks
     * @private
     */
    function _validateCodeBlocks(codeBlocks, result, stepId) {
        if (!Array.isArray(codeBlocks)) {
            result.warnings.push(`Step ${stepId} has invalid codeBlocks`);
            return;
        }
        
        for (const block of codeBlocks) {
            if (!block || typeof block !== 'object') {
                result.warnings.push(`Invalid code block in step ${stepId}`);
                continue;
            }
            
            if (!block.code) {
                result.warnings.push(`Code block in step ${stepId} is missing code`);
            }
            
            if (block.language && !SUPPORTED_CODE_LANGUAGES.includes(block.language)) {
                result.warnings.push(`Unsupported code language in step ${stepId}: ${block.language}`);
            }
        }
    }
    
    /**
     * Validate resources
     * @private
     */
    function _validateResources(resources, result, context = '') {
        if (!resources || !Array.isArray(resources)) {
            if (context) {
                result.warnings.push(`${context} has invalid resources`);
            }
            return;
        }
        
        for (const resource of resources) {
            if (!resource || typeof resource !== 'object') {
                result.warnings.push(`Invalid resource in ${context}`);
                continue;
            }
            
            if (resource.type && !SUPPORTED_RESOURCE_TYPES.includes(resource.type)) {
                result.warnings.push(`Unsupported resource type in ${context}: ${resource.type}`);
            }
            
            if (!resource.title && !resource.url) {
                result.warnings.push(`Resource in ${context} has no title or URL`);
            }
        }
    }
    
    /**
     * Validate videos
     * @private
     */
    function _validateVideos(videos, result) {
        if (!videos || !Array.isArray(videos)) {
            return;
        }
        
        for (const video of videos) {
            if (!video || typeof video !== 'object') {
                result.warnings.push('Invalid video entry');
                continue;
            }
            
            if (!video.url) {
                result.warnings.push('Video is missing URL');
            }
        }
    }
    
    /**
     * Validate search links
     * @private
     */
    function _validateSearchLinks(searchLinks, result) {
        if (!searchLinks || !Array.isArray(searchLinks)) {
            return;
        }
        
        for (const link of searchLinks) {
            if (!link || typeof link !== 'object') {
                result.warnings.push('Invalid search link entry');
                continue;
            }
            
            if (!link.title && !link.url) {
                result.warnings.push('Search link has no title or URL');
            }
        }
    }
    
    /**
     * Validate metadata
     * @private
     */
    function _validateMetadata(metadata, result) {
        if (!metadata || typeof metadata !== 'object') {
            return; // Metadata is optional
        }
        
        // Metadata can contain any properties, no validation needed
    }
    
    /**
     * Validate translations
     * @private
     */
    function _validateTranslations(translations, result) {
        if (!translations || typeof translations !== 'object') {
            return; // Translations are optional
        }
        
        // Translations can contain any language codes
    }
    
    /**
     * Check for circular dependencies in steps
     * @private
     */
    function _checkCircularDependencies(dependencies, result) {
        if (!dependencies || dependencies.length === 0) {
            return;
        }
        
        // Build dependency graph
        const graph = {};
        const allStepIds = new Set();
        
        for (const dep of dependencies) {
            allStepIds.add(dep.stepId);
            graph[dep.stepId] = dep.dependencies || [];
        }
        
        // Check each step for circular dependencies
        for (const stepId of allStepIds) {
            const visited = new Set();
            const stack = new Set();
            
            if (_hasCircularDependency(stepId, graph, visited, stack)) {
                result.valid = false;
                result.errors.push(`Circular dependency detected involving step: ${stepId}`);
                return; // Only report once
            }
        }
    }
    
    /**
     * Check if a step has circular dependencies
     * @private
     */
    function _hasCircularDependency(stepId, graph, visited, stack) {
        if (stack.has(stepId)) {
            return true;
        }
        
        if (visited.has(stepId)) {
            return false;
        }
        
        visited.add(stepId);
        stack.add(stepId);
        
        const dependencies = graph[stepId] || [];
        
        for (const depId of dependencies) {
            if (_hasCircularDependency(depId, graph, visited, stack)) {
                return true;
            }
        }
        
        stack.delete(stepId);
        return false;
    }
    
    // Public API
    return {
        validateGuide,
        validateMetadata: _validateMetadata,
        validatePhases: _validatePhases,
        validateSteps: _validateSteps,
        getSupportedEntityTypes: () => [...SUPPORTED_ENTITY_TYPES],
        getSupportedWarningTypes: () => [...SUPPORTED_WARNING_TYPES],
        getSupportedResourceTypes: () => [...SUPPORTED_RESOURCE_TYPES],
        getSupportedUnits: () => ({ ...SUPPORTED_UNITS })
    };
})();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Validation;
}
