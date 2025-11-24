<?php

namespace FilamentMarkdownEditorExtended\MarkdownEditorExtended\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @see \FilamentMarkdownEditorExtended\MarkdownEditorExtended\MarkdownEditorExtended
 */
class MarkdownEditorExtended extends Facade
{
    protected static function getFacadeAccessor()
    {
        return \FilamentMarkdownEditorExtended\MarkdownEditorExtended\MarkdownEditorExtended::class;
    }
}
