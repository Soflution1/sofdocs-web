<script lang="ts">
	import Icon from '$lib/components/ui/icon.svelte';
	import ColorPicker from '$lib/components/ui/color-picker.svelte';
	import { getDocumentState, updateDocumentHtml } from '$lib/stores/document.svelte';
	import { getSelectionState } from '$lib/stores/selection.svelte';
	import { toggleLeftSidebar } from '$lib/stores/ui.svelte';
	import {
		toggleBold,
		toggleItalic,
		toggleUnderline,
		toggleStrikethrough,
		toggleSuperscript,
		toggleSubscript,
		setFontFamily,
		setFontSize,
		setAlignment,
		setColor,
		setHighlight,
		clearFormatting,
		toggleList,
		setIndent,
		setHeadingLevel,
		undoEdit,
		redoEdit,
		saveDocx
	} from '$lib/wasm/loader';

	const doc = getDocumentState();
	const sel = getSelectionState();

	let selectedFont = $state('Arial');
	let selectedSize = $state(11);
	let showFontColorPicker = $state(false);
	let showHighlightPicker = $state(false);

	const FONT_SIZES = [8, 9, 10, 10.5, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];

	async function applyStyle(fn: (sp: number, so: number, ep: number, eo: number) => Promise<string>) {
		if (!doc.isLoaded) return;
		const html = await fn(sel.startPara, sel.startOffset, sel.endPara, sel.endOffset);
		updateDocumentHtml(html);
	}

	async function onFontChange(e: Event) {
		const font = (e.target as HTMLSelectElement).value;
		selectedFont = font;
		if (!doc.isLoaded) return;
		const html = await setFontFamily(sel.startPara, sel.startOffset, sel.endPara, sel.endOffset, font);
		updateDocumentHtml(html);
	}

	async function onSizeChange(e: Event) {
		const size = parseInt((e.target as HTMLSelectElement).value, 10);
		selectedSize = size;
		if (!doc.isLoaded) return;
		const html = await setFontSize(sel.startPara, sel.startOffset, sel.endPara, sel.endOffset, size);
		updateDocumentHtml(html);
	}

	async function onIncreaseFontSize() {
		const idx = FONT_SIZES.findIndex((s) => s >= selectedSize);
		const nextIdx = Math.min(idx + 1, FONT_SIZES.length - 1);
		selectedSize = FONT_SIZES[nextIdx];
		if (!doc.isLoaded) return;
		const html = await setFontSize(sel.startPara, sel.startOffset, sel.endPara, sel.endOffset, selectedSize);
		updateDocumentHtml(html);
	}

	async function onDecreaseFontSize() {
		const idx = FONT_SIZES.findIndex((s) => s >= selectedSize);
		const prevIdx = Math.max(idx - 1, 0);
		selectedSize = FONT_SIZES[prevIdx];
		if (!doc.isLoaded) return;
		const html = await setFontSize(sel.startPara, sel.startOffset, sel.endPara, sel.endOffset, selectedSize);
		updateDocumentHtml(html);
	}

	async function onAlign(alignment: string) {
		if (!doc.isLoaded) return;
		const html = await setAlignment(sel.startPara, alignment);
		updateDocumentHtml(html);
	}

	async function onUndo() {
		if (!doc.isLoaded) return;
		updateDocumentHtml(await undoEdit());
	}

	async function onRedo() {
		if (!doc.isLoaded) return;
		updateDocumentHtml(await redoEdit());
	}

	async function onSave() {
		if (!doc.isLoaded) return;
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
	}

	async function onFontColor(color: string) {
		if (!doc.isLoaded) return;
		const hex = color.replace('#', '');
		const html = await setColor(sel.startPara, sel.startOffset, sel.endPara, sel.endOffset, hex);
		updateDocumentHtml(html);
	}

	async function onHighlightColor(color: string) {
		if (!doc.isLoaded) return;
		const html = await setHighlight(sel.startPara, sel.startOffset, sel.endPara, sel.endOffset, color);
		updateDocumentHtml(html);
	}

	async function onToggleList(type: string) {
		if (!doc.isLoaded) return;
		const html = await toggleList(sel.startPara, type);
		updateDocumentHtml(html);
	}

	async function onIncreaseIndent() {
		if (!doc.isLoaded) return;
		const html = await setIndent(sel.startPara, 720, 0, 0);
		updateDocumentHtml(html);
	}

	async function onDecreaseIndent() {
		if (!doc.isLoaded) return;
		const html = await setIndent(sel.startPara, 0, 0, 0);
		updateDocumentHtml(html);
	}

	async function onHeadingStyle(level: number) {
		if (!doc.isLoaded) return;
		const html = await setHeadingLevel(sel.startPara, level);
		updateDocumentHtml(html);
	}

	async function onPaste() {
		try {
			const text = await navigator.clipboard.readText();
			if (text) {
				document.execCommand('insertText', false, text);
			}
		} catch {
			// Fallback: let browser handle
		}
	}

	function onSelectAll() {
		document.execCommand('selectAll');
	}

	function onFindReplace() {
		toggleLeftSidebar();
	}
