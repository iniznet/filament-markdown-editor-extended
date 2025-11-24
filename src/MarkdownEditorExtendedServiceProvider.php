<?php

namespace FilamentMarkdownEditorExtended\MarkdownEditorExtended;

use Filament\Support\Assets\AlpineComponent;
use Filament\Support\Assets\Asset;
use Filament\Support\Assets\Css;
use Filament\Support\Assets\Js;
use Filament\Support\Facades\FilamentAsset;
use Filament\Support\Facades\FilamentIcon;
use Illuminate\Filesystem\Filesystem;
use Livewire\Features\SupportTesting\Testable;
use Spatie\LaravelPackageTools\Commands\InstallCommand;
use Spatie\LaravelPackageTools\Package;
use Spatie\LaravelPackageTools\PackageServiceProvider;
use FilamentMarkdownEditorExtended\MarkdownEditorExtended\Commands\MarkdownEditorExtendedCommand;
use FilamentMarkdownEditorExtended\MarkdownEditorExtended\Testing\TestsMarkdownEditorExtended;

class MarkdownEditorExtendedServiceProvider extends PackageServiceProvider
{
    public static string $name = 'filament-markdown-editor-extended';

    public static string $viewNamespace = 'filament-markdown-editor-extended';

    public function configurePackage(Package $package): void
    {
        /*
         * This class is a Package Service Provider
         *
         * More info: https://github.com/spatie/laravel-package-tools
         */
        $package->name(static::$name)
            ->hasCommands($this->getCommands())
            ->hasInstallCommand(function (InstallCommand $command) {
                $command
                    ->publishConfigFile()
                    ->publishMigrations()
                    ->askToRunMigrations()
                    ->askToStarRepoOnGitHub('iniznet/filament-markdown-editor-extended');
            });

        $configFileName = $package->shortName();

        if (file_exists($package->basePath("/../config/{$configFileName}.php"))) {
            $package->hasConfigFile();
        }

        if (file_exists($package->basePath('/../database/migrations'))) {
            $package->hasMigrations($this->getMigrations());
        }

        if (file_exists($package->basePath('/../resources/lang'))) {
            $package->hasTranslations();
        }

        if (file_exists($package->basePath('/../resources/views'))) {
            $package->hasViews(static::$viewNamespace);
        }
    }

    public function packageRegistered(): void {}

    public function packageBooted(): void
    {
        // Asset Registration
        FilamentAsset::register(
            $this->getAssets(),
            $this->getAssetPackageName()
        );

        FilamentAsset::registerScriptData(
            $this->getScriptData(),
            $this->getAssetPackageName()
        );

        // Icon Registration
        FilamentIcon::register($this->getIcons());

        // Handle Stubs
        if (app()->runningInConsole()) {
            foreach (app(Filesystem::class)->files(__DIR__ . '/../stubs/') as $file) {
                $this->publishes([
                    $file->getRealPath() => base_path("stubs/filament-markdown-editor-extended/{$file->getFilename()}"),
                ], 'filament-markdown-editor-extended-stubs');
            }
        }

        // Testing
        Testable::mixin(new TestsMarkdownEditorExtended);
    }

    protected function getAssetPackageName(): ?string
    {
        return 'iniznet/filament-markdown-editor-extended';
    }

    /**
     * @return array<Asset>
     */
    protected function getAssets(): array
    {
        return [
            // AlpineComponent::make('filament-markdown-editor-extended', __DIR__ . '/../resources/dist/components/filament-markdown-editor-extended.js'),
            Css::make('filament-markdown-editor-extended-styles', __DIR__ . '/../resources/dist/filament-markdown-editor-extended.css'),
            Js::make('filament-markdown-editor-extended-scripts', __DIR__ . '/../resources/dist/filament-markdown-editor-extended.js'),
        ];
    }

    /**
     * @return array<class-string>
     */
    protected function getCommands(): array
    {
        return [
            MarkdownEditorExtendedCommand::class,
        ];
    }

    /**
     * @return array<string>
     */
    protected function getIcons(): array
    {
        return [];
    }

    /**
     * @return array<string>
     */
    protected function getRoutes(): array
    {
        return [];
    }

    /**
     * @return array<string, mixed>
     */
    protected function getScriptData(): array
    {
        return [];
    }

    /**
     * @return array<string>
     */
    protected function getMigrations(): array
    {
        return [
            'create_filament-markdown-editor-extended_table',
        ];
    }
}
