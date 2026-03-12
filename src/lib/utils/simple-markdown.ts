/**
 * Converts simple markdown-like text to HTML.
 * If the input already contains HTML block tags, it's returned as-is.
 *
 * Supported syntax:
 *   ## Heading           → <h2>Heading</h2>
 *   ![alt](src)          → <img src="..." alt="..." class="article-img" />
 *   [text](url)          → <a href="..." target="_blank" rel="noopener noreferrer">text</a>
 *   **bold**             → <strong>bold</strong>
 *   - list item          → <ul><li>list item</li></ul>
 *   Blank line           → new <p> paragraph
 */
export function simpleMarkdownToHtml(text: string): string {
	if (!text || !text.trim()) return '';

	// If it already has HTML block elements, return as-is
	if (/<(?:p|h[1-6]|div|ul|ol|li|article|section|img|table)\b/i.test(text)) {
		return text;
	}

	const lines = text.split('\n');
	const blocks: string[] = [];
	let current: string[] = [];
	let inList = false;
	let listItems: string[] = [];

	function flushParagraph() {
		if (current.length > 0) {
			const content = current.join('\n').trim();
			if (content) {
				blocks.push(`<p>${inlineFormat(content)}</p>`);
			}
			current = [];
		}
	}

	function flushList() {
		if (listItems.length > 0) {
			blocks.push(`<ul>${listItems.map(li => `<li>${inlineFormat(li)}</li>`).join('')}</ul>`);
			listItems = [];
			inList = false;
		}
	}

	for (const line of lines) {
		const trimmed = line.trim();

		// Blank line = end current block
		if (!trimmed) {
			if (inList) flushList();
			flushParagraph();
			continue;
		}

		// Heading: ## Text
		if (trimmed.startsWith('## ')) {
			if (inList) flushList();
			flushParagraph();
			blocks.push(`<h2>${inlineFormat(trimmed.slice(3))}</h2>`);
			continue;
		}

		// Standalone image: ![alt](src)
		const imgMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
		if (imgMatch) {
			if (inList) flushList();
			flushParagraph();
			blocks.push(`<img src="${imgMatch[2]}" alt="${imgMatch[1]}" class="article-img" />`);
			continue;
		}

		// List item: - text
		if (trimmed.startsWith('- ')) {
			flushParagraph();
			inList = true;
			listItems.push(trimmed.slice(2));
			continue;
		}

		// If we were in a list but this line isn't a list item, flush
		if (inList) flushList();

		current.push(trimmed);
	}

	if (inList) flushList();
	flushParagraph();

	return blocks.join('\n');
}

function inlineFormat(text: string): string {
	return text
		// Bold: **text**
		.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
		// Links: [text](url)
		.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
}
