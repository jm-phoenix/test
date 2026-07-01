/**
 * GuideOS Search Module
 * Version: 1.0.0
 * 
 * Handles AI context building and search functionality.
 * Part of Sprint 03 - Knowledge Engine
 */

/**
 * Search Module
 * @namespace Search
 */
const Search = (function() {
    'use strict';
    
    // AI provider configurations
    const AI_PROVIDERS = {
        none: {
            name: 'None',
            enabled: false,
            url: null
        },
        gemini: {
            name: 'Gemini',
            enabled: true,
            url: 'https://gemini.google.com/search?q={query}'
        },
        copilot: {
            name: 'Microsoft Copilot',
            enabled: true,
            url: 'https://copilot.microsoft.com/?q={query}'
        },
        perplexity: {
            name: 'Perplexity',
            enabled: true,
            url: 'https://www.perplexity.ai/search?q={query}'
        }
    };
    
    // Current AI provider
    let currentProvider = 'none';
    
    // Storage key
    const STORAGE_KEY = 'viewer_ai_provider';
    
    /**
     * Initialize the search module
     */
    function initialize() {
        const savedProvider = Storage.load(STORAGE_KEY, 'none');
        setProvider(savedProvider);
    }
    
    /**
     * Set the current AI provider
     * @param {string} provider - The provider ID
     */
    function setProvider(provider) {
        if (AI_PROVIDERS[provider]) {
            currentProvider = provider;
            Storage.save(STORAGE_KEY, provider);
        } else {
            console.warn(`Unknown AI provider: ${provider}`);
        }
    }
    
    /**
     * Get the current AI provider
     * @returns {string} The current provider ID
     */
    function getProvider() {
        return currentProvider;
    }
    
    /**
     * Get available AI providers
     * @returns {Object} Available providers
     */
    function getAvailableProviders() {
        return { ...AI_PROVIDERS };
    }
    
    /**
     * Build an AI context prompt for a step
     * @param {Object} step - The current step
     * @param {Object} guide - The complete guide
     * @param {Object} options - Additional options
     * @returns {string} The context prompt
     */
    function buildPrompt(step, guide, options = {}) {
        if (!step || !guide) {
            return '';
        }
        
        const lines = [];
        
        // Header
        lines.push('I am following a GuideOS maintenance guide.');
        lines.push('');
        
        // Guide information
        if (guide.guide) {
            lines.push(`Guide: ${guide.guide.title || 'Untitled Guide'}`);
            if (guide.guide.description) {
                lines.push(`Description: ${guide.guide.description}`);
            }
        }
        
        // Equipment information
        if (guide.equipment) {
            lines.push('');
            lines.push('Equipment:');
            if (guide.equipment.manufacturer) {
                lines.push(`  Manufacturer: ${guide.equipment.manufacturer}`);
            }
            if (guide.equipment.series) {
                lines.push(`  Series: ${guide.equipment.series}`);
            }
            if (guide.equipment.model) {
                lines.push(`  Model: ${guide.equipment.model}`);
            }
            if (guide.equipment.revision) {
                lines.push(`  Revision: ${guide.equipment.revision}`);
            }
        }
        
        // Current step information
        lines.push('');
        lines.push(`Current Step: ${step.title || 'Untitled Step'}`);
        if (step.instruction) {
            lines.push(`Instruction: ${step.instruction}`);
        }
        
        // AI context from step
        if (step.aiContext) {
            lines.push('');
            lines.push('Additional Context:');
            if (step.aiContext.purpose) {
                lines.push(`  Purpose: ${step.aiContext.purpose}`);
            }
            if (step.aiContext.expectedResult) {
                lines.push(`  Expected Result: ${step.aiContext.expectedResult}`);
            }
            if (step.aiContext.technicalExplanation) {
                lines.push(`  Technical Explanation: ${step.aiContext.technicalExplanation}`);
            }
            if (step.aiContext.commonMistakes) {
                lines.push(`  Common Mistakes: ${step.aiContext.commonMistakes}`);
            }
            if (step.aiContext.importantNotes) {
                lines.push(`  Important Notes: ${step.aiContext.importantNotes}`);
            }
        }
        
        // Relevant entities
        if (step.entities) {
            lines.push('');
            lines.push('Relevant Technical Data:');
            for (const [name, entity] of Object.entries(step.entities)) {
                if (entity) {
                    lines.push(`  ${name}: ${_formatEntity(entity)}`);
                }
            }
        }
        
        // Relevant resources
        if (step.resources && Array.isArray(step.resources) && step.resources.length > 0) {
            lines.push('');
            lines.push('Available Resources:');
            for (const resource of step.resources) {
                if (resource.title) {
                    lines.push(`  - ${resource.title}${resource.description ? `: ${resource.description}` : ''}`);
                }
            }
        }
        
        // Official documentation links
        if (guide.resources && Array.isArray(guide.resources) && guide.resources.length > 0) {
            lines.push('');
            lines.push('Official Documentation:');
            for (const resource of guide.resources) {
                if (resource.title && resource.url) {
                    lines.push(`  - ${resource.title}: ${resource.url}`);
                }
            }
        }
        
        // Footer
        lines.push('');
        lines.push('Please answer this question based on the above context.');
        lines.push('');
        lines.push('Question: {question}');
        
        return lines.join('\n');
    }
    
    /**
     * Format an entity for display in AI context
     * @private
     */
    function _formatEntity(entity) {
        if (!entity) {
            return 'Unknown';
        }
        
        const parts = [];
        
        if (entity.type) {
            parts.push(`Type: ${entity.type}`);
        }
        
        if (entity.value !== undefined) {
            parts.push(`Value: ${entity.value}`);
        }
        
        if (entity.unit) {
            parts.push(`Unit: ${entity.unit}`);
        }
        
        if (entity.name) {
            parts.push(`Name: ${entity.name}`);
        }
        
        if (entity.partNumber) {
            parts.push(`Part #: ${entity.partNumber}`);
        }
        
        if (entity.description) {
            parts.push(`Description: ${entity.description}`);
        }
        
        return parts.join(', ');
    }
    
    /**
     * Build a search URL for the current provider
     * @param {string} query - The search query
     * @returns {string|null} The search URL or null if provider doesn't support search
     */
    function buildSearchUrl(query) {
        const provider = AI_PROVIDERS[currentProvider];
        if (!provider || !provider.enabled || !provider.url) {
            return null;
        }
        
        return provider.url.replace('{query}', encodeURIComponent(query));
    }
    
    /**
     * Open a search with the current provider
     * @param {string} query - The search query
     */
    function openSearch(query) {
        const url = buildSearchUrl(query);
        if (url) {
            window.open(url, '_blank');
        } else {
            Dialogs.warning('No AI Provider', 'Please select an AI provider in the preferences.');
        }
    }
    
    /**
     * Open AI search for a specific step
     * @param {Object} step - The current step
     * @param {Object} guide - The complete guide
     * @param {string} question - The user's question
     */
    function openStepSearch(step, guide, question) {
        const prompt = buildPrompt(step, guide);
        const query = prompt.replace('{question}', question);
        openSearch(query);
    }
    
    /**
     * Build a context-aware search query
     * @param {Object} step - The current step
     * @param {Object} guide - The complete guide
     * @param {string} question - The user's question
     * @returns {string} The complete search query
     */
    function buildContextQuery(step, guide, question) {
        const prompt = buildPrompt(step, guide);
        return prompt.replace('{question}', question);
    }
    
    // Public API
    return {
        initialize,
        setProvider,
        getProvider,
        getAvailableProviders,
        buildPrompt,
        buildSearchUrl,
        openSearch,
        openStepSearch,
        buildContextQuery
    };
})();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Search;
}
