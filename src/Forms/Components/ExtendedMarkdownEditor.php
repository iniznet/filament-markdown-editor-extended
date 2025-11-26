<?php

namespace Iniznet\FilamentMarkdownEditorExtended\Forms\Components;

use Closure;
use Filament\Forms\Components\MarkdownEditor as BaseMarkdownEditor;
use Iniznet\FilamentMarkdownEditorExtended\MarkdownEditorExtended;

class ExtendedMarkdownEditor extends BaseMarkdownEditor
{
    protected bool | Closure | null $alignmentEnabled = null;

    protected bool | Closure | null $spoilerEnabled = null;

    protected function setUp(): void
    {
        parent::setUp();

        $this->toolbarButtons(fn () => $this->resolveToolbar());
    }

    public function alignment(bool | Closure $condition = true): static
    {
        $this->alignmentEnabled = $condition;

        return $this;
    }

    public function spoiler(bool | Closure $condition = true): static
    {
        $this->spoilerEnabled = $condition;

        return $this;
    }

    protected function resolveToolbar(): array
    {
        $toolbar = app(MarkdownEditorExtended::class)->getToolbar();

        if (blank($toolbar)) {
            $toolbar = parent::getDefaultToolbarButtons();
        }

        return array_values(array_filter(
            array_map(fn (array $group) => $this->filterToolbarButtons($group), $toolbar),
            fn (array $group) => filled($group),
        ));
    }

    protected function filterToolbarButtons(array $buttons): array
    {
        return array_values(array_filter($buttons, function (string $button): bool {
            if ($this->isAlignmentButton($button) && ! $this->isAlignmentEnabled()) {
                return false;
            }

            if ($button === 'spoiler' && ! $this->isSpoilerEnabled()) {
                return false;
            }

            return true;
        }));
    }

    protected function isAlignmentButton(string $button): bool
    {
        return in_array($button, ['alignLeft', 'alignCenter', 'alignRight', 'alignJustify'], true);
    }

    protected function isAlignmentEnabled(): bool
    {
        return (bool) ($this->evaluate($this->alignmentEnabled) ?? true);
    }

    protected function isSpoilerEnabled(): bool
    {
        return (bool) ($this->evaluate($this->spoilerEnabled) ?? true);
    }
}
