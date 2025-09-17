import { codify, setTitle } from './utils.js';
import { Headers } from './data.js';

// Simple in-memory cache for fetched HTML
const cache = new Map();

const highlightAll = () => {
    if (window.hljs && typeof window.hljs.highlightAll === 'function') {
        window.hljs.highlightAll();
    }
};

export const goto = async (theme, titleName) => {
    const Title_Name = titleName.replace(/\s+/g, '').toLowerCase();
    const resourceName = `${theme.toLowerCase()}/${Title_Name}.html`;

    history.pushState({ resource: resourceName }, '', `#${resourceName}`);
    await loadResource(resourceName, theme, titleName);
};

export const loadResource = async (resourceName, theme = '', titleName = '') => {
    const container = document.getElementById('content-container');
    if (!container) return;

    try {
        let html;
        if (cache.has(resourceName)) {
            html = cache.get(resourceName);
        } else {
            const res = await fetch(resourceName, { cache: 'no-cache' });
            if (!res.ok) throw new Error(`Failed to load resource: ${resourceName}`);
            html = await res.text();
            cache.set(resourceName, html);
        }

        container.innerHTML = html;
        // Lazy-load images inside content
        container.querySelectorAll('img').forEach(img => {
            img.setAttribute('loading', 'lazy');
        });
        // Re-highlight code
        codify();
        highlightAll();
        setTitle(theme, titleName);
        // Re-run link highlighting after content load
        if (window.Highlight_Links) window.Highlight_Links();
    } catch (err) {
        console.error(err);
        container.innerHTML = `
            <div role="alert" style="padding:1rem">
                <p>Content not found for <code>${resourceName}</code>.</p>
                <button id="retry-load">Retry</button>
            </div>`;
        const retry = container.querySelector('#retry-load');
        if (retry) retry.addEventListener('click', () => loadResource(resourceName, theme, titleName));
    }
};

export const devDisplay = async (file) => {
    const name = file.endsWith('.html') ? file : `${file}.html`;
    if (name === 'default.html') {
        setTitle();
    }
    await loadResource(name);
};

export const initNavigation = () => {
    if (window.hljs) window.hljs.configure({ languages: ['cpp'] });

    window.addEventListener('popstate', (event) => {
        const stateRes = event.state && event.state.resource;
        const hash = window.location.hash ? window.location.hash.substring(1) : '';
        const resource = stateRes || hash || 'default.html';
        loadResource(resource);
    });

    // Expose goto globally for inline onclick handlers if needed
    window.Goto = goto;
    window.dev_display = devDisplay;
};
