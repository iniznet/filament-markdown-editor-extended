<?php

namespace Iniznet\FilamentMarkdownEditorExtended\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @see \Iniznet\FilamentMarkdownEditorExtended\MarkdownEditorExtended
 */
class MarkdownEditorExtended extends Facade
{
    protected static function getFacadeAccessor()
    {
        return \Iniznet\FilamentMarkdownEditorExtended\MarkdownEditorExtended::class;
    }
}
