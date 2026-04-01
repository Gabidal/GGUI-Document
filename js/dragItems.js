const DRAGGABLE_SELECTOR = '.draggableItem';
const DRAG_INIT_ATTR = 'data-drag-init';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const getViewportSize = () => {
    const doc = document.documentElement;
    return {
        width: doc.clientWidth,
        height: doc.clientHeight,
    };
};

const startDrag = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    const target = event.currentTarget;
    event.preventDefault();

    const rect = target.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    if (target.setPointerCapture) {
        target.setPointerCapture(event.pointerId);
    }

    target.style.position = 'fixed';
    target.style.left = `${rect.left}px`;
    target.style.top = `${rect.top}px`;
    target.style.right = 'auto';
    target.style.bottom = 'auto';
    target.style.cursor = 'grabbing';

    const onMove = (moveEvent) => {
        const view = getViewportSize();
        const maxLeft = Math.max(0, view.width - rect.width);
        const maxTop = Math.max(0, view.height - rect.height);
        const nextLeft = clamp(moveEvent.clientX - offsetX, 0, maxLeft);
        const nextTop = clamp(moveEvent.clientY - offsetY, 0, maxTop);
        target.style.left = `${nextLeft}px`;
        target.style.top = `${nextTop}px`;
    };

    const onUp = (upEvent) => {
        if (target.releasePointerCapture) {
            target.releasePointerCapture(upEvent.pointerId);
        }
        target.style.cursor = 'grab';
        target.removeEventListener('pointermove', onMove);
        target.removeEventListener('pointerup', onUp);
        target.removeEventListener('pointercancel', onUp);
    };

    target.addEventListener('pointermove', onMove);
    target.addEventListener('pointerup', onUp);
    target.addEventListener('pointercancel', onUp);
};

export const initItemDrag = (root = document) => {
    const elements = root.querySelectorAll(DRAGGABLE_SELECTOR);
    elements.forEach((element) => {
        if (element.getAttribute(DRAG_INIT_ATTR) === 'true') return;
        element.setAttribute(DRAG_INIT_ATTR, 'true');
        element.setAttribute('draggable', 'false');
        element.style.touchAction = 'none';
        element.addEventListener('pointerdown', startDrag);
    });
};
