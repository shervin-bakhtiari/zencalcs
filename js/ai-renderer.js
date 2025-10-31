/**
 * ZenCalcs AI Response Renderer
 * Renders Markdown responses with icon placeholder replacement
 */

// Icon SVG map - maps [icon:name] to actual SVG code
const iconMap = {
    home: `<svg class="inline-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>`,

    wallet: `<svg class="inline-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>
        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/>
        <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>
    </svg>`,

    chart: `<svg class="inline-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="20" x2="12" y2="10"/>
        <line x1="18" y1="20" x2="18" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="16"/>
    </svg>`,

    bolt: `<svg class="inline-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>`,

    lightbulb: `<svg class="inline-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="9" y1="18" x2="15" y2="18"/>
        <line x1="10" y1="22" x2="14" y2="22"/>
        <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
    </svg>`,

    trending: `<svg class="inline-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
        <polyline points="17 6 23 6 23 12"/>
    </svg>`,

    target: `<svg class="inline-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="12" r="6"/>
        <circle cx="12" cy="12" r="2"/>
    </svg>`,

    alert: `<svg class="inline-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>`,

    calculator: `<svg class="inline-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2"/>
        <rect x="8" y="6" width="8" height="4" rx="1"/>
        <line x1="8" y1="14" x2="8" y2="14"/>
        <line x1="12" y1="14" x2="12" y2="14"/>
        <line x1="16" y1="14" x2="16" y2="14"/>
    </svg>`,

    check: `<svg class="inline-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"/>
    </svg>`
};

/**
 * Replace [icon:name] placeholders with SVG icons
 */
function replaceIconPlaceholders(text) {
    return text.replace(/\[icon:(\w+)\]/g, (match, iconName) => {
        return iconMap[iconName] || match;
    });
}

/**
 * Simple markdown renderer (if marked.js not available)
 */
function simpleMarkdownRender(text) {
    let html = text;

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Lists
    html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    // Blockquotes
    html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

    // Line breaks
    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/\n/g, '<br>');

    // Wrap in paragraphs
    html = '<p>' + html + '</p>';

    return html;
}

/**
 * Render AI response with icon replacement and markdown parsing
 * @param {string} markdownText - The markdown text from Claude
 * @param {string} targetElementId - ID of the element to render into
 */
function renderAIResponse(markdownText, targetElementId) {
    const element = document.getElementById(targetElementId);
    if (!element) {
        console.error(`Element with ID "${targetElementId}" not found`);
        return;
    }

    // Render markdown FIRST (without icon replacement)
    let html;
    if (typeof marked !== 'undefined') {
        // Use marked.js if available
        html = marked.parse(markdownText);
    } else {
        // Use simple renderer as fallback
        html = simpleMarkdownRender(markdownText);
    }

    // THEN replace icon placeholders in the HTML
    html = replaceIconPlaceholders(html);

    // Set the HTML
    element.innerHTML = html;
    element.classList.add('ai-results');
}

/**
 * Render AI response with collapsible "Show More" functionality
 * Extracts first 2-3 paragraphs as summary, rest as expandable content
 * @param {string} markdownText - The markdown text from Claude
 * @param {string} targetElementId - ID of the element to render into
 */
function renderCollapsibleAIResponse(markdownText, targetElementId) {
    const element = document.getElementById(targetElementId);
    if (!element) {
        console.error(`Element with ID "${targetElementId}" not found`);
        return;
    }

    // Render full markdown first
    let html;
    if (typeof marked !== 'undefined') {
        html = marked.parse(markdownText);
    } else {
        html = simpleMarkdownRender(markdownText);
    }

    // Replace icon placeholders
    html = replaceIconPlaceholders(html);

    // Create a temporary div to parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // Find the first h2 (if it exists) and content after it
    const firstH2 = tempDiv.querySelector('h2');
    let summaryContent = '';
    let expandedContent = '';

    if (firstH2) {
        // Get all elements
        const allElements = Array.from(tempDiv.children);
        const h2Index = allElements.indexOf(firstH2);

        // Summary: First h2 and next 2-3 elements
        const summaryElements = allElements.slice(h2Index, h2Index + 4);
        summaryContent = summaryElements.map(el => el.outerHTML).join('');

        // Expanded: Everything after summary
        const expandedElements = allElements.slice(h2Index + 4);
        if (expandedElements.length > 0) {
            expandedContent = expandedElements.map(el => el.outerHTML).join('');
        }
    } else {
        // If no h2, just split by paragraphs
        const paragraphs = tempDiv.querySelectorAll('p');
        if (paragraphs.length > 2) {
            summaryContent = Array.from(paragraphs).slice(0, 2).map(p => p.outerHTML).join('');
            expandedContent = Array.from(paragraphs).slice(2).map(p => p.outerHTML).join('');
        } else {
            summaryContent = html;
        }
    }

    // Build collapsible HTML
    if (expandedContent) {
        const uniqueId = targetElementId + '-expanded';
        element.innerHTML = `
            <div class="ai-summary">${summaryContent}</div>
            <div id="${uniqueId}" class="ai-expanded hidden">${expandedContent}</div>
            <button onclick="toggleAIExpanded('${uniqueId}', this)" class="mt-4 px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-semibold transition flex items-center gap-2 mx-auto">
                <span class="expand-text">Show More Analysis</span>
                <svg class="w-4 h-4 expand-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
            </button>
        `;
    } else {
        element.innerHTML = html;
    }

    element.classList.add('ai-results');
}

/**
 * Toggle expanded AI content
 */
function toggleAIExpanded(contentId, button) {
    const content = document.getElementById(contentId);
    const text = button.querySelector('.expand-text');
    const icon = button.querySelector('.expand-icon');

    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        content.classList.add('ai-fade-in');
        text.textContent = 'Show Less';
        icon.style.transform = 'rotate(180deg)';
    } else {
        content.classList.add('hidden');
        content.classList.remove('ai-fade-in');
        text.textContent = 'Show More Analysis';
        icon.style.transform = 'rotate(0deg)';
    }
}

// Export for use in other files
window.renderAIResponse = renderAIResponse;
window.renderCollapsibleAIResponse = renderCollapsibleAIResponse;
window.toggleAIExpanded = toggleAIExpanded;
window.replaceIconPlaceholders = replaceIconPlaceholders;
