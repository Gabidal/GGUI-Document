import { Headers, HeaderTranslations } from './data.js';
import { goto, toResourceName } from './navigation.js';
import { hideMenuIfPortrait } from './menu.js';
import { debounce } from './utils.js';

const MAX_RESULTS = 20;
const MAX_SNIPPET_CHARS = 160;

export const initSearch = () => {
    const container = document.getElementById('menu-container');
    if (!container) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'searchWrapper';

    const input = document.createElement('input');
    input.type = 'search';
    input.placeholder = 'Search documentation...';
    input.ariaLabel = 'Search documentation';
    input.className = 'searchBox';

    const results = document.createElement('div');
    results.className = 'searchResult';

    wrapper.appendChild(input);
    wrapper.appendChild(results);
    // Insert search after the logo/header div and before the menu list
    const headerDiv = container.querySelector('div');
    if (headerDiv && headerDiv.parentElement === container) {
        headerDiv.insertAdjacentElement('afterend', wrapper);
    } else {
        container.prepend(wrapper);
    }

    const entries = [];
    for (const [theme, items] of Object.entries(Headers)) {
        for (const item of items) {
            entries.push({
                theme,
                item,
                tags: HeaderTranslations[item] || [],
                resourceName: toResourceName(theme, item)
            });
        }
    }

    const pageTextCache = new Map();
    const pendingFetches = new Map();
    let searchToken = 0;

    const normalizeText = (text) => text.replace(/\s+/g, ' ').trim();

    const extractTextFromHtml = (html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        doc.querySelectorAll('script, style, noscript').forEach(el => el.remove());
        const text = doc.body ? doc.body.textContent || '' : '';
        return normalizeText(text);
    };

    const getPageText = async (resourceName) => {
        if (pageTextCache.has(resourceName)) return pageTextCache.get(resourceName);
        if (pendingFetches.has(resourceName)) return pendingFetches.get(resourceName);

        const fetchPromise = (async () => {
            try {
                const res = await fetch(resourceName, { cache: 'no-cache' });
                if (!res.ok) throw new Error(`Failed to load resource: ${resourceName}`);
                const html = await res.text();
                return extractTextFromHtml(html);
            } catch (err) {
                console.error(err);
                return '';
            } finally {
                pendingFetches.delete(resourceName);
            }
        })();

        pendingFetches.set(resourceName, fetchPromise);
        const text = await fetchPromise;
        pageTextCache.set(resourceName, text);
        return text;
    };

    const getSnippet = (text, termLower) => {
        const idx = text.toLowerCase().indexOf(termLower);
        if (idx === -1) return '';
        const snippet = text.slice(idx, idx + MAX_SNIPPET_CHARS);
        return normalizeText(snippet);
    };

    const buildResultLink = (entry, snippet = '') => {
        const a = document.createElement('a');
        a.className = 'Link';
        a.href = 'javascript:void(0)';
        a.onclick = () => {
            goto(entry.theme, entry.item);
            hideMenuIfPortrait();
        };

        const title = document.createElement('span');
        title.className = 'searchResultTitle';
        title.textContent = `${entry.theme} • ${entry.item}`;
        a.appendChild(title);

        if (snippet) {
            const extra = document.createElement('span');
            extra.className = 'searchResultSnippet';
            extra.textContent = `(${snippet})`;
            a.appendChild(extra);
        }

        return a;
    };

    const renderMenuMatches = (matched) => {
        results.innerHTML = '';
        for (const m of matched) {
            results.appendChild(buildResultLink(m));
        }
    };

    const renderContentMatches = async (termLower, token) => {
        let added = 0;
        for (const entry of entries) {
            if (token !== searchToken) return;
            const text = await getPageText(entry.resourceName);
            if (token !== searchToken) return;
            if (!text) continue;
            const snippet = getSnippet(text, termLower);
            if (!snippet) continue;
            results.appendChild(buildResultLink(entry, snippet));
            added += 1;
            if (added >= MAX_RESULTS) return;
        }
    };

    const render = (q) => {
        const token = ++searchToken;
        results.innerHTML = '';
        const term = q.trim();
        if (!term) return;

        const termLower = term.toLowerCase();
        const matched = entries.filter(({ theme, item, tags }) =>
            item.toLowerCase().includes(termLower) ||
            theme.toLowerCase().includes(termLower) ||
            tags.some(t => t.toLowerCase().includes(termLower))
        ).slice(0, MAX_RESULTS);

        if (matched.length > 0) {
            renderMenuMatches(matched);
            return;
        }

        void renderContentMatches(termLower, token);
    };

    const debouncedRender = debounce((value) => render(value), 150);

    input.addEventListener('input', (e) => debouncedRender(e.target.value));
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && results.firstElementChild) {
            results.firstElementChild.click();
        }
    });
};
