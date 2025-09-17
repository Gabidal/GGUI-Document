import { Headers, HeaderTranslations } from './data.js';
import { goto } from './navigation.js';

export const initSearch = () => {
    const container = document.getElementById('menu-container');
    if (!container) return;

    const wrapper = document.createElement('div');
    wrapper.style.padding = '0.5rem 0.75rem';
    wrapper.style.borderBottom = '1px solid #364057';

    const input = document.createElement('input');
    input.type = 'search';
    input.placeholder = 'Search documentation...';
    input.ariaLabel = 'Search documentation';
    input.style.width = '90%';
    input.style.padding = '0.4rem 0.6rem';
    input.style.borderRadius = '6px';
    input.style.border = '1px solid #364057';
    input.style.background = '#0f172a';
    input.style.color = '#cbd5e1';

    const results = document.createElement('div');
    results.style.maxHeight = '30vh';
    results.style.overflowY = 'auto';

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
        for (const item of items) entries.push({ theme, item, tags: HeaderTranslations[item] || [] });
    }

    const render = (q) => {
        results.innerHTML = '';
        if (!q) return;
        const term = q.toLowerCase();
        const matched = entries.filter(({ theme, item, tags }) =>
            item.toLowerCase().includes(term) ||
            theme.toLowerCase().includes(term) ||
            tags.some(t => t.toLowerCase().includes(term))
        ).slice(0, 20);
        for (const m of matched) {
            const a = document.createElement('a');
            a.textContent = `${m.theme} • ${m.item}`;
            a.href = 'javascript:void(0)';
            a.className = 'Link';
            a.style.display = 'block';
            a.style.padding = '0.25rem 0';
            a.onclick = () => goto(m.theme, m.item);
            results.appendChild(a);
        }
    };

    input.addEventListener('input', (e) => render(e.target.value));
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && results.firstChild) {
            results.firstChild.click();
        }
    });
};
