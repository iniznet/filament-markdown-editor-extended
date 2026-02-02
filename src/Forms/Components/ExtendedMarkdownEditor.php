<?php

namespace Iniznet\FilamentMarkdownEditorExtended\Forms\Components;

use Awcodes\Curator\Facades\Curator;
use Closure;
use Filament\Forms\Components\MarkdownEditor as BaseMarkdownEditor;
use Iniznet\FilamentMarkdownEditorExtended\MarkdownEditorExtended;

/**
 * @method void registerActions(array $actions)
 * @method string getStatePath()
 * @method mixed evaluate(mixed $value)
 * @method array|null getFileAttachmentsAcceptedFileTypes()
 * @method int|string|null getFileAttachmentsMaxSize()
 * @method mixed getState()
 * @method static static make(?string $name = null)
 * @method void setUp()
 */
class ExtendedMarkdownEditor extends BaseMarkdownEditor
{
    protected string $view = 'filament-markdown-editor-extended::components.extended-markdown-editor';

    protected bool | Closure | null $alignmentEnabled = null;

    protected bool | Closure | null $spoilerEnabled = null;

    protected bool | Closure | null $curatorEnabled = null;

    protected array | Closure | null $toolbarButtonLabels = null;

    protected array | Closure | null $toolbarSyntax = null;

    protected array | Closure | null $toolbarIcons = null;

    protected function setUp(): void
    {
        parent::setUp();

        $this->toolbarButtons(fn () => $this->resolveToolbar());
    }

    public function getDefaultToolbarButtons(): array
    {
        return $this->resolveToolbar();
    }

    protected function buildCuratorSettings(ExtendedMarkdownEditor $component): array
    {
        if (! $this->isCuratorEnabled()) {
            return [];
        }

        return [
            'acceptedFileTypes' => $component->getFileAttachmentsAcceptedFileTypes() ?? Curator::getAcceptedFileTypes(),
            'defaultSort' => 'desc',
            'directory' => $component->getFileAttachmentsDirectory() ?? Curator::getDirectory(),
            'diskName' => $component->getFileAttachmentsDiskName() ?? Curator::getDiskName(),
            'imageCropAspectRatio' => Curator::getImageCropAspectRatio(),
            'imageResizeTargetWidth' => Curator::getImageResizeTargetWidth(),
            'imageResizeTargetHeight' => Curator::getImageResizeTargetHeight(),
            'imageResizeMode' => Curator::getImageResizeMode(),
            'isLimitedToDirectory' => false,
            'isTenantAware' => Curator::isTenantAware(),
            'tenantOwnershipRelationshipName' => Curator::getTenantName(),
            'isMultiple' => false,
            'maxItems' => 1,
            'maxSize' => $component->getFileAttachmentsMaxSize() ?? Curator::getMaxSize(),
            'minSize' => Curator::getMinSize(),
            'pathGenerator' => config($this->getCuratorPathGeneratorKey()),
            'rules' => [],
            'selected' => [],
            'shouldPreserveFilenames' => Curator::shouldPreserveFilenames(),
            'statePath' => $component->getStatePath(),
            'visibility' => $component->getFileAttachmentsVisibility() ?? Curator::getVisibility(),
        ];
    }

    public function getCuratorSettings(): array
    {
        return $this->buildCuratorSettings($this);
    }

    public function getExtendedTranslations(): array
    {
        $base = config('markdown-editor-extended.translations')
            ?? trans('filament-markdown-editor-extended::editor');

        if (! is_array($base)) {
            $base = [];
        }

        if (array_key_exists('tools', $base) && is_array($base['tools'])) {
            $base = $base['tools'];
        }

        $overrides = $this->evaluate($this->toolbarButtonLabels);

        if ($overrides === null && $this->toolbarButtonLabels !== null) {
            $overrides = $this->toolbarButtonLabels;
        }

        if ($overrides instanceof Closure) {
            $overrides = $overrides();
        }

        if (! is_array($overrides)) {
            $overrides = [];
        }

        if (array_key_exists('tools', $overrides) && is_array($overrides['tools'])) {
            $overrides = $overrides['tools'];
        }

        return array_replace_recursive($base, $overrides);
    }

    public function getExtendedSyntax(): array
    {
        $base = config('markdown-editor-extended.syntax') ?? [];
        $overrides = $this->evaluate($this->toolbarSyntax);

        if ($overrides === null && $this->toolbarSyntax !== null) {
            $overrides = $this->toolbarSyntax;
        }

        if ($overrides instanceof Closure) {
            $overrides = $overrides();
        }

        if (! is_array($base)) {
            $base = [];
        }

        if (! is_array($overrides)) {
            $overrides = [];
        }

        return array_replace_recursive($base, $overrides);
    }

    public function getNormalizedStateForRendering(): string
    {
        $state = $this->getState();

        if ($state === null) {
            return '';
        }

        return $this->normalizeMarkdownSyntax((string) $state);
    }

    public function getExtendedIcons(): array
    {
        $base = config('markdown-editor-extended.icons') ?? [];
        $overrides = $this->evaluate($this->toolbarIcons);

        if ($overrides === null && $this->toolbarIcons !== null) {
            $overrides = $this->toolbarIcons;
        }

        if ($overrides instanceof Closure) {
            $overrides = $overrides();
        }

        if (! is_array($base)) {
            $base = [];
        }

        if (! is_array($overrides)) {
            $overrides = [];
        }

        $icons = array_replace_recursive($base, $overrides);

        foreach ($icons as $key => $value) {
            $icons[$key] = $this->resolveIconValue($value);
        }

        return $icons;
    }

