import { initNavigation, devDisplay } from './navigation.js';
import { displayMenu, generateList } from './menu.js';
import { initScrollIndicators } from './scrollIndicators.js';
import { Highlight_Links } from './highlightLinks.js';
import { initSearch } from './search.js';
import { initTheme, toggleTheme } from './theme.js';

// Bootstrapping
window.addEventListener('DOMContentLoaded', async () => {
    initTheme();
    initNavigation();
    await displayMenu();
    generateList();
    initSearch();
    initScrollIndicators();
    Highlight_Links();

    // Load route from hash or default
    const hash = window.location.hash ? window.location.hash.substring(1) : '';
    if (hash) {
        // navigation will handle
        window.dev_display(hash.replace('.html', ''));
    } else {
        devDisplay('default');
    }
});
