const ICON_MASKS = {
    'align-left': `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
            <rect x="4" y="5" width="12" height="2" rx="1" />
            <rect x="4" y="9" width="8" height="2" rx="1" />
            <rect x="4" y="13" width="12" height="2" rx="1" />
            <rect x="4" y="17" width="8" height="2" rx="1" />
        </svg>
    `,
    'align-center': `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
            <rect x="6" y="5" width="12" height="2" rx="1" />
            <rect x="8" y="9" width="8" height="2" rx="1" />
            <rect x="6" y="13" width="12" height="2" rx="1" />
            <rect x="8" y="17" width="8" height="2" rx="1" />
        </svg>
    `,
    'align-right': `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
            <rect x="8" y="5" width="12" height="2" rx="1" />
            <rect x="12" y="9" width="8" height="2" rx="1" />
            <rect x="8" y="13" width="12" height="2" rx="1" />
            <rect x="12" y="17" width="8" height="2" rx="1" />
        </svg>
    `,
    'align-justify': `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
            <rect x="4" y="5" width="16" height="2" rx="1" />
            <rect x="4" y="9" width="16" height="2" rx="1" />
            <rect x="4" y="13" width="16" height="2" rx="1" />
            <rect x="4" y="17" width="16" height="2" rx="1" />
        </svg>
    `,
    spoiler: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
            <path d="M12 5c4.79 0 8.7 3.05 10 7-1.3 3.95-5.21 7-10 7s-8.7-3.05-10-7c1.3-3.95 5.21-7 10-7zm0 4a3 3 0 100 6 3 3 0 000-6z" />
            <path d="M6 18.5L18.5 6 19.9 7.4 7.4 19.9z" />
        </svg>
    `,
};

const CUSTOM_BUTTONS = {
    alignLeft: (component) => makeAlignmentButton(component, 'align-left', 'Align left'),
    alignCenter: (component) => makeAlignmentButton(component, 'align-center', 'Align center'),
    alignRight: (component) => makeAlignmentButton(component, 'align-right', 'Align right'),
    alignJustify: (component) => makeAlignmentButton(component, 'align-justify', 'Justify'),
    spoiler: (component) => ({
        name: 'spoiler',
        className: 'markdown-editor-extended-icon markdown-editor-extended-spoiler',
        title: 'Spoiler',
        action: () => toggleInlineSpoiler(component),
    }),
};

function makeAlignmentButton(component, variant, title) {
    return {
        name: variant,
        className: `markdown-editor-extended-icon markdown-editor-extended-${variant}`,
        title,
        action: () => insertFencedBlock(component, `:::${variant}`),
    };
}

function ensureIconStylesInjected() {
    if (document.getElementById('markdown-editor-extended-icons')) {
        return;
    }

    const style = document.createElement('style');
    style.id = 'markdown-editor-extended-icons';
    style.textContent = buildIconStyles();

    document.head.appendChild(style);
}

function buildIconStyles() {
    const baseSelector = '.editor-toolbar';
    const base = `
${baseSelector} a.markdown-editor-extended-icon,
${baseSelector} button.markdown-editor-extended-icon {
    position: relative;
    text-indent: -9999px;
}

${baseSelector} a.markdown-editor-extended-icon::before,
${baseSelector} button.markdown-editor-extended-icon::before {
    content: '';
    display: inline-block;
    width: 1.1rem;
    height: 1.1rem;
    background-color: currentColor;
    mask-repeat: no-repeat;
    mask-position: center;
    mask-size: 1.1rem;
}
`;

    const iconRules = Object.entries(ICON_MASKS)
        .map(([variant, svg]) => {
            const dataUrl = svgDataUrl(svg);

            return `
${baseSelector} .markdown-editor-extended-${variant}::before {
    -webkit-mask-image: url('${dataUrl}');
    mask-image: url('${dataUrl}');
}
`;
        })
        .join('\n');

    return `${base}\n${iconRules}`;
}

function svgDataUrl(svg) {
    const encoded = encodeURIComponent(svg.replace(/\s+/g, ' ').trim())
        .replace(/'/g, '%27')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29');

    return `data:image/svg+xml,${encoded}`;
}

function insertFencedBlock(component, opener) {
    const editor = getEditorInstance(component);

    if (! editor?.codemirror) {
        return;
    }

    const cm = editor.codemirror;
    const doc = cm.getDoc();
    const selection = doc.getSelection();
    const closing = ':::';
    const block = `${opener}\n${selection || ''}\n${closing}`;

    doc.replaceSelection(block);

    if (! selection) {
        const cursor = doc.getCursor();
        doc.setCursor({ line: cursor.line - 1, ch: opener.length });
    }

    cm.focus();
}

function patchComponent(component) {
    if (! component || component.__markdownEditorExtendedPatched) {
        return component;
    }

    if (typeof component.getToolbarButton !== 'function') {
        return component;
    }

    ensureIconStylesInjected();

    const originalGetToolbarButton = component.getToolbarButton.bind(component);

    component.getToolbarButton = function (name) {
        if (CUSTOM_BUTTONS[name]) {
            return CUSTOM_BUTTONS[name](component);
        }

        return originalGetToolbarButton(name);
    };

    component.__markdownEditorExtendedPatched = true;

    return component;
}

function getEditorInstance(component) {
    return component?.editor ?? component;
}

function toggleInlineSpoiler(component) {
    const editor = getEditorInstance(component);

    if (! editor?.codemirror) {
        return;
    }

    const cm = editor.codemirror;
    const doc = cm.getDoc();
    const spoilerStart = '||';
    const spoilerEnd = '||';
    const hasSelection = doc.somethingSelected();
    const startPos = doc.getCursor('from');
    const endPos = doc.getCursor('to');
    const startIndex = doc.indexFromPos(startPos);
    const endIndex = doc.indexFromPos(endPos);

    if (hasSelection) {
        const selectedText = doc.getSelection();
        const selectionWrapped =
            selectedText.startsWith(spoilerStart) &&
            selectedText.endsWith(spoilerEnd) &&
            selectedText.length >= spoilerStart.length + spoilerEnd.length;
        const canCheckOutside = startIndex >= spoilerStart.length;
        const beforeSelection = canCheckOutside
            ? doc.getRange(doc.posFromIndex(startIndex - spoilerStart.length), startPos)
            : '';
        const afterSelection = doc.getRange(endPos, doc.posFromIndex(endIndex + spoilerEnd.length));
        const aroundWrapped =
            beforeSelection === spoilerStart &&
            afterSelection === spoilerEnd;

        if (selectionWrapped) {
            const inner = selectedText.slice(spoilerStart.length, selectedText.length - spoilerEnd.length);
            doc.replaceRange(inner, startPos, endPos);
            const newEndIndex = startIndex + inner.length;
            doc.setSelection(startPos, doc.posFromIndex(newEndIndex));
        } else if (aroundWrapped) {
            const endTokenFrom = doc.posFromIndex(endIndex);
            const endTokenTo = doc.posFromIndex(endIndex + spoilerEnd.length);
            doc.replaceRange('', endTokenFrom, endTokenTo);

            const startTokenFrom = doc.posFromIndex(startIndex - spoilerStart.length);
            doc.replaceRange('', startTokenFrom, startPos);

            const newStartIndex = startIndex - spoilerStart.length;
            const newEndIndex = endIndex - spoilerStart.length;
            doc.setSelection(
                doc.posFromIndex(newStartIndex),
                doc.posFromIndex(newEndIndex),
            );
        } else {
            const wrapped = `${spoilerStart}${selectedText}${spoilerEnd}`;
            doc.replaceRange(wrapped, startPos, endPos);
            const selectionStart = doc.posFromIndex(startIndex + spoilerStart.length);
            const selectionEnd = doc.posFromIndex(startIndex + spoilerStart.length + selectedText.length);
            doc.setSelection(selectionStart, selectionEnd);
        }
    } else {
        const placeholder = 'spoiler';
        const wrapped = `${spoilerStart}${placeholder}${spoilerEnd}`;
        doc.replaceRange(wrapped, startPos);
        const selectionStart = doc.posFromIndex(startIndex + spoilerStart.length);
        const selectionEnd = doc.posFromIndex(startIndex + spoilerStart.length + placeholder.length);
        doc.setSelection(selectionStart, selectionEnd);
    }

    cm.focus();
}

function patchAlpineData() {
    const Alpine = window.Alpine;

    if (! Alpine || Alpine.data.__markdownEditorExtendedPatched) {
        return Boolean(Alpine);
    }

    const originalData = Alpine.data.bind(Alpine);

    Alpine.data = function (name, callback) {
        if (name !== 'markdownEditorFormComponent') {
            return originalData(name, callback);
        }

        return originalData(name, function (...args) {
            const component = callback(...args);

            return patchComponent(component);
        });
    };

    Alpine.data.__markdownEditorExtendedPatched = true;

    return true;
}

if (! patchAlpineData()) {
    document.addEventListener('alpine:init', () => {
        patchAlpineData();
    }, { once: true });
}
