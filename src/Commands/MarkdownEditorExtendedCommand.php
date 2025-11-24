<?php

namespace FilamentMarkdownEditorExtended\MarkdownEditorExtended\Commands;

use Illuminate\Console\Command;

class MarkdownEditorExtendedCommand extends Command
{
    public $signature = 'filament-markdown-editor-extended';

    public $description = 'My command';

    public function handle(): int
    {
        $this->comment('All done');

        return self::SUCCESS;
    }
}
