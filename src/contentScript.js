// Markdown-it content script. It appends a <style> block with CSS @page margin
// boxes to each rendered note. @page rules only apply when printing, so the
// note viewer is unaffected; Joplin's PDF export prints the rendered HTML.

const SLOTS = ['left', 'center', 'right'];

// Quote a string for CSS, hex-escaping characters that could break out of the
// string or the surrounding <style> element.
function cssString(text) {
	return '"' + text.replace(/[\\"<>\r\n]/g, c => '\\' + c.charCodeAt(0).toString(16) + ' ') + '"';
}

// "Page {page} of {pages}" -> "Page " counter(page) " of " counter(pages)
function cssContent(template, date) {
	const parts = [];
	const re = /\{(page|pages|date)\}/g;
	let last = 0;
	let match;
	while ((match = re.exec(template))) {
		if (match.index > last) parts.push(cssString(template.slice(last, match.index)));
		parts.push(match[1] === 'date' ? cssString(date) : `counter(${match[1]})`);
		last = re.lastIndex;
	}
	if (last < template.length) parts.push(cssString(template.slice(last)));
	return parts.join(' ');
}

function buildStyle(setting) {
	const showLines = !!setting('showLines');
	const fontSize = Number(setting('fontSize')) || 8;
	const marginTop = Number(setting('marginTop')) || 20;
	const marginBottom = Number(setting('marginBottom')) || 20;
	const date = new Date().toLocaleDateString();

	const boxes = [];
	for (const edge of ['top', 'bottom']) {
		const prefix = edge === 'top' ? 'header' : 'footer';
		const templates = SLOTS.map(slot => String(setting(prefix + slot[0].toUpperCase() + slot.slice(1)) || ''));
		const edgeUsed = templates.some(t => t.trim());
		if (!edgeUsed) continue;

		SLOTS.forEach((slot, i) => {
			const template = templates[i];
			// Empty slots still get a box when lines are on, so the line spans the full width.
			if (!template.trim() && !showLines) return;
			const line = showLines
				? (edge === 'top' ? 'border-bottom: 0.5pt solid #000; padding-bottom: 2mm;' : 'border-top: 0.5pt solid #000; padding-top: 2mm;')
				: '';
			boxes.push(`@${edge}-${slot} {
				content: ${template.trim() ? cssContent(template, date) : '""'};
				font-size: ${fontSize}pt;
				color: #000;
				text-align: ${slot};
				vertical-align: ${edge === 'top' ? 'bottom' : 'top'};
				${line}
			}`);
		});
	}

	if (!boxes.length) return '';

	return `<style class="pdf-header-footer">
		@page {
			margin-top: ${marginTop}mm;
			margin-bottom: ${marginBottom}mm;
			${boxes.join('\n')}
		}
	</style>`;
}

module.exports = {
	default: function (_context) {
		return {
			plugin: function (markdownIt, pluginOptions) {
				const originalRender = markdownIt.renderer.render.bind(markdownIt.renderer);

				markdownIt.renderer.render = function (tokens, options, env) {
					const html = originalRender(tokens, options, env);
					try {
						if (!pluginOptions || typeof pluginOptions.settingValue !== 'function') return html;
						return html + buildStyle(key => pluginOptions.settingValue(key));
					} catch (error) {
						console.warn('PDF Header & Footer: could not build style', error);
						return html;
					}
				};
			},
		};
	},
};
