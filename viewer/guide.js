/**
 * GuideOS Viewer
 * Module: guide.js
 * Version: 1.0.0
 * Purpose: Main Viewer application logic.
 * Follows ARCHITECTURE.md: Controllers coordinate engines and update interface.
 */

/**
 * GuideOS Viewer - Main Application
 * This is the bootstrap and controller for the Viewer.
 * It coordinates between engines (Theme, Storage, etc.) and the UI.
 */
(function() {
    'use strict';

    // ===== Application State =====
    const state = {
        currentGuide: null,
        currentGuideId: null,
        isLoading: false,
        error: null,
        phases: [],
        progress: {},
        notes: {},
        settings: {
            darkMode: false,
            manufacturerTheme: false,
            unitSystem: 'original',
            collapsedPhases: {}
        }
    };

    // ===== DOM Elements =====
    const elements = {
        // Layout
        sidebar: null,
        mainContent: null,
        contentArea: null,
        
        // Screens
        welcomeScreen: null,
        guideContent: null,
        errorScreen: null,
        loadingScreen: null,
        
        // Guide Info
        guideTitle: null,
        guideSubtitle: null,
        currentGuideId: null,
        
        // Metadata
        metadataManufacturer: null,
        metadataModel: null,
        metadataCategory: null,
        metadataDifficulty: null,
        metadataTime: null,
        progressBar: null,
        progressText: null,
        progressSteps: null,
        
        // Phases
        phasesContainer: null,
        
        // Controls
        darkModeToggle: null,
        manufacturerThemeToggle: null,
        unitSystemSelect: null,
        mobileSidebarToggle: null,
        sidebarToggle: null,
        loadSampleBtn: null,
        loadGuideBtn: null,
        loadGuideForm: null,
        guideIdInput: null,
        loadGuideSubmit: null,
        loadGuideCancel: null,
        exportBtn: null,
        aiBtn: null,
        
        // Error
        errorTitle: null,
        errorMessage: null,
        errorRetryBtn: null,
        errorBackBtn: null,
        
        // Loading
        loadingMessage: null,
        loadingGuideId: null
    };

    // ===== Initialize Application =====
    function initialize() {
        // Cache DOM elements
        cacheElements();
        
        // Initialize modules
        initializeModules();
        
        // Load settings
        loadSettings();
        
        // Setup event listeners
        setupEventListeners();
        
        // Show welcome screen
        showWelcomeScreen();
        
        // Check URL for guide ID
        checkUrlForGuide();
    }

    // ===== Cache DOM Elements =====
    function cacheElements() {
        // Layout
        elements.sidebar = document.getElementById('sidebar');
        elements.mainContent = document.getElementById('main-content');
        elements.contentArea = document.getElementById('content-area');
        
        // Screens
        elements.welcomeScreen = document.getElementById('welcome-screen');
        elements.guideContent = document.getElementById('guide-content');
        elements.errorScreen = document.getElementById('error-screen');
        elements.loadingScreen = document.getElementById('loading-screen');
        
        // Guide Info
        elements.guideTitle = document.getElementById('guide-title');
        elements.guideSubtitle = document.getElementById('guide-subtitle');
        elements.currentGuideId = document.getElementById('current-guide-id');
        
        // Metadata
        elements.metadataManufacturer = document.getElementById('metadata-manufacturer');
        elements.metadataModel = document.getElementById('metadata-model');
        elements.metadataCategory = document.getElementById('metadata-category');
        elements.metadataDifficulty = document.getElementById('metadata-difficulty');
        elements.metadataTime = document.getElementById('metadata-time');
        elements.progressBar = document.getElementById('progress-bar');
        elements.progressText = document.getElementById('progress-text');
        elements.progressSteps = document.getElementById('progress-steps');
        
        // Phases
        elements.phasesContainer = document.getElementById('phases-container');
        
        // Controls
        elements.darkModeToggle = document.getElementById('dark-mode-toggle');
        elements.manufacturerThemeToggle = document.getElementById('manufacturer-theme-toggle');
        elements.unitSystemSelect = document.getElementById('unit-system-select');
        elements.mobileSidebarToggle = document.getElementById('mobile-sidebar-toggle');
        elements.sidebarToggle = document.getElementById('sidebar-toggle');
        elements.loadSampleBtn = document.getElementById('load-sample-btn');
        elements.loadGuideBtn = document.getElementById('load-guide-btn');
        elements.loadGuideForm = document.getElementById('load-guide-form');
        elements.guideIdInput = document.getElementById('guide-id-input');
        elements.loadGuideSubmit = document.getElementById('load-guide-submit');
        elements.loadGuideCancel = document.getElementById('load-guide-cancel');
        elements.exportBtn = document.getElementById('export-btn');
        elements.aiBtn = document.getElementById('ai-btn');
        
        // Error
        elements.errorTitle = document.getElementById('error-title');
        elements.errorMessage = document.getElementById('error-message');
        elements.errorRetryBtn = document.getElementById('error-retry-btn');
        elements.errorBackBtn = document.getElementById('error-back-btn');
        
        // Loading
        elements.loadingMessage = document.getElementById('loading-message');
        elements.loadingGuideId = document.getElementById('loading-guide-id');
    }

    // ===== Initialize Modules =====
    function initializeModules() {
        // Initialize Dialogs
        Dialogs.initialize();
        
        // Initialize Theme with Storage
        Theme.initialize(Storage);
        
        // Apply saved theme
        Theme.applyTheme();
    }

    // ===== Load Settings =====
    function loadSettings() {
        // Load saved settings from Storage
        state.settings.darkMode = Storage.load('DarkMode', false);
        state.settings.manufacturerTheme = Storage.load('ManufacturerTheme', false);
        state.settings.unitSystem = Storage.load('UnitSystem', 'original');
        state.settings.collapsedPhases = Storage.load('CollapsedPhases', {});
        
        // Apply settings to UI
        applySettingsToUI();
    }

    // ===== Apply Settings to UI =====
    function applySettingsToUI() {
        // Dark Mode
        if (elements.darkModeToggle) {
            elements.darkModeToggle.checked = state.settings.darkMode;
        }
        
        // Manufacturer Theme
        if (elements.manufacturerThemeToggle) {
            elements.manufacturerThemeToggle.checked = state.settings.manufacturerTheme;
        }
        
        // Unit System
        if (elements.unitSystemSelect) {
            elements.unitSystemSelect.value = state.settings.unitSystem;
        }
        
        // Apply theme
        Theme.setTheme(state.settings.darkMode ? 'dark' : 'light');
        Theme.toggleManufacturerTheme(state.settings.manufacturerTheme);
        Theme.saveTheme(Storage);
    }

    // ===== Setup Event Listeners =====
    function setupEventListeners() {
        // Theme Toggles
        if (elements.darkModeToggle) {
            elements.darkModeToggle.addEventListener('change', function() {
                state.settings.darkMode = this.checked;
                Theme.setTheme(this.checked ? 'dark' : 'light');
                Storage.save('DarkMode', state.settings.darkMode);
                Theme.saveTheme(Storage);
            });
        }
        
        if (elements.manufacturerThemeToggle) {
            elements.manufacturerThemeToggle.addEventListener('change', function() {
                state.settings.manufacturerTheme = this.checked;
                Theme.toggleManufacturerTheme(this.checked);
                Storage.save('ManufacturerTheme', state.settings.manufacturerTheme);
                Theme.saveTheme(Storage);
            });
        }
        
        // Unit System
        if (elements.unitSystemSelect) {
            elements.unitSystemSelect.addEventListener('change', function() {
                state.settings.unitSystem = this.value;
                Storage.save('UnitSystem', state.settings.unitSystem);
            });
        }
        
        // Mobile Sidebar Toggle
        if (elements.mobileSidebarToggle) {
            elements.mobileSidebarToggle.addEventListener('click', toggleSidebar);
        }
        
        if (elements.sidebarToggle) {
            elements.sidebarToggle.addEventListener('click', toggleSidebar);
        }
        
        // Load Sample Guide
        if (elements.loadSampleBtn) {
            elements.loadSampleBtn.addEventListener('click', function() {
                loadGuide('SAMPLE001');
            });
        }
        
        // Load Guide by ID
        if (elements.loadGuideBtn) {
            elements.loadGuideBtn.addEventListener('click', function() {
                elements.loadGuideForm.classList.remove('hidden');
                elements.guideIdInput.focus();
            });
        }
        
        if (elements.loadGuideSubmit) {
            elements.loadGuideSubmit.addEventListener('click', function() {
                const guideId = elements.guideIdInput.value.trim().toUpperCase();
                if (guideId) {
                    loadGuide(guideId);
                    elements.loadGuideForm.classList.add('hidden');
                    elements.guideIdInput.value = '';
                }
            });
        }
        
        if (elements.loadGuideCancel) {
            elements.loadGuideCancel.addEventListener('click', function() {
                elements.loadGuideForm.classList.add('hidden');
                elements.guideIdInput.value = '';
            });
        }
        
        // Error Screen Buttons
        if (elements.errorRetryBtn) {
            elements.errorRetryBtn.addEventListener('click', function() {
                if (state.currentGuideId) {
                    loadGuide(state.currentGuideId);
                } else {
                    hideErrorScreen();
                }
            });
        }
        
        if (elements.errorBackBtn) {
            elements.errorBackBtn.addEventListener('click', hideErrorScreen);
        }
        
        // Guide ID Input (Enter key)
        if (elements.guideIdInput) {
            elements.guideIdInput.addEventListener('keypress', function(event) {
                if (event.key === 'Enter') {
                    elements.loadGuideSubmit.click();
                }
            });
        }
        
        // Window resize
        window.addEventListener('resize', function() {
            // Close sidebar on small screens when clicking outside
            if (window.innerWidth <= 1024) {
                if (elements.sidebar.classList.contains('open')) {
                    // Keep open if explicitly opened
                }
            } else {
                elements.sidebar.classList.remove('open');
            }
        });
    }

    // ===== Toggle Sidebar =====
    function toggleSidebar() {
        if (elements.sidebar) {
            elements.sidebar.classList.toggle('open');
        }
    }

    // ===== Check URL for Guide ID =====
    function checkUrlForGuide() {
        const params = Utils.getQueryParams();
        if (params.g) {
            loadGuide(params.g.toUpperCase());
        }
    }

    // ===== Load Guide =====
    function loadGuide(guideId) {
        if (!guideId) {
            showErrorScreen('Invalid Guide ID', 'Please provide a valid Guide ID.');
            return;
        }

        // Validate Guide ID format (8 hex characters)
        if (!/^[0-9A-F]{8}$/.test(guideId)) {
            showErrorScreen('Invalid Guide ID', 'Guide ID must be 8 uppercase hexadecimal characters.');
            return;
        }

        // Set loading state
        state.isLoading = true;
        state.currentGuideId = guideId;
        state.error = null;
        
        // Update URL
        updateUrl(guideId);
        
        // Show loading screen
        showLoadingScreen(guideId);
        
        // Calculate guide path
        const guidePath = Utils.calculateGuidePath(guideId);
        
        // Try to load the guide
        // For now, we'll use a sample guide since the actual guides folder doesn't exist yet
        // In production, this would fetch from the guides/ folder
        if (guideId === 'SAMPLE001') {
            // Load sample guide (for demo purposes)
            loadSampleGuide();
        } else {
            // Try to fetch the actual guide
            fetchGuide(guidePath, guideId);
        }
    }

    // ===== Fetch Guide from Server =====
    function fetchGuide(path, guideId) {
        fetch(path)
            .then(function(response) {
                if (!response.ok) {
                    throw new Error('Guide not found: ' + response.status);
                }
                return response.json();
            })
            .then(function(guide) {
                processGuide(guide, guideId);
            })
            .catch(function(error) {
                console.error('Failed to load guide:', error);
                showErrorScreen('Guide Not Found', 'The guide "' + guideId + '" could not be loaded.');
            });
    }

    // ===== Load Sample Guide (for demo) =====
    function loadSampleGuide() {
        // This is a sample GuideSpec for demonstration
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
                keywords: ['pump', 'maintenance', 'centrifugal'],
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
                accentColor: '#007bff'
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

        // Process the sample guide
        processGuide(sampleGuide, 'SAMPLE001');
    }

    // ===== Process Guide =====
    function processGuide(guide, guideId) {
        try {
            // Validate the guide
            const validation = validateGuide(guide);
            if (!validation.valid) {
                throw new Error('Invalid Guide: ' + validation.errors.join(', '));
            }

            // Store the guide
            state.currentGuide = guide;
            state.currentGuideId = guideId;
            
            // Hide loading screen
            hideLoadingScreen();
            
            // Render the guide
            renderGuide();
            
            // Show guide content
            showGuideContent();
            
        } catch (error) {
            console.error('Failed to process guide:', error);
            showErrorScreen('Invalid Guide', error.message);
        }
    }

    // ===== Validate Guide =====
    function validateGuide(guide) {
        const errors = [];
        const warnings = [];

        // Check for required fields
        if (!guide.guideSpecVersion) {
            errors.push('Missing guideSpecVersion');
        }
        
        if (!guide.guide) {
            errors.push('Missing guide object');
        } else {
            if (!guide.guide.title) {
                errors.push('Missing guide.title');
            }
            if (!guide.guide.id && guide.guideSpecVersion === '1.0') {
                warnings.push('Guide ID is recommended for published guides');
            }
        }

        if (!guide.phases || !Array.isArray(guide.phases) || guide.phases.length === 0) {
            errors.push('Missing or empty phases array');
        }

        // Check phases and steps
        if (guide.phases) {
            guide.phases.forEach(function(phase, phaseIndex) {
                if (!phase.id) {
                    errors.push('Phase ' + (phaseIndex + 1) + ' is missing id');
                }
                if (!phase.title) {
                    errors.push('Phase ' + (phaseIndex + 1) + ' is missing title');
                }
                if (!phase.steps || !Array.isArray(phase.steps)) {
                    errors.push('Phase ' + (phaseIndex + 1) + ' is missing steps array');
                } else {
                    phase.steps.forEach(function(step, stepIndex) {
                        if (!step.id) {
                            errors.push('Phase ' + (phaseIndex + 1) + ', Step ' + (stepIndex + 1) + ' is missing id');
                        }
                        if (!step.title) {
                            errors.push('Phase ' + (phaseIndex + 1) + ', Step ' + (stepIndex + 1) + ' is missing title');
                        }
                        if (!step.instruction) {
                            errors.push('Phase ' + (phaseIndex + 1) + ', Step ' + (stepIndex + 1) + ' is missing instruction');
                        }
                    });
                }
            });
        }

        return {
            valid: errors.length === 0,
            errors: errors,
            warnings: warnings
        };
    }

    // ===== Render Guide =====
    function renderGuide() {
        const guide = state.currentGuide;
        
        // Update guide info in header
        if (elements.guideTitle) {
            elements.guideTitle.textContent = guide.guide.title || 'Untitled Guide';
        }
        if (elements.guideSubtitle) {
            elements.guideSubtitle.textContent = guide.guide.description || '';
        }
        if (elements.currentGuideId) {
            elements.currentGuideId.textContent = 'Guide: ' + (guide.guide.id || state.currentGuideId);
        }

        // Update metadata
        if (guide.equipment) {
            if (elements.metadataManufacturer) {
                elements.metadataManufacturer.textContent = guide.equipment.manufacturer || '-';
            }
            if (elements.metadataModel) {
                elements.metadataModel.textContent = guide.equipment.model || '-';
            }
        }
        
        if (elements.metadataCategory) {
            elements.metadataCategory.textContent = guide.guide.category || '-';
        }
        if (elements.metadataDifficulty) {
            elements.metadataDifficulty.textContent = guide.guide.difficulty || '-';
        }
        if (elements.metadataTime) {
            elements.metadataTime.textContent = guide.guide.estimatedMinutes + ' minutes' || '-';
        }

        // Render phases
        renderPhases(guide.phases);
        
        // Update progress (for now, just show 0%)
        updateProgress();
    }

    // ===== Render Phases =====
    function renderPhases(phases) {
        if (!elements.phasesContainer) {
            return;
        }

        // Clear existing phases
        elements.phasesContainer.innerHTML = '';

        // Store phases in state
        state.phases = phases;

        // Render each phase
        phases.forEach(function(phase) {
            const phaseElement = createPhaseElement(phase);
            elements.phasesContainer.appendChild(phaseElement);
        });
    }

    // ===== Create Phase Element =====
    function createPhaseElement(phase) {
        const phaseCard = document.createElement('div');
        phaseCard.className = 'phase-card';
        phaseCard.setAttribute('data-phase-id', phase.id);

        // Phase Header
        const phaseHeader = document.createElement('div');
        phaseHeader.className = 'phase-header';
        
        const phaseHeaderLeft = document.createElement('div');
        phaseHeaderLeft.className = 'phase-header-left';
        
        const phaseTitle = document.createElement('h3');
        phaseTitle.className = 'phase-title';
        phaseTitle.textContent = phase.title;
        
        const phaseMeta = document.createElement('div');
        phaseMeta.className = 'phase-meta';
        phaseMeta.textContent = (phase.steps ? phase.steps.length + ' steps' : '') + 
            (phase.estimatedMinutes ? ' | ' + phase.estimatedMinutes + ' min' : '');
        
        phaseHeaderLeft.appendChild(phaseTitle);
        phaseHeaderLeft.appendChild(phaseMeta);
        
        const phaseToggle = document.createElement('button');
        phaseToggle.className = 'phase-toggle';
        phaseToggle.innerHTML = '&#9660;';
        phaseToggle.setAttribute('aria-label', 'Collapse phase');
        
        // Check if phase should be collapsed
        const isCollapsed = state.settings.collapsedPhases[phase.id];
        if (isCollapsed) {
            phaseToggle.classList.add('collapsed');
        }
        
        phaseHeader.appendChild(phaseHeaderLeft);
        phaseHeader.appendChild(phaseToggle);
        
        // Phase Content
        const phaseContent = document.createElement('div');
        phaseContent.className = 'phase-content';
        if (isCollapsed) {
            phaseContent.classList.add('collapsed');
        }
        
        // Render steps
        if (phase.steps) {
            phase.steps.forEach(function(step) {
                const stepElement = createStepElement(step, phase.id);
                phaseContent.appendChild(stepElement);
            });
        }
        
        phaseCard.appendChild(phaseHeader);
        phaseCard.appendChild(phaseContent);
        
        // Add click handler for phase header
        phaseHeader.addEventListener('click', function() {
            togglePhase(phase.id, phaseContent, phaseToggle);
        });
        
        return phaseCard;
    }

    // ===== Create Step Element =====
    function createStepElement(step, phaseId) {
        const stepCard = document.createElement('div');
        stepCard.className = 'step-card';
        stepCard.setAttribute('data-step-id', step.id);
        stepCard.setAttribute('data-phase-id', phaseId);

        // Step Checkbox
        const stepCheckbox = document.createElement('input');
        stepCheckbox.type = 'checkbox';
        stepCheckbox.className = 'step-checkbox';
        stepCheckbox.id = 'step-' + step.id;
        
        // Step Content
        const stepContent = document.createElement('div');
        stepContent.className = 'step-content';
        
        const stepTitle = document.createElement('h4');
        stepTitle.className = 'step-title';
        stepTitle.textContent = step.title;
        
        const stepInstruction = document.createElement('p');
        stepInstruction.className = 'step-instruction';
        
        // Process instruction (replace placeholders with entity values for now)
        let instructionText = step.instruction || '';
        if (step.entities) {
            for (const [placeholder, entity] of Object.entries(step.entities)) {
                const placeholderRegex = new RegExp('\{' + placeholder + '\}', 'g');
                if (entity.type === 'torque') {
                    instructionText = instructionText.replace(placeholderRegex, entity.value + ' ' + entity.unit);
                } else if (entity.type === 'tool' || entity.type === 'part') {
                    instructionText = instructionText.replace(placeholderRegex, entity.name || entity.partNumber || placeholder);
                } else {
                    instructionText = instructionText.replace(placeholderRegex, JSON.stringify(entity));
                }
            }
        }
        stepInstruction.innerHTML = Utils.escapeHtml(instructionText);
        
        // Step Meta
        const stepMeta = document.createElement('div');
        stepMeta.className = 'step-meta';
        
        if (step.estimatedMinutes) {
            const stepTime = document.createElement('span');
            stepTime.className = 'step-time';
            stepTime.innerHTML = '&#128337; ' + step.estimatedMinutes + ' min';
            stepMeta.appendChild(stepTime);
        }
        
        if (step.warnings && step.warnings.length > 0) {
            const warningBadge = document.createElement('span');
            warningBadge.className = 'warning-badge';
            warningBadge.textContent = '!' + step.warnings.length;
            warningBadge.title = step.warnings.length + ' warning(s)';
            stepMeta.appendChild(warningBadge);
        }
        
        stepContent.appendChild(stepTitle);
        stepContent.appendChild(stepInstruction);
        if (stepMeta.children.length > 0) {
            stepContent.appendChild(stepMeta);
        }
        
        // Warnings
        if (step.warnings && step.warnings.length > 0) {
            const warningsContainer = document.createElement('div');
            warningsContainer.className = 'step-warnings';
            
            step.warnings.forEach(function(warning) {
                const warningElement = document.createElement('div');
                warningElement.className = 'warning-card warning-' + (warning.type || 'information');
                
                const warningTitle = document.createElement('strong');
                warningTitle.textContent = warning.title || warning.type || 'Warning';
                
                const warningDescription = document.createElement('p');
                warningDescription.textContent = warning.description || '';
                
                warningElement.appendChild(warningTitle);
                warningElement.appendChild(warningDescription);
                warningsContainer.appendChild(warningElement);
            });
            
            stepContent.appendChild(warningsContainer);
        }
        
        // Assemble step card
        const stepCheckboxContainer = document.createElement('label');
        stepCheckboxContainer.className = 'step-checkbox-container';
        stepCheckboxContainer.appendChild(stepCheckbox);
        
        stepCard.appendChild(stepCheckboxContainer);
        stepCard.appendChild(stepContent);
        
        // Add click handler for checkbox
        stepCheckbox.addEventListener('change', function() {
            toggleStepCompletion(step.id, phaseId, this.checked);
        });
        
        return stepCard;
    }

    // ===== Toggle Phase =====
    function togglePhase(phaseId, phaseContent, phaseToggle) {
        const isCollapsed = phaseContent.classList.toggle('collapsed');
        phaseToggle.classList.toggle('collapsed', isCollapsed);
        
        // Save collapsed state
        state.settings.collapsedPhases[phaseId] = isCollapsed;
        Storage.save('CollapsedPhases', state.settings.collapsedPhases);
    }

    // ===== Toggle Step Completion =====
    function toggleStepCompletion(stepId, phaseId, completed) {
        if (!state.progress) {
            state.progress = {};
        }
        if (!state.progress[phaseId]) {
            state.progress[phaseId] = {};
        }
        
        state.progress[phaseId][stepId] = completed;
        Storage.save('Progress-' + state.currentGuideId, state.progress);
        
        // Update progress display
        updateProgress();
    }

    // ===== Update Progress =====
    function updateProgress() {
        if (!state.currentGuide || !state.currentGuide.phases) {
            if (elements.progressBar) {
                elements.progressBar.className = 'progress-bar';
            }
            if (elements.progressText) {
                elements.progressText.textContent = '0% Complete';
            }
            if (elements.progressSteps) {
                elements.progressSteps.textContent = '0/0 Steps';
            }
            return;
        }

        // Count total and completed steps
        let totalSteps = 0;
        let completedSteps = 0;
        
        state.currentGuide.phases.forEach(function(phase) {
            if (phase.steps) {
                phase.steps.forEach(function(step) {
                    totalSteps++;
                    if (state.progress && state.progress[phase.id] && state.progress[phase.id][step.id]) {
                        completedSteps++;
                    }
                });
            }
        });

        // Calculate percentage
        const percentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
        
        // Update UI
        if (elements.progressBar) {
            elements.progressBar.className = 'progress-bar complete-' + percentage;
        }
        if (elements.progressText) {
            elements.progressText.textContent = percentage + '% Complete';
        }
        if (elements.progressSteps) {
            elements.progressSteps.textContent = completedSteps + '/' + totalSteps + ' Steps';
        }
    }

    // ===== Update URL =====
    function updateUrl(guideId) {
        if (history.pushState) {
            const newUrl = window.location.pathname + '?g=' + guideId;
            history.pushState({ guideId: guideId }, '', newUrl);
        }
    }

    // ===== Show/Hide Screens =====
    function showWelcomeScreen() {
        if (elements.welcomeScreen) {
            elements.welcomeScreen.classList.remove('hidden');
        }
        if (elements.guideContent) {
            elements.guideContent.classList.add('hidden');
        }
        if (elements.errorScreen) {
            elements.errorScreen.classList.add('hidden');
        }
        if (elements.loadingScreen) {
            elements.loadingScreen.classList.add('hidden');
        }
        
        // Reset state
        state.isLoading = false;
        state.error = null;
        state.currentGuide = null;
        state.currentGuideId = null;
    }

    function showGuideContent() {
        if (elements.welcomeScreen) {
            elements.welcomeScreen.classList.add('hidden');
        }
        if (elements.guideContent) {
            elements.guideContent.classList.remove('hidden');
        }
        if (elements.errorScreen) {
            elements.errorScreen.classList.add('hidden');
        }
        if (elements.loadingScreen) {
            elements.loadingScreen.classList.add('hidden');
        }
        
        // Enable buttons
        if (elements.exportBtn) {
            elements.exportBtn.disabled = false;
        }
        if (elements.aiBtn) {
            elements.aiBtn.disabled = false;
        }
    }

    function showLoadingScreen(guideId) {
        if (elements.welcomeScreen) {
            elements.welcomeScreen.classList.add('hidden');
        }
        if (elements.guideContent) {
            elements.guideContent.classList.add('hidden');
        }
        if (elements.errorScreen) {
            elements.errorScreen.classList.add('hidden');
        }
        if (elements.loadingScreen) {
            elements.loadingScreen.classList.remove('hidden');
        }
        
        if (elements.loadingGuideId) {
            elements.loadingGuideId.textContent = 'Guide ID: ' + guideId;
        }
    }

    function hideLoadingScreen() {
        if (elements.loadingScreen) {
            elements.loadingScreen.classList.add('hidden');
        }
        state.isLoading = false;
    }

    function showErrorScreen(title, message) {
        if (elements.welcomeScreen) {
            elements.welcomeScreen.classList.add('hidden');
        }
        if (elements.guideContent) {
            elements.guideContent.classList.add('hidden');
        }
        if (elements.loadingScreen) {
            elements.loadingScreen.classList.add('hidden');
        }
        if (elements.errorScreen) {
            elements.errorScreen.classList.remove('hidden');
        }
        
        if (elements.errorTitle) {
            elements.errorTitle.textContent = title || 'Error';
        }
        if (elements.errorMessage) {
            elements.errorMessage.textContent = message || 'An error occurred.';
        }
        
        state.isLoading = false;
        state.error = { title: title, message: message };
    }

    function hideErrorScreen() {
        if (elements.errorScreen) {
            elements.errorScreen.classList.add('hidden');
        }
        state.error = null;
        
        // Show welcome screen if no guide is loaded
        if (!state.currentGuide) {
            showWelcomeScreen();
        }
    }

    // ===== Public API =====
    window.GuideViewer = {
        initialize: initialize,
        loadGuide: loadGuide,
        getState: function() { return state; },
        getElements: function() { return elements; }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();
