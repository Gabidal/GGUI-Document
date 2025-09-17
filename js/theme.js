const KEY = 'ggui-theme';

export const applyTheme = (theme) => {
    const t = theme || localStorage.getItem(KEY) || 'dark';
    document.body.setAttribute('data-theme', t);
};

export const toggleTheme = () => {
    const current = document.body.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(KEY, next);
    applyTheme(next);
};

export const initTheme = () => {
    applyTheme();
};
