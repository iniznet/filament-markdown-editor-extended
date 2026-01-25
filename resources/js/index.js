const ICON_MASKS = {
    'align-left': `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
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
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25" />
        </svg>
    `,
    'align-justify': `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
        </svg>
    `,
    spoiler: `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
        </svg>
    `,
    curator: `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
    `,
    'format-paragraphs': `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M13 4v16"/>
            <path d="M17 4v16"/>
            <path d="M19 4H9.5a4.5 4.5 0 0 0 0 9H13"/>
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
    curator: (component) => ({
        name: 'curator',
        className: 'markdown-editor-extended-icon markdown-editor-extended-curator',
        title: 'Insert Media',
        action: () => openCuratorPanel(component),
    }),
    formatParagraphs: (component) => ({
        name: 'format-paragraphs',
        className: 'markdown-editor-extended-icon markdown-editor-extended-format-paragraphs',
        title: 'Convert line breaks to paragraphs',
        action: () => convertLineBreaksToParagraphs(component),
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

function convertLineBreaksToParagraphs(component) {
    const editor = getEditorInstance(component);

    if (! editor?.codemirror) {
        return;
    }

    const cm = editor.codemirror;
    const doc = cm.getDoc();
    const hasSelection = doc.somethingSelected();

    let text;
    let startPos;
    let endPos;

    if (hasSelection) {
        // Only convert selected text
        text = doc.getSelection();
        startPos = doc.getCursor('from');
        endPos = doc.getCursor('to');
    } else {
        // Convert entire document
        text = doc.getValue();
        startPos = { line: 0, ch: 0 };
        endPos = { line: doc.lineCount() - 1, ch: doc.getLine(doc.lineCount() - 1).length };
    }

    // Convert single newlines to double newlines (paragraphs)
    // But preserve existing double newlines (already paragraphs)
    // And preserve markdown elements like headers, lists, code blocks, etc.
    const converted = text
        // First, normalize: replace 3+ newlines with exactly 2
        .replace(/\n{3,}/g, '\n\n')
        // Then convert single newlines to double (but not inside code blocks or after special chars)
        .replace(/([^\n])\n(?!\n)(?![-*+#>\d`|])/g, '$1\n\n');

    if (hasSelection) {
        doc.replaceRange(converted, startPos, endPos);
    } else {
        doc.setValue(converted);
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

function openCuratorPanel(component) {
    // component is the Alpine data object (markdownEditorFormComponent instance)
    // It has: editor, state, $wire, $root, $refs, etc.

    const $wire = component.$wire;
    const $root = component.$root;

    if (!$wire) {
        console.warn('Curator: $wire not found on component');
        return;
    }

    if (!$root) {
        console.warn('Curator: $root not found on component');
        return;
    }

    // The key is the id attribute of the $root element (set in the blade template)
    // Format: typically something like "data.content"
    const key = $root.id;

    if (!key) {
        console.warn('Curator: Could not determine component key from $root.id');
        return;
    }

    const modalId = `curator-panel-${key.replace(/\./g, '-')}`;
    window.dispatchEvent(new CustomEvent('open-modal', {
        detail: { id: modalId },
    }));
}

// Listen for our custom markdown-curator-insert event
document.addEventListener('markdown-curator-insert', (event) => {
    // Handle both wrapped and unwrapped event detail (Livewire can wrap in array)
    let detail = event.detail;
    if (Array.isArray(detail)) {
        detail = detail[0];
    }

    const { key } = detail || {};

    // The media structure from Curator is deeply nested:
    // detail.media = [{ statePath: '...', media: [actual items] }]
    // We need to extract the actual media items
    let media = detail?.media;

    // Unwrap the nested structure
    if (Array.isArray(media) && media.length > 0) {
        // Check if it's the Curator structure with statePath and media
        if (media[0]?.media && Array.isArray(media[0].media)) {
            media = media[0].media;
        }
    }

    if (!key) {
        console.warn('Curator: Missing key in event detail');
        return;
    }

    if (!media || (Array.isArray(media) && media.length === 0)) {
        console.warn('Curator: Missing media in event detail');
        return;
    }

    if (!window.Alpine) {
        console.warn('Curator: Alpine not found');
        return;
    }

    // The key matches the id attribute of the markdown editor element
    const editorElement = document.getElementById(key);

    if (!editorElement) {
        console.warn('Curator: Could not find editor element with id:', key);
        return;
    }

    try {
        const data = window.Alpine.$data(editorElement);
        const editor = data?.editor;

        if (editor && editor.codemirror) {
            const cm = editor.codemirror;
            const items = Array.isArray(media) ? media : [media];
            const text = items.map(item => {
                const url = item.url || item.large_url || item.medium_url || item.thumbnail_url;
                const alt = item.alt || item.title || item.pretty_name || item.name || '';
                return `![${alt}](${url})`;
            }).join('\n');

            cm.replaceSelection(text);
            cm.focus();
        } else {
            console.warn('Curator: Could not find codemirror instance');
        }
    } catch (e) {
        console.error('Curator: Error inserting media', e);
    }
});
