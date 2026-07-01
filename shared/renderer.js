/**
 * GuideOS Renderer Module
 * Version: 1.0.0
 * 
 * Handles rendering of GuideSpec content to the DOM.
 */

/**
 * Renderer Module
 * @namespace Renderer
 */
const Renderer = (function() {
    'use strict';
    
    // Current guide being rendered
    let currentGuide = null;
    
    // DOM cache
    const domCache = {
        guideContainer: null,
        metadataContainer: null,
        phasesContainer: null,
        navigationContainer: null
    };
    
    /**
     * Initialize the renderer with DOM elements
     * @param {HTMLElement} guideContainer - The container for guide content
     */
    function initialize(guideContainer) {
        domCache.guideContainer = guideContainer;
        
        // Create main containers
        _createContainers();
    }
    
    /**
     * Create the main rendering containers
     * @private
     */
    function _createContainers() {
        if (!domCache.guideContainer) {
            return;
        }
        
        // Clear existing content
        domCache.guideContainer.innerHTML = '';
        
        // Metadata container
        domCache.metadataContainer = document.createElement('div');
        domCache.metadataContainer.className = 'guide-metadata';
        domCache.metadataContainer.style.cssText = `
            margin-bottom: var(--spacing-lg);
            padding: var(--spacing-md);
            background-color: var(--surface-color);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
        `;
        
        // Phases container
        domCache.phasesContainer = document.createElement('div');
        domCache.phasesContainer.className = 'guide-phases';
        domCache.phasesContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: var(--spacing-md);
        `;
        
        // Navigation container
        domCache.navigationContainer = document.createElement('div');
        domCache.navigationContainer.className = 'guide-navigation';
        domCache.navigationContainer.style.cssText = `
            margin-bottom: var(--spacing-lg);
            padding: var(--spacing-md);
            background-color: var(--surface-color);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
        `;
        
        // Append containers
        domCache.guideContainer.appendChild(domCache.metadataContainer);
        domCache.guideContainer.appendChild(domCache.navigationContainer);
        domCache.guideContainer.appendChild(domCache.phasesContainer);
    }
    
    /**
     * Render a complete guide
     * @param {Object} guide - The guide to render
     */
    function renderGuide(guide) {
        if (!guide || typeof guide !== 'object') {
            console.error('Invalid guide data');
            return;
        }
        
        currentGuide = guide;
        
        // Apply guide theme
        if (guide.theme && guide.theme.enabled) {
            Theme.applyGuideTheme(guide.theme);
        } else {
            Theme.setManufacturerTheme(false);
        }
        
        // Render metadata
        _renderMetadata(guide);
        
        // Render navigation
        _renderNavigation(guide);
        
        // Render phases
        _renderPhases(guide.phases || []);
    }
    
    /**
     * Render guide metadata
     * @private
     */
    function _renderMetadata(guide) {
        if (!domCache.metadataContainer || !guide.guide) {
            return;
        }
        
        const metadata = guide.guide;
        const equipment = guide.equipment || {};
        
        // Clear existing metadata
        domCache.metadataContainer.innerHTML = '';
        
        // Create metadata grid
        const grid = document.createElement('div');
        grid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: var(--spacing-md);
        `;
        
        // Title
        const titleEl = document.createElement('h1');
        titleEl.textContent = metadata.title || 'Untitled Guide';
        titleEl.style.cssText = `
            grid-column: 1 / -1;
            font-size: var(--font-size-xl);
            margin-bottom: var(--spacing-sm);
            color: var(--text-color);
        `;
        grid.appendChild(titleEl);
        
        // Description
        const descEl = document.createElement('p');
        descEl.textContent = metadata.description || 'No description available';
        descEl.style.cssText = `
            grid-column: 1 / -1;
            color: var(--text-secondary);
            margin-bottom: var(--spacing-md);
        `;
        grid.appendChild(descEl);
        
        // Metadata fields
        const fields = [
            { label: 'Version', value: metadata.version },
            { label: 'Category', value: metadata.category },
            { label: 'Difficulty', value: metadata.difficulty },
            { label: 'Estimated Time', value: _formatMinutes(metadata.estimatedMinutes) },
            { label: 'Manufacturer', value: equipment.manufacturer },
            { label: 'Model', value: equipment.model },
            { label: 'Series', value: equipment.series },
            { label: 'Author', value: metadata.author },
            { label: 'Created', value: _formatDate(metadata.created) },
            { label: 'Updated', value: _formatDate(metadata.updated) }
        ];
        
        for (const field of fields) {
            if (field.value) {
                const fieldEl = document.createElement('div');
                fieldEl.style.cssText = `
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                `;
                
                const labelEl = document.createElement('span');
                labelEl.textContent = field.label;
                labelEl.style.cssText = `
                    font-size: var(--font-size-sm);
                    color: var(--text-muted);
                    font-weight: 600;
                `;
                
                const valueEl = document.createElement('span');
                valueEl.textContent = field.value;
                valueEl.style.cssText = `
                    font-size: var(--font-size-md);
                    color: var(--text-color);
                `;
                
                fieldEl.appendChild(labelEl);
                fieldEl.appendChild(valueEl);
                grid.appendChild(fieldEl);
            }
        }
        
        domCache.metadataContainer.appendChild(grid);
    }
    
    /**
     * Render guide navigation
     * @private
     */
    function _renderNavigation(guide) {
        if (!domCache.navigationContainer || !guide.phases) {
            return;
        }
        
        // Clear existing navigation
        domCache.navigationContainer.innerHTML = '';
        
        const navTitle = document.createElement('h2');
        navTitle.textContent = 'Guide Navigation';
        navTitle.style.cssText = `
            font-size: var(--font-size-lg);
            margin-bottom: var(--spacing-md);
            color: var(--text-color);
        `;
        
        const navList = document.createElement('div');
        navList.style.cssText = `
            display: flex;
            flex-wrap: wrap;
            gap: var(--spacing-sm);
        `;
        
        // Add phase navigation buttons
        for (const phase of guide.phases) {
            const phaseBtn = document.createElement('button');
            phaseBtn.textContent = `${phase.id} - ${phase.title}`;
            phaseBtn.dataset.phaseId = phase.id;
            phaseBtn.style.cssText = `
                padding: var(--spacing-sm) var(--spacing-md);
                border: 1px solid var(--border-color);
                background-color: var(--surface-color);
                color: var(--text-color);
                border-radius: var(--border-radius);
                cursor: pointer;
                font-size: var(--font-size-sm);
                transition: all var(--transition-fast);
            `;
            
            phaseBtn.addEventListener('click', () => {
                _scrollToPhase(phase.id);
            });
            
            phaseBtn.addEventListener('mouseenter', () => {
                phaseBtn.style.backgroundColor = 'var(--primary-color)';
                phaseBtn.style.color = 'white';
                phaseBtn.style.borderColor = 'var(--primary-color)';
            });
            
            phaseBtn.addEventListener('mouseleave', () => {
                phaseBtn.style.backgroundColor = 'var(--surface-color)';
                phaseBtn.style.color = 'var(--text-color)';
                phaseBtn.style.borderColor = 'var(--border-color)';
            });
            
            navList.appendChild(phaseBtn);
        }
        
        domCache.navigationContainer.appendChild(navTitle);
        domCache.navigationContainer.appendChild(navList);
    }
    
    /**
     * Render all phases
     * @private
     */
    function _renderPhases(phases) {
        if (!domCache.phasesContainer) {
            return;
        }
        
        // Clear existing phases
        domCache.phasesContainer.innerHTML = '';
        
        for (const phase of phases) {
            _renderPhase(phase);
        }
    }
    
    /**
     * Render a single phase
     * @private
     */
    function _renderPhase(phase) {
        if (!domCache.phasesContainer) {
            return;
        }
        
        const phaseEl = document.createElement('div');
        phaseEl.className = 'guide-phase';
        phaseEl.id = `phase-${phase.id}`;
        phaseEl.dataset.phaseId = phase.id;
        phaseEl.style.cssText = `
            background-color: var(--surface-color);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            overflow: hidden;
        `;
        
        // Phase header
        const headerEl = document.createElement('div');
        headerEl.className = 'phase-header';
        headerEl.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: var(--spacing-md);
            background-color: var(--primary-color);
            color: white;
            cursor: pointer;
            transition: all var(--transition-fast);
        `;
        
        const headerLeft = document.createElement('div');
        headerLeft.style.cssText = `
            display: flex;
            align-items: center;
            gap: var(--spacing-md);
        `;
        
        const collapseIcon = document.createElement('span');
        collapseIcon.className = 'collapse-icon';
        collapseIcon.textContent = '▼';
        collapseIcon.style.cssText = `
            font-size: var(--font-size-md);
            transition: transform var(--transition-fast);
        `;
        
        const headerContent = document.createElement('div');
        headerContent.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 2px;
        `;
        
        const phaseTitle = document.createElement('h2');
        phaseTitle.textContent = phase.title || 'Untitled Phase';
        phaseTitle.style.cssText = `
            font-size: var(--font-size-lg);
            font-weight: 600;
        `;
        
        const phaseDesc = document.createElement('p');
        phaseDesc.textContent = phase.description || 'No description';
        phaseDesc.style.cssText = `
            font-size: var(--font-size-sm);
            opacity: 0.9;
        `;
        
        const phaseInfo = document.createElement('div');
        phaseInfo.style.cssText = `
            display: flex;
            gap: var(--spacing-md);
            font-size: var(--font-size-sm);
        `;
        
        const stepCount = document.createElement('span');
        stepCount.textContent = `${phase.steps ? phase.steps.length : 0} steps`;
        
        const estimatedTime = document.createElement('span');
        estimatedTime.textContent = `Estimated: ${_formatMinutes(phase.estimatedMinutes)}`;
        
        phaseInfo.appendChild(stepCount);
        phaseInfo.appendChild(estimatedTime);
        
        headerContent.appendChild(phaseTitle);
        headerContent.appendChild(phaseDesc);
        headerLeft.appendChild(collapseIcon);
        headerLeft.appendChild(headerContent);
        headerEl.appendChild(headerLeft);
        headerEl.appendChild(phaseInfo);
        
        // Steps container
        const stepsContainer = document.createElement('div');
        stepsContainer.className = 'phase-steps';
        stepsContainer.style.cssText = `
            padding: var(--spacing-md);
            border-top: 1px solid var(--border-color);
        `;
        
        // Render steps
        if (phase.steps && Array.isArray(phase.steps)) {
            for (const step of phase.steps) {
                _renderStep(step, phase.id);
            }
        }
        
        phaseEl.appendChild(headerEl);
        phaseEl.appendChild(stepsContainer);
        
        // Collapse/expand functionality
        let isCollapsed = false;
        
        headerEl.addEventListener('click', () => {
            isCollapsed = !isCollapsed;
            
            if (isCollapsed) {
                stepsContainer.style.display = 'none';
                collapseIcon.style.transform = 'rotate(-90deg)';
            } else {
                stepsContainer.style.display = '';
                collapseIcon.style.transform = 'rotate(0deg)';
            }
        });
        
        domCache.phasesContainer.appendChild(phaseEl);
    }
    
    /**
     * Render a single step
     * @private
     */
    function _renderStep(step, phaseId) {
        const stepsContainer = document.querySelector(`.guide-phase[data-phase-id="${phaseId}"] .phase-steps`);
        if (!stepsContainer) {
            return;
        }
        
        const stepEl = document.createElement('div');
        stepEl.className = 'guide-step';
        stepEl.id = `step-${step.id}`;
        stepEl.dataset.stepId = step.id;
        stepEl.dataset.phaseId = phaseId;
        stepEl.style.cssText = `
            margin-bottom: var(--spacing-md);
            padding: var(--spacing-md);
            background-color: var(--surface-color);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
        `;
        
        // Step header
        const stepHeader = document.createElement('div');
        stepHeader.className = 'step-header';
        stepHeader.style.cssText = `
            display: flex;
            align-items: flex-start;
            gap: var(--spacing-md);
            margin-bottom: var(--spacing-md);
        `;
        
        // Step number
        const stepNumber = document.createElement('div');
        stepNumber.className = 'step-number';
        stepNumber.textContent = step.id || '?';
        stepNumber.style.cssText = `
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: var(--primary-color);
            color: white;
            border-radius: 50%;
            font-weight: 600;
            font-size: var(--font-size-md);
            flex-shrink: 0;
        `;
        
        // Step content
        const stepContent = document.createElement('div');
        stepContent.className = 'step-content';
        stepContent.style.cssText = `
            flex: 1;
        `;
        
        // Step title
        const stepTitle = document.createElement('h3');
        stepTitle.textContent = step.title || 'Untitled Step';
        stepTitle.style.cssText = `
            font-size: var(--font-size-lg);
            font-weight: 600;
            margin-bottom: var(--spacing-xs);
            color: var(--text-color);
        `;
        
        // Step instruction
        const stepInstruction = document.createElement('p');
        stepInstruction.textContent = step.instruction || 'No instruction provided';
        stepInstruction.style.cssText = `
            color: var(--text-secondary);
            line-height: var(--line-height);
            margin-bottom: var(--spacing-sm);
        `;
        
        // Step metadata
        const stepMeta = document.createElement('div');
        stepMeta.className = 'step-meta';
        stepMeta.style.cssText = `
            display: flex;
            align-items: center;
            gap: var(--spacing-md);
            font-size: var(--font-size-sm);
            color: var(--text-muted);
        `;
        
        if (step.estimatedMinutes) {
            const timeEl = document.createElement('span');
            timeEl.textContent = `Estimated: ${_formatMinutes(step.estimatedMinutes)}`;
            stepMeta.appendChild(timeEl);
        }
        
        // Dependencies
        if (step.dependencies && Array.isArray(step.dependencies) && step.dependencies.length > 0) {
            const depsEl = document.createElement('span');
            depsEl.textContent = `Dependencies: ${step.dependencies.join(', ')}`;
            depsEl.style.cssText = `
                display: flex;
                align-items: center;
                gap: 4px;
            `;
            
            // Add dependency icon
            const depIcon = document.createElement('span');
            depIcon.textContent = '🔗';
            depsEl.prepend(depIcon);
            
            stepMeta.appendChild(depsEl);
        }
        
        stepContent.appendChild(stepTitle);
        stepContent.appendChild(stepInstruction);
        stepContent.appendChild(stepMeta);
        
        stepHeader.appendChild(stepNumber);
        stepHeader.appendChild(stepContent);
        
        stepEl.appendChild(stepHeader);
        
        // Warnings
        if (step.warnings && Array.isArray(step.warnings) && step.warnings.length > 0) {
            _renderWarnings(step.warnings, stepEl);
        }
        
        // Code blocks
        if (step.codeBlocks && Array.isArray(step.codeBlocks) && step.codeBlocks.length > 0) {
            _renderCodeBlocks(step.codeBlocks, stepEl);
        }
        
        // Resources
        if (step.resources && Array.isArray(step.resources) && step.resources.length > 0) {
            _renderResources(step.resources, stepEl);
        }
        
        // Placeholder for notes (Sprint 04)
        const notesPlaceholder = document.createElement('div');
        notesPlaceholder.className = 'notes-placeholder';
        notesPlaceholder.textContent = 'Notes: Not implemented yet (Sprint 04)';
        notesPlaceholder.style.cssText = `
            margin-top: var(--spacing-md);
            padding: var(--spacing-sm);
            font-size: var(--font-size-sm);
            color: var(--text-muted);
            font-style: italic;
        `;
        stepEl.appendChild(notesPlaceholder);
        
        // Completion checkbox (Sprint 04)
        const completionPlaceholder = document.createElement('div');
        completionPlaceholder.className = 'completion-placeholder';
        completionPlaceholder.textContent = 'Completion tracking: Not implemented yet (Sprint 04)';
        completionPlaceholder.style.cssText = `
            margin-top: var(--spacing-sm);
            font-size: var(--font-size-sm);
            color: var(--text-muted);
            font-style: italic;
        `;
        stepEl.appendChild(completionPlaceholder);
        
        stepsContainer.appendChild(stepEl);
    }
    
    /**
     * Render warnings for a step
     * @private
     */
    function _renderWarnings(warnings, stepEl) {
        const warningsContainer = document.createElement('div');
        warningsContainer.className = 'step-warnings';
        warningsContainer.style.cssText = `
            margin-top: var(--spacing-md);
            display: flex;
            flex-direction: column;
            gap: var(--spacing-sm);
        `;
        
        for (const warning of warnings) {
            const warningEl = document.createElement('div');
            warningEl.className = `warning warning-${warning.type || 'warning'}`;
            warningEl.style.cssText = `
                padding: var(--spacing-sm) var(--spacing-md);
                border-radius: var(--border-radius);
                font-size: var(--font-size-sm);
            `;
            
            // Set colors based on warning type
            switch (warning.type) {
                case 'danger':
                    warningEl.style.backgroundColor = 'var(--danger-bg)';
                    warningEl.style.borderLeft = '4px solid var(--danger-color)';
                    warningEl.style.color = 'var(--danger-color)';
                    break;
                case 'warning':
                    warningEl.style.backgroundColor = 'var(--warning-bg)';
                    warningEl.style.borderLeft = '4px solid var(--warning-color)';
                    warningEl.style.color = 'var(--warning-color)';
                    break;
                case 'success':
                    warningEl.style.backgroundColor = 'var(--success-bg)';
                    warningEl.style.borderLeft = '4px solid var(--success-color)';
                    warningEl.style.color = 'var(--success-color)';
                    break;
                case 'information':
                default:
                    warningEl.style.backgroundColor = 'var(--information-bg)';
                    warningEl.style.borderLeft = '4px solid var(--information-color)';
                    warningEl.style.color = 'var(--information-color)';
                    break;
            }
            
            const warningTitle = document.createElement('strong');
            warningTitle.textContent = warning.title || 'Warning';
            warningTitle.style.cssText = `display: block; margin-bottom: 2px;`;
            
            const warningDesc = document.createElement('span');
            warningDesc.textContent = warning.description || '';
            
            warningEl.appendChild(warningTitle);
            warningEl.appendChild(warningDesc);
            warningsContainer.appendChild(warningEl);
        }
        
        stepEl.appendChild(warningsContainer);
    }
    
    /**
     * Render code blocks for a step
     * @private
     */
    function _renderCodeBlocks(codeBlocks, stepEl) {
        const codeContainer = document.createElement('div');
        codeContainer.className = 'step-code-blocks';
        codeContainer.style.cssText = `
            margin-top: var(--spacing-md);
            display: flex;
            flex-direction: column;
            gap: var(--spacing-sm);
        `;
        
        for (const block of codeBlocks) {
            const blockEl = document.createElement('div');
            blockEl.className = 'code-block';
            blockEl.style.cssText = `
                background-color: var(--surface-color);
                border: 1px solid var(--border-color);
                border-radius: var(--border-radius);
                overflow: hidden;
            `;
            
            // Code block header
            const headerEl = document.createElement('div');
            headerEl.className = 'code-block-header';
            headerEl.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: var(--spacing-xs) var(--spacing-md);
                background-color: var(--background-color);
                border-bottom: 1px solid var(--border-color);
                font-size: var(--font-size-sm);
            `;
            
            const titleEl = document.createElement('span');
            titleEl.textContent = block.title || block.language || 'Code';
            
            const copyBtn = document.createElement('button');
            copyBtn.textContent = 'Copy';
            copyBtn.style.cssText = `
                background: none;
                border: none;
                cursor: pointer;
                font-size: var(--font-size-sm);
                color: var(--primary-color);
            `;
            
            copyBtn.addEventListener('click', () => {
                Utils.copyText(block.code || '').then(success => {
                    if (success) {
                        copyBtn.textContent = 'Copied!';
                        setTimeout(() => {
                            copyBtn.textContent = 'Copy';
                        }, 2000);
                    }
                });
            });
            
            headerEl.appendChild(titleEl);
            headerEl.appendChild(copyBtn);
            
            // Code content
            const codeEl = document.createElement('pre');
            codeEl.textContent = block.code || '';
            codeEl.style.cssText = `
                padding: var(--spacing-md);
                overflow-x: auto;
                font-family: monospace;
                font-size: var(--font-size-sm);
                white-space: pre-wrap;
                word-wrap: break-word;
            `;
            
            blockEl.appendChild(headerEl);
            blockEl.appendChild(codeEl);
            codeContainer.appendChild(blockEl);
        }
        
        stepEl.appendChild(codeContainer);
    }
    
    /**
     * Render resources for a step
     * @private
     */
    function _renderResources(resources, stepEl) {
        const resourcesContainer = document.createElement('div');
        resourcesContainer.className = 'step-resources';
        resourcesContainer.style.cssText = `
            margin-top: var(--spacing-md);
            display: flex;
            flex-direction: column;
            gap: var(--spacing-sm);
        `;
        
        const titleEl = document.createElement('h4');
        titleEl.textContent = 'Resources';
        titleEl.style.cssText = `
            font-size: var(--font-size-md);
            font-weight: 600;
            margin-bottom: var(--spacing-sm);
            color: var(--text-color);
        `;
        
        resourcesContainer.appendChild(titleEl);
        
        for (const resource of resources) {
            const resourceEl = document.createElement('div');
            resourceEl.className = 'resource-card';
            resourceEl.style.cssText = `
                display: flex;
                align-items: center;
                gap: var(--spacing-md);
                padding: var(--spacing-sm) var(--spacing-md);
                background-color: var(--surface-color);
                border: 1px solid var(--border-color);
                border-radius: var(--border-radius);
                cursor: pointer;
                transition: all var(--transition-fast);
            `;
            
            const iconEl = document.createElement('span');
            iconEl.textContent = '📄';
            iconEl.style.cssText = `font-size: var(--font-size-lg);`;
            
            const contentEl = document.createElement('div');
            contentEl.style.cssText = `
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 2px;
            `;
            
            const title = document.createElement('strong');
            title.textContent = resource.title || 'Untitled Resource';
            title.style.cssText = `font-size: var(--font-size-sm);`;
            
            const desc = document.createElement('span');
            desc.textContent = resource.description || '';
            desc.style.cssText = `
                font-size: var(--font-size-sm);
                color: var(--text-secondary);
            `;
            
            contentEl.appendChild(title);
            contentEl.appendChild(desc);
            
            const openBtn = document.createElement('button');
            openBtn.textContent = 'Open';
            openBtn.style.cssText = `
                padding: var(--spacing-xs) var(--spacing-sm);
                background-color: var(--primary-color);
                color: white;
                border: none;
                border-radius: var(--border-radius);
                cursor: pointer;
                font-size: var(--font-size-sm);
            `;
            
            openBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (resource.url) {
                    window.open(resource.url, '_blank');
                }
            });
            
            resourceEl.appendChild(iconEl);
            resourceEl.appendChild(contentEl);
            resourceEl.appendChild(openBtn);
            
            resourceEl.addEventListener('click', () => {
                if (resource.url) {
                    window.open(resource.url, '_blank');
                }
            });
            
            resourcesContainer.appendChild(resourceEl);
        }
        
        stepEl.appendChild(resourcesContainer);
    }
    
    /**
     * Scroll to a specific phase
     * @private
     */
    function _scrollToPhase(phaseId) {
        const phaseEl = document.getElementById(`phase-${phaseId}`);
        if (phaseEl) {
            phaseEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    /**
     * Format minutes to a readable string
     * @private
     */
    function _formatMinutes(minutes) {
        if (minutes === undefined || minutes === null) {
            return 'Unknown';
        }
        
        const num = Number(minutes);
        if (isNaN(num) || num <= 0) {
            return 'Unknown';
        }
        
        if (num < 60) {
            return `${num} min`;
        }
        
        const hours = Math.floor(num / 60);
        const remainingMinutes = num % 60;
        
        if (remainingMinutes === 0) {
            return `${hours} hour${hours !== 1 ? 's' : ''}`;
        }
        
        return `${hours}h ${remainingMinutes}min`;
    }
    
    /**
     * Format date for display
     * @private
     */
    function _formatDate(dateString) {
        if (!dateString) {
            return 'Unknown';
        }
        
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return dateString;
            }
            
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return dateString;
        }
    }
    
    /**
     * Clear the current guide rendering
     */
    function clearViewer() {
        currentGuide = null;
        
        if (domCache.guideContainer) {
            domCache.guideContainer.innerHTML = '';
        }
        
        // Reset containers
        domCache.metadataContainer = null;
        domCache.phasesContainer = null;
        domCache.navigationContainer = null;
    }
    
    // Public API
    return {
        initialize,
        renderGuide,
        clearViewer
    };
})();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Renderer;
}
