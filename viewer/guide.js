/**
 * GuideOS Viewer
 * Module: guide.js
 * Version: 1.0.0
 * Purpose: Main Viewer application logic.
 * Follows ARCHITECTURE.md: Controllers coordinate engines and update interface.
 * Implements Sprint_Viewer_01_Foundation.md and Sprint_Viewer_02_Rendering.md
 */

/**
 * GuideOS Viewer - Main Application
 * This is the bootstrap and controller for the Viewer.
 * It coordinates between engines (Theme, Storage, GuideLoader, Entities, Validation)
 * and the UI.
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
            collapsedPhases: {},
            expandedNotes: {}
        }
    };

    // ===== DOM Elements =====
    const elements = {};

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
        
        // Check URL for guide ID
        checkUrlForGuide();
        
        // Show welcome screen if no guide is loaded
        if (!state.currentGuide) {
            showWelcomeScreen();
        }
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
        elements.collapseAllBtn = document.getElementById('collapse-all-btn');
        elements.expandAllBtn = document.getElementById('expand-all-btn');
        
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
        state.settings.expandedNotes = Storage.load('ExpandedNotes', {});
        
        // Load progress for last guide if available
        const lastGuideId = Storage.load('LastGuideId', null);
        if (lastGuideId) {
            state.progress = Storage.load('Progress-' + lastGuideId, {});
            state.notes = Storage.load('Notes-' + lastGuideId, {});
        }
        
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
                
                // Re-render the guide with new unit system
                if (state.currentGuide) {
                    renderGuide();
                }
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
        
        // Collapse/Expand All Buttons
        if (elements.collapseAllBtn) {
            elements.collapseAllBtn.addEventListener('click', function() {
                collapseAllPhases();
            });
        }
        
        if (elements.expandAllBtn) {
            elements.expandAllBtn.addEventListener('click', function() {
                expandAllPhases();
            });
        }
        
        // Window resize
        window.addEventListener('resize', Utils.debounce(function() {
            // Close sidebar on small screens when clicking outside
            if (window.innerWidth <= 1024) {
                // Keep sidebar open if explicitly opened
            } else {
                if (elements.sidebar) {
                    elements.sidebar.classList.remove('open');
                }
            }
        }, 250));
        
        // Before unload - save state
        window.addEventListener('beforeunload', function() {
            saveCurrentState();
        });
    }

    // ===== Save Current State =====
    function saveCurrentState() {
        if (state.currentGuideId) {
            Storage.save('LastGuideId', state.currentGuideId);
            Storage.save('Progress-' + state.currentGuideId, state.progress);
            Storage.save('Notes-' + state.currentGuideId, state.notes);
            Storage.save('CollapsedPhases', state.settings.collapsedPhases);
            Storage.save('ExpandedNotes', state.settings.expandedNotes);
        }
    }

    // ===== Toggle Sidebar =====
    function toggleSidebar() {
        if (elements.sidebar) {
            elements.sidebar.classList.toggle('open');
        }
    }

    // ===== Collapse/Expand All Phases =====
    function collapseAllPhases() {
        if (elements.phasesContainer) {
            const phaseCards = elements.phasesContainer.querySelectorAll('.phase-card');
            phaseCards.forEach(function(phaseCard) {
                const phaseId = phaseCard.getAttribute('data-phase-id');
                const phaseContent = phaseCard.querySelector('.phase-content');
                const phaseToggle = phaseCard.querySelector('.phase-toggle');
                
                if (phaseContent && !phaseContent.classList.contains('collapsed')) {
                    phaseContent.classList.add('collapsed');
                    if (phaseToggle) {
                        phaseToggle.classList.add('collapsed');
                    }
                    state.settings.collapsedPhases[phaseId] = true;
                }
            });
            Storage.save('CollapsedPhases', state.settings.collapsedPhases);
        }
    }

    function expandAllPhases() {
        if (elements.phasesContainer) {
            const phaseCards = elements.phasesContainer.querySelectorAll('.phase-card');
            phaseCards.forEach(function(phaseCard) {
                const phaseId = phaseCard.getAttribute('data-phase-id');
                const phaseContent = phaseCard.querySelector('.phase-content');
                const phaseToggle = phaseCard.querySelector('.phase-toggle');
                
                if (phaseContent && phaseContent.classList.contains('collapsed')) {
                    phaseContent.classList.remove('collapsed');
                    if (phaseToggle) {
                        phaseToggle.classList.remove('collapsed');
                    }
                    state.settings.collapsedPhases[phaseId] = false;
                }
            });
            Storage.save('CollapsedPhases', state.settings.collapsedPhases);
        }
    }

    // ===== Check URL for Guide ID =====
    function checkUrlForGuide() {
        GuideLoader.loadGuideFromUrl({
            onSuccess: function(guide) {
                processGuide(guide, guide.guide.id || 'SAMPLE001');
            },
            onError: function(error) {
                console.error('Failed to load guide from URL:', error);
                showErrorScreen('Failed to Load Guide', error.message);
            },
            onNotFound: function(guideId) {
                showErrorScreen('Guide Not Found', 'The guide "' + guideId + '" could not be found.');
            }
        });
    }

    // ===== Load Guide =====
    function loadGuide(guideId) {
        if (!guideId) {
            showErrorScreen('Invalid Guide ID', 'Please provide a valid Guide ID.');
            return;
        }

        // Validate Guide ID format (8 hex characters)
        if (!/^[0-9A-F]{8}$/.test(guideId) && guideId !== 'SAMPLE001') {
            showErrorScreen('Invalid Guide ID', 'Guide ID must be 8 uppercase hexadecimal characters (e.g., 8F35A198).');
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
        
        // Load the guide
        GuideLoader.loadGuide(guideId, {
            onSuccess: function(guide) {
                processGuide(guide, guideId);
            },
            onError: function(error) {
                console.error('Failed to load guide:', error);
                showErrorScreen('Failed to Load Guide', error.message);
            },
            onNotFound: function() {
                showErrorScreen('Guide Not Found', 'The guide "' + guideId + '" could not be found.');
            }
        });
    }

    // ===== Process Guide =====
    function processGuide(guide, guideId) {
        try {
            // Validate the guide
            const validation = Validation.validateGuideSpec(guide);
            if (!validation.success) {
                throw new Error('Invalid GuideSpec: ' + validation.errors.join(', '));
            }

            // Store the guide
            state.currentGuide = guide;
            state.currentGuideId = guideId;
            
            // Load saved progress and notes for this guide
            state.progress = Storage.load('Progress-' + guideId, {});
            state.notes = Storage.load('Notes-' + guideId, {});
            
            // Hide loading screen
            hideLoadingScreen();
            
            // Render the guide
            renderGuide();
            
            // Show guide content
            showGuideContent();
            
            // Save last guide ID
            Storage.save('LastGuideId', guideId);
            
        } catch (error) {
            console.error('Failed to process guide:', error);
            showErrorScreen('Invalid Guide', error.message);
        }
    }

    // ===== Update URL =====
    function updateUrl(guideId) {
        if (history.pushState) {
            const newUrl = window.location.pathname + '?g=' + guideId;
            history.pushState({ guideId: guideId }, '', newUrl);
        }
    }

    // ===== Render Guide =====
    function renderGuide() {
        const guide = state.currentGuide;
        if (!guide) {
            return;
        }

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
            elements.metadataTime.textContent = (guide.guide.estimatedMinutes || 0) + ' minutes';
        }

        // Apply manufacturer theme if available
        if (guide.theme && guide.theme.enabled) {
            Theme.setManufacturerTheme(guide.theme);
            if (state.settings.manufacturerTheme) {
                Theme.toggleManufacturerTheme(true);
            }
        }

        // Render phases
        renderPhases(guide.phases);
        
        // Update progress
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
        const stepCount = phase.steps ? phase.steps.length : 0;
        const timeText = phase.estimatedMinutes ? phase.estimatedMinutes + ' min' : '';
        phaseMeta.textContent = stepCount + ' step' + (stepCount !== 1 ? 's' : '') + 
            (timeText ? ' | ' + timeText : '');
        
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
        const stepCheckboxContainer = document.createElement('label');
        stepCheckboxContainer.className = 'step-checkbox-container';
        
        const stepCheckbox = document.createElement('input');
        stepCheckbox.type = 'checkbox';
        stepCheckbox.className = 'step-checkbox';
        stepCheckbox.id = 'step-' + step.id;
        
        // Set checked state from progress
        if (state.progress[phaseId] && state.progress[phaseId][step.id]) {
            stepCheckbox.checked = true;
        }
        
        stepCheckboxContainer.appendChild(stepCheckbox);
        
        // Step Content
        const stepContent = document.createElement('div');
        stepContent.className = 'step-content';
        
        const stepTitle = document.createElement('h4');
        stepTitle.className = 'step-title';
        stepTitle.textContent = step.title;
        
        const stepInstruction = document.createElement('p');
        stepInstruction.className = 'step-instruction';
        
        // Resolve placeholders in instruction
        let instructionText = step.instruction || '';
        if (step.entities) {
            instructionText = Entities.resolveInstruction(
                instructionText,
                step.entities,
                state.settings.unitSystem
            );
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
        
        if (step.resources && step.resources.length > 0) {
            const resourceBadge = document.createElement('span');
            resourceBadge.className = 'resource-badge';
            resourceBadge.textContent = '&#128196;' + step.resources.length;
            resourceBadge.title = step.resources.length + ' resource(s)';
            stepMeta.appendChild(resourceBadge);
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
                const warningElement = createWarningElement(warning);
                warningsContainer.appendChild(warningElement);
            });
            
            stepContent.appendChild(warningsContainer);
        }
        
        // Resources
        if (step.resources && step.resources.length > 0) {
            const resourcesContainer = document.createElement('div');
            resourcesContainer.className = 'step-resources';
            
            step.resources.forEach(function(resource) {
                const resourceElement = createResourceElement(resource);
                resourcesContainer.appendChild(resourceElement);
            });
            
            stepContent.appendChild(resourcesContainer);
        }
        
        // Notes Section
        const notesContainer = document.createElement('div');
        notesContainer.className = 'step-notes';
        
        const notesHeader = document.createElement('div');
        notesHeader.className = 'notes-header';
        notesHeader.innerHTML = '<span>&#128196; Notes</span>';
        
        const notesInputContainer = document.createElement('div');
        notesInputContainer.className = 'notes-input-container';
        
        const notesInput = document.createElement('textarea');
        notesInput.className = 'notes-input';
        notesInput.placeholder = 'Add your notes here...';
        notesInput.setAttribute('data-step-id', step.id);
        notesInput.setAttribute('data-phase-id', phaseId);
        
        // Load saved note
        if (state.notes[phaseId] && state.notes[phaseId][step.id]) {
            notesInput.value = state.notes[phaseId][step.id];
        }
        
        // Auto-expand textarea
        notesInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
            
            // Save note
            saveNote(phaseId, step.id, this.value);
        });
        
        notesInputContainer.appendChild(notesInput);
        notesContainer.appendChild(notesHeader);
        notesContainer.appendChild(notesInputContainer);
        
        // Check if notes should be expanded
        const isExpanded = state.settings.expandedNotes[step.id];
        if (!isExpanded) {
            notesContainer.classList.add('collapsed');
        }
        
        // Add toggle for notes
        notesHeader.addEventListener('click', function() {
            toggleNotes(step.id, notesContainer);
        });
        
        stepContent.appendChild(notesContainer);
        
        // Assemble step card
        stepCard.appendChild(stepCheckboxContainer);
        stepCard.appendChild(stepContent);
        
        // Add click handler for checkbox
        stepCheckbox.addEventListener('change', function() {
            toggleStepCompletion(step.id, phaseId, this.checked);
        });
        
        return stepCard;
    }

    // ===== Create Warning Element =====
    function createWarningElement(warning) {
        const warningElement = document.createElement('div');
        const type = warning.type || 'information';
        warningElement.className = 'warning-card warning-' + type;
        
        const warningTitle = document.createElement('strong');
        warningTitle.className = 'warning-title';
        warningTitle.textContent = warning.title || type.charAt(0).toUpperCase() + type.slice(1);
        
        const warningDescription = document.createElement('p');
        warningDescription.className = 'warning-description';
        warningDescription.textContent = warning.description || '';
        
        warningElement.appendChild(warningTitle);
        warningElement.appendChild(warningDescription);
        
        return warningElement;
    }

    // ===== Create Resource Element =====
    function createResourceElement(resource) {
        const resourceElement = document.createElement('div');
        resourceElement.className = 'resource-card';
        
        const resourceLink = document.createElement('a');
        resourceLink.className = 'resource-link';
        resourceLink.href = resource.url || '#';
        resourceLink.target = '_blank';
        resourceLink.rel = 'noopener noreferrer';
        
        const resourceTitle = document.createElement('span');
        resourceTitle.className = 'resource-title';
        resourceTitle.textContent = resource.title || resource.url || 'Resource';
        
        const resourceDescription = document.createElement('span');
        resourceDescription.className = 'resource-description';
        resourceDescription.textContent = resource.description ? ' - ' + resource.description : '';
        
        resourceLink.appendChild(resourceTitle);
        resourceLink.appendChild(resourceDescription);
        resourceElement.appendChild(resourceLink);
        
        return resourceElement;
    }

    // ===== Toggle Phase =====
    function togglePhase(phaseId, phaseContent, phaseToggle) {
        const isCollapsed = phaseContent.classList.toggle('collapsed');
        phaseToggle.classList.toggle('collapsed', isCollapsed);
        
        // Save collapsed state
        state.settings.collapsedPhases[phaseId] = isCollapsed;
        Storage.save('CollapsedPhases', state.settings.collapsedPhases);
    }

    // ===== Toggle Notes =====
    function toggleNotes(stepId, notesContainer) {
        const isExpanded = notesContainer.classList.toggle('collapsed');
        state.settings.expandedNotes[stepId] = !isExpanded;
        Storage.save('ExpandedNotes', state.settings.expandedNotes);
    }

    // ===== Save Note =====
    function saveNote(phaseId, stepId, value) {
        if (!state.notes[phaseId]) {
            state.notes[phaseId] = {};
        }
        state.notes[phaseId][stepId] = value;
        Storage.save('Notes-' + state.currentGuideId, state.notes);
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
                    if (state.progress[phase.id] && state.progress[phase.id][step.id]) {
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
        
        state.isLoading = true;
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
        getElements: function() { return elements; },
        getCurrentGuide: function() { return state.currentGuide; },
        getCurrentGuideId: function() { return state.currentGuideId; }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();
