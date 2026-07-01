/**
 * GuideOS Viewer - Main Application
 * Version: 1.0.0
 * 
 * Main entry point for the GuideOS Viewer application.
 * Handles application initialization, routing, and coordination between modules.
 * 
 * Implements:
 * - Sprint 01: Foundation
 * - Sprint 02: Rendering Engine
 * - Sprint 03: Knowledge Engine
 */

/**
 * GuideOS Viewer Application
 * @namespace GuideViewer
 */
const GuideViewer = (function() {
    'use strict';
    
    // Application state
    const state = {
        currentGuideId: null,
        currentGuide: null,
        isLoading: false,
        error: null,
        validationResult: null,
        resolvedGuide: null
    };
    
    // DOM elements
    const elements = {
        app: null,
        sidebar: null,
        mainContent: null,
        sidebarToggle: null,
        mobileSidebarToggle: null,
        overlay: null,
        welcomeScreen: null,
        loadingScreen: null,
        errorScreen: null,
        guideContainer: null,
        guideTitle: null,
        guideSubtitle: null,
        loadingGuideId: null,
        errorTitle: null,
        errorMessage: null,
        viewerVersion: null,
        guidespecVersion: null,
        footerViewerVersion: null,
        footerGuidespecVersion: null,
        guideNav: null,
        unitSystemSelect: null,
        aiProviderSelect: null
    };
    
    // Storage keys
    const STORAGE_KEYS = {
        SIDEBAR_COLLAPSED: 'viewer_sidebar_collapsed'
    };
    
    /**
     * Initialize DOM element references
     * @private
     */
    function _initElements() {
        elements.app = document.getElementById('app');
        elements.sidebar = document.getElementById('sidebar');
        elements.mainContent = document.getElementById('main-content');
        elements.sidebarToggle = document.getElementById('sidebar-toggle');
        elements.mobileSidebarToggle = document.getElementById('mobile-sidebar-toggle');
        elements.overlay = document.getElementById('overlay');
        elements.welcomeScreen = document.getElementById('welcome-screen');
        elements.loadingScreen = document.getElementById('loading-screen');
        elements.errorScreen = document.getElementById('error-screen');
        elements.guideContainer = document.getElementById('guide-container');
        elements.guideTitle = document.getElementById('guide-title');
        elements.guideSubtitle = document.getElementById('guide-subtitle');
        elements.loadingGuideId = document.getElementById('loading-guide-id');
        elements.errorTitle = document.getElementById('error-title');
        elements.errorMessage = document.getElementById('error-message');
        elements.viewerVersion = document.getElementById('viewer-version');
        elements.guidespecVersion = document.getElementById('guidespec-version');
        elements.footerViewerVersion = document.getElementById('footer-viewer-version');
        elements.footerGuidespecVersion = document.getElementById('footer-guidespec-version');
        elements.guideNav = document.getElementById('guide-nav');
        elements.unitSystemSelect = document.getElementById('unit-system');
        elements.aiProviderSelect = document.getElementById('ai-provider');
    }
    
    /**
     * Initialize event listeners
     * @private
     */
    function _initEventListeners() {
        // Sidebar toggle
        if (elements.sidebarToggle) {
            elements.sidebarToggle.addEventListener('click', _toggleSidebar);
        }
        
        // Mobile sidebar toggle
        if (elements.mobileSidebarToggle) {
            elements.mobileSidebarToggle.addEventListener('click', _openSidebar);
        }
        
        // Overlay click
        if (elements.overlay) {
            elements.overlay.addEventListener('click', _closeSidebar);
        }
        
        // Dark mode toggle (sidebar)
        const darkModeToggle = document.getElementById('toggle-dark-mode');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', () => {
                Theme.toggleDarkMode();
            });
        }
        
        // Dark mode toggle (header)
        const headerDarkToggle = document.getElementById('header-dark-toggle');
        if (headerDarkToggle) {
            headerDarkToggle.addEventListener('click', () => {
                Theme.toggleDarkMode();
            });
        }
        
        // Manufacturer theme toggle (sidebar)
        const manufacturerToggle = document.getElementById('toggle-manufacturer-theme');
        if (manufacturerToggle) {
            manufacturerToggle.addEventListener('click', () => {
                Theme.toggleManufacturerTheme();
            });
        }
        
        // Manufacturer theme toggle (header)
        const headerThemeToggle = document.getElementById('header-theme-toggle');
        if (headerThemeToggle) {
            headerThemeToggle.addEventListener('click', () => {
                Theme.toggleManufacturerTheme();
            });
        }
        
        // Load sample guide button
        const loadSampleBtn = document.getElementById('load-sample');
        if (loadSampleBtn) {
            loadSampleBtn.addEventListener('click', () => {
                _loadGuide('SAMPLE001');
            });
        }
        
        // Error retry button
        const errorRetryBtn = document.getElementById('error-retry');
        if (errorRetryBtn) {
            errorRetryBtn.addEventListener('click', () => {
                if (state.currentGuideId) {
                    _loadGuide(state.currentGuideId);
                } else {
                    _showWelcomeScreen();
                }
            });
        }
        
        // Error back button
        const errorBackBtn = document.getElementById('error-back');
        if (errorBackBtn) {
            errorBackBtn.addEventListener('click', _showWelcomeScreen);
        }
        
        // Unit system selector
        if (elements.unitSystemSelect) {
            elements.unitSystemSelect.addEventListener('change', (e) => {
                const system = e.target.value;
                Localization.setUnitSystem(system);
                _reRenderGuide();
            });
        }
        
        // AI provider selector
        if (elements.aiProviderSelect) {
            elements.aiProviderSelect.addEventListener('change', (e) => {
                const provider = e.target.value;
                Search.setProvider(provider);
            });
        }
        
        // Window resize
        window.addEventListener('resize', Utils.debounce(_handleResize, 250));
        
        // Before unload - save state
        window.addEventListener('beforeunload', _handleBeforeUnload);
    }
    
    /**
     * Toggle sidebar open/closed
     * @private
     */
    function _toggleSidebar() {
        if (elements.sidebar.classList.contains('open')) {
            _closeSidebar();
        } else {
            _openSidebar();
        }
    }
    
    /**
     * Open sidebar
     * @private
     */
    function _openSidebar() {
        elements.sidebar.classList.add('open');
        if (elements.overlay) {
            elements.overlay.classList.remove('hidden');
        }
        Storage.save(STORAGE_KEYS.SIDEBAR_COLLAPSED, false);
    }
    
    /**
     * Close sidebar
     * @private
     */
    function _closeSidebar() {
        elements.sidebar.classList.remove('open');
        if (elements.overlay) {
            elements.overlay.classList.add('hidden');
        }
        Storage.save(STORAGE_KEYS.SIDEBAR_COLLAPSED, true);
    }
    
    /**
     * Handle window resize
     * @private
     */
    function _handleResize() {
        // Close sidebar on desktop
        if (window.innerWidth > 1024) {
            _closeSidebar();
        }
    }
    
    /**
     * Handle before unload event
     * @private
     */
    function _handleBeforeUnload() {
        // Save current state
        _saveState();
    }
    
    /**
     * Save application state
     * @private
     */
    function _saveState() {
        // Save sidebar state
        const isCollapsed = elements.sidebar.classList.contains('open') ? false : true;
        Storage.save(STORAGE_KEYS.SIDEBAR_COLLAPSED, isCollapsed);
    }
    
    /**
     * Restore application state
     * @private
     */
    function _restoreState() {
        // Restore sidebar state
        const isCollapsed = Storage.load(STORAGE_KEYS.SIDEBAR_COLLAPSED, false);
        if (isCollapsed && window.innerWidth <= 1024) {
            elements.sidebar.classList.remove('open');
            if (elements.overlay) {
                elements.overlay.classList.add('hidden');
            }
        }
    }
    
    /**
     * Show the welcome screen
     * @private
     */
    function _showWelcomeScreen() {
        state.currentGuideId = null;
        state.currentGuide = null;
        state.isLoading = false;
        state.error = null;
        state.validationResult = null;
        state.resolvedGuide = null;
        
        // Update UI
        if (elements.guideTitle) {
            elements.guideTitle.textContent = 'GuideOS Viewer';
        }
        if (elements.guideSubtitle) {
            elements.guideSubtitle.textContent = 'Welcome to GuideOS';
        }
        
        // Hide all screens
        _hideAllScreens();
        
        // Show welcome screen
        if (elements.welcomeScreen) {
            elements.welcomeScreen.classList.remove('hidden');
        }
        
        // Clear renderer
        Renderer.clearViewer();
        
        // Reset theme
        Theme.setManufacturerTheme(false);
    }
    
    /**
     * Show loading screen
     * @param {string} guideId - The guide ID being loaded
     * @private
     */
    function _showLoadingScreen(guideId) {
        state.isLoading = true;
        state.error = null;
        
        // Update loading text
        if (elements.loadingGuideId) {
            const guideIdSpan = elements.loadingGuideId.querySelector('.guide-id');
            if (guideIdSpan) {
                guideIdSpan.textContent = guideId || 'Unknown';
            }
        }
        
        // Hide all screens
        _hideAllScreens();
        
        // Show loading screen
        if (elements.loadingScreen) {
            elements.loadingScreen.classList.remove('hidden');
        }
    }
    
    /**
     * Show error screen
     * @param {string} title - Error title
     * @param {string} message - Error message
     * @private
     */
    function _showErrorScreen(title, message) {
        state.isLoading = false;
        state.error = { title, message };
        
        // Update error text
        if (elements.errorTitle) {
            elements.errorTitle.textContent = title;
        }
        if (elements.errorMessage) {
            elements.errorMessage.textContent = message;
        }
        
        // Hide all screens
        _hideAllScreens();
        
        // Show error screen
        if (elements.errorScreen) {
            elements.errorScreen.classList.remove('hidden');
        }
        
        // Clear renderer
        Renderer.clearViewer();
        
        // Reset theme
        Theme.setManufacturerTheme(false);
    }
    
    /**
     * Hide all content screens
     * @private
     */
    function _hideAllScreens() {
        if (elements.welcomeScreen) {
            elements.welcomeScreen.classList.add('hidden');
        }
        if (elements.loadingScreen) {
            elements.loadingScreen.classList.add('hidden');
        }
        if (elements.errorScreen) {
            elements.errorScreen.classList.add('hidden');
        }
        if (elements.guideContainer) {
            elements.guideContainer.classList.add('hidden');
        }
    }
    
    /**
     * Load a guide by ID
     * @param {string} guideId - The guide ID to load
     * @private
     */
    function _loadGuide(guideId) {
        // Validate guide ID
        if (!guideId || !Utils.isValidGuideId(guideId)) {
            _showErrorScreen('Invalid Guide ID', 'The provided guide ID is not valid. It must be 8 uppercase hexadecimal characters.');
            return;
        }
        
        state.currentGuideId = guideId.toUpperCase();
        _showLoadingScreen(state.currentGuideId);
        
        // Load the guide
        GuideLoader.loadGuide(state.currentGuideId)
            .then(guide => {
                if (!guide) {
                    _showErrorScreen('Guide Not Found', `The guide with ID ${state.currentGuideId} could not be found.`);
                    return;
                }
                
                // Validate the guide
                const validationResult = Validation.validateGuide(guide);
                state.validationResult = validationResult;
                
                if (!validationResult.valid) {
                    const errorMessage = validationResult.errors.length > 0 
                        ? validationResult.errors.join('\n') 
                        : 'The guide contains validation errors.';
                    _showErrorScreen('Validation Error', errorMessage);
                    return;
                }
                
                // Store the guide
                state.currentGuide = guide;
                
                // Set current guide context for entities
                Entities.setCurrentGuide(guide);
                
                // Update header
                if (elements.guideTitle && guide.guide) {
                    elements.guideTitle.textContent = guide.guide.title || 'Untitled Guide';
                }
                if (elements.guideSubtitle && guide.guide) {
                    elements.guideSubtitle.textContent = guide.guide.description || '';
                }
                
                // Hide loading screen
                if (elements.loadingScreen) {
                    elements.loadingScreen.classList.add('hidden');
                }
                
                // Show guide container
                if (elements.guideContainer) {
                    elements.guideContainer.classList.remove('hidden');
                }
                
                // Initialize renderer if not already done
                if (!Renderer.getCurrentGuide) {
                    Renderer.initialize(elements.guideContainer);
                }
                
                // Resolve entities in the guide
                state.resolvedGuide = Entities.resolveAllEntities(guide);
                
                // Render the guide
                Renderer.renderGuide(state.resolvedGuide);
                
                // Update navigation in sidebar
                _updateSidebarNavigation(guide);
                
                // Enable unit system selector
                if (elements.unitSystemSelect) {
                    elements.unitSystemSelect.disabled = false;
                    
                    // Check if guide has localizable entities
                    if (Entities.hasLocalizableEntities(guide)) {
                        elements.unitSystemSelect.disabled = false;
                    } else {
                        elements.unitSystemSelect.disabled = true;
                    }
                }
                
                // Enable AI provider selector
                if (elements.aiProviderSelect) {
                    elements.aiProviderSelect.disabled = false;
                }
                
            })
            .catch(error => {
                console.error('Error loading guide:', error);
                _showErrorScreen('Loading Error', 'An unexpected error occurred while loading the guide.');
            });
    }
    
    /**
     * Re-render the current guide (for unit system changes)
     * @private
     */
    function _reRenderGuide() {
        if (!state.currentGuide) {
            return;
        }
        
        // Re-resolve entities with new unit system
        state.resolvedGuide = Entities.resolveAllEntities(state.currentGuide);
        
        // Re-render
        Renderer.renderGuide(state.resolvedGuide);
    }
    
    /**
     * Update sidebar navigation with guide phases
     * @private
     */
    function _updateSidebarNavigation(guide) {
        if (!elements.guideNav || !guide.phases) {
            return;
        }
        
        // Clear existing navigation
        elements.guideNav.innerHTML = '';
        
        // Add phase links
        for (const phase of guide.phases) {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `#phase-${phase.id}`;
            a.textContent = `${phase.id} - ${phase.title}`;
            a.style.cssText = `
                display: block;
                padding: var(--spacing-sm) var(--spacing-md);
                color: var(--text-color);
                text-decoration: none;
                border-radius: var(--border-radius);
                transition: all var(--transition-fast);
            `;
            
            a.addEventListener('click', (e) => {
                e.preventDefault();
                const phaseEl = document.getElementById(`phase-${phase.id}`);
                if (phaseEl) {
                    phaseEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
            
            a.addEventListener('mouseenter', () => {
                a.style.backgroundColor = 'var(--primary-color)';
                a.style.color = 'white';
            });
            
            a.addEventListener('mouseleave', () => {
                a.style.backgroundColor = '';
                a.style.color = 'var(--text-color)';
            });
            
            li.appendChild(a);
            elements.guideNav.appendChild(li);
        }
    }
    
    /**
     * Check URL for guide parameter and load if present
     * @private
     */
    function _checkUrlForGuide() {
        const guideId = Utils.getUrlParam('g');
        if (guideId) {
            _loadGuide(guideId.toUpperCase());
        }
    }
    
    /**
     * Update version displays
     * @private
     */
    function _updateVersions() {
        const viewerVersion = '1.0.0';
        const guidespecVersion = '1.0';
        
        if (elements.viewerVersion) {
            elements.viewerVersion.textContent = viewerVersion;
        }
        if (elements.guidespecVersion) {
            elements.guidespecVersion.textContent = `GuideSpec ${guidespecVersion}`;
        }
        if (elements.footerViewerVersion) {
            elements.footerViewerVersion.textContent = `Viewer ${viewerVersion}`;
        }
        if (elements.footerGuidespecVersion) {
            elements.footerGuidespecVersion.textContent = `GuideSpec ${guidespecVersion}`;
        }
    }
    
    /**
     * Initialize the application
     */
    function initialize() {
        // Initialize modules
        Theme.initialize();
        Localization.initialize();
        Search.initialize();
        
        // Initialize elements
        _initElements();
        
        // Initialize event listeners
        _initEventListeners();
        
        // Update versions
        _updateVersions();
        
        // Restore state
        _restoreState();
        
        // Initialize renderer
        if (elements.guideContainer) {
            Renderer.initialize(elements.guideContainer);
        }
        
        // Check URL for guide parameter
        _checkUrlForGuide();
        
        // If no guide in URL, show welcome screen
        if (!state.currentGuideId) {
            _showWelcomeScreen();
        }
        
        console.log('GuideOS Viewer initialized successfully.');
    }
    
    // Public API
    return {
        initialize,
        loadGuide: _loadGuide,
        showWelcomeScreen: _showWelcomeScreen,
        getCurrentGuideId: () => state.currentGuideId,
        getCurrentGuide: () => state.currentGuide,
        getResolvedGuide: () => state.resolvedGuide,
        isLoading: () => state.isLoading,
        getError: () => state.error,
        getValidationResult: () => state.validationResult,
        reRenderGuide: _reRenderGuide
    };
})();

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    GuideViewer.initialize();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GuideViewer;
}
