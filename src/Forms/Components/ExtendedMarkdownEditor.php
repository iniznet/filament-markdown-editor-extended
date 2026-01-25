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
 * @method static static make(?string $name = null)
 * @method void setUp()
 */
class ExtendedMarkdownEditor extends BaseMarkdownEditor
{
    protected string $view = 'filament-markdown-editor-extended::components.extended-markdown-editor';

    protected bool | Closure | null $alignmentEnabled = null;

    protected bool | Closure | null $spoilerEnabled = null;

    protected bool | Closure | null $curatorEnabled = null;

    protected function setUp(): void
    {
        parent::setUp();

        $this->toolbarButtons(fn () => $this->resolveToolbar());
    }

    protected function buildCuratorSettings(ExtendedMarkdownEditor $component): array
    {
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

        return array_values(array_filter(
            array_map(fn (array $group) => $this->filterToolbarButtons($group), $toolbar),
            fn (array $group) => filled($group),
        ));
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
        return (bool) ($this->evaluate($this->alignmentEnabled) ?? true);
    }

    protected function isSpoilerEnabled(): bool
    {
        return (bool) ($this->evaluate($this->spoilerEnabled) ?? true);
    }

    protected function isCuratorEnabled(): bool
    {
        return (bool) ($this->evaluate($this->curatorEnabled) ?? class_exists(Curator::class));
    }
}
