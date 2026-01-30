const EXTENDED_ICON_KEYS = new Set([
    'align-left',
    'align-center',
    'align-right',
    'align-justify',
    'spoiler',
    'curator',
    'format-paragraphs',
]);

const DEFAULT_TITLES = {
    bold: 'Bold',
    italic: 'Italic',
    strike: 'Strikethrough',
    link: 'Link',
    heading: 'Heading',
    blockquote: 'Blockquote',
    codeBlock: 'Code block',
    bulletList: 'Bullet list',
    orderedList: 'Numbered list',
};

const DEFAULT_SYNTAX = {
    bold: { prefix: '**', suffix: '**' },
    italic: { prefix: '*', suffix: '*' },
    strike: { prefix: '~~', suffix: '~~' },
    link: { prefix: '[', suffix: '](url)' },
    heading: { prefix: '# ', suffix: '' },
    blockquote: { prefix: '> ', suffix: '' },
    codeBlock: { prefix: '```\n', suffix: '\n```' },
    bulletList: { prefix: '- ', suffix: '' },
    orderedList: { prefix: '1. ', suffix: '' },
    alignLeft: { prefix: ':::align-left\n', suffix: '\n:::' },
    alignCenter: { prefix: ':::align-center\n', suffix: '\n:::' },
    alignRight: { prefix: ':::align-right\n', suffix: '\n:::' },
    alignJustify: { prefix: ':::align-justify\n', suffix: '\n:::' },
    spoiler: { prefix: '||', suffix: '||' },
};

const CUSTOM_BUTTONS = {
    alignLeft: (component) => makeAlignmentButton(component, 'align-left', getToolLabel(component, 'align_left', 'Align left')),
    alignCenter: (component) => makeAlignmentButton(component, 'align-center', getToolLabel(component, 'align_center', 'Align center')),
    alignRight: (component) => makeAlignmentButton(component, 'align-right', getToolLabel(component, 'align_right', 'Align right')),
    alignJustify: (component) => makeAlignmentButton(component, 'align-justify', getToolLabel(component, 'align_justify', 'Justify')),
    spoiler: (component) => ({
        name: 'spoiler',
        className: 'markdown-editor-extended-icon markdown-editor-extended-spoiler',
        title: getToolLabel(component, 'spoiler', 'Spoiler'),
        action: () => toggleInlineSpoiler(component),
    }),
    curator: (component) => ({
        name: 'curator',
        className: 'markdown-editor-extended-icon markdown-editor-extended-curator',
        title: getToolLabel(component, 'curator', 'Insert media'),
        action: () => openCuratorPanel(component),
    }),
    formatParagraphs: (component) => ({
        name: 'format-paragraphs',
        className: 'markdown-editor-extended-icon markdown-editor-extended-format-paragraphs',
        title: getToolLabel(component, 'format_paragraphs', 'Convert line breaks to paragraphs'),
        action: () => convertLineBreaksToParagraphs(component),
    }),
};

function getToolLabel(component, key, fallback) {
    const labels = component?.extendedTranslations?.tools ?? component?.extendedTranslations ?? {};

    return labels[key] ?? fallback;
}

function makeAlignmentButton(component, variant, title) {
    return {
        name: variant,
        className: `markdown-editor-extended-icon markdown-editor-extended-${variant}`,
        title,
        action: () => insertFencedBlock(component, `:::${variant}`),
    };
}

function ensureIconStylesInjected(component) {
    if (document.getElementById('markdown-editor-extended-icons')) {
        return;
    }

    const style = document.createElement('style');
    style.id = 'markdown-editor-extended-icons';
    style.textContent = buildIconStyles(getIconMasks(component));

    document.head.appendChild(style);
}

