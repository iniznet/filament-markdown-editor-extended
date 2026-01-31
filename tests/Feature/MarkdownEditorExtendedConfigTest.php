<?php

use Filament\Panel;
use Iniznet\FilamentMarkdownEditorExtended\Forms\Components\ExtendedMarkdownEditor;
use Iniznet\FilamentMarkdownEditorExtended\MarkdownEditorExtended;
use Iniznet\FilamentMarkdownEditorExtended\MarkdownEditorExtendedPlugin;

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
        ->boot(\Mockery::mock(Panel::class));

    expect(app(MarkdownEditorExtended::class)->getToolbar())
        ->toBe($toolbar);
});

it('respects feature toggles from config', function (): void {
    config()->set('markdown-editor-extended.features.curator', false);

    $component = ExtendedMarkdownEditor::make('content');

    expect($component->isCuratorEnabled())->toBeFalse();
});

it('respects format paragraphs toggle from config', function (): void {
    config()->set('markdown-editor-extended.features.format_paragraphs', false);

    $component = ExtendedMarkdownEditor::make('content');

    expect(collect($component->getToolbarButtons())->flatten())
        ->not->toContain('formatParagraphs');
});

it('replaces attachFiles with curator when enabled by default', function (): void {
    config()->set('markdown-editor-extended.features.curator', true);
    config()->set('markdown-editor-extended.toolbar', [
        ['table', 'attachFiles'],
    ]);

    $component = ExtendedMarkdownEditor::make('content');

    expect(collect($component->getToolbarButtons())->flatten())
        ->toContain('curator')
        ->not->toContain('attachFiles');
});

it('keeps attachFiles when curator is already present', function (): void {
    config()->set('markdown-editor-extended.features.curator', true);
    config()->set('markdown-editor-extended.toolbar', [
        ['table', 'attachFiles', 'curator'],
    ]);

    $component = ExtendedMarkdownEditor::make('content');

    expect(collect($component->getToolbarButtons())->flatten())
        ->toContain('curator')
        ->toContain('attachFiles');
});

it('allows overriding toolbar button labels', function (): void {
    $component = ExtendedMarkdownEditor::make('content')
        ->toolbarButtonLabels([
            'tools' => [
                'spoiler' => 'Custom spoiler',
            ],
        ]);

    expect($component->getExtendedTranslations())
        ->toMatchArray([
            'spoiler' => 'Custom spoiler',
        ]);
});

it('exposes syntax overrides from config', function (): void {
    config()->set('markdown-editor-extended.syntax', [
        'bold' => [
            'prefix' => '__',
            'suffix' => '__',
        ],
    ]);

    $component = ExtendedMarkdownEditor::make('content');

    expect($component->getExtendedSyntax())
        ->toMatchArray([
            'bold' => [
                'prefix' => '__',
                'suffix' => '__',
            ],
        ]);
});

it('provides default syntax configuration', function (): void {
    $component = ExtendedMarkdownEditor::make('content');

    expect($component->getExtendedSyntax())
        ->toMatchArray([
            'bold' => ['prefix' => '**', 'suffix' => '**'],
            'italic' => ['prefix' => '*', 'suffix' => '*'],
            'strike' => ['prefix' => '~-', 'suffix' => '-~'],
            'link' => ['prefix' => '[', 'suffix' => '](url)'],
            'heading' => ['prefix' => '# ', 'suffix' => ''],
            'blockquote' => ['prefix' => '> ', 'suffix' => ''],
            'codeBlock' => ['prefix' => "```\n", 'suffix' => "\n```"],
            'bulletList' => ['prefix' => '- ', 'suffix' => ''],
            'orderedList' => ['prefix' => '1. ', 'suffix' => ''],
            'alignLeft' => ['prefix' => ":::align-left\n", 'suffix' => "\n:::"],
            'alignCenter' => ['prefix' => ":::align-center\n", 'suffix' => "\n:::"],
            'alignRight' => ['prefix' => ":::align-right\n", 'suffix' => "\n:::"],
            'alignJustify' => ['prefix' => ":::align-justify\n", 'suffix' => "\n:::"],
            'spoiler' => ['prefix' => '||', 'suffix' => '||'],
        ]);
});

it('exposes icon overrides from config', function (): void {
    config()->set('markdown-editor-extended.icons', [
        'spoiler' => '<svg></svg>',
        'upload-image' => '/icons/custom-image.svg',
    ]);

    $component = ExtendedMarkdownEditor::make('content');

    expect($component->getExtendedIcons())
        ->toMatchArray([
            'spoiler' => '<svg></svg>',
            'upload-image' => '/icons/custom-image.svg',
        ]);
});
