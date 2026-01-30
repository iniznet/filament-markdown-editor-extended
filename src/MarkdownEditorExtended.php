<?php

namespace Iniznet\FilamentMarkdownEditorExtended;

class MarkdownEditorExtended
{
    protected ?array $toolbar = null;

    protected function getDefaultToolbar(): array
    {
        return [
            ['bold', 'italic', 'strike', 'link'],
            ['heading'],
            ['blockquote', 'codeBlock', 'bulletList', 'orderedList'],
            ['alignLeft', 'alignCenter', 'alignRight', 'alignJustify'],
            ['spoiler'],
            ['table', 'attachFiles'],
            ['formatParagraphs'],
            ['undo', 'redo'],
        ];
    }

    public function toolbar(array $toolbar): static
    {
        $this->toolbar = $toolbar;

        return $this;
    }

    public function getToolbar(): array
    {
        $toolbarFromConfig = config('markdown-editor-extended.toolbar');

        return $this->toolbar ?? $toolbarFromConfig ?? $this->getDefaultToolbar();
    }
}
