<?php

namespace Iniznet\FilamentMarkdownEditorExtended;

use Filament\Support\Assets\Js;
use Filament\Support\Facades\FilamentAsset;
use Iniznet\FilamentMarkdownEditorExtended\Testing\TestsMarkdownEditorExtended;
use Livewire\Features\SupportTesting\Testable;
use Spatie\LaravelPackageTools\Commands\InstallCommand;
use Spatie\LaravelPackageTools\Package;
use Spatie\LaravelPackageTools\PackageServiceProvider;

class MarkdownEditorExtendedServiceProvider extends PackageServiceProvider
{
    public static string $name = 'filament-markdown-editor-extended';

    public function configurePackage(Package $package): void
    {
        $package->name(static::$name)
            ->hasInstallCommand(function (InstallCommand $command) {
                $command
                    ->publishConfigFile()
                    ->askToStarRepoOnGitHub('iniznet/filament-markdown-editor-extended');
            })
            ->hasConfigFile('markdown-editor-extended')
            ->hasViews('filament-markdown-editor-extended');
    }

    public function packageRegistered(): void
    {
        $this->app->singleton(MarkdownEditorExtended::class, fn (): MarkdownEditorExtended => new MarkdownEditorExtended);
    }

    public function packageBooted(): void
    {
        FilamentAsset::register(
            $this->getAssets(),
            $this->getAssetPackageName()
        );

        FilamentAsset::registerScriptData(
            $this->getScriptData(),
            $this->getAssetPackageName()
        );

        if (is_callable([Testable::class, 'mixin'])) {
            call_user_func([Testable::class, 'mixin'], new TestsMarkdownEditorExtended);
        }
    }

    protected function getAssetPackageName(): ?string
    {
        return 'iniznet/filament-markdown-editor-extended';
    }

    protected function getAssets(): array
    {
        $scriptPath = __DIR__ . '/../resources/dist/filament-markdown-editor-extended.js';

        return [
            Js::make('filament-markdown-editor-extended-scripts', $scriptPath),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    protected function getScriptData(): array
    {
        return [
            'markdown-editor-extended' => [
                'toolbar' => app(MarkdownEditorExtended::class)->getToolbar(),
            ],
        ];
    }
}
