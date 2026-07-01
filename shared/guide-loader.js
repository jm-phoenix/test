/**
 * GuideOS Guide Loader Module
 * Version: 1.0.0
 * 
 * Handles loading GuideSpec JSON files from the server.
 */

/**
 * Guide Loader Module
 * @namespace GuideLoader
 */
const GuideLoader = (function() {
    'use strict';
    
    const GUIDES_BASE_PATH = 'guides';
    
    /**
     * Calculate the path for a guide based on its ID
     * @param {string} guideId - The guide ID
     * @returns {string} The full path to the guide JSON file
     */
    function calculateGuidePath(guideId) {
        if (!guideId || typeof guideId !== 'string') {
            return null;
        }
        
        // Guide ID must be 8 characters
        const normalizedId = guideId.toUpperCase();
        if (normalizedId.length !== 8) {
            return null;
        }
        
        // Split into two-character folders
        const folder1 = normalizedId.substring(0, 2);
        const folder2 = normalizedId.substring(2, 4);
        
        // Return path: guides/XX/XXXXXXXX.json
        return `${GUIDES_BASE_PATH}/${folder1}/${normalizedId}.json`;
    }
    
    /**
     * Load a guide from a URL
     * @param {string} url - The URL to load the guide from
     * @returns {Promise<Object|null>} The guide data or null if failed
     */
    function loadGuideFromUrl(url) {
        return new Promise((resolve) => {
            if (!url || typeof url !== 'string') {
                resolve(null);
                return;
            }
            
            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(data => {
                    resolve(data);
                })
                .catch(error => {
                    console.error('Failed to load guide from URL:', url, error);
                    resolve(null);
                });
        });
    }
    
    /**
     * Load a guide by its ID
     * @param {string} guideId - The guide ID
     * @returns {Promise<Object|null>} The guide data or null if failed
     */
    function loadGuide(guideId) {
        const path = calculateGuidePath(guideId);
        if (!path) {
            return Promise.resolve(null);
        }
        
        return loadGuideFromUrl(path);
    }
    
    /**
     * Check if a guide exists
     * @param {string} guideId - The guide ID
     * @returns {Promise<boolean>} True if the guide exists
     */
    function guideExists(guideId) {
        const path = calculateGuidePath(guideId);
        if (!path) {
            return Promise.resolve(false);
        }
        
        return fetch(path, { method: 'HEAD' })
            .then(response => {
                return response.ok;
            })
            .catch(() => {
                return false;
            });
    }
    
    /**
     * Get a sample guide for testing
     * @returns {Object} Sample guide data
     */
    function getSampleGuide() {
        return {
            guideSpecVersion: '1.0',
            guide: {
                id: 'SAMPLE001',
                title: 'Sample Guide',
                description: 'A sample guide for testing',
                version: '1.0.0',
                language: 'en',
                availableLanguages: ['en'],
                category: 'Test',
                difficulty: 'Easy',
                estimatedMinutes: 10,
                keywords: ['sample', 'test'],
                author: 'GuideOS',
                created: '2026-01-01T00:00:00Z',
                updated: '2026-01-01T00:00:00Z'
            },
            equipment: {
                manufacturer: 'Test Corp',
                series: 'Test Series',
                model: 'Test Model'
            },
            phases: [
                {
                    id: 'PHASE-01',
                    title: 'Test Phase',
                    description: 'A test phase',
                    estimatedMinutes: 10,
                    steps: [
                        {
                            id: 'STEP-01',
                            title: 'Test Step',
                            instruction: 'This is a test step.'
                        }
                    ]
                }
            ]
        };
    }
    
    // Public API
    return {
        calculateGuidePath,
        loadGuide,
        loadGuideFromUrl,
        guideExists,
        getSampleGuide
    };
})();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GuideLoader;
}