    protected function resolveIconValue(mixed $value): mixed
    {
        if (! is_string($value)) {
            return $value;
        }

        if (! str_starts_with($value, '/vendor/filament-markdown-editor-extended/icons/')) {
            return $value;
        }

        $iconPath = $this->getPackageIconPath(basename($value));

        if (! is_file($iconPath)) {
            return $value;
        }

        $contents = file_get_contents($iconPath);

        return $contents === false ? $value : $contents;
    }

    protected function getPackageIconPath(string $filename): string
    {
        return __DIR__ . '/../../../resources/icons/' . $filename;
    }

    public function getCuratorModalHeadingKey(): string
    {
        return 'curator::views.attach_curator_media.modal.heading';
    }

    public function getCuratorPathGeneratorKey(): string
    {
        return 'curator.path_generator';
    }

    public function curator(bool | Closure $condition = true): static
    {
        $this->curatorEnabled = $condition;

        return $this;
    }

    public function toolbarButtonLabels(array | Closure $labels): static
    {
        $this->toolbarButtonLabels = $labels;

        return $this;
    }

    public function toolbarSyntax(array | Closure $syntax): static
    {
        $this->toolbarSyntax = $syntax;

        return $this;
    }

    public function toolbarIcons(array | Closure $icons): static
    {
        $this->toolbarIcons = $icons;

        return $this;
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

        $toolbar = $this->replaceAttachFilesWithCurator($toolbar);

        return array_values(array_filter(
            array_map(fn (array $group) => $this->filterToolbarButtons($group), $toolbar),
            fn (array $group) => filled($group),
        ));
    }

    protected function replaceAttachFilesWithCurator(array $toolbar): array
    {
        if (! $this->isCuratorEnabled()) {
            return $toolbar;
        }

        $hasCurator = collect($toolbar)
            ->flatten()
            ->contains('curator');

        if ($hasCurator) {
            return $toolbar;
        }

        return array_map(function (array $group): array {
            return array_map(function (string $button): string {
                if ($button !== 'attachFiles') {
                    return $button;
                }

                return 'curator';
            }, $group);
        }, $toolbar);
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

            if ($button === 'formatParagraphs' && ! $this->isFormatParagraphsEnabled()) {
                return false;
            }

            if ($button === 'curator' && ! $this->isCuratorEnabled()) {
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
        return $this->resolveFeatureToggle($this->alignmentEnabled, 'markdown-editor-extended.features.alignment', true);
    }

    protected function isSpoilerEnabled(): bool
    {
        return $this->resolveFeatureToggle($this->spoilerEnabled, 'markdown-editor-extended.features.spoiler', true);
    }

    protected function isFormatParagraphsEnabled(): bool
    {
        return $this->resolveFeatureToggle(null, 'markdown-editor-extended.features.format_paragraphs', true);
    }

    public function isCuratorEnabled(): bool
    {
        if (! $this->isCuratorAvailable()) {
            return false;
        }

        return $this->resolveFeatureToggle($this->curatorEnabled, 'markdown-editor-extended.features.curator', true);
    }

    protected function isCuratorAvailable(): bool
    {
        return class_exists(Curator::class);
    }

    protected function normalizeMarkdownSyntax(string $content): string
    {
        $customSyntax = $this->getExtendedSyntax();
        $defaultSyntax = $this->getDefaultSyntaxMap();

        foreach ($defaultSyntax as $key => $defaults) {
            if (! isset($customSyntax[$key])) {
                continue;
            }

            $custom = $customSyntax[$key];

            if (! is_array($custom)) {
                continue;
            }

            $customPrefix = $custom['prefix'] ?? '';
            $customSuffix = $custom['suffix'] ?? '';
            $defaultPrefix = $defaults['prefix'] ?? '';
            $defaultSuffix = $defaults['suffix'] ?? '';

            if ($customPrefix === $defaultPrefix && $customSuffix === $defaultSuffix) {
                continue;
            }

            if ($customPrefix === '' && $customSuffix === '') {
                continue;
            }

            $pattern = '/' . preg_quote($customPrefix, '/') . '(.*?)' . preg_quote($customSuffix, '/') . '/s';
            $replacement = $defaultPrefix . '$1' . $defaultSuffix;

            $content = preg_replace($pattern, $replacement, $content) ?? $content;
        }

        return $content;
    }

    /**
     * @return array<string, array{prefix: string, suffix: string}>
     */
    protected function getDefaultSyntaxMap(): array
    {
        return [
            'bold' => ['prefix' => '**', 'suffix' => '**'],
            'italic' => ['prefix' => '*', 'suffix' => '*'],
            'strike' => ['prefix' => '~~', 'suffix' => '~~'],
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
        ];
    }

    protected function resolveFeatureToggle(
        bool | Closure | null $value,
        string $configKey,
        bool $default,
    ): bool {
        $evaluated = $this->evaluate($value);

        if ($evaluated !== null) {
            return (bool) $evaluated;
        }

        $configured = config($configKey);

        if ($configured !== null) {
            return (bool) $configured;
        }

        return $default;
    }
}