function buildIconStyles(iconMasks) {
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

    const iconRules = Object.entries(iconMasks)
        .map(([variant, value]) => {
            const selector = resolveIconSelector(baseSelector, variant);
            const url = resolveIconUrl(value);

            if (! selector || ! url) {
                return '';
            }

            return `
${selector}::before {
    -webkit-mask-image: url('${url}');
    mask-image: url('${url}');
}
`;
        })
        .filter(Boolean)
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

function resolveIconSelector(baseSelector, key) {
    if (! key) {
        return null;
    }

    if (key.startsWith('.') || key.startsWith('#') || key.includes(' ')) {
        return `${baseSelector} ${key}`;
    }

    if (EXTENDED_ICON_KEYS.has(key)) {
        return `${baseSelector} .markdown-editor-extended-${key}`;
    }

    return `${baseSelector} .${key}`;
}

function resolveIconUrl(value) {
    if (! value || typeof value !== 'string') {
        return null;
    }

    const trimmed = value.trim();

    if (trimmed.startsWith('<svg')) {
        return svgDataUrl(trimmed);
    }

    return trimmed;
}

function getIconMasks(component) {
    return component?.extendedIcons ?? {};
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

    if (typeof component.init === 'function' && ! component.__markdownEditorExtendedInitPatched) {
        const originalInit = component.init.bind(component);

        component.init = async function (...args) {
            await originalInit(...args);

            applyPreviewSyntaxNormalizer(component);
        };

        component.__markdownEditorExtendedInitPatched = true;
    }

    ensureIconStylesInjected(component);

    const originalGetToolbarButton = component.getToolbarButton.bind(component);

    component.getToolbarButton = function (name) {
        const syntaxConfig = getSyntaxConfig(component, name);

        if (syntaxConfig) {
            return buildSyntaxButton(component, name, syntaxConfig);
        }

        if (CUSTOM_BUTTONS[name]) {
            return CUSTOM_BUTTONS[name](component);
        }

        return originalGetToolbarButton(name);
    };

    component.__markdownEditorExtendedPatched = true;

    return component;
}

function applyPreviewSyntaxNormalizer(component) {
    if (! component?.editor) {
        return;
    }

    if (component.editor.options?.previewRender?.__markdownEditorExtended) {
        return;
    }

    const originalPreviewRender = component.editor.options?.previewRender?.bind(component.editor)
        ?? ((plainText) => component.editor.markdown(plainText));

    const normalizedPreviewRender = (plainText) => {
        const normalized = normalizePreviewMarkdown(plainText, component.extendedSyntax ?? {});

        return originalPreviewRender(normalized);
    };

    normalizedPreviewRender.__markdownEditorExtended = true;

    component.editor.options.previewRender = normalizedPreviewRender;
}

function normalizePreviewMarkdown(text, syntax) {
    let normalized = text;

    Object.entries(DEFAULT_SYNTAX).forEach(([key, defaults]) => {
        const custom = syntax?.[key];

        if (! custom || typeof custom !== 'object') {
            return;
        }

        const customPrefix = custom.prefix ?? '';
        const customSuffix = custom.suffix ?? '';

        if (customPrefix === defaults.prefix && customSuffix === defaults.suffix) {
            return;
        }

        if (! customPrefix && ! customSuffix) {
            return;
        }

        const pattern = new RegExp(`${escapeRegex(customPrefix)}([\\s\\S]*?)${escapeRegex(customSuffix)}`, 'g');

        normalized = normalized.replace(pattern, `${defaults.prefix}$1${defaults.suffix}`);
    });

    return normalized;
}

function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
}

function getSyntaxConfig(component, name) {
    const syntax = component?.extendedSyntax ?? {};

    return syntax?.[name] ?? null;
}

function buildSyntaxButton(component, name, config) {
    const normalized = normalizeSyntaxConfig(config);
    const title = normalized.title ?? DEFAULT_TITLES[name] ?? name;

    return {
        name,
        className: name,
        title,
        action: () => applySyntax(component, normalized),
    };
}

function normalizeSyntaxConfig(config) {
    if (typeof config === 'string') {
        return {
            prefix: config,
            suffix: config,
        };
    }

    if (! config || typeof config !== 'object') {
        return {
            prefix: '',
            suffix: '',
        };
    }

    return {
        prefix: config.prefix ?? '',
        suffix: config.suffix ?? '',
        title: config.title ?? null,
    };
}

function applySyntax(component, config) {
    const editor = getEditorInstance(component);

    if (! editor?.codemirror) {
        return;
    }

    const cm = editor.codemirror;
    const doc = cm.getDoc();
    const selection = doc.getSelection();
    const start = doc.getCursor('from');
    const startIndex = doc.indexFromPos(start);

    const value = `${config.prefix}${selection || ''}${config.suffix}`;

    doc.replaceSelection(value);

    if (! selection) {
        const cursorStart = startIndex + config.prefix.length;
        doc.setSelection(doc.posFromIndex(cursorStart), doc.posFromIndex(cursorStart));
    }

    cm.focus();
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
