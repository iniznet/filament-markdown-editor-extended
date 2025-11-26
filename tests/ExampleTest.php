<?php

use Filament\Panel;
use Iniznet\FilamentMarkdownEditorExtended\MarkdownEditorExtended;
use Iniznet\FilamentMarkdownEditorExtended\MarkdownEditorExtendedPlugin;
use Mockery;

beforeEach(function (): void {
    config()->set('markdown-editor-extended.toolbar', null);
});

it('returns the configured toolbar from the manager', function (): void {
    $toolbar = [['customBold']];

    config()->set('markdown-editor-extended.toolbar', $toolbar);

    expect((new MarkdownEditorExtended)->getToolbar())
        ->toBe($toolbar);
});

it('allows overriding the toolbar through the plugin', function (): void {
    $toolbar = [['spoiler', 'alignLeft']];

    $manager = new MarkdownEditorExtended;
    app()->instance(MarkdownEditorExtended::class, $manager);

    MarkdownEditorExtendedPlugin::make()
        ->toolbar($toolbar)
        ->boot(Mockery::mock(Panel::class));

    expect(app(MarkdownEditorExtended::class)->getToolbar())
        ->toBe($toolbar);
});
