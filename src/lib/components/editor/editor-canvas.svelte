<script lang="ts">
	import { getDocumentState, updateDocumentHtml } from '$lib/stores/document.svelte';
	import { getUIState } from '$lib/stores/ui.svelte';
	import { getSelectionState, updateSelection } from '$lib/stores/selection.svelte';
	import {
		insertText,
		deleteRange,
		splitParagraph,
		undoEdit,
		redoEdit,
		toggleBold,
		toggleItalic,
		toggleUnderline,
		saveDocx,
		getWordCount,
		getParagraphCount
	} from '$lib/wasm/loader';

	const doc = getDocumentState();
	const ui = getUIState();
	const sel = getSelectionState();

	let editorEl: HTMLDivElement | undefined = $state();
	let isComposing = $state(false);

	function getDocPosition(node: Node, offset: number): { para: number; charOffset: number } | null {
		const paraEl = findParaElement(node);
		if (!paraEl) return null;

		const paraIdx = parseInt(paraEl.getAttribute('data-para') ?? '0', 10);
		const charOffset = computeCharOffset(paraEl, node, offset);
		return { para: paraIdx, charOffset };
	}

	function findParaElement(node: Node): HTMLElement | null {
		let current: Node | null = node;
		while (current && current !== editorEl) {
			if (current instanceof HTMLElement && current.hasAttribute('data-para')) {
				return current;
			}
			current = current.parentNode;
		}
		return null;
	}

	function computeCharOffset(paraEl: HTMLElement, targetNode: Node, targetOffset: number): number {
		let charCount = 0;
		const walker = document.createTreeWalker(paraEl, NodeFilter.SHOW_TEXT);
		let textNode = walker.nextNode();
		while (textNode) {
			if (textNode === targetNode) {
				return charCount + targetOffset;
			}
			charCount += (textNode.textContent?.length ?? 0);
			textNode = walker.nextNode();
		}
		if (targetNode === paraEl || targetNode.parentElement === paraEl) {
			return charCount;
		}
		return charCount;
	}

	function syncSelection() {
		const domSel = window.getSelection();
		if (!domSel || domSel.rangeCount === 0 || !editorEl) return;

		const range = domSel.getRangeAt(0);
		const start = getDocPosition(range.startContainer, range.startOffset);
		const end = getDocPosition(range.endContainer, range.endOffset);
		if (!start || !end) return;

		updateSelection({
			startPara: start.para,
			startOffset: start.charOffset,
			endPara: end.para,
			endOffset: end.charOffset,
			collapsed: range.collapsed
		});
	}

	function restoreCursor(para: number, offset: number) {
		if (!editorEl) return;
		const paraEl = editorEl.querySelector(`[data-para="${para}"]`);
		if (!paraEl) return;

		const walker = document.createTreeWalker(paraEl, NodeFilter.SHOW_TEXT);
		let remaining = offset;
		let textNode = walker.nextNode();
		while (textNode) {
			const len = textNode.textContent?.length ?? 0;
			if (remaining <= len) {
				const domSel = window.getSelection();
				const range = document.createRange();
				range.setStart(textNode, remaining);
				range.collapse(true);
				domSel?.removeAllRanges();
				domSel?.addRange(range);
				return;
			}
			remaining -= len;
			textNode = walker.nextNode();
		}
	}

	async function handleInput(e: Event) {
		if (isComposing) return;
		e.preventDefault?.();
	}

	async function handleBeforeInput(e: Event) {
		const ie = e as InputEvent;
		if (isComposing) return;

		const inputType = ie.inputType;

		if (inputType === 'insertText' && ie.data) {
			e.preventDefault();
			const html = await insertText(sel.startPara, sel.startOffset, ie.data!);
			updateDocumentHtml(html);
			await tick();
			restoreCursor(sel.startPara, sel.startOffset + ie.data!.length);
			syncSelection();
			refreshCounts();
			return;
		}

		if (inputType === 'insertParagraph' || inputType === 'insertLineBreak') {
			e.preventDefault();
			if (!sel.collapsed) {
				const html = await deleteRange(sel.startPara, sel.startOffset, sel.endPara, sel.endOffset);
				updateDocumentHtml(html);
			}
			const html = await splitParagraph(sel.startPara, sel.startOffset);
			updateDocumentHtml(html);
			await tick();
			restoreCursor(sel.startPara + 1, 0);
			syncSelection();
			refreshCounts();
			return;
		}

		if (inputType === 'deleteContentBackward') {
			e.preventDefault();
			if (!sel.collapsed) {
				const html = await deleteRange(sel.startPara, sel.startOffset, sel.endPara, sel.endOffset);
				updateDocumentHtml(html);
				await tick();
				restoreCursor(sel.startPara, sel.startOffset);
			} else if (sel.startOffset > 0) {
				const html = await deleteRange(sel.startPara, sel.startOffset - 1, sel.startPara, sel.startOffset);
				updateDocumentHtml(html);
				await tick();
				restoreCursor(sel.startPara, sel.startOffset - 1);
			} else if (sel.startPara > 0) {
				const prevParaEl = editorEl?.querySelector(`[data-para="${sel.startPara - 1}"]`);
				let prevLen = 0;
				if (prevParaEl) {
					const walker = document.createTreeWalker(prevParaEl, NodeFilter.SHOW_TEXT);
					let n = walker.nextNode();
					while (n) {
						prevLen += (n.textContent?.length ?? 0);
						n = walker.nextNode();
					}
				}
				const html = await deleteRange(sel.startPara - 1, prevLen, sel.startPara, 0);
				updateDocumentHtml(html);
				await tick();
				restoreCursor(sel.startPara - 1, prevLen);
			}
			syncSelection();
			refreshCounts();
			return;
		}

		if (inputType === 'deleteContentForward') {
			e.preventDefault();
			if (!sel.collapsed) {
				const html = await deleteRange(sel.startPara, sel.startOffset, sel.endPara, sel.endOffset);
				updateDocumentHtml(html);
				await tick();
				restoreCursor(sel.startPara, sel.startOffset);
			} else {
				const paraEl = editorEl?.querySelector(`[data-para="${sel.startPara}"]`);
				let paraLen = 0;
				if (paraEl) {
					const walker = document.createTreeWalker(paraEl, NodeFilter.SHOW_TEXT);
					let n = walker.nextNode();
					while (n) {
						paraLen += (n.textContent?.length ?? 0);
						n = walker.nextNode();
					}
				}
				if (sel.startOffset < paraLen) {
					const html = await deleteRange(sel.startPara, sel.startOffset, sel.startPara, sel.startOffset + 1);
					updateDocumentHtml(html);
				} else {
					const html = await deleteRange(sel.startPara, paraLen, sel.startPara + 1, 0);
					updateDocumentHtml(html);
				}
				await tick();
				restoreCursor(sel.startPara, sel.startOffset);
			}
			syncSelection();
			refreshCounts();
			return;
		}
	}

	interface PasteRun {
		text: string;
		bold: boolean;
		italic: boolean;
		underline: boolean;
		newParagraph: boolean;
	}

	function parseHtmlToRuns(htmlStr: string): PasteRun[] {
		const doc2 = new DOMParser().parseFromString(htmlStr, 'text/html');
		const runs: PasteRun[] = [];

		function walkNode(node: Node, inheritBold: boolean, inheritItalic: boolean, inheritUnderline: boolean) {
			if (node.nodeType === Node.TEXT_NODE) {
				const text = node.textContent || '';
				if (text.length > 0) {
					runs.push({ text, bold: inheritBold, italic: inheritItalic, underline: inheritUnderline, newParagraph: false });
				}
				return;
			}
			if (node.nodeType !== Node.ELEMENT_NODE) return;
			const el = node as HTMLElement;
			const tag = el.tagName.toLowerCase();

			let bold = inheritBold;
			let italic = inheritItalic;
			let underline = inheritUnderline;

			if (tag === 'b' || tag === 'strong') bold = true;
			if (tag === 'i' || tag === 'em') italic = true;
			if (tag === 'u') underline = true;

			const style = el.style;
			if (style.fontWeight === 'bold' || parseInt(style.fontWeight) >= 700) bold = true;
			if (style.fontStyle === 'italic') italic = true;
			if (style.textDecoration?.includes('underline')) underline = true;

			if (tag === 'p' || tag === 'div' || tag === 'br' || tag === 'li') {
				if (runs.length > 0) {
					runs.push({ text: '', bold: false, italic: false, underline: false, newParagraph: true });
				}
			}

			for (const child of el.childNodes) {
				walkNode(child, bold, italic, underline);
			}
		}

		walkNode(doc2.body, false, false, false);
		return runs;
	}

	async function handlePaste(e: ClipboardEvent) {
		e.preventDefault();
		if (!e.clipboardData) return;

		if (!sel.collapsed) {
			const result = await deleteRange(sel.startPara, sel.startOffset, sel.endPara, sel.endOffset);
			updateDocumentHtml(result);
		}

		const htmlData = e.clipboardData.getData('text/html');
		const plainText = e.clipboardData.getData('text/plain');

		let currentPara = sel.startPara;
		let currentOffset = sel.startOffset;

		if (htmlData) {
			const pasteRuns = parseHtmlToRuns(htmlData);
			for (const run of pasteRuns) {
				if (run.newParagraph) {
					const result = await splitParagraph(currentPara, currentOffset);
					updateDocumentHtml(result);
					currentPara++;
					currentOffset = 0;
					continue;
				}
				if (run.text.length === 0) continue;

				const result = await insertText(currentPara, currentOffset, run.text);
				updateDocumentHtml(result);

				const endOffset = currentOffset + run.text.length;

				if (run.bold) {
					const r = await toggleBold(currentPara, currentOffset, currentPara, endOffset);
					updateDocumentHtml(r);
				}
				if (run.italic) {
					const r = await toggleItalic(currentPara, currentOffset, currentPara, endOffset);
					updateDocumentHtml(r);
				}
				if (run.underline) {
					const r = await toggleUnderline(currentPara, currentOffset, currentPara, endOffset);
					updateDocumentHtml(r);
				}

				currentOffset = endOffset;
			}
		} else if (plainText) {
			const lines = plainText.split('\n');
			for (let i = 0; i < lines.length; i++) {
				if (lines[i].length > 0) {
					const result = await insertText(currentPara, currentOffset, lines[i]);
					updateDocumentHtml(result);
					currentOffset += lines[i].length;
				}
				if (i < lines.length - 1) {
					const result = await splitParagraph(currentPara, currentOffset);
					updateDocumentHtml(result);
					currentPara++;
					currentOffset = 0;
				}
			}
		}

		await tick();
		restoreCursor(currentPara, currentOffset);
		syncSelection();
		refreshCounts();
	}

	async function handleCopy(e: ClipboardEvent) {
		const domSel = window.getSelection();
		if (!domSel || domSel.isCollapsed) return;

		e.preventDefault();
		const selectedText = domSel.toString();

		const range = domSel.getRangeAt(0);
		const fragment = range.cloneContents();
		const wrapper = document.createElement('div');
		wrapper.appendChild(fragment);
		const selectedHtml = wrapper.innerHTML;

		e.clipboardData?.setData('text/plain', selectedText);
		e.clipboardData?.setData('text/html', selectedHtml);
	}

	async function handleKeydown(e: KeyboardEvent) {
		const mod = e.metaKey || e.ctrlKey;

		if (mod && e.key === 'z' && !e.shiftKey) {
			e.preventDefault();
			const html = await undoEdit();
			updateDocumentHtml(html);
			refreshCounts();
			return;
		}

		if (mod && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
			e.preventDefault();
			const html = await redoEdit();
			updateDocumentHtml(html);
			refreshCounts();
			return;
		}

		if (mod && e.key === 'b') {
			e.preventDefault();
			const html = await toggleBold(sel.startPara, sel.startOffset, sel.endPara, sel.endOffset);
			updateDocumentHtml(html);
			return;
		}

		if (mod && e.key === 'i') {
			e.preventDefault();
			const html = await toggleItalic(sel.startPara, sel.startOffset, sel.endPara, sel.endOffset);
			updateDocumentHtml(html);
			return;
		}

		if (mod && e.key === 'u') {
			e.preventDefault();
			const html = await toggleUnderline(sel.startPara, sel.startOffset, sel.endPara, sel.endOffset);
			updateDocumentHtml(html);
			return;
		}

		if (mod && e.key === 's') {
			e.preventDefault();
			try {
				const bytes = await saveDocx();
				const blob = new Blob([new Uint8Array(bytes)], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = doc.fileName || 'document.docx';
				a.click();
				URL.revokeObjectURL(url);
			} catch (err) {
				alert(`Save failed: ${err}`);
			}
			return;
		}
	}

	async function refreshCounts() {
		doc.wordCount = await getWordCount();
		doc.paragraphCount = await getParagraphCount();
	}

	function tick(): Promise<void> {
		return new Promise((resolve) => requestAnimationFrame(() => resolve()));
	}
</script>

<div class="flex-1 overflow-auto bg-[var(--color-canvas-bg)] flex justify-center py-8">
	{#if doc.isLoading}
		<div class="flex items-center justify-center">
			<div class="flex flex-col items-center gap-3">
				<div class="w-8 h-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin"></div>
				<span class="text-sm text-[var(--color-text-secondary)]">Loading document...</span>
			</div>
		</div>
	{:else if doc.isLoaded}
		<div
			class="bg-[var(--color-page-bg)] shadow-[0_1px_3px_rgba(0,0,0,0.12),0_4px_16px_rgba(0,0,0,0.08)] mx-auto"
			style="
				width: {(816 * ui.zoom) / 100}px;
				min-height: {(1056 * ui.zoom) / 100}px;
				padding: {(96 * ui.zoom) / 100}px;
				transform-origin: top center;
			"
		>
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				bind:this={editorEl}
				class="sofdocs-content outline-none"
				style="font-size: {(11 * ui.zoom) / 100}pt; line-height: 1.5;"
				contenteditable="true"
				spellcheck="true"
				onbeforeinput={handleBeforeInput}
				oninput={handleInput}
				onkeydown={handleKeydown}
				onpaste={handlePaste}
				oncopy={handleCopy}
				oncut={handleCopy}
				onselectionchange={syncSelection}
				onmouseup={syncSelection}
				oncompositionstart={() => (isComposing = true)}
				oncompositionend={() => (isComposing = false)}
			>
				{@html doc.html}
			</div>
		</div>
	{:else}
		<div class="flex flex-col items-center justify-center h-full gap-6">
			<div class="text-6xl opacity-20">📄</div>
			<div class="text-center">
				<p class="text-lg font-medium text-[var(--color-text-secondary)]">Open a document</p>
				<p class="text-sm text-[var(--color-text-muted)] mt-1">Drop a .docx file or click the upload button below</p>
			</div>
		</div>
	{/if}
</div>

<style>
	:global(.sofdocs-content p),
	:global(.sofdocs-content h1),
	:global(.sofdocs-content h2),
	:global(.sofdocs-content h3),
	:global(.sofdocs-content h4),
	:global(.sofdocs-content h5),
	:global(.sofdocs-content h6) {
		margin: 0;
		padding: 2px 0;
		min-height: 1.2em;
	}
	:global(.sofdocs-content h1) {
		font-size: 2em;
		font-weight: bold;
	}
	:global(.sofdocs-content h2) {
		font-size: 1.5em;
		font-weight: bold;
	}
	:global(.sofdocs-content h3) {
		font-size: 1.17em;
		font-weight: bold;
	}
	:global(.sofdocs-content ul),
	:global(.sofdocs-content ol) {
		margin: 0;
		padding-left: 2em;
	}
	:global(.sofdocs-content li) {
		padding: 1px 0;
	}
	:global(.sofdocs-content table) {
		border-collapse: collapse;
		width: 100%;
		margin: 1em 0;
	}
	:global(.sofdocs-content td) {
		border: 1px solid #ccc;
		padding: 4px 8px;
	}
	:global(.sofdocs-content img) {
		max-width: 100%;
		display: inline-block;
	}
</style>
