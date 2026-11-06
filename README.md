# PDF Header & Footer for Joplin

A [Joplin](https://joplinapp.org/) plugin that adds a header and footer to **every page** of a note when you export it to PDF. You set the text in Joplin's settings, so you don't need to edit CSS.

- Separate left, centre and right text for both the header and the footer
- Page numbers and the date through placeholders
- Optional lines under the header and above the footer
- Adjustable font size and top and bottom page margins
- The note viewer is unchanged: the header and footer appear only in exported PDFs

## Requirements

Joplin desktop 3.2 or later.

## Installation

1. Download `plugin.tnoahc.pdf-header-footer.jpl` from the [latest release](https://github.com/tnoahc/joplin-pdf-header-footer/releases/latest).
2. In Joplin, open **Tools → Options → Plugins**, click the ⚙ button, and choose **Install from file**.
3. Select the downloaded `.jpl` file and restart Joplin.

## Usage

Open **Tools → Options → PDF Header & Footer** and fill in any of the six text fields:

| Setting | Position on the page |
| --- | --- |
| Header - left / centre / right | Top margin |
| Footer - left / centre / right | Bottom margin |

Leave a field empty to print nothing in that position. You can use these placeholders in any field:

| Placeholder | Replaced with |
| --- | --- |
| `{page}` | Current page number |
| `{pages}` | Total number of pages |
| `{date}` | Export date, in your system's date format |

For example, `Page {page} of {pages}` prints "Page 2 of 5".

Then export a note as usual with **File → Export → PDF**.

If your custom stylesheet already adds a header or footer, for example with `.exported-note::before` or `::after`, remove those rules so the text doesn't appear twice.

## Known limitations

- **File → Print doesn't include the header and footer.** Joplin doesn't load plugins when it prints directly. Export to PDF first, then print the PDF.
- The note title can't be used as a placeholder. Joplin already prints the title at the top of the note.

## How it works

The plugin registers a Markdown-it content script. The script adds a CSS [`@page`](https://developer.mozilla.org/docs/Web/CSS/@page) rule with page margin boxes to the rendered note, built from your settings. Joplin's PDF export prints that rendered HTML, so the header and footer repeat on every page. `@page` rules only apply when printing, which is why the viewer doesn't change.

## Development

The plugin is plain JavaScript in `src/`, so there's no compile step.

1. Start Joplin in [Development Mode](https://joplinapp.org/help/api/references/development_mode) with `Joplin --env dev`.
2. In **Tools → Options → Plugins → Advanced Settings**, set **Development plugins** to the full path of this repository's `src` folder.
3. Restart Joplin. After you edit a file, restart again to reload the plugin.

To build the installable package, run:

```sh
sh build.sh      # or: npm run dist
```

This writes `publish/plugin.tnoahc.pdf-header-footer.jpl` and the matching `.json` file that the Joplin plugin repository reads. See [RELEASING.md](RELEASING.md) for how to publish a new version.

## License

[MIT](LICENSE) © 2026 Noah C. Tarinyebwa
