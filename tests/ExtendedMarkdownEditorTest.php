<?php

use Iniznet\FilamentMarkdownEditorExtended\Forms\Components\ExtendedMarkdownEditor;
use ReflectionMethod;

it('filters alignment buttons when disabled', function (): void {
    $component = ExtendedMarkdownEditor::make('content')->alignment(false);

    $method = new ReflectionMethod(ExtendedMarkdownEditor::class, 'filterToolbarButtons');
    $method->setAccessible(true);

    $buttons = ['bold', 'alignLeft', 'alignRight'];

    expect($method->invoke($component, $buttons))->toBe(['bold']);
});

it('filters the spoiler button when disabled', function (): void {
    $component = ExtendedMarkdownEditor::make('content')->spoiler(false);

    $method = new ReflectionMethod(ExtendedMarkdownEditor::class, 'filterToolbarButtons');
    $method->setAccessible(true);

    $buttons = ['spoiler', 'alignLeft'];

    expect($method->invoke($component, $buttons))->toBe(['alignLeft']);
});
