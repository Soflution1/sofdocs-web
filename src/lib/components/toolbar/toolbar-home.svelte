<script lang="ts">
	import Icon from '$lib/components/ui/icon.svelte';
	import { getDocumentState, updateDocumentHtml } from '$lib/stores/document.svelte';
	import { getSelectionState } from '$lib/stores/selection.svelte';
	import {
		toggleBold,
		toggleItalic,
		toggleUnderline,
		toggleStrikethrough,
		setFontFamily,
		setFontSize,
		setAlignment,
		undoEdit,
		redoEdit,
		saveDocx
	} from '$lib/wasm/loader';

	const doc = getDocumentState();
	const sel = getSelectionState();

	let selectedFont = $state('Arial');
	let selectedSize = $state(11);

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
</script>

<div class="flex items-stretch h-[var(--spacing-toolbar-controls-height)] bg-[var(--color-toolbar-bg)] shadow-[var(--color-toolbar-shadow)] px-1 select-none overflow-x-auto overflow-y-hidden">

	<!-- Static: Save / Print / Undo / Redo -->
	<div class="flex items-center gap-0.5 px-1 border-r border-[var(--color-toolbar-border)]">
		<button class="toolbar-btn-sm" title="Save (Ctrl+S)" onclick={onSave}>
			<Icon name="btn-save" />
		</button>
		<button class="toolbar-btn-sm" title="Print (Ctrl+P)">
			<Icon name="btn-print" />
		</button>
		<button class="toolbar-btn-sm" title="Undo (Ctrl+Z)" onclick={onUndo}>
			<Icon name="btn-undo" />
		</button>
		<button class="toolbar-btn-sm" title="Redo (Ctrl+Y)" onclick={onRedo}>
			<Icon name="btn-redo" />
		</button>
	</div>

	<!-- Clipboard: Paste (big) + Cut/Copy (small stacked) -->
	<div class="flex items-center gap-0.5 px-1 border-r border-[var(--color-toolbar-border)]">
		<button class="toolbar-btn-big" title="Paste (Ctrl+V)">
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

	<!-- Font: family, size, inc/dec, change case -->
	<div class="flex items-center gap-0.5 px-1 border-r border-[var(--color-toolbar-border)]">
		<div class="flex flex-col gap-1">
			<div class="flex items-center gap-0.5">
				<select
					class="toolbar-select w-[130px]"
					title="Font"
					bind:value={selectedFont}
					onchange={onFontChange}
				>
					<option>Arial</option>
					<option>Times New Roman</option>
					<option>Calibri</option>
					<option>Cambria</option>
					<option>Courier New</option>
					<option>Georgia</option>
					<option>Helvetica</option>
					<option>Tahoma</option>
					<option>Verdana</option>
				</select>
				<select
					class="toolbar-select w-[45px] text-center"
					title="Font Size"
					bind:value={selectedSize}
					onchange={onSizeChange}
				>
					{#each [8, 9, 10, 10.5, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72] as size}
						<option value={size}>{size}</option>
					{/each}
				</select>
				<button class="toolbar-btn-sm" title="Increase Font Size">
					<Icon name="btn-incfont" />
				</button>
				<button class="toolbar-btn-sm" title="Decrease Font Size">
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
				<button class="toolbar-btn-sm" title="Superscript">
					<Icon name="btn-superscript" />
				</button>
				<button class="toolbar-btn-sm" title="Subscript">
					<Icon name="btn-subscript" />
				</button>
				<span class="toolbar-separator-v"></span>
				<button class="toolbar-btn-sm" title="Font Color">
					<Icon name="btn-fontcolor" />
				</button>
				<button class="toolbar-btn-sm" title="Highlight Color">
					<Icon name="btn-highlight" />
				</button>
				<span class="toolbar-separator-v"></span>
				<button class="toolbar-btn-sm" title="Clear Style">
					<Icon name="btn-clearstyle" />
				</button>
				<button class="toolbar-btn-sm" title="Copy Style">
					<Icon name="btn-copystyle" />
				</button>
			</div>
		</div>
	</div>

	<!-- Paragraph: lists, indent, spacing, alignment -->
	<div class="flex items-center gap-0.5 px-1 border-r border-[var(--color-toolbar-border)]">
		<div class="flex flex-col gap-1">
			<div class="flex items-center gap-0.5">
				<button class="toolbar-btn-sm" title="Bullets">
					<Icon name="btn-setmarkers" />
				</button>
				<button class="toolbar-btn-sm" title="Numbering">
					<Icon name="btn-numbering" />
				</button>
				<button class="toolbar-btn-sm" title="Multi-level List">
					<Icon name="btn-multilevels" />
				</button>
				<span class="toolbar-separator-v"></span>
				<button class="toolbar-btn-sm" title="Decrease Indent">
					<Icon name="btn-decoffset" />
				</button>
				<button class="toolbar-btn-sm" title="Increase Indent">
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
			{#each ['Normal', 'Heading 1', 'Heading 2', 'Heading 3', 'Title', 'Subtitle'] as styleName}
				<button
					class="flex-shrink-0 h-[46px] w-[60px] border border-[var(--color-toolbar-border)] rounded-[3px] text-[9px] leading-tight flex items-center justify-center text-center hover:border-[var(--color-accent)] transition-all cursor-pointer bg-white"
					title={styleName}
				>
					{styleName}
				</button>
			{/each}
		</div>
	</div>

	<!-- Editing: Find/Replace, Select All -->
	<div class="flex items-center gap-0.5 px-1">
		<div class="flex flex-col gap-0.5">
			<button class="toolbar-btn-sm" title="Find and Replace (Ctrl+H)">
				<Icon name="btn-replace" />
			</button>
			<button class="toolbar-btn-sm" title="Select All (Ctrl+A)">
				<Icon name="btn-select-all" />
			</button>
		</div>
	</div>
</div>

<style>
	:global(.toolbar-btn-sm) {
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 3px;
		transition: all 0.15s;
		cursor: pointer;
		border: none;
		background: transparent;
		padding: 0;
	}
	:global(.toolbar-btn-sm:hover) {
		background: var(--color-toolbar-hover);
	}
	:global(.toolbar-btn-sm:active) {
		background: var(--color-toolbar-pressed);
	}

	:global(.toolbar-btn-big) {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: var(--spacing-button-big);
		height: var(--spacing-button-big);
		border-radius: 3px;
		transition: all 0.15s;
		cursor: pointer;
		border: none;
		background: transparent;
		padding: 2px;
		gap: 2px;
	}
	:global(.toolbar-btn-big:hover) {
		background: var(--color-toolbar-hover);
	}
	:global(.toolbar-btn-big:active) {
		background: var(--color-toolbar-pressed);
	}

	:global(.toolbar-btn-label) {
		font-size: 10px;
		color: var(--color-text-secondary);
		line-height: 1;
	}

	:global(.toolbar-select) {
		height: var(--spacing-form-control);
		font-size: 11px;
		border: 1px solid var(--color-toolbar-border);
		border-radius: 3px;
		padding: 0 4px;
		background: white;
		appearance: none;
		cursor: pointer;
		color: var(--color-text-primary);
	}
	:global(.toolbar-select:focus) {
		outline: none;
		border-color: var(--color-accent);
	}

	:global(.toolbar-separator-v) {
		width: 1px;
		height: 20px;
		background: var(--color-toolbar-border);
		margin: 0 2px;
		flex-shrink: 0;
	}
</style>
