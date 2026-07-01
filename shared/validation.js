/**
 * GuideOS
 * Module: validation.js
 * Version: 1.0.0
 * Purpose: Validation Engine for GuideSpec and GuideDraft.
 * Follows CODING_STANDARD.md: No DOM manipulation, single responsibility.
 */

/**
 * Validation Engine for GuideOS.
 * Validates GuideSpec JSON against the specification.
 * Never modifies data. Returns structured results.
 */
const Validation = (function() {
    'use strict';

    // Supported GuideSpec versions
    const SUPPORTED_VERSIONS = ['1.0'];

    // Supported entity types (from GUIDE_SPEC.md)
    const SUPPORTED_ENTITY_TYPES = {
        // Engineering Values
        pressure: true,
        torque: true,
        distance: true,
        length: true,
        temperature: true,
        weight: true,
        volume: true,
        flow: true,
        speed: true,
        time: true,
        angle: true,
        voltage: true,
        current: true,
        frequency: true,
        power: true,
        diameter: true,
        
        // Technical Objects
        tool: true,
        part: true,
        chemical: true,
        bearing: true,
        seal: true,
        lubricant: true,
        wireGauge: true,
        thread: true,
        fastener: true,
        material: true,
        
        // Reference Objects
        document: true,
        manual: true,
        video: true,
        website: true,
        warning: true,
        note: true
    };

    // Supported units (from GUIDE_SPEC.md)
    const SUPPORTED_UNITS = {
        pressure: ['psi', 'bar', 'kPa', 'MPa'],
        torque: ['lb-ft', 'lb-in', 'N-m', 'kgf-m'],
        distance: ['km', 'mi'],
        length: ['mm', 'cm', 'm', 'in', 'ft'],
        temperature: ['°C', '°F'],
        volume: ['L', 'mL', 'gal', 'qt'],
        flow: ['L/min', 'GPM', 'm³/h'],
        weight: ['kg', 'g', 'lb', 'oz'],
        power: ['W', 'kW', 'HP'],
        voltage: ['V', 'kV'],
        current: ['A', 'mA'],
        frequency: ['Hz', 'kHz'],
        speed: ['rpm'],
        time: ['s', 'min', 'h'],
        angle: ['°', 'rad'],
        diameter: ['mm', 'cm', 'm', 'in']
    };

    // Required fields for GuideSpec
    const REQUIRED_GUIDE_FIELDS = [
        'guideSpecVersion',
        'guide'
    ];

    const REQUIRED_GUIDE_METADATA = [
        'title'
    ];

    const REQUIRED_PHASE_FIELDS = [
        'id',
        'title',
        'steps'
    ];

    const REQUIRED_STEP_FIELDS = [
        'id',
        'title',
        'instruction'
    ];

    /**
     * Validate a GuideSpec object.
     * @param {Object} guideSpec - The GuideSpec to validate.
     * @returns {Object} - Validation result with success, errors, and warnings.
     */
    function validateGuideSpec(guideSpec) {
        const result = {
            success: true,
            errors: [],
            warnings: []
        };

        if (!guideSpec || typeof guideSpec !== 'object') {
            result.success = false;
            result.errors.push('GuideSpec is not a valid object');
            return result;
        }

        // Check version
        if (!guideSpec.guideSpecVersion) {
            result.success = false;
            result.errors.push('Missing guideSpecVersion');
        } else if (!SUPPORTED_VERSIONS.includes(guideSpec.guideSpecVersion)) {
            result.success = false;
            result.errors.push('Unsupported GuideSpec version: ' + guideSpec.guideSpecVersion);
        }

        // Check required fields
        for (const field of REQUIRED_GUIDE_FIELDS) {
            if (!(field in guideSpec)) {
                result.success = false;
                result.errors.push('Missing required field: ' + field);
            }
        }

        // Validate guide metadata
        if (guideSpec.guide) {
            validateGuideMetadata(guideSpec.guide, result);
        }

        // Validate equipment
        if (guideSpec.equipment) {
            validateEquipment(guideSpec.equipment, result);
        }

        // Validate theme
        if (guideSpec.theme) {
            validateTheme(guideSpec.theme, result);
        }

        // Validate phases
        if (guideSpec.phases) {
            validatePhases(guideSpec.phases, result);
        } else {
            result.success = false;
            result.errors.push('Missing phases array');
        }

        // Validate resources
        if (guideSpec.resources) {
            validateResources(guideSpec.resources, result);
        }

        // Check for circular dependencies
        if (guideSpec.phases) {
            checkCircularDependencies(guideSpec.phases, result);
        }

        // If there are errors, mark as unsuccessful
        result.success = result.errors.length === 0;

        return result;
    }

    /**
     * Validate guide metadata.
     * @param {Object} guide - The guide metadata.
     * @param {Object} result - The validation result object.
     */
    function validateGuideMetadata(guide, result) {
        for (const field of REQUIRED_GUIDE_METADATA) {
            if (!(field in guide)) {
                result.success = false;
                result.errors.push('Missing required guide metadata: ' + field);
            }
        }

        // Check Guide ID format if present
        if (guide.id) {
            if (!/^[0-9A-F]{8}$/i.test(guide.id)) {
                result.warnings.push('Guide ID "' + guide.id + '" does not match the recommended format (8 uppercase hex characters)');
            }
        } else {
            result.warnings.push('Guide ID is missing (recommended for published guides)');
        }

        // Check version format
        if (guide.version && !/^\d+\.\d+\.\d+$/.test(guide.version)) {
            result.warnings.push('Guide version "' + guide.version + '" does not follow semantic versioning');
        }

        // Check difficulty
        const validDifficulties = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
        if (guide.difficulty && !validDifficulties.includes(guide.difficulty)) {
            result.warnings.push('Invalid difficulty level: ' + guide.difficulty);
        }

        // Check language
        if (guide.language && guide.language.length !== 2) {
            result.warnings.push('Language code should be 2 characters: ' + guide.language);
        }

        // Check availableLanguages
        if (guide.availableLanguages) {
            if (!Array.isArray(guide.availableLanguages)) {
                result.warnings.push('availableLanguages should be an array');
            } else {
                guide.availableLanguages.forEach(function(lang) {
                    if (typeof lang !== 'string' || lang.length !== 2) {
                        result.warnings.push('Invalid language code in availableLanguages: ' + lang);
                    }
                });
            }
        }
    }

    /**
     * Validate equipment.
     * @param {Object} equipment - The equipment object.
     * @param {Object} result - The validation result object.
     */
    function validateEquipment(equipment, result) {
        if (!equipment.manufacturer) {
            result.warnings.push('Equipment is missing manufacturer');
        }
        if (!equipment.model) {
            result.warnings.push('Equipment is missing model');
        }
    }

    /**
     * Validate theme.
     * @param {Object} theme - The theme object.
     * @param {Object} result - The validation result object.
     */
    function validateTheme(theme, result) {
        // Check color format (hexadecimal)
        const colorFields = [
            'primaryColor', 'secondaryColor', 'accentColor',
            'backgroundColor', 'surfaceColor', 'textColor',
            'warningColor', 'dangerColor', 'successColor', 'informationColor'
        ];

        colorFields.forEach(function(field) {
            if (theme[field] && !isValidHexColor(theme[field])) {
                result.errors.push('Invalid color format for theme.' + field + ': ' + theme[field]);
            }
        });
    }

    /**
     * Validate phases.
     * @param {Array} phases - The phases array.
     * @param {Object} result - The validation result object.
     */
    function validatePhases(phases, result) {
        if (!Array.isArray(phases)) {
            result.errors.push('Phases must be an array');
            return;
        }

        if (phases.length === 0) {
            result.errors.push('At least one phase is required');
            return;
        }

        const phaseIds = new Set();

        phases.forEach(function(phase, index) {
            // Check required fields
            for (const field of REQUIRED_PHASE_FIELDS) {
                if (!(field in phase)) {
                    result.errors.push('Phase ' + (index + 1) + ' is missing required field: ' + field);
                }
            }

            // Check for duplicate phase IDs
            if (phase.id) {
                if (phaseIds.has(phase.id)) {
                    result.errors.push('Duplicate phase ID: ' + phase.id);
                } else {
                    phaseIds.add(phase.id);
                }
            }

            // Validate steps
            if (phase.steps) {
                validateSteps(phase.steps, phase.id, result);
            }

            // Validate estimatedMinutes
            if (phase.estimatedMinutes !== undefined && typeof phase.estimatedMinutes !== 'number') {
                result.warnings.push('Phase ' + phase.id + ' has invalid estimatedMinutes');
            }
        });
    }

    /**
     * Validate steps.
     * @param {Array} steps - The steps array.
     * @param {string} phaseId - The parent phase ID.
     * @param {Object} result - The validation result object.
     */
    function validateSteps(steps, phaseId, result) {
        if (!Array.isArray(steps)) {
            result.errors.push('Steps in phase ' + phaseId + ' must be an array');
            return;
        }

        if (steps.length === 0) {
            result.warnings.push('Phase ' + phaseId + ' has no steps');
            return;
        }

        const stepIds = new Set();

        steps.forEach(function(step, index) {
            // Check required fields
            for (const field of REQUIRED_STEP_FIELDS) {
                if (!(field in step)) {
                    result.errors.push('Step ' + (index + 1) + ' in phase ' + phaseId + ' is missing required field: ' + field);
                }
            }

            // Check for duplicate step IDs
            if (step.id) {
                if (stepIds.has(step.id)) {
                    result.errors.push('Duplicate step ID in phase ' + phaseId + ': ' + step.id);
                } else {
                    stepIds.add(step.id);
                }
            }

            // Validate entities
            if (step.entities) {
                validateEntities(step.entities, phaseId, step.id, result);
            }

            // Validate warnings
            if (step.warnings) {
                validateWarnings(step.warnings, phaseId, step.id, result);
            }

            // Validate resources
            if (step.resources) {
                validateResources(step.resources, phaseId, step.id, result);
            }

            // Validate estimatedMinutes
            if (step.estimatedMinutes !== undefined && typeof step.estimatedMinutes !== 'number') {
                result.warnings.push('Step ' + step.id + ' in phase ' + phaseId + ' has invalid estimatedMinutes');
            }

            // Validate dependencies
            if (step.dependencies) {
                validateDependencies(step.dependencies, phaseId, step.id, result);
            }
        });
    }

    /**
     * Validate entities.
     * @param {Object} entities - The entities object.
     * @param {string} phaseId - The parent phase ID.
     * @param {string} stepId - The parent step ID.
     * @param {Object} result - The validation result object.
     */
    function validateEntities(entities, phaseId, stepId, result) {
        if (typeof entities !== 'object' || entities === null) {
            result.errors.push('Entities in step ' + stepId + ' (phase ' + phaseId + ') must be an object');
            return;
        }

        const entityNames = new Set();

        for (const [name, entity] of Object.entries(entities)) {
            // Check for duplicate entity names
            if (entityNames.has(name)) {
                result.errors.push('Duplicate entity name in step ' + stepId + ': ' + name);
            } else {
                entityNames.add(name);
            }

            // Check entity type
            if (!entity.type) {
                result.errors.push('Entity ' + name + ' in step ' + stepId + ' is missing type');
            } else if (!SUPPORTED_ENTITY_TYPES[entity.type]) {
                result.errors.push('Unsupported entity type in step ' + stepId + ': ' + entity.type);
            }

            // Validate entity based on type
            validateEntityByType(entity, name, phaseId, stepId, result);
        }
    }

    /**
     * Validate an entity based on its type.
     * @param {Object} entity - The entity to validate.
     * @param {string} name - The entity name.
     * @param {string} phaseId - The parent phase ID.
     * @param {string} stepId - The parent step ID.
     * @param {Object} result - The validation result object.
     */
    function validateEntityByType(entity, name, phaseId, stepId, result) {
        switch (entity.type) {
            case 'torque':
            case 'pressure':
            case 'temperature':
            case 'voltage':
            case 'current':
            case 'frequency':
            case 'distance':
            case 'length':
            case 'weight':
            case 'volume':
            case 'flow':
            case 'speed':
            case 'time':
            case 'angle':
            case 'power':
            case 'diameter':
                // Engineering values require value and unit
                if (entity.value === undefined) {
                    result.errors.push('Entity ' + name + ' (type: ' + entity.type + ') in step ' + stepId + ' is missing value');
                }
                if (!entity.unit) {
                    result.errors.push('Entity ' + name + ' (type: ' + entity.type + ') in step ' + stepId + ' is missing unit');
                } else if (!isValidUnit(entity.type, entity.unit)) {
                    result.errors.push('Invalid unit for ' + entity.type + ' entity ' + name + ' in step ' + stepId + ': ' + entity.unit);
                }
                break;

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
                // Object entities require name or partNumber
                if (!entity.name && !entity.partNumber) {
                    result.warnings.push('Entity ' + name + ' (type: ' + entity.type + ') in step ' + stepId + ' should have a name or partNumber');
                }
                break;

            case 'document':
            case 'manual':
            case 'video':
            case 'website':
                // Reference entities should have a URL or title
                if (!entity.url && !entity.title) {
                    result.warnings.push('Entity ' + name + ' (type: ' + entity.type + ') in step ' + stepId + ' should have a URL or title');
                }
                break;
        }
    }

    /**
     * Validate warnings.
     * @param {Array} warnings - The warnings array.
     * @param {string} phaseId - The parent phase ID.
     * @param {string} stepId - The parent step ID.
     * @param {Object} result - The validation result object.
     */
    function validateWarnings(warnings, phaseId, stepId, result) {
        if (!Array.isArray(warnings)) {
            result.errors.push('Warnings in step ' + stepId + ' (phase ' + phaseId + ') must be an array');
            return;
        }

        const validTypes = ['danger', 'warning', 'information', 'success'];

        warnings.forEach(function(warning, index) {
            if (!warning.type) {
                result.warnings.push('Warning ' + index + ' in step ' + stepId + ' is missing type');
            } else if (!validTypes.includes(warning.type)) {
                result.warnings.push('Invalid warning type in step ' + stepId + ': ' + warning.type);
            }

            if (!warning.title && !warning.description) {
                result.warnings.push('Warning ' + index + ' in step ' + stepId + ' should have a title or description');
            }
        });
    }

    /**
     * Validate resources.
     * @param {Array} resources - The resources array.
     * @param {string} phaseId - The parent phase ID (optional).
     * @param {string} stepId - The parent step ID (optional).
     * @param {Object} result - The validation result object.
     */
    function validateResources(resources, phaseId, stepId, result) {
        if (!Array.isArray(resources)) {
            const location = phaseId && stepId ? 'step ' + stepId + ' (phase ' + phaseId + ')' : 'guide';
            result.errors.push('Resources in ' + location + ' must be an array');
            return;
        }

        resources.forEach(function(resource, index) {
            const location = phaseId && stepId ? 'step ' + stepId : (phaseId ? 'phase ' + phaseId : 'guide');
            
            if (!resource.title) {
                result.warnings.push('Resource ' + index + ' in ' + location + ' is missing title');
            }

            if (resource.url && !isValidUrl(resource.url)) {
                result.warnings.push('Invalid URL for resource ' + index + ' in ' + location + ': ' + resource.url);
            }
        });
    }

    /**
     * Validate dependencies.
     * @param {Array} dependencies - The dependencies array.
     * @param {string} phaseId - The parent phase ID.
     * @param {string} stepId - The parent step ID.
     * @param {Object} result - The validation result object.
     */
    function validateDependencies(dependencies, phaseId, stepId, result) {
        if (!Array.isArray(dependencies)) {
            result.errors.push('Dependencies in step ' + stepId + ' (phase ' + phaseId + ') must be an array');
            return;
        }

        dependencies.forEach(function(dep) {
            if (typeof dep !== 'string') {
                result.errors.push('Invalid dependency in step ' + stepId + ': must be a string');
            }
        });
    }

    /**
     * Check for circular dependencies in phases/steps.
     * @param {Array} phases - The phases array.
     * @param {Object} result - The validation result object.
     */
    function checkCircularDependencies(phases, result) {
        // Build a map of all step IDs and their dependencies
        const stepDependencies = {};
        const allStepIds = new Set();

        phases.forEach(function(phase) {
            if (phase.steps) {
                phase.steps.forEach(function(step) {
                    allStepIds.add(step.id);
                    if (step.dependencies) {
                        stepDependencies[step.id] = step.dependencies;
                    }
                });
            }
        });

        // Check each step's dependencies
        for (const [stepId, deps] of Object.entries(stepDependencies)) {
            deps.forEach(function(dep) {
                if (!allStepIds.has(dep)) {
                    result.warnings.push('Step ' + stepId + ' depends on non-existent step: ' + dep);
                }
            });
        }

        // Simple circular dependency check (for small graphs)
        // For large graphs, a more sophisticated algorithm would be needed
        for (const stepId of allStepIds) {
            if (hasCircularDependency(stepId, stepDependencies, new Set())) {
                result.errors.push('Circular dependency detected involving step: ' + stepId);
                return; // Only report once
            }
        }
    }

    /**
     * Recursively check for circular dependencies.
     * @param {string} stepId - The step ID to check.
     * @param {Object} dependencies - The dependencies map.
     * @param {Set} visited - Set of visited step IDs.
     * @returns {boolean} - True if circular dependency found.
     */
    function hasCircularDependency(stepId, dependencies, visited) {
        if (visited.has(stepId)) {
            return true;
        }

        visited.add(stepId);

        const deps = dependencies[stepId];
        if (deps) {
            for (const dep of deps) {
                if (hasCircularDependency(dep, dependencies, new Set(visited))) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Check if a color is valid hexadecimal.
     * @param {string} color - The color to check.
     * @returns {boolean} - True if valid.
     */
    function isValidHexColor(color) {
        if (!color || typeof color !== 'string') {
            return false;
        }
        
        // Match #RGB, #RRGGBB, or #RRGGBBAA
        const hexColorRegex = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/;
        return hexColorRegex.test(color);
    }

    /**
     * Check if a unit is valid for an entity type.
     * @param {string} entityType - The entity type.
     * @param {string} unit - The unit to check.
     * @returns {boolean} - True if valid.
     */
    function isValidUnit(entityType, unit) {
        if (!SUPPORTED_UNITS[entityType]) {
            return false;
        }
        return SUPPORTED_UNITS[entityType].includes(unit);
    }

    /**
     * Check if a URL is valid.
     * @param {string} url - The URL to check.
     * @returns {boolean} - True if valid.
     */
    function isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    }

    // Public API
    return {
        validateGuideSpec: validateGuideSpec,
        validateGuideMetadata: validateGuideMetadata,
        validatePhases: validatePhases,
        validateSteps: validateSteps,
        validateEntities: validateEntities,
        validateTheme: validateTheme,
        SUPPORTED_VERSIONS: SUPPORTED_VERSIONS,
        SUPPORTED_ENTITY_TYPES: SUPPORTED_ENTITY_TYPES,
        SUPPORTED_UNITS: SUPPORTED_UNITS
    };
})();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Validation;
}
