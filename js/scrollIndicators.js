import { debounce } from './utils.js';

export const updateScrollIndicator = (element) => {
    if (!element) return;
    const hasScroll = element.scrollHeight > element.clientHeight;
    const isAtBottom = element.scrollTop + element.clientHeight >= element.scrollHeight - 5;

    if (element.id === 'menu-container') {
        const menuUl = document.getElementById('menu');
        if (menuUl) {
            if (hasScroll && !isAtBottom) {
                menuUl.classList.add('scroll-indicator', 'has-scroll');
            } else {
                menuUl.classList.remove('has-scroll');
                if (!hasScroll) menuUl.classList.remove('scroll-indicator');
            }
        }
    } else {
        if (hasScroll && !isAtBottom) {
            element.classList.add('scroll-indicator', 'has-scroll');
        } else {
            element.classList.remove('has-scroll');
            if (!hasScroll) element.classList.remove('scroll-indicator');
        }
    }
};

export const initScrollIndicators = () => {
    const menuContainer = document.getElementById('menu-container');
    const contentContainer = document.getElementById('content-container');
    const menuUl = document.getElementById('menu');

    const updMenu = debounce(() => updateScrollIndicator(menuContainer), 100);
    const updContent = debounce(() => updateScrollIndicator(contentContainer), 100);

    if (menuUl && menuContainer) {
        menuUl.classList.add('scroll-indicator');
        updMenu();
        menuContainer.addEventListener('scroll', updMenu);
        const menuObserver = new MutationObserver(() => setTimeout(updMenu, 50));
        menuObserver.observe(menuContainer, { childList: true, subtree: true });
    }
    if (contentContainer) {
        contentContainer.classList.add('scroll-indicator');
        updContent();
        contentContainer.addEventListener('scroll', updContent);
        const contentObserver = new MutationObserver(() => setTimeout(updContent, 50));
        contentObserver.observe(contentContainer, { childList: true, subtree: true });
    }
    window.addEventListener('resize', () => {
        setTimeout(() => {
            updMenu();
            updContent();
        }, 100);
    });
};
