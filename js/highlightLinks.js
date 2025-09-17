import { Headers, HeaderTranslations } from './data.js';

export const Highlight_Links = () => {
    const Main = document.getElementById('content-container');
    if (!Main) return;
    for (const Paragraph of Main.getElementsByTagName('p')) {
        if (Paragraph.querySelector('.preserve-href')) continue;
        let Name = Paragraph.innerText;
        let words = Name.split(/((?<!\d)\.(?!\d)|[\s,!?(){}\[\]])/);
        for (let i = 0; i < words.length; i++) {
            let matched = false;
            for (const [theme, keywords] of Object.entries(Headers)) {
                if (matched) break;
                if (keywords.some(keyword => {
                    if (keyword.toLowerCase() === words[i].toLowerCase()) {
                        words[i] = `<a class="Link" onclick="Goto('${theme}', '${keyword}')">${words[i]}</a>`;
                        matched = true;
                        return true;
                    }
                    return false;
                })) break;
                for (const keyword of keywords) {
                    if (HeaderTranslations[keyword]?.some(translated => translated.toLowerCase() === words[i].toLowerCase())) {
                        words[i] = `<a class="Link" onclick="Goto('${theme}', '${keyword}')">${words[i]}</a>`;
                        matched = true;
                        break;
                    }
                }
            }
        }
        Paragraph.innerHTML = words.join("");
    }
};

// Expose globally to reuse in navigation
window.Highlight_Links = Highlight_Links;
