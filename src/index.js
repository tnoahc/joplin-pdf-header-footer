// Plain-JS Joplin plugin: Joplin provides the `joplin` global in the plugin sandbox.

const SECTION = 'pdfHeaderFooter';

// SettingItemType enum values from the plugin API (Int = 1, String = 2, Bool = 3).
const TYPE_INT = 1;
const TYPE_STRING = 2;
const TYPE_BOOL = 3;

const PLACEHOLDER_HELP = 'Placeholders: {page}, {pages}, {date}. Leave empty for nothing.';

function textSetting(label, value) {
	return { value, type: TYPE_STRING, section: SECTION, public: true, label, description: PLACEHOLDER_HELP };
}

joplin.plugins.register({
	onStart: async function () {
		await joplin.settings.registerSection(SECTION, {
			label: 'PDF Header & Footer',
			iconName: 'fas fa-file-pdf',
			description: 'Text printed at the top and bottom of every page when a note is exported to PDF.',
		});

		await joplin.settings.registerSettings({
			headerLeft: textSetting('Header - left', ''),
			headerCenter: textSetting('Header - centre', ''),
			headerRight: textSetting('Header - right', ''),
			footerLeft: textSetting('Footer - left', ''),
			footerCenter: textSetting('Footer - centre', ''),
			footerRight: textSetting('Footer - right', 'Page {page} of {pages}'),
			showLines: {
				value: true, type: TYPE_BOOL, section: SECTION, public: true,
				label: 'Draw a line under the header and above the footer',
			},
			fontSize: {
				value: 8, type: TYPE_INT, section: SECTION, public: true, minimum: 5, maximum: 20,
				label: 'Font size (pt)',
			},
			marginTop: {
				value: 20, type: TYPE_INT, section: SECTION, public: true, minimum: 5, maximum: 60,
				label: 'Top page margin (mm)',
				description: 'Space reserved for the header.',
			},
			marginBottom: {
				value: 20, type: TYPE_INT, section: SECTION, public: true, minimum: 5, maximum: 60,
				label: 'Bottom page margin (mm)',
				description: 'Space reserved for the footer.',
			},
		});

		await joplin.contentScripts.register('markdownItPlugin', 'pdfHeaderFooter', './contentScript.js');
	},
});
