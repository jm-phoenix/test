/**
 * GuideOS
 * Module: guide-loader.js
 * Version: 1.0.0
 * Purpose: Load and parse GuideSpec files.
 * Follows CODING_STANDARD.md: No DOM manipulation, single responsibility.
 */

/**
 * Guide Loader for GuideOS Viewer.
 * Handles loading GuideSpec JSON from various sources.
 * Validates and parses the guide before rendering.
 */
const GuideLoader = (function() {
    'use strict';

    // Cache for loaded guides
    const guideCache = {};

    /**
     * Load a guide by ID.
     * @param {string} guideId - The guide ID (8 hex characters).
     * @param {Object} options - Options for loading.
     * @param {Function} options.onSuccess - Callback for successful load.
     * @param {Function} options.onError - Callback for errors.
     * @param {Function} options.onNotFound - Callback for guide not found.
     * @returns {Promise} - Promise that resolves with the guide or rejects with error.
     */
    function loadGuide(guideId, options) {
        if (!guideId) {
            const error = new Error('Guide ID is required');
            if (options && options.onError) {
                options.onError(error);
            }
            return Promise.reject(error);
        }

        // Normalize guide ID to uppercase
        const normalizedId = guideId.toUpperCase();

        // Check cache first
        if (guideCache[normalizedId]) {
            if (options && options.onSuccess) {
                options.onSuccess(guideCache[normalizedId]);
            }
            return Promise.resolve(guideCache[normalizedId]);
        }

        // Calculate guide path
        const guidePath = Utils.calculateGuidePath(normalizedId);

        // Try to fetch the guide
        return fetchGuide(guidePath, normalizedId, options);
    }

    /**
     * Fetch a guide from the server.
     * @param {string} path - The path to the guide JSON file.
     * @param {string} guideId - The guide ID.
     * @param {Object} options - Options for loading.
     * @returns {Promise} - Promise that resolves with the guide.
     */
    function fetchGuide(path, guideId, options) {
        // For demo purposes, check if it's the sample guide
        if (guideId === 'SAMPLE001') {
            return loadSampleGuide(guideId, options);
        }

        return fetch(path)
            .then(function(response) {
                if (!response.ok) {
                    throw new Error('Guide not found: ' + response.status);
                }
                return response.json();
            })
            .then(function(guide) {
                // Validate the guide
                const validation = Validation.validateGuideSpec(guide);
                if (!validation.success) {
                    throw new Error('Invalid GuideSpec: ' + validation.errors.join(', '));
                }

                // Cache the guide
                guideCache[guideId] = guide;

                if (options && options.onSuccess) {
                    options.onSuccess(guide);
                }

                return guide;
            })
            .catch(function(error) {
                console.error('Failed to load guide:', error);
                
                if (options && options.onError) {
                    options.onError(error);
                }
                
                // Check if it's a 404 (guide not found)
                if (error.message && error.message.includes('404')) {
                    if (options && options.onNotFound) {
                        options.onNotFound(guideId);
                    }
                }

                return Promise.reject(error);
            });
    }

    /**
     * Load the sample guide (for demo purposes).
     * @param {string} guideId - The guide ID.
     * @param {Object} options - Options for loading.
     * @returns {Promise} - Promise that resolves with the sample guide.
     */
    function loadSampleGuide(guideId, options) {
        // Sample guide data (same as in SAMPLE001.json)
        const sampleGuide = {
            guideSpecVersion: '1.0',
            guide: {
                id: 'SAMPLE001',
                title: 'Pump Maintenance Procedure',
                description: 'Complete maintenance procedure for centrifugal pumps',
                version: '1.0.0',
                language: 'en',
                availableLanguages: ['en'],
                category: 'Maintenance',
                difficulty: 'Intermediate',
                estimatedMinutes: 120,
                keywords: ['pump', 'maintenance', 'centrifugal', 'wilden'],
                author: 'GuideOS Team',
                created: '2026-01-01',
                updated: '2026-06-28'
            },
            equipment: {
                manufacturer: 'Wilden',
                series: 'P8',
                model: 'P8-15',
                revision: 'A',
                voltage: 480,
                frequency: 60,
                fluid: 'Water'
            },
            theme: {
                enabled: true,
                primaryColor: '#0054a6',
                secondaryColor: '#6c757d',
                accentColor: '#007bff',
                backgroundColor: '#f0f4f8',
                surfaceColor: '#ffffff',
                textColor: '#1a1a1a'
            },
            phases: [
                {
                    id: 'PHASE-01',
                    title: 'Preparation',
                    description: 'Prepare the pump and workspace for maintenance.',
                    estimatedMinutes: 15,
                    steps: [
                        {
                            id: 'STEP-01',
                            title: 'Safety First',
                            instruction: 'Ensure the pump is isolated from power and pressure. Lock out and tag out all energy sources.',
                            estimatedMinutes: 5,
                            warnings: [
                                {
                                    type: 'danger',
                                    title: 'Electrical Hazard',
                                    description: 'Failure to lock out power can result in serious injury or death.'
                                }
                            ]
                        },
                        {
                            id: 'STEP-02',
                            title: 'Gather Tools',
                            instruction: 'Collect all required tools: {tool1}, {tool2}, and {tool3}.',
                            estimatedMinutes: 5,
                            entities: {
                                tool1: { type: 'tool', name: 'Torque Wrench' },
                                tool2: { type: 'tool', name: 'Screwdrivers' },
                                tool3: { type: 'tool', name: 'Pliers' }
                            }
                        },
                        {
                            id: 'STEP-03',
                            title: 'Prepare Workspace',
                            instruction: 'Clear the area around the pump and ensure adequate lighting.',
                            estimatedMinutes: 5
                        }
                    ]
                },
                {
                    id: 'PHASE-02',
                    title: 'Disassembly',
                    description: 'Remove pump components for inspection.',
                    estimatedMinutes: 45,
                    steps: [
                        {
                            id: 'STEP-04',
                            title: 'Remove Cover Bolts',
                            instruction: 'Remove the four cover bolts using a {tool1}. Torque specification: {torque1}.',
                            estimatedMinutes: 10,
                            entities: {
                                tool1: { type: 'tool', name: 'Socket Wrench' },
                                torque1: { type: 'torque', value: 25, unit: 'lb-ft', precision: 0 }
                            },
                            warnings: [
                                {
                                    type: 'warning',
                                    title: 'Bolt Order',
                                    description: 'Remove bolts in a cross pattern to avoid warping the cover.'
                                }
                            ]
                        },
                        {
                            id: 'STEP-05',
                            title: 'Inspect Diaphragm',
                            instruction: 'Remove the diaphragm and inspect for cracks or wear. Replace if damaged.',
                            estimatedMinutes: 15,
                            resources: [
                                {
                                    title: 'Diaphragm Inspection Guide',
                                    description: 'OEM guide for diaphragm inspection',
                                    url: 'https://example.com/diaphragm-inspection'
                                }
                            ]
                        },
                        {
                            id: 'STEP-06',
                            title: 'Check Valves',
                            instruction: 'Inspect all check valves for proper seating and wear.',
                            estimatedMinutes: 10
                        }
                    ]
                },
                {
                    id: 'PHASE-03',
                    title: 'Reassembly',
                    description: 'Reassemble the pump with new components.',
                    estimatedMinutes: 45,
                    steps: [
                        {
                            id: 'STEP-07',
                            title: 'Install New Diaphragm',
                            instruction: 'Install the new diaphragm kit (Part {part1}).',
                            estimatedMinutes: 15,
                            entities: {
                                part1: { type: 'part', partNumber: '928-001', description: 'Diaphragm Kit' }
                            }
                        },
                        {
                            id: 'STEP-08',
                            title: 'Torque Cover Bolts',
                            instruction: 'Install and torque the four cover bolts to {torque1}.',
                            estimatedMinutes: 10,
                            entities: {
                                torque1: { type: 'torque', value: 25, unit: 'lb-ft', precision: 0 }
                            }
                        },
                        {
                            id: 'STEP-09',
                            title: 'Test Operation',
                            instruction: 'Start the pump and verify normal operation. Check for leaks.',
                            estimatedMinutes: 20,
                            warnings: [
                                {
                                    type: 'information',
                                    title: 'Initial Testing',
                                    description: 'Run the pump for at least 5 minutes to verify all systems are functioning.'
                                }
                            ]
                        }
                    ]
                }
            ],
            resources: [
                {
                    title: 'P8 Maintenance Manual',
                    description: 'Complete maintenance manual for Wilden P8 pumps',
                    url: 'https://example.com/p8-manual'
                }
            ]
        };

        // Validate the sample guide
        const validation = Validation.validateGuideSpec(sampleGuide);
        if (!validation.success) {
            const error = new Error('Invalid sample guide: ' + validation.errors.join(', '));
            if (options && options.onError) {
                options.onError(error);
            }
            return Promise.reject(error);
        }

        // Cache the guide
        guideCache[guideId] = sampleGuide;

        if (options && options.onSuccess) {
            options.onSuccess(sampleGuide);
        }

        return Promise.resolve(sampleGuide);
    }

    /**
     * Load a guide from a URL parameter.
     * @param {Object} options - Options for loading.
     * @returns {Promise} - Promise that resolves with the guide or null.
     */
    function loadGuideFromUrl(options) {
        const params = Utils.getQueryParams();
        if (params.g) {
            return loadGuide(params.g, options);
        }
        return Promise.resolve(null);
    }

    /**
     * Clear the guide cache.
     */
    function clearCache() {
        Object.keys(guideCache).forEach(function(key) {
            delete guideCache[key];
        });
    }

    /**
     * Get a cached guide.
     * @param {string} guideId - The guide ID.
     * @returns {Object|null} - The cached guide or null.
     */
    function getCachedGuide(guideId) {
        return guideCache[guideId.toUpperCase()] || null;
    }

    // Public API
    return {
        loadGuide: loadGuide,
        loadGuideFromUrl: loadGuideFromUrl,
        fetchGuide: fetchGuide,
        loadSampleGuide: loadSampleGuide,
        clearCache: clearCache,
        getCachedGuide: getCachedGuide
    };
})();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GuideLoader;
}