</script>

<div class="flex items-stretch h-[var(--spacing-toolbar-controls-height)] bg-[var(--color-toolbar-bg)] shadow-[var(--color-toolbar-shadow)] px-1 select-none overflow-x-auto overflow-y-hidden">

	<!-- Static: Save / Print / Undo / Redo -->
	<div class="flex items-center gap-0.5 px-1 border-r border-[var(--color-toolbar-border)]">
		<button class="toolbar-btn-sm" title="Save (Ctrl+S)" onclick={onSave}>
			<Icon name="btn-save" />
		</button>
		<button class="toolbar-btn-sm" title="Print (Ctrl+P)" onclick={() => window.print()}>
			<Icon name="btn-print" />
		</button>
		<button class="toolbar-btn-sm" title="Undo (Ctrl+Z)" onclick={onUndo}>
			<Icon name="btn-undo" />
		</button>
		<button class="toolbar-btn-sm" title="Redo (Ctrl+Y)" onclick={onRedo}>
			<Icon name="btn-redo" />
		</button>
	</div>

	<!-- Clipboard -->
	<div class="flex items-center gap-0.5 px-1 border-r border-[var(--color-toolbar-border)]">
		<button class="toolbar-btn-big" title="Paste (Ctrl+V)" onclick={onPaste}>
			<Icon name="btn-paste" size="big" />
			<span class="toolbar-btn-label">Paste</span>
		</button>
		<div class="flex flex-col gap-0.5">
			<button class="toolbar-btn-sm" title="Cut (Ctrl+X)">
				<Icon name="btn-cut" />
			</button>
			<button class="toolbar-btn-sm" title="Copy (Ctrl+C)">
				<Icon name="btn-copy" />
			</button>
		</div>
	</div>

	<!-- Font -->
	<div class="flex items-center gap-0.5 px-1 border-r border-[var(--color-toolbar-border)]">
		<div class="flex flex-col gap-1">
			<div class="flex items-center gap-0.5">
				<select class="toolbar-select w-[130px]" title="Font" bind:value={selectedFont} onchange={onFontChange}>
					<option>Arial</option><option>Times New Roman</option><option>Calibri</option><option>Cambria</option>
					<option>Courier New</option><option>Georgia</option><option>Helvetica</option><option>Tahoma</option><option>Verdana</option>
				</select>
				<select class="toolbar-select w-[45px] text-center" title="Font Size" bind:value={selectedSize} onchange={onSizeChange}>
					{#each FONT_SIZES as size}
						<option value={size}>{size}</option>
					{/each}
				</select>
				<button class="toolbar-btn-sm" title="Increase Font Size" onclick={onIncreaseFontSize}>
					<Icon name="btn-incfont" />
				</button>
				<button class="toolbar-btn-sm" title="Decrease Font Size" onclick={onDecreaseFontSize}>
					<Icon name="btn-decfont" />
				</button>
				<button class="toolbar-btn-sm" title="Change Case">
					<Icon name="btn-change-case" />
				</button>
			</div>
			<div class="flex items-center gap-0.5">
				<button class="toolbar-btn-sm" title="Bold (Ctrl+B)" onclick={() => applyStyle(toggleBold)}>
					<Icon name="btn-bold" />
				</button>
				<button class="toolbar-btn-sm" title="Italic (Ctrl+I)" onclick={() => applyStyle(toggleItalic)}>
					<Icon name="btn-italic" />
				</button>
				<button class="toolbar-btn-sm" title="Underline (Ctrl+U)" onclick={() => applyStyle(toggleUnderline)}>
					<Icon name="btn-underline" />
				</button>
				<button class="toolbar-btn-sm" title="Strikethrough" onclick={() => applyStyle(toggleStrikethrough)}>
					<Icon name="btn-strikeout" />
				</button>
				<button class="toolbar-btn-sm" title="Superscript" onclick={() => applyStyle(toggleSuperscript)}>
					<Icon name="btn-superscript" />
				</button>
				<button class="toolbar-btn-sm" title="Subscript" onclick={() => applyStyle(toggleSubscript)}>
					<Icon name="btn-subscript" />
				</button>
				<span class="toolbar-separator-v"></span>
				<div class="relative">
					<button class="toolbar-btn-sm" title="Font Color" onclick={() => (showFontColorPicker = !showFontColorPicker)}>
						<Icon name="btn-fontcolor" />
					</button>
					{#if showFontColorPicker}
						<ColorPicker onselect={onFontColor} onclose={() => (showFontColorPicker = false)} />
					{/if}
				</div>
				<div class="relative">
					<button class="toolbar-btn-sm" title="Highlight Color" onclick={() => (showHighlightPicker = !showHighlightPicker)}>
						<Icon name="btn-highlight" />
					</button>
					{#if showHighlightPicker}
						<ColorPicker onselect={onHighlightColor} onclose={() => (showHighlightPicker = false)} />
					{/if}
				</div>
				<span class="toolbar-separator-v"></span>
				<button class="toolbar-btn-sm" title="Clear Style" onclick={() => applyStyle(clearFormatting)}>
					<Icon name="btn-clearstyle" />
				</button>
				<button class="toolbar-btn-sm" title="Copy Style">
					<Icon name="btn-copystyle" />
				</button>
			</div>
		</div>
	</div>

	<!-- Paragraph -->
	<div class="flex items-center gap-0.5 px-1 border-r border-[var(--color-toolbar-border)]">
		<div class="flex flex-col gap-1">
			<div class="flex items-center gap-0.5">
				<button class="toolbar-btn-sm" title="Bullets" onclick={() => onToggleList('bullet')}>
					<Icon name="btn-setmarkers" />
				</button>
				<button class="toolbar-btn-sm" title="Numbering" onclick={() => onToggleList('decimal')}>
					<Icon name="btn-numbering" />
				</button>
				<button class="toolbar-btn-sm" title="Multi-level List">
					<Icon name="btn-multilevels" />
				</button>
				<span class="toolbar-separator-v"></span>
				<button class="toolbar-btn-sm" title="Decrease Indent" onclick={onDecreaseIndent}>
					<Icon name="btn-decoffset" />
				</button>
				<button class="toolbar-btn-sm" title="Increase Indent" onclick={onIncreaseIndent}>
					<Icon name="btn-incoffset" />
				</button>
				<button class="toolbar-btn-sm" title="Line Spacing">
					<Icon name="btn-linespace" />
				</button>
			</div>
			<div class="flex items-center gap-0.5">
				<button class="toolbar-btn-sm" title="Align Left" onclick={() => onAlign('left')}>
					<Icon name="btn-align-left" />
				</button>
				<button class="toolbar-btn-sm" title="Align Center" onclick={() => onAlign('center')}>
					<Icon name="btn-align-center" />
				</button>
				<button class="toolbar-btn-sm" title="Align Right" onclick={() => onAlign('right')}>
					<Icon name="btn-align-right" />
				</button>
				<button class="toolbar-btn-sm" title="Justify" onclick={() => onAlign('both')}>
					<Icon name="btn-align-just" />
				</button>
				<span class="toolbar-separator-v"></span>
				<button class="toolbar-btn-sm" title="Show/Hide Paragraph Marks">
					<Icon name="btn-paragraph" />
				</button>
			</div>
		</div>
	</div>

	<!-- Styles gallery -->
	<div class="flex items-center gap-1 px-2 border-r border-[var(--color-toolbar-border)]">
		<div class="flex gap-1 overflow-x-auto max-w-[200px]">
			{#each [{name: 'Normal', level: 0}, {name: 'Heading 1', level: 1}, {name: 'Heading 2', level: 2}, {name: 'Heading 3', level: 3}] as style}
				<button
					class="flex-shrink-0 h-[46px] w-[60px] border border-[var(--color-toolbar-border)] rounded-[3px] text-[9px] leading-tight flex items-center justify-center text-center hover:border-[var(--color-accent)] transition-all cursor-pointer bg-white"
					title={style.name}
					onclick={() => onHeadingStyle(style.level)}
				>
					{style.name}
				</button>
			{/each}
		</div>
	</div>

	<!-- Editing -->
	<div class="flex items-center gap-0.5 px-1">
		<div class="flex flex-col gap-0.5">
			<button class="toolbar-btn-sm" title="Find and Replace (Ctrl+H)" onclick={onFindReplace}>
				<Icon name="btn-replace" />
			</button>
			<button class="toolbar-btn-sm" title="Select All (Ctrl+A)" onclick={onSelectAll}>
				<Icon name="btn-select-all" />
			</button>
		</div>
	</div>
</div>

<style>
	:global(.toolbar-btn-sm) {
		width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;
		border-radius: 3px; transition: all 0.15s; cursor: pointer; border: none; background: transparent; padding: 0;
	}
	:global(.toolbar-btn-sm:hover) { background: var(--color-toolbar-hover); }
	:global(.toolbar-btn-sm:active) { background: var(--color-toolbar-pressed); }
	:global(.toolbar-btn-big) {
		display: flex; flex-direction: column; align-items: center; justify-content: center;
		width: var(--spacing-button-big); height: var(--spacing-button-big);
		border-radius: 3px; transition: all 0.15s; cursor: pointer; border: none; background: transparent; padding: 2px; gap: 2px;
	}
	:global(.toolbar-btn-big:hover) { background: var(--color-toolbar-hover); }
	:global(.toolbar-btn-big:active) { background: var(--color-toolbar-pressed); }
	:global(.toolbar-btn-label) { font-size: 10px; color: var(--color-text-secondary); line-height: 1; }
	:global(.toolbar-select) {
		height: var(--spacing-form-control); font-size: 11px; border: 1px solid var(--color-toolbar-border);
		border-radius: 3px; padding: 0 4px; background: white; appearance: none; cursor: pointer; color: var(--color-text-primary);
	}
	:global(.toolbar-select:focus) { outline: none; border-color: var(--color-accent); }
	:global(.toolbar-separator-v) { width: 1px; height: 20px; background: var(--color-toolbar-border); margin: 0 2px; flex-shrink: 0; }
</style>
