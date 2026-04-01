import { Headers, clone, reverseLists } from './data.js';
import { goto } from './navigation.js';

let headers = clone(Headers);
const headerBackup = reverseLists(clone(Headers));
let menuToggleInitialized = false;
let menuContainer = null;

const isPortraitView = () => {
    if (window.matchMedia) {
        return window.matchMedia('(orientation: portrait)').matches;
    }
    return window.innerHeight > window.innerWidth;
};

const setMenuHidden = (hidden) => {
    if (!menuContainer) return;
    document.body.classList.toggle('menu-hidden', hidden);
    menuContainer.setAttribute('aria-hidden', hidden ? 'true' : 'false');
};

export const hideMenuIfPortrait = () => {
    if (!isPortraitView()) return;
    setMenuHidden(true);
};

export const changeOrder = (alphabetical) => {
    if (alphabetical) {
        for (const k in headers) {
            headers[k] = [...headers[k]].sort().reverse();
        }
    } else {
        headers = clone(headerBackup);
    }
    generateList();
};

export const generateList = () => {
    const List = document.getElementById('menu');
    if (!List) return;

    for (const [Header, Content] of Object.entries(headers)) {
        const Item = document.createElement('details');
        Item.className = 'Header List Element';
        Item.open = true;
        Item.setAttribute('role', 'group');

        const Summary = document.createElement('summary');
        Summary.innerText = Header;
        Summary.setAttribute('role', 'heading');
        Summary.setAttribute('aria-level', '2');
        Item.appendChild(Summary);

        for (const Sub_Item of Content) {
            const Sub_Element = document.createElement('li');
            Sub_Element.innerText = Sub_Item;
            Sub_Element.setAttribute('role', 'link');
            Sub_Element.tabIndex = 0;
            Sub_Element.onclick = () => {
                goto(Header, Sub_Item);
                hideMenuIfPortrait();
            };
            Sub_Element.onkeydown = (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    goto(Header, Sub_Item);
                    hideMenuIfPortrait();
                }
            };
            Item.appendChild(Sub_Element);
        }

        let Found_Previous_Item_Form = false;
        for (const Old_Item of List.getElementsByTagName('details')) {
            if (Old_Item.getElementsByTagName('summary')[0].innerText === Header) {
                for (let i = Old_Item.childNodes.length - 1; i >= 0; i--) Old_Item.childNodes[i].remove();
                for (let i = Item.childNodes.length - 1; i >= 0; i--) Old_Item.appendChild(Item.childNodes[i]);
                Found_Previous_Item_Form = true;
                break;
            }
        }
        if (!Found_Previous_Item_Form) List.appendChild(Item);
    }
};

export const displayMenu = async () => {
    const container = document.getElementById('menu-container');
    if (!container) return;
    try {
        const res = await fetch('menu.html');
        const html = await res.text();
        container.innerHTML = html;
        const menuUl = document.getElementById('menu');
        if (menuUl) menuUl.setAttribute('role', 'tree');
        initMenuToggle();
        generateList();
    } catch (e) {
        console.error(e);
    }
};

// expose for other modules needing headers list
export const getHeaders = () => headers;

const initMenuToggle = () => {
    if (menuToggleInitialized) return;

    const hideBtn = document.getElementById('menu-hide-btn');
    const unhideBtn = document.getElementById('menu-unhide-btn');
    const container = document.getElementById('menu-container');

    if (!hideBtn || !unhideBtn || !container) return;

    menuContainer = container;

    hideBtn.addEventListener('click', (event) => {
        event.preventDefault();
        setMenuHidden(true);
    });

    unhideBtn.addEventListener('click', (event) => {
        event.preventDefault();
        setMenuHidden(false);
    });

    setMenuHidden(false);
    menuToggleInitialized = true;
};
