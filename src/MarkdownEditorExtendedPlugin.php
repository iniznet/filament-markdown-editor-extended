<?php

namespace Iniznet\FilamentMarkdownEditorExtended;

use Filament\Contracts\Plugin;
use Filament\Panel;

class MarkdownEditorExtendedPlugin implements Plugin
{
    protected ?array $toolbar = null;

    public function getId(): string
    {
        return 'filament-markdown-editor-extended';
    }

    public function register(Panel $panel): void {}

    public function boot(Panel $panel): void
    {
        $manager = app(MarkdownEditorExtended::class);

        if ($this->toolbar !== null) {
            $manager->toolbar($this->toolbar);
        }

    }

    public function toolbar(array $toolbar): static
    {
        $this->toolbar = $toolbar;

        return $this;
    }

    public static function make(): static
    {
        return app(static::class);
    }

    public static function get(): static
    {
        /** @var static $plugin */
        $plugin = filament(app(static::class)->getId());

        return $plugin;
    }
}
