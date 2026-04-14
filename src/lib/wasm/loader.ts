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

export async function parseDocx(bytes: Uint8Array): Promise<{
	html: string;
	plainText: string;
	wordCount: number;
}> {
	await loadWasm();
	const wasm = await import('sofdocs-wasm');
	const html = wasm.get_document_html(bytes);
	const plainText = wasm.get_document_text(bytes);
	const wordCount = wasm.get_word_count(bytes);
	return { html, plainText, wordCount };
}
