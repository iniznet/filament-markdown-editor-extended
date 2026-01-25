<x-filament::modal id="{{ $modalId }}" width="screen" class="curator-panel" display-classes="block" teleport="body">
    <livewire:curator-panel
        :settings="$settings"
        @insert-media="
            $dispatch('markdown-curator-insert', {
                key: '{{ $editorId }}',
                media: $event.detail?.media ?? $event.detail?.[0]?.media ?? $event.detail?.[0] ?? $event.detail,
            });
            window.dispatchEvent(new CustomEvent('close-modal-quietly', { detail: { id: '{{ $modalId }}' } }));
        "
    />
</x-filament::modal>
