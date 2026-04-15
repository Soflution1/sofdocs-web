import type { InitOutput } from 'sofdocs-wasm';

let wasmModule: InitOutput | null = null;
let loadPromise: Promise<InitOutput> | null = null;

export async function loadWasm(): Promise<InitOutput> {
	if (wasmModule) return wasmModule;
	if (loadPromise) return loadPromise;

	loadPromise = (async () => {
		const wasm = await import('sofdocs-wasm');
		const init = wasm.default;
		wasmModule = await init();
		return wasmModule;
	})();

	return loadPromise;
}

async function wasm() {
	await loadWasm();
	return await import('sofdocs-wasm');
}

export async function loadDocx(bytes: Uint8Array): Promise<string> {
	const w = await wasm();
	w.load_docx(bytes);
	return w.get_html();
}

export async function getHtml(): Promise<string> {
	const w = await wasm();
	return w.get_html();
}

export async function getPlainText(): Promise<string> {
	const w = await wasm();
	return w.get_plain_text();
}

export async function getWordCount(): Promise<number> {
	const w = await wasm();
	return w.get_word_count();
}

export async function getParagraphCount(): Promise<number> {
	const w = await wasm();
	return w.get_paragraph_count();
}

export async function saveDocx(): Promise<Uint8Array> {
	const w = await wasm();
	return w.save_docx();
}

export async function insertText(paragraph: number, offset: number, text: string): Promise<string> {
	const w = await wasm();
	return w.insert_text(paragraph, offset, text);
}

export async function deleteRange(
	startPara: number,
	startOffset: number,
	endPara: number,
	endOffset: number
): Promise<string> {
	const w = await wasm();
	return w.delete_range(startPara, startOffset, endPara, endOffset);
}

export async function splitParagraph(paragraph: number, offset: number): Promise<string> {
	const w = await wasm();
	return w.split_paragraph(paragraph, offset);
}

export async function toggleBold(sp: number, so: number, ep: number, eo: number): Promise<string> {
	const w = await wasm();
	return w.toggle_bold(sp, so, ep, eo);
}

export async function toggleItalic(sp: number, so: number, ep: number, eo: number): Promise<string> {
	const w = await wasm();
	return w.toggle_italic(sp, so, ep, eo);
}

export async function toggleUnderline(sp: number, so: number, ep: number, eo: number): Promise<string> {
	const w = await wasm();
	return w.toggle_underline(sp, so, ep, eo);
}

export async function toggleStrikethrough(sp: number, so: number, ep: number, eo: number): Promise<string> {
	const w = await wasm();
	return w.toggle_strikethrough(sp, so, ep, eo);
}

export async function setFontFamily(sp: number, so: number, ep: number, eo: number, font: string): Promise<string> {
	const w = await wasm();
	return w.set_font_family(sp, so, ep, eo, font);
}

export async function setFontSize(sp: number, so: number, ep: number, eo: number, size: number): Promise<string> {
	const w = await wasm();
	return w.set_font_size(sp, so, ep, eo, size);
}

export async function setAlignment(paragraph: number, alignment: string): Promise<string> {
	const w = await wasm();
	return w.set_alignment(paragraph, alignment);
}

export async function undoEdit(): Promise<string> {
	const w = await wasm();
	return w.undo();
}

export async function redoEdit(): Promise<string> {
	const w = await wasm();
	return w.redo();
}

export async function canUndo(): Promise<boolean> {
	const w = await wasm();
	return w.can_undo();
}

export async function canRedo(): Promise<boolean> {
	const w = await wasm();
	return w.can_redo();
}

export async function setColor(sp: number, so: number, ep: number, eo: number, color: string): Promise<string> {
	const w = await wasm();
	return w.set_color(sp, so, ep, eo, color);
}

export async function setHighlight(sp: number, so: number, ep: number, eo: number, color: string): Promise<string> {
	const w = await wasm();
	return w.set_highlight(sp, so, ep, eo, color);
}

export async function toggleSuperscript(sp: number, so: number, ep: number, eo: number): Promise<string> {
	const w = await wasm();
	return w.toggle_superscript(sp, so, ep, eo);
}

export async function toggleSubscript(sp: number, so: number, ep: number, eo: number): Promise<string> {
	const w = await wasm();
	return w.toggle_subscript(sp, so, ep, eo);
}

export async function clearFormatting(sp: number, so: number, ep: number, eo: number): Promise<string> {
	const w = await wasm();
	return w.clear_formatting(sp, so, ep, eo);
}

export async function setIndent(paragraph: number, left: number, right: number, firstLine: number): Promise<string> {
	const w = await wasm();
	return w.set_indent(paragraph, left, right, firstLine);
}

export async function setSpacing(paragraph: number, before: number, after: number, line: number): Promise<string> {
	const w = await wasm();
	return w.set_spacing(paragraph, before, after, line);
}

export async function setHeadingLevel(paragraph: number, level: number): Promise<string> {
	const w = await wasm();
	return w.set_heading_level(paragraph, level);
}

export async function toggleList(paragraph: number, listType: string): Promise<string> {
	const w = await wasm();
	return w.toggle_list(paragraph, listType);
}

export async function findText(query: string): Promise<string> {
	const w = await wasm();
	return w.find_text(query);
}

export async function replaceText(para: number, offset: number, len: number, replacement: string): Promise<string> {
	const w = await wasm();
	return w.replace_text(para, offset, len, replacement);
}

export async function replaceAll(query: string, replacement: string): Promise<string> {
	const w = await wasm();
	return w.replace_all(query, replacement);
}

export async function insertTable(paragraph: number, rows: number, cols: number): Promise<string> {
	const w = await wasm();
	return w.insert_table(paragraph, rows, cols);
}

export async function insertPageBreak(paragraph: number): Promise<string> {
	const w = await wasm();
	return w.insert_page_break(paragraph);
}

export async function insertHyperlink(para: number, startOffset: number, endOffset: number, url: string): Promise<string> {
	const w = await wasm();
	return w.insert_hyperlink(para, startOffset, endOffset, url);
}

export async function insertBookmark(para: number, offset: number, name: string): Promise<string> {
	const w = await wasm();
	return w.insert_bookmark(para, offset, name);
}

export async function getHeaderHtml(): Promise<string> {
	const w = await wasm();
	return w.get_header_html();
}

export async function getFooterHtml(): Promise<string> {
	const w = await wasm();
	return w.get_footer_html();
}

export async function getPageCount(): Promise<number> {
	const w = await wasm();
	return w.get_page_count();
}
