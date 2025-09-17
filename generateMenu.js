// Compatibility shim: keep old globals pointing to new module functions
// so existing inline handlers in content continue to work.
(function(){
    const load = async () => {
        const menu = await import('./js/menu.js');
        const nav = await import('./js/navigation.js');
        const scroll = await import('./js/scrollIndicators.js');
        const links = await import('./js/highlightLinks.js');
        
        window.Generate_List = menu.generateList;
        window.Change_Order = menu.changeOrder;
        window.display_menu = menu.displayMenu;
        window.Goto = nav.goto;
        window.dev_display = nav.devDisplay;
        window.updateScrollIndicator = scroll.updateScrollIndicator;
        window.initScrollIndicators = scroll.initScrollIndicators;
        window.Highlight_Links = links.Highlight_Links;
        window.init = () => {};
    };
    if (document.readyState !== 'loading') load();
    else document.addEventListener('DOMContentLoaded', load);
})();
