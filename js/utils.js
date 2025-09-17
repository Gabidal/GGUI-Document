// Utilities
export const codify = () => {
    document.querySelectorAll('code').forEach(codeElement => {
        if (!codeElement.parentElement.matches('pre')) {
            const preElement = document.createElement('pre');
            preElement.appendChild(codeElement.cloneNode(true));
            codeElement.replaceWith(preElement);
        }
        codeElement.classList.add('language-cpp');
    });
};

export const setTitle = (theme, name) => {
    const clean = (s) => s.replace(/\s+/g, ' ').trim();
    const parts = ["GGUI Docs", theme && clean(theme), name && clean(name)].filter(Boolean);
    document.title = parts.join(' • ');
};

export const debounce = (fn, wait = 150) => {
    let t;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(null, args), wait);
    };
};

export const sanitizeHTML = (html) => html; // placeholder for stricter policies if needed
