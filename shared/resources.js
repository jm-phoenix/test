/**
 * GuideOS Resources Module
 * Version: 1.0.0
 * 
 * Handles rendering and management of guide resources.
 * Part of Sprint 03 - Knowledge Engine
 */

/**
 * Resources Module
 * @namespace Resources
 */
const Resources = (function() {
    'use strict';
    
    /**
     * Render resources for a guide or step
     * @param {Array} resources - Array of resource objects
     * @param {HTMLElement} container - The container element to render into
     * @param {string} context - The context (guide or step)
     */
    function renderResources(resources, container, context = 'guide') {
        if (!resources || !Array.isArray(resources) || resources.length === 0) {
            return;
        }
        
        // Clear container
        container.innerHTML = '';
        
        const titleEl = document.createElement('h3');
        titleEl.textContent = 'Resources';
        titleEl.style.cssText = `
            font-size: var(--font-size-lg);
            font-weight: 600;
            margin-bottom: var(--spacing-md);
            color: var(--text-color);
        `;
        container.appendChild(titleEl);
        
        const listEl = document.createElement('div');
        listEl.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: var(--spacing-sm);
        `;
        
        for (const resource of resources) {
            const resourceEl = _createResourceCard(resource);
            listEl.appendChild(resourceEl);
        }
        
        container.appendChild(listEl);
    }
    
    /**
     * Create a resource card element
     * @private
     */
    function _createResourceCard(resource) {
        const card = document.createElement('div');
        card.className = 'resource-card';
        card.style.cssText = `
            display: flex;
            align-items: center;
            gap: var(--spacing-md);
            padding: var(--spacing-md);
            background-color: var(--surface-color);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            cursor: pointer;
            transition: all var(--transition-fast);
        `;
        
        // Icon based on resource type
        const iconEl = document.createElement('span');
        iconEl.style.cssText = `font-size: var(--font-size-xl);`;
        
        switch (resource.type) {
            case 'OEM Manual':
            case 'Installation Manual':
            case 'Maintenance Manual':
                iconEl.textContent = '📖';
                break;
            case 'Datasheet':
                iconEl.textContent = '📄';
                break;
            case 'Parts List':
                iconEl.textContent = '📋';
                break;
            case 'Exploded View':
                iconEl.textContent = '🔍';
                break;
            case 'Technical Bulletin':
                iconEl.textContent = '📢';
                break;
            case 'FAQ':
                iconEl.textContent = '❓';
                break;
            case 'Website':
                iconEl.textContent = '🌐';
                break;
            case 'PDF':
                iconEl.textContent = '📕';
                break;
            default:
                iconEl.textContent = '📎';
        }
        
        // Content
        const contentEl = document.createElement('div');
        contentEl.style.cssText = `
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 2px;
        `;
        
        const titleEl = document.createElement('strong');
        titleEl.textContent = resource.title || 'Untitled Resource';
        titleEl.style.cssText = `font-size: var(--font-size-md);`;
        
        const descEl = document.createElement('span');
        descEl.textContent = resource.description || '';
        descEl.style.cssText = `
            font-size: var(--font-size-sm);
            color: var(--text-secondary);
        `;
        
        contentEl.appendChild(titleEl);
        contentEl.appendChild(descEl);
        
        // Open button
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
            white-space: nowrap;
        `;
        
        openBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            _openResource(resource);
        });
        
        card.appendChild(iconEl);
        card.appendChild(contentEl);
        card.appendChild(openBtn);
        
        // Click handler for entire card
        card.addEventListener('click', () => {
            _openResource(resource);
        });
        
        return card;
    }
    
    /**
     * Open a resource
     * @private
     */
    function _openResource(resource) {
        if (!resource || !resource.url) {
            Dialogs.warning('No URL', 'This resource does not have a URL specified.');
            return;
        }
        
        // Sanitize URL
        let url = resource.url.trim();
        
        // Add https:// if missing
        if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('ftp://')) {
            url = 'https://' + url;
        }
        
        // Open in new tab
        window.open(url, '_blank');
    }
    
    /**
     * Render videos for a guide or step
     * @param {Array} videos - Array of video objects
     * @param {HTMLElement} container - The container element to render into
     */
    function renderVideos(videos, container) {
        if (!videos || !Array.isArray(videos) || videos.length === 0) {
            return;
        }
        
        // Clear container
        container.innerHTML = '';
        
        const titleEl = document.createElement('h3');
        titleEl.textContent = 'Videos';
        titleEl.style.cssText = `
            font-size: var(--font-size-lg);
            font-weight: 600;
            margin-bottom: var(--spacing-md);
            color: var(--text-color);
        `;
        container.appendChild(titleEl);
        
        const gridEl = document.createElement('div');
        gridEl.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: var(--spacing-md);
        `;
        
        for (const video of videos) {
            const videoCard = _createVideoCard(video);
            gridEl.appendChild(videoCard);
        }
        
        container.appendChild(gridEl);
    }
    
    /**
     * Create a video card element
     * @private
     */
    function _createVideoCard(video) {
        const card = document.createElement('div');
        card.className = 'video-card';
        card.style.cssText = `
            background-color: var(--surface-color);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            overflow: hidden;
            cursor: pointer;
            transition: all var(--transition-fast);
        `;
        
        // Thumbnail (placeholder)
        const thumbnailEl = document.createElement('div');
        thumbnailEl.className = 'video-thumbnail';
        thumbnailEl.style.cssText = `
            height: 169px;
            background-color: var(--background-color);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-muted);
        `;
        
        const playIcon = document.createElement('span');
        playIcon.textContent = '▶';
        playIcon.style.cssText = `font-size: 3rem;`;
        thumbnailEl.appendChild(playIcon);
        
        // Content
        const contentEl = document.createElement('div');
        contentEl.style.cssText = `
            padding: var(--spacing-md);
        `;
        
        const titleEl = document.createElement('strong');
        titleEl.textContent = video.title || 'Untitled Video';
        titleEl.style.cssText = `
            display: block;
            font-size: var(--font-size-md);
            margin-bottom: var(--spacing-xs);
            color: var(--text-color);
        `;
        
        const descEl = document.createElement('span');
        descEl.textContent = video.description || '';
        descEl.style.cssText = `
            font-size: var(--font-size-sm);
            color: var(--text-secondary);
        `;
        
        contentEl.appendChild(titleEl);
        contentEl.appendChild(descEl);
        
        card.appendChild(thumbnailEl);
        card.appendChild(contentEl);
        
        // Click handler
        card.addEventListener('click', () => {
            _openVideo(video);
        });
        
        return card;
    }
    
    /**
     * Open a video
     * @private
     */
    function _openVideo(video) {
        if (!video || !video.url) {
            Dialogs.warning('No URL', 'This video does not have a URL specified.');
            return;
        }
        
        // Sanitize URL
        let url = video.url.trim();
        
        // Handle YouTube URLs
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            // Extract video ID
            let videoId = url;
            if (url.includes('youtube.com/watch?v=')) {
                videoId = url.split('v=')[1].split('&')[0];
            } else if (url.includes('youtu.be/')) {
                videoId = url.split('youtu.be/')[1].split('?')[0];
            }
            
            // Create embed URL
            url = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            
            // Open in new tab with embed
            window.open(url, '_blank');
            return;
        }
        
        // Add https:// if missing
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        
        // Open in new tab
        window.open(url, '_blank');
    }
    
    // Public API
    return {
        renderResources,
        renderVideos,
        openResource: _openResource,
        openVideo: _openVideo
    };
})();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Resources;
}
