# Extended Markdown Editor for Filament

[![Latest Version on Packagist](https://img.shields.io/packagist/v/iniznet/filament-markdown-editor-extended.svg?style=flat-square)](https://packagist.org/packages/iniznet/filament-markdown-editor-extended)
[![GitHub Tests Action Status](https://img.shields.io/github/actions/workflow/status/iniznet/filament-markdown-editor-extended/run-tests.yml?branch=main&label=tests&style=flat-square)](https://github.com/iniznet/filament-markdown-editor-extended/actions?query=workflow%3Arun-tests+branch%3Amain)
[![GitHub Code Style Action Status](https://img.shields.io/github/actions/workflow/status/iniznet/filament-markdown-editor-extended/fix-php-code-style-issues.yml?branch=main&label=code%20style&style=flat-square)](https://github.com/iniznet/filament-markdown-editor-extended/actions?query=workflow%3A"Fix+PHP+code+styling"+branch%3Amain)
[![Total Downloads](https://img.shields.io/packagist/dt/iniznet/filament-markdown-editor-extended.svg?style=flat-square)](https://packagist.org/packages/iniznet/filament-markdown-editor-extended)

Bring alignment tools, spoiler formatting, and a configurable toolbar to Filament’s Markdown editor. This package ships a drop-in field component plus a panel plugin that exposes a single Markdown toolbar definition you can reuse across panels, forms, and repeaters.

> [!WARNING]
> This is an early build. The feature set is still evolving and customization options are limited for now.
> The package requires Filament Curator (it is included as a dependency), so Curator must be installed and available for the media picker features to work.

## Installation

```bash
composer require iniznet/filament-markdown-editor-extended
```

Publish the configuration if you want to customize the global toolbar:

```bash
php artisan vendor:publish --tag="filament-markdown-editor-extended-config"
```

You can also publish the provided stubs:

```bash
php artisan vendor:publish --tag="filament-markdown-editor-extended-stubs"
```

## Registering the plugin

Attach the plugin to your panel to share one toolbar definition everywhere. The plugin lives under the `Iniznet\FilamentMarkdownEditorExtended` namespace.

```php
use Filament\Panel;
use Iniznet\FilamentMarkdownEditorExtended\MarkdownEditorExtendedPlugin;

class AdminPanelProvider extends PanelProvider
{
	public function panel(Panel $panel): Panel
	{
		return $panel->plugins([
			MarkdownEditorExtendedPlugin::make()
				->toolbar([
					['bold', 'italic', 'strike', 'link'],
					['blockquote', 'codeBlock'],
					['spoiler'],
				]),
		]);
	}
}
```

If you prefer configuration files, edit `config/markdown-editor-extended.php` instead:

```php
return [
	'toolbar' => [
		['bold', 'italic', 'strike', 'link'],
		['heading'],
		['blockquote', 'codeBlock', 'bulletList', 'orderedList'],
		['alignLeft', 'alignCenter', 'alignRight', 'alignJustify'],
		['spoiler'],
		['table', 'attachFiles'],
		['undo', 'redo'],
	],
];
```

## Using the field

Swap Filament’s `MarkdownEditor` component for the extended version. Alignment buttons and the spoiler toggle can be enabled/disabled per-field using booleans or closures.

```php
use Iniznet\FilamentMarkdownEditorExtended\Forms\Components\ExtendedMarkdownEditor;

ExtendedMarkdownEditor::make('content')
	->columnSpanFull()
	->alignment(fn (?string $layout) => $layout === 'rich')
	->spoiler()
	->helperText('Spoiler + alignment tools are available when the layout allows rich text.');
```

If you remove buttons from the toolbar, the component automatically strips unavailable actions while keeping the rest intact.

## Testing & code style

```bash
# run the test suite
composer test

# fix formatting
composer format
```

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information on what has changed recently.

## Contributing

Please see [CONTRIBUTING](.github/CONTRIBUTING.md) for details.

## Security Vulnerabilities

Please review [our security policy](../../security/policy) on how to report security vulnerabilities.

## Credits

- [Muhammad Yusuf Fauzan](https://github.com/iniznet)
- [All Contributors](../../contributors)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
